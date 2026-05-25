import { useState, useEffect } from 'react';
import { contactService } from '../../services/contact.service';
import { useToast } from '../../contexts/ToastContext';
import type { ContactData, WorkingHour, BookingMethod, CancellationRule } from '../../types';
import { Save, Plus, Trash2 } from 'lucide-react';

function ContactPage() {
  const { addToast } = useToast();
  const [contact, setContact] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    contactService.getAll().then(data => { setContact(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!contact) return;
    setSaving(true);
    try {
      await contactService.updateMultiple({
        phone: contact.phone, zalo: contact.zalo, email: contact.email,
        address: contact.address, bank_info: contact.bank_info,
        working_hours: contact.working_hours,
        booking_methods: contact.booking_methods,
        cancellation_policy: contact.cancellation_policy,
        section_subtitle: contact.section_subtitle,
        section_title: contact.section_title,
        section_description: contact.section_description,
      });
      addToast('success', 'Đã lưu thông tin liên hệ!');
    } catch { addToast('error', 'Lỗi khi lưu'); } finally { setSaving(false); }
  };

  // Working hours helpers
  const addWorkingHour = () => {
    if (!contact) return;
    setContact({ ...contact, working_hours: [...(contact.working_hours || []), { day: '', hours: '' }] });
  };
  const updateWorkingHour = (i: number, field: keyof WorkingHour, value: string) => {
    if (!contact) return;
    const wh = [...(contact.working_hours || [])];
    wh[i] = { ...wh[i], [field]: value };
    setContact({ ...contact, working_hours: wh });
  };
  const removeWorkingHour = (i: number) => {
    if (!contact) return;
    setContact({ ...contact, working_hours: (contact.working_hours || []).filter((_, idx) => idx !== i) });
  };

  // Booking methods helpers
  const addBookingMethod = () => {
    if (!contact) return;
    setContact({ ...contact, booking_methods: [...(contact.booking_methods || []), { title: '', detail: '', link: '', color: 'emerald' }] });
  };
  const updateBookingMethod = (i: number, field: keyof BookingMethod, value: string) => {
    if (!contact) return;
    const bm = [...(contact.booking_methods || [])];
    bm[i] = { ...bm[i], [field]: value };
    setContact({ ...contact, booking_methods: bm });
  };
  const removeBookingMethod = (i: number) => {
    if (!contact) return;
    setContact({ ...contact, booking_methods: (contact.booking_methods || []).filter((_, idx) => idx !== i) });
  };

  // Cancellation policy helpers
  const addCancelRule = () => {
    if (!contact) return;
    setContact({ ...contact, cancellation_policy: [...(contact.cancellation_policy || []), { rule: '', type: 'info' }] });
  };
  const updateCancelRule = (i: number, field: keyof CancellationRule, value: string) => {
    if (!contact) return;
    const cp = [...(contact.cancellation_policy || [])];
    cp[i] = { ...cp[i], [field]: value };
    setContact({ ...contact, cancellation_policy: cp });
  };
  const removeCancelRule = (i: number) => {
    if (!contact) return;
    setContact({ ...contact, cancellation_policy: (contact.cancellation_policy || []).filter((_, idx) => idx !== i) });
  };

  const inputClass = "w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors";

  if (loading) return <div className="h-48 bg-[#111827] rounded-2xl animate-pulse" />;
  if (!contact) return <p className="text-gray-500">Chưa có dữ liệu</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Thông tin Liên hệ</h1>
          <p className="text-gray-400 text-sm mt-1">Quản lý thông tin liên hệ, giờ hoạt động, chính sách</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/20">
          <Save className="w-4 h-4" /> {saving ? 'Lưu...' : 'Lưu'}
        </button>
      </div>

      {/* Section header */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Tiêu đề section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
            <input value={contact.section_subtitle || ''} onChange={e => setContact({ ...contact, section_subtitle: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input value={contact.section_title || ''} onChange={e => setContact({ ...contact, section_title: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả</label>
          <textarea value={contact.section_description || ''} onChange={e => setContact({ ...contact, section_description: e.target.value })} rows={2} className={inputClass} />
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Số điện thoại</label>
            <input value={contact.phone.number} onChange={e => setContact({ ...contact, phone: { ...contact.phone, number: e.target.value } })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Link điện thoại</label>
            <input value={contact.phone.link} onChange={e => setContact({ ...contact, phone: { ...contact.phone, link: e.target.value } })} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Zalo</label>
            <input value={contact.zalo.number} onChange={e => setContact({ ...contact, zalo: { ...contact.zalo, number: e.target.value } })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Link Zalo</label>
            <input value={contact.zalo.link} onChange={e => setContact({ ...contact, zalo: { ...contact.zalo, link: e.target.value } })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input value={contact.email.address} onChange={e => setContact({ ...contact, email: { address: e.target.value } })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Địa chỉ đầy đủ</label>
          <input value={contact.address.full} onChange={e => setContact({ ...contact, address: { full: e.target.value } })} className={inputClass} />
        </div>
      </div>

      {/* Bank info */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Ngân hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tên ngân hàng</label>
            <input value={contact.bank_info.bank} onChange={e => setContact({ ...contact, bank_info: { ...contact.bank_info, bank: e.target.value } })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Số tài khoản</label>
            <input value={contact.bank_info.account} onChange={e => setContact({ ...contact, bank_info: { ...contact.bank_info, account: e.target.value } })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">QR Code URL</label>
          <input value={contact.bank_info.qr_image} onChange={e => setContact({ ...contact, bank_info: { ...contact.bank_info, qr_image: e.target.value } })} className={inputClass} />
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-white">Giờ hoạt động</h2>
          <button onClick={addWorkingHour} className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300">
            <Plus className="w-4 h-4" /> Thêm
          </button>
        </div>
        {(contact.working_hours || []).map((wh, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
            <input value={wh.day} onChange={e => updateWorkingHour(i, 'day', e.target.value)} placeholder="Thứ 2 - Thứ 6"
              className="flex-1 bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
            <input value={wh.hours} onChange={e => updateWorkingHour(i, 'hours', e.target.value)} placeholder="08:00 - 22:00"
              className="flex-1 bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
            <button onClick={() => removeWorkingHour(i)} className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Booking Methods */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-white">Phương thức đặt phòng</h2>
          <button onClick={addBookingMethod} className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300">
            <Plus className="w-4 h-4" /> Thêm
          </button>
        </div>
        {(contact.booking_methods || []).map((bm, i) => (
          <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Phương thức #{i + 1}</span>
              <button onClick={() => removeBookingMethod(i)} className="text-gray-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={bm.title} onChange={e => updateBookingMethod(i, 'title', e.target.value)} placeholder="Tiêu đề"
                className="bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
              <input value={bm.detail} onChange={e => updateBookingMethod(i, 'detail', e.target.value)} placeholder="Chi tiết"
                className="bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={bm.link} onChange={e => updateBookingMethod(i, 'link', e.target.value)} placeholder="Link"
                className="bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
              <input value={bm.color} onChange={e => updateBookingMethod(i, 'color', e.target.value)} placeholder="Color (emerald, blue...)"
                className="bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Cancellation Policy */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-white">Chính sách hủy phòng</h2>
          <button onClick={addCancelRule} className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300">
            <Plus className="w-4 h-4" /> Thêm
          </button>
        </div>
        {(contact.cancellation_policy || []).map((cp, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
            <input value={cp.rule} onChange={e => updateCancelRule(i, 'rule', e.target.value)} placeholder="Quy tắc"
              className="flex-1 bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
            <select value={cp.type} onChange={e => updateCancelRule(i, 'type', e.target.value)}
              className="bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors">
              <option value="info">Thông tin</option>
              <option value="warning">Cảnh báo</option>
              <option value="danger">Nghiêm trọng</option>
            </select>
            <button onClick={() => removeCancelRule(i)} className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactPage;
