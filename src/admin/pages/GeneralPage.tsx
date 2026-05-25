import { useState, useEffect } from 'react';
import { settingsService } from '../../services/settings.service';
import { useToast } from '../../contexts/ToastContext';
import type { SiteSettings } from '../../types';
import { Save, Plus, Trash2, X } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

function GeneralPage() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceInput, setServiceInput] = useState('');

  useEffect(() => {
    settingsService.getAll().then(data => { setSettings(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await settingsService.updateMultiple({
        site_name: settings.site_name,
        site_tagline: settings.site_tagline,
        logo_url: settings.logo_url,
        seo_title: settings.seo_title,
        seo_description: settings.seo_description,
        footer_description: settings.footer_description,
        footer_services: settings.footer_services,
        social_links: settings.social_links,
        nav_links: settings.nav_links,
      });
      addToast('success', 'Đã lưu cài đặt!');
    } catch { addToast('error', 'Lỗi khi lưu'); } finally { setSaving(false); }
  };

  // Footer services helpers
  const addService = () => {
    if (!serviceInput.trim() || !settings) return;
    setSettings({ ...settings, footer_services: [...(settings.footer_services || []), serviceInput.trim()] });
    setServiceInput('');
  };
  const removeService = (i: number) => {
    if (!settings) return;
    setSettings({ ...settings, footer_services: (settings.footer_services || []).filter((_, idx) => idx !== i) });
  };

  // Nav links helpers
  const addNavLink = () => {
    if (!settings) return;
    setSettings({ ...settings, nav_links: [...(settings.nav_links || []), { name: '', href: '' }] });
  };
  const updateNavLink = (i: number, field: 'name' | 'href', value: string) => {
    if (!settings) return;
    const links = [...(settings.nav_links || [])];
    links[i] = { ...links[i], [field]: value };
    setSettings({ ...settings, nav_links: links });
  };
  const removeNavLink = (i: number) => {
    if (!settings) return;
    setSettings({ ...settings, nav_links: (settings.nav_links || []).filter((_, idx) => idx !== i) });
  };

  const inputClass = "w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors";

  if (loading) return <div className="h-48 bg-[#111827] rounded-2xl animate-pulse" />;
  if (!settings) return <p className="text-gray-500">Chưa có dữ liệu</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Cài đặt chung</h1>
          <p className="text-gray-400 text-sm mt-1">Tên site, logo, SEO, footer, mạng xã hội</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/20">
          <Save className="w-4 h-4" /> {saving ? 'Lưu...' : 'Lưu'}
        </button>
      </div>

      {/* Basic info */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tên website</label>
            <input value={settings.site_name} onChange={e => setSettings({ ...settings, site_name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
            <input value={settings.site_tagline} onChange={e => setSettings({ ...settings, site_tagline: e.target.value })} className={inputClass} />
          </div>
        </div>
        <ImageUploader value={settings.logo_url || ''} onChange={(url) => setSettings({ ...settings, logo_url: url })} folder="branding" label="Logo" />
      </div>

      {/* SEO */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">SEO</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">SEO Title</label>
          <input value={settings.seo_title} onChange={e => setSettings({ ...settings, seo_title: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">SEO Description</label>
          <textarea value={settings.seo_description} onChange={e => setSettings({ ...settings, seo_description: e.target.value })} rows={3} className={inputClass} />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Footer</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả footer</label>
          <textarea value={settings.footer_description} onChange={e => setSettings({ ...settings, footer_description: e.target.value })} rows={3} className={inputClass} />
        </div>

        {/* Footer services */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Dịch vụ footer</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(settings.footer_services || []).map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-sm border border-amber-500/20">
                {s}
                <button onClick={() => removeService(i)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={serviceInput} onChange={e => setServiceInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addService(); } }}
              className="flex-1 bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
              placeholder="Tên dịch vụ..." />
            <button onClick={addService} className="px-4 py-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl text-gray-300 hover:bg-white/[0.1] text-sm transition-colors">Thêm</button>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-white">Navigation Links</h2>
          <button onClick={addNavLink} className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300">
            <Plus className="w-4 h-4" /> Thêm
          </button>
        </div>
        {(settings.nav_links || []).map((link, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
            <input value={link.name} onChange={e => updateNavLink(i, 'name', e.target.value)} placeholder="Tên link"
              className="flex-1 bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
            <input value={link.href} onChange={e => updateNavLink(i, 'href', e.target.value)} placeholder="#section hoặc /path"
              className="flex-1 bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
            <button onClick={() => removeNavLink(i)} className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Social links */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Mạng xã hội</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Facebook URL</label>
            <input value={settings.social_links.facebook} onChange={e => setSettings({ ...settings, social_links: { ...settings.social_links, facebook: e.target.value } })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Instagram URL</label>
            <input value={settings.social_links.instagram} onChange={e => setSettings({ ...settings, social_links: { ...settings.social_links, instagram: e.target.value } })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Youtube URL</label>
            <input value={settings.social_links.youtube} onChange={e => setSettings({ ...settings, social_links: { ...settings.social_links, youtube: e.target.value } })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">TikTok URL</label>
            <input value={settings.social_links.tiktok} onChange={e => setSettings({ ...settings, social_links: { ...settings.social_links, tiktok: e.target.value } })} className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralPage;
