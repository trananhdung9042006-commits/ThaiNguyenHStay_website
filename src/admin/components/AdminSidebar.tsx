import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Image, BedDouble, Sparkles, MapPin,
  Phone, Settings, MessageSquareMore, ExternalLink,
} from 'lucide-react';

const menuItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/hero', icon: Image, label: 'Hero Section' },
  { to: '/admin/rooms', icon: BedDouble, label: 'Phòng ốc' },
  { to: '/admin/amenities', icon: Sparkles, label: 'Tiện ích' },
  { to: '/admin/location', icon: MapPin, label: 'Vị trí' },
  { to: '/admin/contact', icon: Phone, label: 'Liên hệ' },
  { to: '/admin/chatbot', icon: MessageSquareMore, label: 'Chatbot AI' },
  { to: '/admin/settings', icon: Settings, label: 'Cài đặt chung' },
];

function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-emerald-950 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <div>
            <span className="text-white font-bold">Vista</span>
            <span className="text-amber-400 font-bold ml-1">Homestay</span>
          </div>
        </div>
        <p className="text-emerald-400 text-xs mt-1">Trang quản trị</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-emerald-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* View Site */}
      <div className="px-3 py-4 border-t border-white/10">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-emerald-300 hover:bg-white/5 hover:text-white text-sm transition-all"
        >
          <ExternalLink className="w-5 h-5" />
          Xem website
        </a>
      </div>
    </aside>
  );
}

export default AdminSidebar;
