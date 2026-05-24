import { useState, useEffect } from 'react';
import { roomsService } from '../../services/rooms.service';
import { useToast } from '../../contexts/ToastContext';
import type { Room } from '../../types';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

const emptyRoom: Omit<Room, 'id' | 'created_at' | 'updated_at'> = {
  name: '', price: '', capacity: '', size: '', image_url: '',
  amenities: [], description: '', sort_order: 0, is_active: true,
};

function RoomsPage() {
  const { addToast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRoom, setEditRoom] = useState<Partial<Room> | null>(null);
  const [saving, setSaving] = useState(false);

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

  if (loading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Phòng ốc</h1>
        <button onClick={() => setEditRoom({ ...emptyRoom })}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Thêm phòng
        </button>
      </div>

      {/* Edit Modal */}
      {editRoom && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{editRoom.id ? 'Sửa phòng' : 'Thêm phòng mới'}</h2>
              <button onClick={() => setEditRoom(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên phòng *</label>
              <input value={editRoom.name || ''} onChange={e => setEditRoom({...editRoom, name: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá/đêm *</label>
                <input value={editRoom.price || ''} onChange={e => setEditRoom({...editRoom, price: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="800.000đ" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa</label>
                <input value={editRoom.capacity || ''} onChange={e => setEditRoom({...editRoom, capacity: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="2-3 người" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích</label>
                <input value={editRoom.size || ''} onChange={e => setEditRoom({...editRoom, size: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="35m²" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                <input type="number" value={editRoom.sort_order || 0} onChange={e => setEditRoom({...editRoom, sort_order: parseInt(e.target.value)})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh URL</label>
              <input value={editRoom.image_url || ''} onChange={e => setEditRoom({...editRoom, image_url: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea value={editRoom.description || ''} onChange={e => setEditRoom({...editRoom, description: e.target.value})} rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={editRoom.is_active !== false} onChange={e => setEditRoom({...editRoom, is_active: e.target.checked})}
                className="w-4 h-4 text-emerald-600 rounded" />
              <label className="text-sm text-gray-700">Hiển thị trên website</label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditRoom(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Hủy</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-70">
                <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">Phòng</th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">Giá</th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">Sức chứa</th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
              <th className="px-5 py-3 text-right text-sm font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rooms.map(room => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {room.image_url && <img src={room.image_url} alt={room.name} className="w-12 h-12 rounded-lg object-cover" />}
                    <span className="font-medium text-gray-800">{room.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-amber-600 font-semibold">{room.price}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{room.capacity}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${room.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {room.is_active ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditRoom(room)} className="text-blue-500 hover:text-blue-700 p-1"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(room.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rooms.length === 0 && <p className="text-center py-12 text-gray-400">Chưa có phòng nào</p>}
      </div>
    </div>
  );
}

export default RoomsPage;
