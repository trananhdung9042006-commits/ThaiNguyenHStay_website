import { useState, useEffect } from 'react';
import { settingsService } from '../../services/settings.service';
import { useToast } from '../../contexts/ToastContext';
import type { SiteSettings } from '../../types';
import { Save } from 'lucide-react';

function GeneralPage() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.getAll().then(data => { setSettings(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await settingsService.updateMultiple({
        site_name: settings.site_name, site_tagline: settings.site_tagline,
        seo_title: settings.seo_title, seo_description: settings.seo_description,
        footer_description: settings.footer_description, social_links: settings.social_links,
      });
      addToast('success', 'Đã lưu cài đặt!');
    } catch { addToast('error', 'Lỗi khi lưu'); } finally { setSaving(false); }
  };

  if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-2xl" />;
  if (!settings) return <p className="text-gray-500">Chưa có dữ liệu</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt chung</h1>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-70">
          <Save className="w-4 h-4" /> {saving ? 'Lưu...' : 'Lưu'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Thông tin cơ bản</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên website</label>
            <input value={settings.site_name} onChange={e => setSettings({...settings, site_name: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input value={settings.site_tagline} onChange={e => setSettings({...settings, site_tagline: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">SEO</h2>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
          <input value={settings.seo_title} onChange={e => setSettings({...settings, seo_title: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
          <textarea value={settings.seo_description} onChange={e => setSettings({...settings, seo_description: e.target.value})} rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Footer</h2>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Mô tả footer</label>
          <textarea value={settings.footer_description} onChange={e => setSettings({...settings, footer_description: e.target.value})} rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Mạng xã hội</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input value={settings.social_links.facebook} onChange={e => setSettings({...settings, social_links: {...settings.social_links, facebook: e.target.value}})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input value={settings.social_links.instagram} onChange={e => setSettings({...settings, social_links: {...settings.social_links, instagram: e.target.value}})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Youtube URL</label>
            <input value={settings.social_links.youtube} onChange={e => setSettings({...settings, social_links: {...settings.social_links, youtube: e.target.value}})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
            <input value={settings.social_links.tiktok} onChange={e => setSettings({...settings, social_links: {...settings.social_links, tiktok: e.target.value}})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
        </div>
      </div>
    </div>
  );
}

export default GeneralPage;
