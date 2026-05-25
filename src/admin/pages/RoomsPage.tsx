import { useState, useEffect } from 'react';
import { roomsService } from '../../services/rooms.service';
import { useToast } from '../../contexts/ToastContext';
import type { Room } from '../../types';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

const emptyRoom: Omit<Room, 'id' | 'created_at' | 'updated_at'> = {
  name: '', price: '', capacity: '', size: '', image_url: '',
  amenities: [], description: '', sort_order: 0, is_active: true, is_booked: false,
};

function RoomsPage() {
  const { addToast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRoom, setEditRoom] = useState<Partial<Room> | null>(null);
  const [saving, setSaving] = useState(false);
  const [amenityInput, setAmenityInput] = useState('');

  const fetchRooms = async () => {
    try { const data = await roomsService.getAllAdmin(); setRooms(data); }
    catch { addToast('error', 'Lỗi tải danh sách phòng'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSave = async () => {
    if (!editRoom?.name || !editRoom?.price) { addToast('warning', 'Vui lòng nhập tên và giá phòng'); return; }
    setSaving(true);
    try {
      if (editRoom.id) {
        await roomsService.update(editRoom.id, editRoom);
        addToast('success', 'Đã cập nhật phòng!');
      } else {
        await roomsService.create(editRoom as Omit<Room, 'id' | 'created_at' | 'updated_at'>);
        addToast('success', 'Đã thêm phòng mới!');
      }
      setEditRoom(null);
      fetchRooms();
    } catch { addToast('error', 'Lỗi khi lưu phòng'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn chắc chắn muốn xóa phòng này?')) return;
    try { await roomsService.delete(id); addToast('success', 'Đã xóa phòng'); fetchRooms(); }
    catch { addToast('error', 'Lỗi khi xóa'); }
  };

  const handleToggleBooked = async (room: Room) => {
    try {
      await roomsService.update(room.id, { is_booked: !room.is_booked });
      addToast('success', room.is_booked ? 'Phòng đã mở lại' : 'Phòng đánh dấu đã đặt');
      fetchRooms();
    } catch { addToast('error', 'Lỗi cập nhật'); }
  };

  const addAmenity = () => {
    if (!amenityInput.trim() || !editRoom) return;
    const current = editRoom.amenities || [];
    if (!current.includes(amenityInput.trim())) {
      setEditRoom({ ...editRoom, amenities: [...current, amenityInput.trim()] });
    }
    setAmenityInput('');
  };

  const removeAmenity = (item: string) => {
    if (!editRoom) return;
    setEditRoom({ ...editRoom, amenities: (editRoom.amenities || []).filter(a => a !== item) });
  };

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-[#111827] rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý Phòng ốc</h1>
          <p className="text-gray-400 text-sm mt-1">{rooms.length} phòng</p>
        </div>
        <button onClick={() => { setEditRoom({ ...emptyRoom }); setAmenityInput(''); }}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20">
          <Plus className="w-4 h-4" /> Thêm phòng
        </button>
      </div>

      {/* Edit Modal */}
      {editRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{editRoom.id ? 'Sửa phòng' : 'Thêm phòng mới'}</h2>
              <button onClick={() => setEditRoom(null)} className="text-gray-500 hover:text-gray-300 p-1"><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tên phòng *</label>
              <input value={editRoom.name || ''} onChange={e => setEditRoom({ ...editRoom, name: e.target.value })}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Giá/đêm *</label>
                <input value={editRoom.price || ''} onChange={e => setEditRoom({ ...editRoom, price: e.target.value })}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" placeholder="800.000đ" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sức chứa</label>
                <input value={editRoom.capacity || ''} onChange={e => setEditRoom({ ...editRoom, capacity: e.target.value })}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" placeholder="2-3 người" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Diện tích</label>
                <input value={editRoom.size || ''} onChange={e => setEditRoom({ ...editRoom, size: e.target.value })}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" placeholder="35m²" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thứ tự</label>
                <input type="number" value={editRoom.sort_order || 0} onChange={e => setEditRoom({ ...editRoom, sort_order: parseInt(e.target.value) })}
                  className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
              </div>
            </div>

            <ImageUploader value={editRoom.image_url || ''} onChange={(url) => setEditRoom({ ...editRoom, image_url: url })} folder="rooms" label="Hình ảnh phòng" />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả</label>
              <textarea value={editRoom.description || ''} onChange={e => setEditRoom({ ...editRoom, description: e.target.value })} rows={2}
                className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
            </div>

            {/* Amenities chip editor */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tiện nghi phòng</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(editRoom.amenities || []).map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/15 text-emerald-400 rounded-lg text-sm border border-emerald-500/20">
                    {a}
                    <button onClick={() => removeAmenity(a)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={amenityInput} onChange={e => setAmenityInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }}
                  className="flex-1 bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="WiFi, Điều hòa, TV..." />
                <button onClick={addAmenity} className="px-4 py-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl text-gray-300 hover:bg-white/[0.1] text-sm transition-colors">Thêm</button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editRoom.is_active !== false} onChange={e => setEditRoom({ ...editRoom, is_active: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#0B0F19] border-white/[0.15] text-emerald-500 focus:ring-emerald-500/20" />
                <span className="text-sm text-gray-300">Hiển thị</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editRoom.is_booked === true} onChange={e => setEditRoom({ ...editRoom, is_booked: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#0B0F19] border-white/[0.15] text-red-500 focus:ring-red-500/20" />
                <span className="text-sm text-gray-300">Đã được đặt</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditRoom(null)} className="px-5 py-2.5 border border-white/[0.08] rounded-xl text-gray-400 hover:bg-white/[0.04] transition-colors">Hủy</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/20">
                <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rooms Table */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0B0F19]">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Phòng</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Giá</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Sức chứa</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Trạng thái</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {room.image_url ? (
                      <img src={room.image_url} alt={room.name} className="w-12 h-12 rounded-lg object-cover border border-white/[0.06]" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white/[0.04] flex items-center justify-center text-gray-600 text-xs">No img</div>
                    )}
                    <span className="font-medium text-gray-200">{room.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-amber-400 font-semibold">{room.price}</td>
                <td className="px-5 py-4 text-sm text-gray-400 hidden md:table-cell">{room.capacity}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${room.is_active ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/15 text-gray-400 border border-gray-500/20'}`}>
                      {room.is_active ? 'Hiển thị' : 'Ẩn'}
                    </span>
                    <button
                      onClick={() => handleToggleBooked(room)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${room.is_booked ? 'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25'}`}
                    >
                      {room.is_booked ? '🔒 Đã đặt' : '✅ Còn trống'}
                    </button>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setEditRoom(room); setAmenityInput(''); }} className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 p-2 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(room.id)} className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rooms.length === 0 && <p className="text-center py-12 text-gray-500">Chưa có phòng nào</p>}
      </div>
    </div>
  );
}

export default RoomsPage;
