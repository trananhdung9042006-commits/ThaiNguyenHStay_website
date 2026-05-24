import { useState, useEffect } from 'react';
import { contactService } from '../../services/contact.service';
import { useToast } from '../../contexts/ToastContext';
import type { ContactData } from '../../types';
import { Save } from 'lucide-react';

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
        section_subtitle: contact.section_subtitle, section_title: contact.section_title,
        section_description: contact.section_description,
      });
      addToast('success', 'Đã lưu thông tin liên hệ!');
    } catch { addToast('error', 'Lỗi khi lưu'); } finally { setSaving(false); }
  };

  if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-2xl" />;
  if (!contact) return <p className="text-gray-500">Chưa có dữ liệu</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Thông tin Liên hệ</h1>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-70">
          <Save className="w-4 h-4" /> {saving ? 'Lưu...' : 'Lưu'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Thông tin cơ bản</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input value={contact.phone.number} onChange={e => setContact({...contact, phone: {...contact.phone, number: e.target.value}})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Link điện thoại</label>
            <input value={contact.phone.link} onChange={e => setContact({...contact, phone: {...contact.phone, link: e.target.value}})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Zalo</label>
            <input value={contact.zalo.number} onChange={e => setContact({...contact, zalo: {...contact.zalo, number: e.target.value}})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Link Zalo</label>
            <input value={contact.zalo.link} onChange={e => setContact({...contact, zalo: {...contact.zalo, link: e.target.value}})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input value={contact.email.address} onChange={e => setContact({...contact, email: {address: e.target.value}})}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ đầy đủ</label>
          <input value={contact.address.full} onChange={e => setContact({...contact, address: {full: e.target.value}})}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Ngân hàng</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên ngân hàng</label>
            <input value={contact.bank_info.bank} onChange={e => setContact({...contact, bank_info: {...contact.bank_info, bank: e.target.value}})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
            <input value={contact.bank_info.account} onChange={e => setContact({...contact, bank_info: {...contact.bank_info, account: e.target.value}})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">QR Code URL</label>
          <input value={contact.bank_info.qr_image} onChange={e => setContact({...contact, bank_info: {...contact.bank_info, qr_image: e.target.value}})}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
      </div>
    </div>
  );
}

export default ContactPage;
