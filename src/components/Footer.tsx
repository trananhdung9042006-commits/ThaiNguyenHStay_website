import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';

function Footer() {
  const { data } = useSiteData();
  const settings = data?.settings;
  const contact = data?.contact;

  const footerDescription = settings?.footer_description || '';
  const socialLinks = settings?.social_links || { facebook: '#', instagram: '#', youtube: '#', tiktok: '#' };
  const address = contact?.address?.full || '';
  const phone = contact?.phone?.number || '';
  const email = contact?.email?.address || '';

  return (
    <footer className="bg-emerald-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">{(settings?.site_name || 'Vista Homestay').charAt(0)}</span>
              </div>
              <div>
                {(() => {
                  const name = settings?.site_name || 'Vista Homestay';
                  const parts = name.split(' ');
                  return <>
                    <span className="text-white font-bold text-lg">{parts[0]}</span>
                    {parts.length > 1 && <span className="text-amber-400 font-bold text-lg ml-1">{parts.slice(1).join(' ')}</span>}
                  </>;
                })()}
              </div>
            </div>
            <p className="text-emerald-300 text-sm leading-relaxed">{footerDescription}</p>
            <div className="flex gap-3 mt-4">
              <a href={socialLinks.facebook} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href={socialLinks.instagram} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href={socialLinks.youtube} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors" target="_blank" rel="noopener noreferrer">
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-bold mb-4">Liên Kết</h3>
            <ul className="space-y-2">
              {(settings?.nav_links || []).map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-emerald-300 text-sm hover:text-amber-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-bold mb-4">Liên Hệ</h3>
            <div className="space-y-3">
              {address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-emerald-300 text-sm">{address}</p>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <a href={contact?.phone?.link || '#'} className="text-emerald-300 text-sm hover:text-amber-400 transition-colors">
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <a href={`mailto:${email}`} className="text-emerald-300 text-sm hover:text-amber-400 transition-colors">
                    {email}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-emerald-400 text-sm">
            © {new Date().getFullYear()} {settings?.site_name || 'Vista Homestay'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
