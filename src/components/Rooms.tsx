import { motion } from 'framer-motion';
import { Wifi, Tv, Snowflake, Coffee, Utensils, Car, Wind } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import { AMENITY_ICON_MAP } from '../types';

const iconComponents: Record<string, React.FC<{ className?: string }>> = {
  Wifi, Tv, Snowflake, Coffee, Utensils, Car, Wind,
};

function Rooms() {
  const { data } = useSiteData();
  const rooms = data?.rooms || [];

  return (
    <section id="rooms" className="py-20 lg:py-24 bg-gradient-to-b from-stone-100 to-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-500 uppercase tracking-wider text-sm font-semibold">Lựa Chọn Hoàn Hảo</span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-950 mt-3">Các Loại Phòng</h2>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
            Đa dạng loại phòng với thiết kế đẹp mắt, tiện nghi đầy đủ, phù hợp mọi nhu cầu của bạn
          </p>
        </motion.div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:-translate-y-2 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={room.image_url}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  {room.price}/đêm
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-emerald-950">{room.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                  <span>{room.capacity}</span>
                  <span>•</span>
                  <span>{room.size}</span>
                </div>

                {/* Room Amenities */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {(room.amenities || []).map((code) => {
                    const amenity = AMENITY_ICON_MAP[code];
                    if (!amenity) return null;
                    const Icon = iconComponents[amenity.icon];
                    if (!Icon) return null;
                    return (
                      <div key={code} className="flex items-center gap-1 text-xs text-stone-500 bg-stone-100 rounded-lg px-2 py-1">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  className="block mt-6 text-center bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Đặt phòng ngay
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Rooms;
