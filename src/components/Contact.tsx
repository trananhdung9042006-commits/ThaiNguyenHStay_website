import { motion } from 'framer-motion';
import { Phone, MessageCircle, QrCode, Clock, CreditCard, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';

const policyIcons: Record<string, React.FC<{ className?: string }>> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const policyColors: Record<string, string> = {
  info: 'text-blue-500',
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  danger: 'text-red-500',
};

function Contact() {
  const { data } = useSiteData();
  const contact = data?.contact;

  const subtitle = contact?.section_subtitle || 'Liên Hệ & Đặt Phòng';
  const title = contact?.section_title || 'Đặt Phòng Nhanh Chóng';
  const description = contact?.section_description || '';
  const workingHours = contact?.working_hours || [];
  const cancellationPolicy = contact?.cancellation_policy || [];
  const bankInfo = contact?.bank_info;

  return (
    <section id="contact" className="py-20 lg:py-24 bg-gradient-to-b from-emerald-900 to-emerald-950">
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
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mt-3">{title}</h2>
          {description && (
            <p className="mt-4 text-lg text-emerald-200 max-w-2xl mx-auto">{description}</p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Methods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Phương thức liên hệ</h3>

            {/* Phone */}
            {contact?.phone && (
              <a
                href={contact.phone.link}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-emerald-400/30 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Gọi điện</p>
                  <p className="text-emerald-300 text-sm">{contact.phone.number}</p>
                </div>
              </a>
            )}

            {/* Zalo */}
            {contact?.zalo && (
              <a
                href={contact.zalo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-blue-400/30 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Zalo</p>
                  <p className="text-emerald-300 text-sm">{contact.zalo.number}</p>
                </div>
              </a>
            )}

            {/* Bank */}
            {bankInfo && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{bankInfo.bank}</p>
                    <p className="text-emerald-300 text-sm">{bankInfo.account}</p>
                  </div>
                </div>
                {bankInfo.qr_image && (
                  <div className="mt-4 bg-white rounded-xl p-3 inline-block">
                    <img src={bankInfo.qr_image} alt="QR Code" className="w-32 h-32" />
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Working Hours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Giờ hoạt động</h3>
            </div>
            <div className="space-y-3">
              {workingHours.map((wh, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0">
                  <span className="text-emerald-200">{wh.day}</span>
                  <span className="text-amber-400 font-semibold">{wh.hours}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cancellation Policy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <QrCode className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Chính sách đặt phòng</h3>
            </div>
            <div className="space-y-3">
              {cancellationPolicy.map((rule, i) => {
                const Icon = policyIcons[rule.type] || Info;
                const color = policyColors[rule.type] || 'text-white';
                return (
                  <div key={i} className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color}`} />
                    <p className="text-emerald-200 text-sm">{rule.rule}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
