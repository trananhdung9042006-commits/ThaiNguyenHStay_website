import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-emerald-950 border-t border-emerald-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-amber-400 rounded-lg flex items-center justify-center">
                <span className="text-emerald-950 font-bold text-xl">H</span>
              </div>
              <div>
                <span className="text-white font-bold text-xl">ThaiNguyen</span>
                <span className="text-amber-400 font-semibold text-xl">Stay</span>
              </div>
            </div>
            <p className="text-emerald-300 mb-6 leading-relaxed">
              Trải nghiệm homestay đẳng cấp tại Thái Nguyên. Nơi nghỉ dưỡng yên bình giữa thiên nhiên,
              mang lại những kỷ niệm đáng nhớ.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-emerald-800/50 rounded-full flex items-center justify-center text-emerald-300 hover:bg-amber-500 hover:text-emerald-950 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-emerald-800/50 rounded-full flex items-center justify-center text-emerald-300 hover:bg-amber-500 hover:text-emerald-950 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-emerald-800/50 rounded-full flex items-center justify-center text-emerald-300 hover:bg-amber-500 hover:text-emerald-950 transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Liên Kết Nhanh</h4>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-emerald-300 hover:text-amber-400 transition-colors">Trang chủ</a>
              </li>
              <li>
                <a href="#rooms" className="text-emerald-300 hover:text-amber-400 transition-colors">Phòng ốc</a>
              </li>
              <li>
                <a href="#amenities" className="text-emerald-300 hover:text-amber-400 transition-colors">Tiện ích</a>
              </li>
              <li>
                <a href="#location" className="text-emerald-300 hover:text-amber-400 transition-colors">Vị trí</a>
              </li>
              <li>
                <a href="#contact" className="text-emerald-300 hover:text-amber-400 transition-colors">Liên hệ</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Dịch Vụ</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-emerald-300">Đặt phòng trực tuyến</span>
              </li>
              <li>
                <span className="text-emerald-300">Dịch vụ ăn uống</span>
              </li>
              <li>
                <span className="text-emerald-300">Organisation sự kiện</span>
              </li>
              <li>
                <span className="text-emerald-300">Tham quan du lịch</span>
              </li>
              <li>
                <span className="text-emerald-300">Cho thuê xe máy</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Liên Hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-300 text-sm">Hotline</p>
                  <a href="tel:+84912345678" className="text-white font-semibold hover:text-amber-400 transition-colors">
                    0912.345.678
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-300 text-sm">Email</p>
                  <a href="mailto:booking@thainguyenstay.com" className="text-white font-semibold hover:text-amber-400 transition-colors">
                    booking@thainguyenstay.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-300 text-sm">Địa chỉ</p>
                  <p className="text-white text-sm leading-relaxed">
                    Đường Nguyễn Du, Phường Túc Duyên,<br />
                    TP. Thái Nguyên, Tỉnh Thái Nguyên
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-800/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-emerald-400 text-sm text-center md:text-left">
              © {currentYear} ThaiNguyen Stay. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-emerald-400 hover:text-amber-400 transition-colors">Điều khoản</a>
              <a href="#" className="text-emerald-400 hover:text-amber-400 transition-colors">Chính sách bảo mật</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
