import { useState, useEffect } from 'react';
import { chatbotService } from '../../services/chatbot.service';
import { useToast } from '../../contexts/ToastContext';
import type { ChatbotConfig, KnowledgeEntry, AIProvider } from '../../types';
import { AI_PROVIDERS, PROVIDER_MODELS, KB_CATEGORIES } from '../../types';
import { Save, Plus, Pencil, Trash2, X, Bot, BookOpen, Key, Cpu } from 'lucide-react';

const providerLabels: Record<AIProvider, string> = {
  openai: 'OpenAI', gemini: 'Google Gemini', anthropic: 'Anthropic',
  groq: 'Groq (LLama)', custom: 'Custom API',
};

const providerColors: Record<AIProvider, string> = {
  openai: 'from-green-500/20 to-green-600/5 border-green-500/20 text-green-400',
  gemini: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
  anthropic: 'from-orange-500/20 to-orange-600/5 border-orange-500/20 text-orange-400',
  groq: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
  custom: 'from-gray-500/20 to-gray-600/5 border-gray-500/20 text-gray-400',
};

function ChatbotPage() {
  const { addToast } = useToast();
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editKB, setEditKB] = useState<Partial<KnowledgeEntry> | null>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'knowledge'>('config');

  useEffect(() => {
    Promise.all([chatbotService.getConfig(), chatbotService.getKnowledge()])
      .then(([cfg, kb]) => { setConfig(cfg); setKnowledge(kb); })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveConfig = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await chatbotService.updateConfig(config.id, config);
      addToast('success', 'Đã lưu cấu hình chatbot!');
    } catch { addToast('error', 'Lỗi khi lưu'); }
    finally { setSaving(false); }
  };

  const handleSaveKB = async () => {
    if (!editKB?.question || !editKB?.answer || !editKB?.category) {
      addToast('warning', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    try {
      if (editKB.id) {
        await chatbotService.updateKnowledge(editKB.id, editKB);
      } else {
        await chatbotService.createKnowledge(editKB as Omit<KnowledgeEntry, 'id' | 'created_at' | 'updated_at'>);
      }
      addToast('success', 'Đã lưu!');
      setEditKB(null);
      setKnowledge(await chatbotService.getKnowledge());
    } catch { addToast('error', 'Lỗi'); }
  };

  const handleDeleteKB = async (id: string) => {
    if (!confirm('Xóa FAQ này?')) return;
    try { await chatbotService.deleteKnowledge(id); setKnowledge(await chatbotService.getKnowledge()); addToast('success', 'Đã xóa'); }
    catch { addToast('error', 'Lỗi'); }
  };

  const availableModels = config ? (PROVIDER_MODELS[config.api_provider] || []) : [];
  const inputClass = "w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors";

  if (loading) return <div className="h-96 bg-[#111827] rounded-2xl animate-pulse" />;
  if (!config) return <p className="text-gray-500">Chưa có cấu hình chatbot. Hãy chạy seed.sql.</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Chatbot AI</h1>
          <p className="text-gray-400 text-sm mt-1">Cấu hình trợ lý ảo & knowledge base</p>
        </div>
        <button
          onClick={() => setConfig({ ...config, is_active: !config.is_active })}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
            config.is_active
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25'
              : 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${config.is_active ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-gray-500'}`} />
          {config.is_active ? 'Đang bật' : 'Đang tắt'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#111827] border border-white/[0.06] rounded-xl">
        <button onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
            activeTab === 'config' ? 'bg-emerald-500/15 text-emerald-400' : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.03]'
          }`}>
          <Cpu className="w-4 h-4" /> Cấu hình AI
        </button>
        <button onClick={() => setActiveTab('knowledge')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
            activeTab === 'knowledge' ? 'bg-emerald-500/15 text-emerald-400' : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.03]'
          }`}>
          <BookOpen className="w-4 h-4" /> Knowledge Base ({knowledge.length})
        </button>
      </div>

      {/* Config Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Provider & Model */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-emerald-400" />
              <h2 className="text-base font-semibold text-white">AI Provider & Model</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Provider</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {AI_PROVIDERS.map(p => (
                  <button key={p} onClick={() => setConfig({ ...config, api_provider: p, model: PROVIDER_MODELS[p]?.[0] || '' })}
                    className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all bg-gradient-to-br ${
                      config.api_provider === p
                        ? providerColors[p]
                        : 'from-transparent to-transparent border-white/[0.06] text-gray-400 hover:border-white/[0.12]'
                    }`}>
                    {providerLabels[p]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Key className="w-4 h-4 inline mr-1" /> API Key
              </label>
              <input type="password" value={config.api_key_encrypted || ''} onChange={e => setConfig({ ...config, api_key_encrypted: e.target.value })}
                className={inputClass} placeholder="sk-... hoặc API key của provider" />
            </div>

            {config.api_provider === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Custom API Endpoint</label>
                <input value={config.api_endpoint || ''} onChange={e => setConfig({ ...config, api_endpoint: e.target.value })}
                  className={inputClass} placeholder="https://your-api.com/v1/chat/completions" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
              {availableModels.length > 0 ? (
                <select value={config.model} onChange={e => setConfig({ ...config, model: e.target.value })}
                  className={`${inputClass} bg-[#0B0F19]`}>
                  {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              ) : (
                <input value={config.model} onChange={e => setConfig({ ...config, model: e.target.value })}
                  className={inputClass} placeholder="Nhập tên model" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Temperature: <span className="text-emerald-400">{config.temperature}</span></label>
                <input type="range" min="0" max="1" step="0.1" value={config.temperature}
                  onChange={e => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 h-2 bg-white/[0.06] rounded-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>Chính xác</span><span>Sáng tạo</span></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Tokens</label>
                <input type="number" value={config.max_tokens} onChange={e => setConfig({ ...config, max_tokens: parseInt(e.target.value) })}
                  className={inputClass} />
              </div>
            </div>
          </div>

          {/* Behavior */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-white">Hành vi Chatbot</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">System Prompt</label>
              <textarea value={config.system_prompt} onChange={e => setConfig({ ...config, system_prompt: e.target.value })} rows={4}
                className={`${inputClass} text-sm`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tin nhắn chào mừng</label>
              <textarea value={config.welcome_message} onChange={e => setConfig({ ...config, welcome_message: e.target.value })} rows={2}
                className={`${inputClass} text-sm`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quick Replies (mỗi dòng 1 reply)</label>
              <textarea
                value={(config.quick_replies || []).join('\n')}
                onChange={e => setConfig({ ...config, quick_replies: e.target.value.split('\n').filter(Boolean) })}
                rows={4}
                className={`${inputClass} text-sm`}
                placeholder="Xem phòng & giá&#10;Vị trí & đường đi&#10;Đặt phòng" />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSaveConfig} disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/20">
              <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
            </button>
          </div>
        </div>
      )}

      {/* Knowledge Tab */}
      {activeTab === 'knowledge' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setEditKB({ category: 'đặt_phòng', question: '', answer: '', keywords: [], sort_order: 0, is_active: true })}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20">
              <Plus className="w-4 h-4" /> Thêm FAQ
            </button>
          </div>

          {/* KB Modal */}
          {editKB && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">{editKB.id ? 'Sửa' : 'Thêm'} FAQ</h2>
                  <button onClick={() => setEditKB(null)}><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Danh mục</label>
                  <select value={editKB.category || ''} onChange={e => setEditKB({ ...editKB, category: e.target.value })}
                    className={`${inputClass} bg-[#0B0F19]`}>
                    {KB_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Câu hỏi *</label>
                  <textarea value={editKB.question || ''} onChange={e => setEditKB({ ...editKB, question: e.target.value })} rows={2}
                    className={`${inputClass} text-sm`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Câu trả lời *</label>
                  <textarea value={editKB.answer || ''} onChange={e => setEditKB({ ...editKB, answer: e.target.value })} rows={4}
                    className={`${inputClass} text-sm`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Keywords (phân cách bằng dấu phẩy)</label>
                  <input value={(editKB.keywords || []).join(', ')} onChange={e => setEditKB({ ...editKB, keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className={`${inputClass} text-sm`} placeholder="đặt phòng, booking, đặt" />
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditKB(null)} className="px-5 py-2.5 border border-white/[0.08] rounded-xl text-gray-400 hover:bg-white/[0.04] transition-colors">Hủy</button>
                  <button onClick={handleSaveKB} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all">Lưu</button>
                </div>
              </div>
            </div>
          )}

          {/* KB Table */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0B0F19]">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Danh mục</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Câu hỏi</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Trả lời</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {knowledge.map(kb => (
                  <tr key={kb.id} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">{kb.category}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300 max-w-[200px] truncate">{kb.question}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 max-w-[250px] truncate hidden md:table-cell">{kb.answer}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditKB(kb)} className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 p-2 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteKB(kb.id)} className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {knowledge.length === 0 && <p className="text-center py-12 text-gray-500">Chưa có FAQ</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatbotPage;
