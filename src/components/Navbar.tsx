import { useState } from 'react';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Trang chủ', href: '#home' },
    { name: 'Phòng ốc', href: '#rooms' },
    { name: 'Tiện ích', href: '#amenities' },
    { name: 'Vị trí', href: '#location' },
    { name: 'Liên hệ', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-emerald-950/90 backdrop-blur-md border-b border-emerald-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-amber-400 rounded-lg flex items-center justify-center">
              <span className="text-emerald-950 font-bold text-xl">H</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl">ThaiNguyen</span>
              <span className="text-amber-400 font-semibold text-xl">Stay</span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-emerald-100 hover:text-amber-400 transition-colors font-medium"
              >
                {link.name}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 px-6 py-2.5 rounded-full font-semibold hover:from-amber-400 hover:to-amber-500 transition-all hover:scale-105 shadow-lg shadow-amber-500/30"
            >
              Đặt phòng ngay
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
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
            className="md:hidden bg-emerald-950/95 backdrop-blur-md border-t border-emerald-800/30"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-emerald-100 hover:text-amber-400 transition-colors font-medium py-2"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 px-6 py-3 rounded-full font-semibold text-center"
              >
                Đặt phòng ngay
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
