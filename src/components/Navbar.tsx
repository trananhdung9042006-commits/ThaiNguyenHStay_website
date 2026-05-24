import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useSiteData();

  const navLinks = data?.settings.nav_links || [
    { name: 'Trang chủ', href: '#home' },
    { name: 'Phòng ốc', href: '#rooms' },
    { name: 'Tiện ích', href: '#amenities' },
    { name: 'Vị trí', href: '#location' },
    { name: 'Liên hệ', href: '#contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-emerald-950/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <span className="text-white font-bold text-lg">Vista</span>
              <span className="text-amber-400 font-bold text-lg ml-1">Homestay</span>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-emerald-200 hover:text-amber-400 transition-colors text-sm font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <motion.a
            href="#contact"
            className="hidden lg:inline-flex bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform shadow-lg shadow-amber-500/25"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Đặt phòng ngay
          </motion.a>

          {/* Mobile Toggle */}
          <button className="lg:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-emerald-950/98 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-emerald-200 hover:text-amber-400 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                className="block bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center px-6 py-3 rounded-full font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Đặt phòng ngay
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
