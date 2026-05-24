import { motion } from 'framer-motion';
import { Phone, MessageCircle, QrCode, Mail, Clock, MapPin, CheckCircle } from 'lucide-react';

const Contact = () => {
  const bookingMethods = [
    {
      icon: Phone,
      title: 'Gọi Điện Thoại',
      description: 'Liên hệ trực tiếp với chúng tôi',
      action: '0912.345.678',
      link: 'tel:+84912345678',
      color: 'from-green-500 to-green-600',
      iconColor: 'text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Zalo',
      description: 'Chat và đặt phòng qua Zalo',
      action: '0912.345.678',
      link: 'https://zalo.me/0912345678',
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-600'
    },
    {
      icon: QrCode,
      title: 'Quét QR Code',
      description: 'Quét để chuyển khoản đặt cọc',
      action: 'MB Bank',
      link: '#',
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-600'
    }
  ];

  const workingHours = [
    { day: 'Thứ 2 - Thứ 6', hours: '08:00 - 22:00' },
    { day: 'Thứ 7', hours: '07:00 - 23:00' },
    { day: 'Chủ Nhật', hours: '07:00 - 23:00' },
    { day: 'Lễ Tết', hours: '24/24' }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-emerald-950 to-emerald-900 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 font-semibold text-lg uppercase tracking-wider">Liên Hệ & Đặt Phòng</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Đặt Phòng Nhanh Chóng
          </h2>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
            Nhiều phương thức đặt phòng tiện lợi, hỗ trợ 24/7
          </p>
        </motion.div>

        {/* Booking Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {bookingMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{method.title}</h3>
                <p className="text-emerald-200 mb-4">{method.description}</p>
                {method.title === 'Quét QR Code' ? (
                  <div className="bg-white rounded-2xl p-4 mb-4">
                    <img
                      src="/images/qr-code.png"
                      alt="QR Code"
                      className="w-full h-auto"
                    />
                    <p className="text-center text-emerald-900 font-semibold mt-2">MB Bank</p>
                    <p className="text-center text-emerald-700 text-sm">0123 456 789</p>
                  </div>
                ) : (
                  <a
                    href={method.link}
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${method.color} text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity`}
                  >
                    {method.action}
                    {method.title === 'Gọi Điện Thoại' && <Phone className="w-4 h-4" />}
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Contact Info & Hours */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Thông Tin Liên Hệ</h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-emerald-300 text-sm">Điện thoại</p>
                  <a href="tel:+84912345678" className="text-white font-semibold text-lg hover:text-amber-400 transition-colors">
                    0912.345.678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-emerald-300 text-sm">Zalo</p>
                  <a href="https://zalo.me/0912345678" className="text-white font-semibold text-lg hover:text-amber-400 transition-colors">
                    0912.345.678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-emerald-300 text-sm">Email</p>
                  <a href="mailto:booking@thainguyenstay.com" className="text-white font-semibold text-lg hover:text-amber-400 transition-colors">
                    booking@thainguyenstay.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-emerald-300 text-sm">Địa chỉ</p>
                  <p className="text-white font-semibold">
                    Đường Nguyễn Du, Phường Túc Duyên,<br />
                    Thành phố Thái Nguyên, Tỉnh Thái Nguyên
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Working Hours */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Giờ Hoạt Động</h3>
            
            <div className="space-y-4 mb-8">
              {workingHours.map((schedule, index) => (
                <div key={schedule.day} className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-emerald-200">{schedule.day}</span>
                  <span className="text-white font-semibold">{schedule.hours}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/20 border border-amber-500/30 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold mb-1">Hỗ trợ 24/7</p>
                  <p className="text-emerald-200 text-sm">
                    Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc của quý khách
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Booking Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-emerald-950 mb-3">Đặt Cọc & Hủy Phòng</h3>
          <p className="text-emerald-900 max-w-3xl mx-auto">
            • Đặt cọc 30% giá trị phòng để xác nhận đặt phòng<br />
            • Hủy phòng trước 48 giờ: hoàn lại 100% tiền cọc<br />
            • Hủy phòng trước 24 giờ: hoàn lại 50% tiền cọc<br />
            • Hủy phòng dưới 24 giờ: không hoàn tiền cọc
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
