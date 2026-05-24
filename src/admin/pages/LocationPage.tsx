import { useState, useEffect } from 'react';
import { locationService } from '../../services/location.service';
import { useToast } from '../../contexts/ToastContext';
import type { LocationInfo, Attraction } from '../../types';
import { Save, Plus, Pencil, Trash2, X } from 'lucide-react';

function LocationPage() {
  const { addToast } = useToast();
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editAttr, setEditAttr] = useState<Partial<Attraction> | null>(null);

  useEffect(() => {
    Promise.all([locationService.get(), locationService.getAllAttractions()])
      .then(([loc, attr]) => { setLocation(loc); setAttractions(attr); })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveLocation = async () => {
    if (!location) return;
    setSaving(true);
    try { await locationService.update(location.id, location); addToast('success', 'Đã lưu!'); }
    catch { addToast('error', 'Lỗi'); } finally { setSaving(false); }
  };

  const handleSaveAttr = async () => {
    if (!editAttr?.name) return;
    try {
      if (editAttr.id) { await locationService.updateAttraction(editAttr.id, editAttr); }
      else { await locationService.createAttraction(editAttr as Omit<Attraction, 'id' | 'created_at'>); }
      addToast('success', 'Đã lưu!'); setEditAttr(null);
      setAttractions(await locationService.getAllAttractions());
    } catch { addToast('error', 'Lỗi'); }
  };

  const handleDeleteAttr = async (id: string) => {
    if (!confirm('Xóa?')) return;
    try { await locationService.deleteAttraction(id); setAttractions(await locationService.getAllAttractions()); addToast('success', 'Đã xóa'); }
    catch { addToast('error', 'Lỗi'); }
  };

  if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Vị trí</h1>
        <button onClick={handleSaveLocation} disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-70">
          <Save className="w-4 h-4" /> {saving ? 'Lưu...' : 'Lưu vị trí'}
        </button>
      </div>

      {location && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input value={location.address} onChange={e => setLocation({...location, address: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Google Maps link</label>
            <input value={location.google_maps_link} onChange={e => setLocation({...location, google_maps_link: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Map Embed URL (iframe src)</label>
            <input value={location.map_embed_url || ''} onChange={e => setLocation({...location, map_embed_url: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
            <input value={location.phone} onChange={e => setLocation({...location, phone: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>
      )}

      {/* Attractions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Điểm tham quan</h2>
        <button onClick={() => setEditAttr({ name: '', distance: '', travel_time: '', sort_order: 0, is_active: true })}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-amber-600">
          <Plus className="w-4 h-4" /> Thêm
        </button>
      </div>

      {editAttr && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between"><h3 className="font-bold">{editAttr.id ? 'Sửa' : 'Thêm'}</h3><button onClick={() => setEditAttr(null)}><X className="w-5 h-5 text-gray-400" /></button></div>
            <input placeholder="Tên *" value={editAttr.name || ''} onChange={e => setEditAttr({...editAttr, name: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Khoảng cách" value={editAttr.distance || ''} onChange={e => setEditAttr({...editAttr, distance: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input placeholder="Thời gian" value={editAttr.travel_time || ''} onChange={e => setEditAttr({...editAttr, travel_time: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditAttr(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600">Hủy</button>
              <button onClick={handleSaveAttr} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700">Lưu</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {attractions.map(a => (
          <div key={a.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{a.name}</p>
              <p className="text-sm text-gray-500">{a.distance} • {a.travel_time}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditAttr(a)} className="text-blue-500 p-1"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteAttr(a.id)} className="text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LocationPage;
