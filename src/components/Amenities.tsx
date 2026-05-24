import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';

function Amenities() {
  const { data } = useSiteData();
  const amenities = data?.amenities || [];

  return (
    <section id="amenities" className="py-20 lg:py-24 bg-gradient-to-b from-emerald-950 to-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-500 uppercase tracking-wider text-sm font-semibold">Tiện Ích Vượt Trội</span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mt-3">Dịch Vụ & Tiện Ích</h2>
          <p className="mt-4 text-lg text-emerald-200 max-w-2xl mx-auto">
            Chúng tôi mang đến trải nghiệm hoàn hảo với hệ thống tiện ích hiện đại
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => {
            const Icon = (LucideIcons as unknown as Record<string, React.FC<{ className?: string }>>)[amenity.icon] || LucideIcons.Star;
            return (
              <motion.div
                key={amenity.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-400/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white text-lg font-semibold">{amenity.title}</h3>
                <p className="text-emerald-300 text-sm mt-2">{amenity.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Amenities;
