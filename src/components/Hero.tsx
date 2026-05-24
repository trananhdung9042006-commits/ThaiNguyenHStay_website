import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Clock, MapPin } from 'lucide-react';

const Hero = () => {
  const scrollToRooms = () => {
    document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Homestay Thái Nguyên"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-950/40" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 mb-6"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Thái Nguyên, Việt Nam</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              Trải nghiệm Homestay
              <span className="block text-amber-400">Đẳng Cấp</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-emerald-100 mb-8 leading-relaxed"
            >
              Nơi nghỉ dưỡng yên bình giữa thiên nhiên Thái Nguyên. Không gian ấm cúng, 
              tiện nghi hiện đại và dịch vụ tận tâm mang lại trải nghiệm难忘.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 mb-10"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-800/50 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">4.9/5</p>
                  <p className="text-emerald-300 text-sm">500+ đánh giá</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-800/50 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">An toàn</p>
                  <p className="text-emerald-300 text-sm">24/7 bảo vệ</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-800/50 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Nhanh chóng</p>
                  <p className="text-emerald-300 text-sm">Đặt phòng 1 phút</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={scrollToRooms}
                className="group bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 px-8 py-4 rounded-full font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all hover:scale-105 shadow-xl shadow-amber-500/30 flex items-center gap-2"
              >
                Xem phòng
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#contact"
                className="border-2 border-emerald-400 text-emerald-400 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 hover:text-emerald-950 transition-all"
              >
                Liên hệ ngay
              </a>
            </motion.div>
          </motion.div>

          {/* Right Side - Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-emerald-800/30 rounded-2xl">
                  <p className="text-4xl font-bold text-amber-400 mb-2">15+</p>
                  <p className="text-emerald-100">Phòng ốc</p>
                </div>
                <div className="text-center p-6 bg-emerald-800/30 rounded-2xl">
                  <p className="text-4xl font-bold text-amber-400 mb-2">2000+</p>
                  <p className="text-emerald-100">Khách hàng</p>
                </div>
                <div className="text-center p-6 bg-emerald-800/30 rounded-2xl">
                  <p className="text-4xl font-bold text-amber-400 mb-2">5</p>
                  <p className="text-emerald-100">Năm kinh nghiệm</p>
                </div>
                <div className="text-center p-6 bg-emerald-800/30 rounded-2xl">
                  <p className="text-4xl font-bold text-amber-400 mb-2">99%</p>
                  <p className="text-emerald-100">Hài lòng</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-amber-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
