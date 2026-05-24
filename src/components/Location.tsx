import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, Mountain, Coffee, Trees } from 'lucide-react';

const Location = () => {
  const attractions = [
    {
      name: 'Hồ Núi Cốc',
      distance: '15km',
      time: '25 phút',
      icon: Mountain
    },
    {
      name: 'Đền Đuổm',
      distance: '8km',
      time: '15 phút',
      icon: Trees
    },
    {
      name: 'Làng chè Tân Cương',
      distance: '20km',
      time: '35 phút',
      icon: Coffee
    },
    {
      name: 'Thác Ba Dội',
      distance: '30km',
      time: '50 phút',
      icon: Mountain
    }
  ];

  return (
    <section id="location" className="py-24 bg-gradient-to-b from-stone-200 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-600 font-semibold text-lg uppercase tracking-wider">Vị Trí Đắc Địa</span>
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mt-3 mb-4">
            Khám Phá Thái Nguyên
          </h2>
          <p className="text-emerald-700 text-lg max-w-2xl mx-auto">
            Homestay của chúng tôi nằm ở vị trí thuận tiện, dễ dàng di chuyển đến các điểm du lịch nổi tiếng
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-8 shadow-2xl h-[500px] flex items-center justify-center relative overflow-hidden">
              {/* Decorative Map Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-white rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-24 h-24 border-4 border-white rounded-full" />
                <div className="absolute bottom-1/4 left-1/3 w-40 h-40 border-4 border-white rounded-full" />
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-400 rounded-full" />
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="w-10 h-10 text-emerald-950" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">ThaiNguyen Stay</h3>
                <p className="text-emerald-200 mb-6">Thành phố Thái Nguyên, Việt Nam</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-800 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors"
                >
                  <Navigation className="w-5 h-5" />
                  Xem trên Google Maps
                </a>
              </div>
            </div>
          </motion.div>

          {/* Nearby Attractions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-emerald-900 mb-6">Điểm Đến Gần Đây</h3>
            <div className="space-y-4">
              {attractions.map((attraction, index) => {
                const Icon = attraction.icon;
                return (
                  <motion.div
                    key={attraction.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4"
                  >
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-emerald-700" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-emerald-900 text-lg">{attraction.name}</h4>
                      <div className="flex items-center gap-4 text-emerald-600 text-sm mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {attraction.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {attraction.time}
                        </span>
                      </div>
                    </div>
                    <Navigation className="w-5 h-5 text-amber-500" />
                  </motion.div>
                );
              })}
            </div>

            {/* Address Card */}
            <div className="mt-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 shadow-xl">
              <h4 className="font-bold text-emerald-950 text-lg mb-3">Địa Chỉ Cụ Thể</h4>
              <p className="text-emerald-900 mb-4">
                Đường Nguyễn Du, Phường Túc Duyên, Thành phố Thái Nguyên, Tỉnh Thái Nguyên
              </p>
              <a
                href="tel:+84912345678"
                className="inline-flex items-center gap-2 bg-emerald-950 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-emerald-900 transition-colors"
              >
                Gọi để tìm đường
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Location;
