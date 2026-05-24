import { motion } from 'framer-motion';
import { Wifi, Car, Coffee, Snowflake, Tv, Dumbbell, Utensils, ShieldCheck, Trees, Waves, Flame, Dog } from 'lucide-react';

interface Amenity {
  icon: any;
  title: string;
  description: string;
}

const Amenities = () => {
  const amenities: Amenity[] = [
    {
      icon: Wifi,
      title: 'WiFi Cao Tốc',
      description: 'Kết nối internet tốc độ cao miễn phí toàn khu vực'
    },
    {
      icon: Car,
      title: 'Bãi Đậu Xe',
      description: 'Chỗ đậu xe an toàn, miễn phí cho khách hàng'
    },
    {
      icon: Coffee,
      title: 'Quán Café',
      description: 'Không gian café thư giãn với đồ uống ngon'
    },
    {
      icon: Snowflake,
      title: 'Điều Hòa',
      description: 'Hệ thống điều hòa hiện đại mọi phòng'
    },
    {
      icon: Tv,
      title: 'Smart TV',
      description: 'Tivi thông minh với nhiều kênh giải trí'
    },
    {
      icon: Dumbbell,
      title: 'Phòng Gym',
      description: 'Trang thiết bị hiện đại để rèn luyện sức khỏe'
    },
    {
      icon: Utensils,
      title: 'Nhà Hàng',
      description: 'Ẩm thực địa phương và món ăn đa dạng'
    },
    {
      icon: ShieldCheck,
      title: 'An Ninh 24/7',
      description: 'Hệ thống an ninh và camera giám sát'
    },
    {
      icon: Trees,
      title: 'Vườn Thượng Uyển',
      description: 'Không gian xanh mát, thư giãn'
    },
    {
      icon: Waves,
      title: 'Hồ Bơi',
      description: 'Hồ bơi ngoài trời với view đẹp'
    },
    {
      icon: Flame,
      title: 'BBQ Party',
      description: 'Dịch vụ nướng BBQ tổ chức tiệc'
    },
    {
      icon: Dog,
      title: 'Thú Cưng',
      description: 'Chấp nhận thú cưng (có phí)'
    }
  ];

  return (
    <section id="amenities" className="py-24 bg-emerald-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 font-semibold text-lg uppercase tracking-wider">Tiện Ích Đẳng Cấp</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Dịch Vụ Của Chúng Tôi
          </h2>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
            Tận hưởng trọn vẹn kỳ nghỉ với đầy đủ tiện nghi hiện đại và dịch vụ tận tâm
          </p>
        </motion.div>

        {/* Amenities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <motion.div
                key={amenity.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-emerald-950" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{amenity.title}</h3>
                <p className="text-emerald-300 text-sm leading-relaxed">{amenity.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
