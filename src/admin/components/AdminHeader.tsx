import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

const pageTitles: Record<string, { title: string; desc: string }> = {
  '/admin/dashboard': { title: 'Dashboard', desc: 'Tổng quan hệ thống' },
  '/admin/hero': { title: 'Hero Section', desc: 'Quản lý banner trang chủ' },
  '/admin/rooms': { title: 'Phòng ốc', desc: 'Quản lý danh sách phòng' },
  '/admin/amenities': { title: 'Tiện ích', desc: 'Quản lý dịch vụ & tiện nghi' },
  '/admin/location': { title: 'Vị trí', desc: 'Quản lý địa chỉ & bản đồ' },
  '/admin/contact': { title: 'Liên hệ', desc: 'Quản lý thông tin liên hệ' },
  '/admin/chatbot': { title: 'Chatbot AI', desc: 'Cấu hình trợ lý ảo' },
  '/admin/settings': { title: 'Cài đặt chung', desc: 'Tên site, SEO, mạng xã hội' },
};

function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const location = useLocation();
  const current = pageTitles[location.pathname] || { title: 'Quản trị', desc: '' };

  return (
    <header className="sticky top-0 z-30 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          {/* Hamburger - mobile only */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
              {current.title}
            </h1>
            {current.desc && (
              <p className="text-xs text-gray-500 mt-0.5">{current.desc}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button className="relative text-gray-400 hover:text-white p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
