import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Sparkles, MessageSquareMore, Users, ArrowUpRight, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ rooms: 0, amenities: 0, knowledge: 0, sessions: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [rooms, amenities, knowledge, sessions] = await Promise.all([
        supabase.from('rooms').select('id', { count: 'exact', head: true }),
        supabase.from('amenities').select('id', { count: 'exact', head: true }),
        supabase.from('knowledge_base').select('id', { count: 'exact', head: true }),
        supabase.from('chat_sessions').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        rooms: rooms.count || 0,
        amenities: amenities.count || 0,
        knowledge: knowledge.count || 0,
        sessions: sessions.count || 0,
      });
    };
    fetchStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng ☀️';
    if (hour < 18) return 'Chào buổi chiều 🌤️';
    return 'Chào buổi tối 🌙';
  };

  const cards = [
    { label: 'Phòng ốc', value: stats.rooms, icon: BedDouble, gradient: 'from-emerald-500/20 to-emerald-600/5', glow: 'shadow-emerald-500/10', iconBg: 'bg-emerald-500/15 text-emerald-400', link: '/admin/rooms' },
    { label: 'Tiện ích', value: stats.amenities, icon: Sparkles, gradient: 'from-amber-500/20 to-amber-600/5', glow: 'shadow-amber-500/10', iconBg: 'bg-amber-500/15 text-amber-400', link: '/admin/amenities' },
    { label: 'FAQ Chatbot', value: stats.knowledge, icon: MessageSquareMore, gradient: 'from-blue-500/20 to-blue-600/5', glow: 'shadow-blue-500/10', iconBg: 'bg-blue-500/15 text-blue-400', link: '/admin/chatbot' },
    { label: 'Chat Sessions', value: stats.sessions, icon: Users, gradient: 'from-purple-500/20 to-purple-600/5', glow: 'shadow-purple-500/10', iconBg: 'bg-purple-500/15 text-purple-400', link: '/admin/chatbot' },
  ];

  const guides = [
    { emoji: '📝', title: 'Hero Section', desc: 'Chỉnh sửa tiêu đề, mô tả và hình nền trang chủ', link: '/admin/hero' },
    { emoji: '🛏️', title: 'Phòng ốc', desc: 'Thêm, sửa, xóa phòng với hình ảnh và giá', link: '/admin/rooms' },
    { emoji: '✨', title: 'Tiện ích', desc: 'Quản lý danh sách tiện ích hiển thị', link: '/admin/amenities' },
    { emoji: '📍', title: 'Vị trí', desc: 'Cập nhật địa chỉ và điểm tham quan lân cận', link: '/admin/location' },
    { emoji: '📞', title: 'Liên hệ', desc: 'Quản lý thông tin liên hệ, giờ hoạt động, chính sách', link: '/admin/contact' },
    { emoji: '🤖', title: 'Chatbot AI', desc: 'Cấu hình AI, nhập API key, quản lý knowledge base', link: '/admin/chatbot' },
    { emoji: '⚙️', title: 'Cài đặt chung', desc: 'Tên site, SEO, footer, mạng xã hội', link: '/admin/settings' },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-white">{getGreeting()}</h1>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="w-4 h-4 text-gray-500" />
          <p className="text-gray-400 text-sm">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.link)}
            className={`bg-[#111827] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.1] transition-all duration-300 shadow-lg ${card.glow} text-left group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </button>
        ))}
      </div>

      {/* Quick guide */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-5">Hướng dẫn nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {guides.map((g) => (
            <button
              key={g.title}
              onClick={() => navigate(g.link)}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.08] transition-all text-left group"
            >
              <span className="text-xl flex-shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-200 group-hover:text-white transition-colors">{g.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{g.desc}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
