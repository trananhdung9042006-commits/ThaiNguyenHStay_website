import { useState, useEffect } from 'react';
import { chatbotService } from '../../services/chatbot.service';
import { useToast } from '../../contexts/ToastContext';
import type { ChatbotConfig, KnowledgeEntry, AIProvider } from '../../types';
import { AI_PROVIDERS, PROVIDER_MODELS, KB_CATEGORIES } from '../../types';
import { Save, Plus, Pencil, Trash2, X, Bot, BookOpen, ToggleLeft, ToggleRight, Key, Cpu } from 'lucide-react';

const providerLabels: Record<AIProvider, string> = {
  openai: 'OpenAI', gemini: 'Google Gemini', anthropic: 'Anthropic',
  groq: 'Groq (LLama)', custom: 'Custom API',
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

  if (loading) return <div className="animate-pulse h-96 bg-gray-100 rounded-2xl" />;
  if (!config) return <p className="text-gray-500">Chưa có cấu hình chatbot. Hãy chạy seed.sql.</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Chatbot AI</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setConfig({...config, is_active: !config.is_active})}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
              config.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {config.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {config.is_active ? 'Đang bật' : 'Đang tắt'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'config' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}>
          <Cpu className="w-4 h-4" /> Cấu hình AI
        </button>
        <button onClick={() => setActiveTab('knowledge')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'knowledge' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}>
          <BookOpen className="w-4 h-4" /> Knowledge Base ({knowledge.length})
        </button>
      </div>

      {/* Config Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Provider & Model */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-6 h-6 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-800">AI Provider & Model</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {AI_PROVIDERS.map(p => (
                  <button key={p} onClick={() => setConfig({...config, api_provider: p, model: PROVIDER_MODELS[p]?.[0] || ''})}
                    className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      config.api_provider === p
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    {providerLabels[p]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Key className="w-4 h-4 inline mr-1" />
                API Key
              </label>
              <input type="password" value={config.api_key_encrypted || ''} onChange={e => setConfig({...config, api_key_encrypted: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="sk-... hoặc API key của provider" />
            </div>

            {config.api_provider === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom API Endpoint</label>
                <input value={config.api_endpoint || ''} onChange={e => setConfig({...config, api_endpoint: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://your-api.com/v1/chat/completions" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              {availableModels.length > 0 ? (
                <select value={config.model} onChange={e => setConfig({...config, model: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              ) : (
                <input value={config.model} onChange={e => setConfig({...config, model: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập tên model" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature: {config.temperature}</label>
                <input type="range" min="0" max="1" step="0.1" value={config.temperature}
                  onChange={e => setConfig({...config, temperature: parseFloat(e.target.value)})}
                  className="w-full accent-emerald-600" />
                <div className="flex justify-between text-xs text-gray-400"><span>Chính xác</span><span>Sáng tạo</span></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                <input type="number" value={config.max_tokens} onChange={e => setConfig({...config, max_tokens: parseInt(e.target.value)})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>

          {/* Behavior */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Hành vi Chatbot</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
              <textarea value={config.system_prompt} onChange={e => setConfig({...config, system_prompt: e.target.value})} rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tin nhắn chào mừng</label>
              <textarea value={config.welcome_message} onChange={e => setConfig({...config, welcome_message: e.target.value})} rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quick Replies (mỗi dòng 1 reply)</label>
              <textarea
                value={(config.quick_replies || []).join('\n')}
                onChange={e => setConfig({...config, quick_replies: e.target.value.split('\n').filter(Boolean)})}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="Xem phòng & giá&#10;Vị trí & đường đi&#10;Đặt phòng" />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSaveConfig} disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-70">
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
              className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700">
              <Plus className="w-4 h-4" /> Thêm FAQ
            </button>
          </div>

          {editKB && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
                <div className="flex justify-between"><h2 className="text-lg font-bold">{editKB.id ? 'Sửa' : 'Thêm'} FAQ</h2>
                  <button onClick={() => setEditKB(null)}><X className="w-5 h-5 text-gray-400" /></button></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select value={editKB.category || ''} onChange={e => setEditKB({...editKB, category: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    {KB_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Câu hỏi *</label>
                  <textarea value={editKB.question || ''} onChange={e => setEditKB({...editKB, question: e.target.value})} rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Câu trả lời *</label>
                  <textarea value={editKB.answer || ''} onChange={e => setEditKB({...editKB, answer: e.target.value})} rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (phân cách bằng dấu phẩy)</label>
                  <input value={(editKB.keywords || []).join(', ')} onChange={e => setEditKB({...editKB, keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="đặt phòng, booking, đặt" />
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditKB(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600">Hủy</button>
                  <button onClick={handleSaveKB} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700">Lưu</button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">Danh mục</th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">Câu hỏi</th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">Trả lời</th>
                  <th className="px-5 py-3 text-right text-sm font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {knowledge.map(kb => (
                  <tr key={kb.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{kb.category}</span></td>
                    <td className="px-5 py-3 text-sm text-gray-700 max-w-[200px] truncate">{kb.question}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 max-w-[250px] truncate">{kb.answer}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditKB(kb)} className="text-blue-500 p-1"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteKB(kb.id)} className="text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {knowledge.length === 0 && <p className="text-center py-12 text-gray-400">Chưa có FAQ</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatbotPage;
