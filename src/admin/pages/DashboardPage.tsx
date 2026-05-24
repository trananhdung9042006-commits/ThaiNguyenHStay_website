import { useEffect, useState } from 'react';
import { BedDouble, Users, Eye, MessageSquareMore } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function DashboardPage() {
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

  const cards = [
    { label: 'Phòng ốc', value: stats.rooms, icon: BedDouble, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Tiện ích', value: stats.amenities, icon: Eye, color: 'from-amber-500 to-amber-600' },
    { label: 'FAQ Chatbot', value: stats.knowledge, icon: MessageSquareMore, color: 'from-blue-500 to-blue-600' },
    { label: 'Chat Sessions', value: stats.sessions, icon: Users, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Hướng dẫn nhanh</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>📝 <strong>Hero Section</strong> — Chỉnh sửa tiêu đề, mô tả và hình nền trang chủ</p>
          <p>🛏️ <strong>Phòng ốc</strong> — Thêm, sửa, xóa phòng với hình ảnh và giá</p>
          <p>✨ <strong>Tiện ích</strong> — Quản lý danh sách tiện ích hiển thị</p>
          <p>📍 <strong>Vị trí</strong> — Cập nhật địa chỉ và điểm tham quan lân cận</p>
          <p>📞 <strong>Liên hệ</strong> — Quản lý thông tin liên hệ, giờ hoạt động, chính sách</p>
          <p>🤖 <strong>Chatbot AI</strong> — Cấu hình AI provider, nhập API key, quản lý knowledge base</p>
          <p>⚙️ <strong>Cài đặt chung</strong> — Tên site, SEO, footer, mạng xã hội</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
