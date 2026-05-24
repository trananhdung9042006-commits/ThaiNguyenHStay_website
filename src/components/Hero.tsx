import { motion } from 'framer-motion';
import { MapPin, Star, Shield, Clock } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';

const iconMap: Record<string, React.FC<{ className?: string }>> = { Star, Shield, Clock };

function Hero() {
  const { data } = useSiteData();
  const hero = data?.hero;

  const locationBadge = hero?.location_badge || 'Thái Nguyên, Việt Nam';
  const titleLine1 = hero?.title_line1 || 'Trải nghiệm Homestay';
  const titleLine2 = hero?.title_line2 || 'Đẳng Cấp';
  const description = hero?.description || '';
  const bgImage = hero?.background_image || '/images/hero-bg.jpg';
  const features = hero?.features || [];
  const stats = hero?.stats || [];
  const ctaPrimaryText = hero?.cta_primary_text || 'Xem phòng';
  const ctaPrimaryLink = hero?.cta_primary_link || '#rooms';
  const ctaSecondaryText = hero?.cta_secondary_text || 'Liên hệ ngay';
  const ctaSecondaryLink = hero?.cta_secondary_link || '#contact';

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={bgImage} alt="ThaiNguyen Stay" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-950/40" />
      </div>

      {/* Decorative */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Location Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-emerald-200 text-sm">{locationBadge}</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
            >
              {titleLine1}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                {titleLine2}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-emerald-200 text-lg max-w-lg"
            >
              {description}
            </motion.p>

            {/* Features */}
            {features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 mt-8"
              >
                {features.map((f, i) => {
                  const Icon = iconMap[f.icon] || Star;
                  return (
                    <div key={i} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2">
                      <Icon className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-white text-sm font-semibold">{f.label}</p>
                        <p className="text-emerald-300 text-xs">{f.sublabel}</p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <a
                href={ctaPrimaryLink}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3.5 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-amber-500/25"
              >
                {ctaPrimaryText}
              </a>
              <a
                href={ctaSecondaryLink}
                className="border-2 border-white/30 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                {ctaSecondaryText}
              </a>
            </motion.div>
          </div>

          {/* Stats Card */}
          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="hidden lg:block"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((s, i) => (
                    <div key={i} className="text-center">
                      <p className="text-3xl font-bold text-amber-400">{s.value}</p>
                      <p className="text-emerald-200 text-sm mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-amber-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
