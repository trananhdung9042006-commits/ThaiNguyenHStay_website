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

  if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Tiện ích</h1>
        <button onClick={() => setEditItem({...emptyAmenity})} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700">
          <Plus className="w-4 h-4" /> Thêm tiện ích
        </button>
      </div>

      {editItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between"><h2 className="text-lg font-bold">{editItem.id ? 'Sửa' : 'Thêm'} tiện ích</h2><button onClick={() => setEditItem(null)}><X className="w-5 h-5 text-gray-400" /></button></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Lucide name) *</label>
              <input value={editItem.icon || ''} onChange={e => setEditItem({...editItem, icon: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Wifi, Car, Coffee..." />
              <p className="text-xs text-gray-400 mt-1">Xem icons tại lucide.dev/icons</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
              <input value={editItem.title || ''} onChange={e => setEditItem({...editItem, title: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})} rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditItem(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-70">
                <Save className="w-4 h-4" /> {saving ? 'Lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map(a => (
          <div key={a.id} className={`bg-white rounded-xl shadow-sm p-5 border ${a.is_active ? 'border-transparent' : 'border-gray-200 opacity-60'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400 font-mono">{a.icon}</p>
                <h3 className="font-semibold text-gray-800 mt-1">{a.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{a.description}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditItem(a)} className="text-blue-500 hover:text-blue-700 p-1"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AmenitiesPage;
