import { motion } from 'framer-motion';
import { Users, Wifi, Car, Coffee, Snowflake, Tv, Wind, Utensils } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  price: string;
  capacity: string;
  size: string;
  image: string;
  amenities: string[];
}

const Rooms = () => {
  const rooms: Room[] = [
    {
      id: 1,
      name: 'Phòng Deluxe View Núi',
      price: '800.000đ',
      capacity: '2-3 người',
      size: '35m²',
      image: '/images/room-deluxe.jpg',
      amenities: ['wifi', 'tv', 'ac', 'coffee']
    },
    {
      id: 2,
      name: 'Phòng Family Gia Đình',
      price: '1.200.000đ',
      capacity: '4-5 người',
      size: '55m²',
      image: '/images/room-family.jpg',
      amenities: ['wifi', 'tv', 'ac', 'coffee', 'utensils']
    },
    {
      id: 3,
      name: 'Bungalow Riêng Tư',
      price: '1.500.000đ',
      capacity: '2 người',
      size: '45m²',
      image: '/images/room-bungalow.jpg',
      amenities: ['wifi', 'tv', 'ac', 'coffee', 'car']
    },
    {
      id: 4,
      name: 'Nhà Cổ Truyền',
      price: '2.000.000đ',
      capacity: '6-8 người',
      size: '80m²',
      image: '/images/room-traditional.jpg',
      amenities: ['wifi', 'tv', 'ac', 'coffee', 'utensils', 'car']
    },
    {
      id: 5,
      name: 'Studio Hiện Đại',
      price: '600.000đ',
      capacity: '2 người',
      size: '28m²',
      image: '/images/room-studio.jpg',
      amenities: ['wifi', 'tv', 'ac', 'coffee']
    },
    {
      id: 6,
      name: 'VIP Suite',
      price: '2.500.000đ',
      capacity: '4 người',
      size: '70m²',
      image: '/images/room-vip.jpg',
      amenities: ['wifi', 'tv', 'ac', 'coffee', 'utensils', 'car', 'wind']
    }
  ];

  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    tv: Tv,
    ac: Snowflake,
    coffee: Coffee,
    utensils: Utensils,
    car: Car,
    wind: Wind
  };

  const amenityLabels: Record<string, string> = {
    wifi: 'WiFi miễn phí',
    tv: 'Smart TV',
    ac: 'Điều hòa',
    coffee: 'Bếp mini',
    utensils: 'Ăn uống',
    car: 'Chỗ đậu xe',
    wind: 'Ban công'
  };

  return (
    <section id="rooms" className="py-24 bg-gradient-to-b from-stone-100 to-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-600 font-semibold text-lg uppercase tracking-wider">Lựa Chọn Hoàn Hảo</span>
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mt-3 mb-4">
            Các Loại Phòng
          </h2>
          <p className="text-emerald-700 text-lg max-w-2xl mx-auto">
            Đa dạng loại phòng với thiết kế đẹp mắt, tiện nghi đầy đủ, phù hợp mọi nhu cầu của bạn
          </p>
        </motion.div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-amber-500 text-emerald-950 px-4 py-2 rounded-full font-bold">
                  {room.price}/đêm
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-emerald-900 mb-2">{room.name}</h3>
                
                {/* Capacity & Size */}
                <div className="flex items-center gap-4 text-emerald-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{room.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">• {room.size}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity];
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium"
                      >
                        <Icon className="w-3 h-3" />
                        <span>{amenityLabels[amenity]}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <a
                  href="#contact"
                  className="block w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-xl font-semibold text-center hover:from-emerald-500 hover:to-emerald-600 transition-all"
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
};

export default Rooms;
