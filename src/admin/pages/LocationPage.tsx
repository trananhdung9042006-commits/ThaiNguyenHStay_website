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

  if (loading) return <div className="h-48 bg-[#111827] rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý Vị trí</h1>
          <p className="text-gray-400 text-sm mt-1">Địa chỉ, bản đồ và điểm tham quan</p>
        </div>
        <button onClick={handleSaveLocation} disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/20">
          <Save className="w-4 h-4" /> {saving ? 'Lưu...' : 'Lưu vị trí'}
        </button>
      </div>

      {location && (
        <>
          {/* Section header fields */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-white">Tiêu đề section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                <input value={location.section_subtitle} onChange={e => setLocation({ ...location, section_subtitle: e.target.value })}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input value={location.section_title} onChange={e => setLocation({ ...location, section_title: e.target.value })}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả</label>
              <textarea value={location.section_description || ''} onChange={e => setLocation({ ...location, section_description: e.target.value })} rows={2}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
            </div>
          </div>

          {/* Location info */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-white">Thông tin vị trí</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Địa chỉ</label>
              <input value={location.address} onChange={e => setLocation({ ...location, address: e.target.value })}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Google Maps link</label>
              <input value={location.google_maps_link} onChange={e => setLocation({ ...location, google_maps_link: e.target.value })}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Map Embed URL (iframe src)</label>
              <input value={location.map_embed_url || ''} onChange={e => setLocation({ ...location, map_embed_url: e.target.value })}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
            </div>
            {location.map_embed_url && (
              <div className="rounded-xl overflow-hidden border border-white/[0.06]">
                <iframe src={location.map_embed_url} className="w-full h-64" loading="lazy" title="Map preview" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Điện thoại</label>
                <input value={location.phone || ''} onChange={e => setLocation({ ...location, phone: e.target.value })}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Latitude</label>
                <input type="number" step="any" value={location.latitude || ''} onChange={e => setLocation({ ...location, latitude: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Longitude</label>
                <input type="number" step="any" value={location.longitude || ''} onChange={e => setLocation({ ...location, longitude: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Attractions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Điểm tham quan</h2>
        <button onClick={() => setEditAttr({ name: '', distance: '', travel_time: '', sort_order: 0, is_active: true })}
          className="flex items-center gap-2 bg-amber-500/15 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-xl font-semibold hover:bg-amber-500/25 transition-colors">
          <Plus className="w-4 h-4" /> Thêm
        </button>
      </div>

      {editAttr && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between">
              <h3 className="font-bold text-white">{editAttr.id ? 'Sửa' : 'Thêm'}</h3>
              <button onClick={() => setEditAttr(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <input placeholder="Tên *" value={editAttr.name || ''} onChange={e => setEditAttr({ ...editAttr, name: e.target.value })}
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Khoảng cách" value={editAttr.distance || ''} onChange={e => setEditAttr({ ...editAttr, distance: e.target.value })}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
              <input placeholder="Thời gian" value={editAttr.travel_time || ''} onChange={e => setEditAttr({ ...editAttr, travel_time: e.target.value })}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditAttr(null)} className="px-5 py-2.5 border border-white/[0.08] rounded-xl text-gray-400 hover:bg-white/[0.04] transition-colors">Hủy</button>
              <button onClick={handleSaveAttr} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all">Lưu</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {attractions.map(a => (
          <div key={a.id} className="bg-[#111827] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between hover:border-white/[0.1] transition-colors">
            <div>
              <p className="font-medium text-gray-200">{a.name}</p>
              <p className="text-sm text-gray-500">{a.distance} • {a.travel_time}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEditAttr(a)} className="text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 p-2 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteAttr(a.id)} className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {attractions.length === 0 && <p className="text-center py-8 text-gray-500">Chưa có điểm tham quan</p>}
      </div>
    </div>
  );
}

export default LocationPage;
