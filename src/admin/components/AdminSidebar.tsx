import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteData } from '../../contexts/SiteDataContext';
import {
  LayoutDashboard, Image, BedDouble, Sparkles, MapPin,
  Phone, Settings, MessageSquareMore, ExternalLink,
  LogOut, X, ChevronRight,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', desc: 'Tổng quan' },
  { to: '/admin/hero', icon: Image, label: 'Hero Section', desc: 'Banner trang chủ' },
  { to: '/admin/rooms', icon: BedDouble, label: 'Phòng ốc', desc: 'Quản lý phòng' },
  { to: '/admin/amenities', icon: Sparkles, label: 'Tiện ích', desc: 'Dịch vụ & tiện nghi' },
  { to: '/admin/location', icon: MapPin, label: 'Vị trí', desc: 'Địa chỉ & bản đồ' },
  { to: '/admin/contact', icon: Phone, label: 'Liên hệ', desc: 'Thông tin liên hệ' },
  { to: '/admin/chatbot', icon: MessageSquareMore, label: 'Chatbot AI', desc: 'Trợ lý ảo' },
  { to: '/admin/settings', icon: Settings, label: 'Cài đặt chung', desc: 'Tên site, SEO' },
];

function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { user, signOut } = useAuth();
  const { data } = useSiteData();
  const siteName = data?.settings?.site_name || 'Vista Homestay';

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col transition-transform duration-300 ease-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{
        background: 'linear-gradient(180deg, #0d1520 0%, #0a1628 50%, #091420 100%)',
      }}
    >
      {/* Close button - mobile only */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">{siteName}</span>
            <p className="text-emerald-400/80 text-[11px] font-medium tracking-wide uppercase">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {menuItems.map(({ to, icon: Icon, label, desc }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/[0.12] text-emerald-400 shadow-lg shadow-emerald-500/[0.05]'
                  : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-emerald-500/20' : 'bg-white/[0.04] group-hover:bg-white/[0.06]'
                }`}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block truncate">{label}</span>
                  <span className={`block text-[11px] truncate transition-colors ${
                    isActive ? 'text-emerald-400/60' : 'text-gray-500 group-hover:text-gray-400'
                  }`}>{desc}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                  isActive ? 'opacity-100 text-emerald-400' : 'opacity-0 group-hover:opacity-50'
                }`} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-3 border-t border-white/[0.06] space-y-1">
        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 text-sm transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Xem website</span>
        </a>

        {/* User info + logout */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300 truncate">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
