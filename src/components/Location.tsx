import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, ExternalLink } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';

function Location() {
  const { data } = useSiteData();
  const location = data?.location;
  const attractions = data?.attractions || [];

  const subtitle = location?.section_subtitle || 'Vị Trí Đắc Địa';
  const title = location?.section_title || 'Khám Phá Thái Nguyên';
  const description = location?.section_description || '';
  const address = location?.address || '';
  const googleMapsLink = location?.google_maps_link || '#';

  return (
    <section id="location" className="py-20 lg:py-24 bg-gradient-to-b from-stone-200 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-500 uppercase tracking-wider text-sm font-semibold">{subtitle}</span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-950 mt-3">{title}</h2>
          {description && (
            <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">{description}</p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map / Address */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-lg p-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-950">Địa chỉ</h3>
                <p className="text-stone-600 mt-1">{address}</p>
              </div>
            </div>

            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Chỉ đường trên Google Maps
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Embedded Map */}
            {location?.map_embed_url && (
              <div className="mt-6 rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={location.map_embed_url}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps - Vista Homestay"
                />
              </div>
            )}
          </motion.div>

          {/* Attractions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-emerald-950 mb-6">Điểm tham quan lân cận</h3>
            <div className="space-y-4">
              {attractions.map((attraction, i) => (
                <motion.div
                  key={attraction.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-emerald-950">{attraction.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5" />
                        {attraction.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {attraction.travel_time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Location;
