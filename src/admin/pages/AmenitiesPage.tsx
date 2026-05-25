import { useState, useEffect } from 'react';
import { amenitiesService } from '../../services/amenities.service';
import { useToast } from '../../contexts/ToastContext';
import type { Amenity } from '../../types';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

const emptyAmenity: Omit<Amenity, 'id' | 'created_at' | 'updated_at'> = {
  icon: 'Star', title: '', description: '', sort_order: 0, is_active: true,
};

function AmenitiesPage() {
  const { addToast } = useToast();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<Amenity> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try { setAmenities(await amenitiesService.getAllAdmin()); } catch { addToast('error', 'Lỗi tải'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!editItem?.title || !editItem?.icon) { addToast('warning', 'Nhập tên icon và tiêu đề'); return; }
    setSaving(true);
    try {
      if (editItem.id) { await amenitiesService.update(editItem.id, editItem); addToast('success', 'Đã cập nhật!'); }
      else { await amenitiesService.create(editItem as Omit<Amenity, 'id' | 'created_at' | 'updated_at'>); addToast('success', 'Đã thêm!'); }
      setEditItem(null); fetch();
    } catch { addToast('error', 'Lỗi khi lưu'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa tiện ích này?')) return;
    try { await amenitiesService.delete(id); addToast('success', 'Đã xóa'); fetch(); } catch { addToast('error', 'Lỗi'); }
  };

  if (loading) return <div className="h-48 bg-[#111827] rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý Tiện ích</h1>
          <p className="text-gray-400 text-sm mt-1">{amenities.length} tiện ích</p>
        </div>
        <button onClick={() => setEditItem({ ...emptyAmenity })}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20">
          <Plus className="w-4 h-4" /> Thêm tiện ích
        </button>
      </div>

      {/* Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{editItem.id ? 'Sửa' : 'Thêm'} tiện ích</h2>
              <button onClick={() => setEditItem(null)} className="text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Icon (Lucide name) *</label>
              <input value={editItem.icon || ''} onChange={e => setEditItem({ ...editItem, icon: e.target.value })}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" placeholder="Wifi, Car, Coffee..." />
              <p className="text-xs text-gray-500 mt-1">Xem icons tại lucide.dev/icons</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tiêu đề *</label>
              <input value={editItem.title || ''} onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả</label>
              <textarea value={editItem.description || ''} onChange={e => setEditItem({ ...editItem, description: e.target.value })} rows={2}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thứ tự</label>
                <input type="number" value={editItem.sort_order || 0} onChange={e => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) })}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editItem.is_active !== false} onChange={e => setEditItem({ ...editItem, is_active: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#0B0F19] border-white/[0.15] text-emerald-500 focus:ring-emerald-500/20" />
                  <span className="text-sm text-gray-300">Hiển thị</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditItem(null)} className="px-5 py-2.5 border border-white/[0.08] rounded-xl text-gray-400 hover:bg-white/[0.04] transition-colors">Hủy</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/20">
                <Save className="w-4 h-4" /> {saving ? 'Lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map(a => (
          <div key={a.id} className={`bg-[#111827] border rounded-xl p-5 transition-all ${a.is_active ? 'border-white/[0.06] hover:border-white/[0.1]' : 'border-white/[0.03] opacity-50'}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono mb-2">{a.icon}</span>
                <h3 className="font-semibold text-gray-200">{a.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{a.description}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditItem(a)} className="text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 p-1.5 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(a.id)} className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {amenities.length === 0 && <p className="text-center py-12 text-gray-500">Chưa có tiện ích nào</p>}
    </div>
  );
}

export default AmenitiesPage;
