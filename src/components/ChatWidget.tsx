import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Phone, MapPin, RotateCcw } from 'lucide-react';
import { chatbotService } from '../services/chatbot.service';
import { useSiteData } from '../contexts/SiteDataContext';
import type { ChatMessage, ChatbotConfig } from '../types';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data } = useSiteData();

  // Load config
  useEffect(() => {
    chatbotService.getConfig().then(setConfig).catch(() => {});
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Add welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0 && config?.welcome_message) {
      setMessages([{
        role: 'assistant',
        content: config.welcome_message,
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [isOpen, config]);

  const buildContext = useCallback(() => {
    if (!data) return '';

    const availableRooms = data.rooms.filter(r => !r.is_booked);
    const bookedRooms = data.rooms.filter(r => r.is_booked);

    const roomInfo = availableRooms.map(r =>
      `- ${r.name}: ${r.price}/đêm, ${r.capacity}, ${r.size}, tiện nghi: ${(r.amenities || []).join(', ')}`
    ).join('\n');

    const bookedInfo = bookedRooms.length > 0
      ? `\n\nPhòng đã hết (ĐÃ ĐẶT - KHÔNG CÒN TRỐNG):\n${bookedRooms.map(r => `- ${r.name}`).join('\n')}`
      : '';

    const amenityInfo = data.amenities.map(a => `- ${a.title}: ${a.description}`).join('\n');

    const address = data.location?.address || '';
    const phone = data.contact?.phone?.number || '';
    const zalo = data.contact?.zalo?.number || '';
    const email = data.contact?.email?.address || '';
    const bankInfo = data.contact?.bank_info
      ? `Ngân hàng: ${data.contact.bank_info.bank}, STK: ${data.contact.bank_info.account}`
      : '';

    const workingHours = (data.contact?.working_hours || [])
      .map(wh => `${wh.day}: ${wh.hours}`).join(', ');

    const bookingMethods = (data.contact?.booking_methods || [])
      .map(bm => `- ${bm.title}: ${bm.detail}`).join('\n');

    const cancellation = (data.contact?.cancellation_policy || [])
      .map(cp => `- ${cp.rule}`).join('\n');

    const attractions = (data.attractions || [])
      .map(a => `- ${a.name}: ${a.distance}, ${a.travel_time}`).join('\n');

    return `
=== THÔNG TIN VISTA HOMESTAY ===

📍 Địa chỉ: ${address}
📞 Điện thoại: ${phone}
💬 Zalo: ${zalo}
📧 Email: ${email}
🕐 Giờ làm việc: ${workingHours}

=== PHÒNG CÒN TRỐNG ===
${roomInfo || 'Hiện chưa có thông tin phòng'}
${bookedInfo}

=== TIỆN ÍCH ===
${amenityInfo || 'Đầy đủ tiện nghi'}

=== CÁCH ĐẶT PHÒNG ===
${bookingMethods || 'Liên hệ trực tiếp'}

=== CHÍNH SÁCH HỦY PHÒNG ===
${cancellation || 'Liên hệ để biết thêm'}

=== THANH TOÁN ===
${bankInfo || 'Liên hệ để biết thêm'}

=== ĐIỂM THAM QUAN LÂN CẬN ===
${attractions || 'Nhiều điểm du lịch hấp dẫn'}
`.trim();
  }, [data]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading || !config) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setShowQuickReplies(false);

    try {
      const reply = await chatbotService.sendMessage(text.trim(), messages, config, buildContext());
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại hoặc liên hệ trực tiếp qua điện thoại/Zalo!',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, config, messages, buildContext]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const handleReset = () => {
    setMessages([]);
    setShowQuickReplies(true);
    if (config?.welcome_message) {
      setMessages([{
        role: 'assistant',
        content: config.welcome_message,
        timestamp: new Date().toISOString(),
      }]);
    }
  };

  // Format message with line breaks and basic markdown
  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line.replace(/\*\*(.*?)\*\*/g, '⟨b⟩$1⟨/b⟩').split(/⟨\/?b⟩/).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // Don't render if chatbot is not active
  if (!config?.is_active) return null;

  const quickReplies = config.quick_replies || [
    'Xem phòng & giá',
    'Cách đặt phòng?',
    'Vị trí & đường đi',
    'Thanh toán',
  ];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            {/* Pulse ring */}
            <div className="absolute inset-0 w-14 h-14 bg-emerald-500/30 rounded-full animate-ping" />
            <button
              onClick={() => setIsOpen(true)}
              className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
              className="absolute bottom-2 right-[72px] bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-xl shadow-lg whitespace-nowrap border border-gray-100"
            >
              💬 Cần hỗ trợ?
              <div className="absolute top-1/2 -translate-y-1/2 right-[-6px] w-3 h-3 bg-white border-r border-b border-gray-100 rotate-[-45deg]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[360px] sm:w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-white/10"
            style={{ background: 'linear-gradient(180deg, #0d1520 0%, #111827 100%)' }}
          >
            {/* Header */}
            <div className="relative px-5 py-4 flex items-center justify-between border-b border-white/[0.06]">
              {/* Gradient glow */}
              <div className="absolute inset-x-0 -top-20 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  {/* Online dot */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0d1520]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight">Vista Homestay AI</h3>
                  <p className="text-emerald-400/70 text-xs font-medium">Trợ lý tư vấn • Trực tuyến</p>
                </div>
              </div>

              <div className="relative flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="text-gray-500 hover:text-gray-300 p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                  title="Bắt đầu lại"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-300 p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-emerald-500/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-emerald-500/10'
                      : 'bg-white/[0.06] text-gray-200 rounded-2xl rounded-bl-md border border-white/[0.06]'
                  }`}>
                    {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 bg-emerald-600/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 bg-emerald-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="bg-white/[0.06] px-4 py-3 rounded-2xl rounded-bl-md border border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-emerald-400/50 text-xs ml-2">Đang soạn...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <AnimatePresence>
              {showQuickReplies && messages.length <= 1 && quickReplies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.02]"
                >
                  <p className="text-[11px] text-gray-500 mb-2 font-medium uppercase tracking-wider">Gợi ý nhanh</p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickReplies.map((text, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(text)}
                        className="text-xs bg-white/[0.06] text-emerald-300 px-3 py-2 rounded-xl border border-white/[0.08] hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:text-emerald-200 transition-all duration-200"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick contact bar */}
            {data?.contact && (
              <div className="px-4 py-2 border-t border-white/[0.06] flex items-center gap-3 bg-white/[0.02]">
                {data.contact.phone?.number && (
                  <a href={data.contact.phone.link || `tel:${data.contact.phone.number}`}
                    className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-emerald-400 transition-colors">
                    <Phone className="w-3 h-3" /> {data.contact.phone.number}
                  </a>
                )}
                {data.location?.address && (
                  <span className="flex items-center gap-1.5 text-[11px] text-gray-500 truncate">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{data.location.address.split(',').slice(0, 2).join(',')}</span>
                  </span>
                )}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-white/[0.06] bg-[#0a0e18]">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-30 disabled:shadow-none active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-center text-[10px] text-gray-600 mt-2">
                Được hỗ trợ bởi AI • Vista Homestay
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatWidget;
