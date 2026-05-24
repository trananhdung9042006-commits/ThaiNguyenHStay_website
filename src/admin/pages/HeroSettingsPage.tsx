import { useState, useEffect } from 'react';
import { heroService } from '../../services/hero.service';
import { useToast } from '../../contexts/ToastContext';
import type { HeroContent } from '../../types';
import { Save } from 'lucide-react';

function HeroSettingsPage() {
  const { addToast } = useToast();
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    heroService.get().then(data => { setHero(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!hero) return;
    setSaving(true);
    try {
      await heroService.update(hero.id, hero);
      addToast('success', 'Đã lưu Hero section!');
    } catch { addToast('error', 'Lỗi khi lưu'); }
    finally { setSaving(false); }
  };

  const update = (field: keyof HeroContent, value: unknown) => {
    setHero(prev => prev ? { ...prev, [field]: value } : prev);
  };

  if (loading) return <div className="animate-pulse h-96 bg-gray-100 rounded-2xl" />;
  if (!hero) return <p className="text-gray-500">Chưa có dữ liệu hero. Hãy chạy seed.sql trước.</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Hero Section</h1>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-70">
          <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location Badge</label>
          <input value={hero.location_badge} onChange={e => update('location_badge', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề dòng 1</label>
            <input value={hero.title_line1} onChange={e => update('title_line1', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề dòng 2 (highlight)</label>
            <input value={hero.title_line2} onChange={e => update('title_line2', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea value={hero.description || ''} onChange={e => update('description', e.target.value)} rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
          <input value={hero.background_image} onChange={e => update('background_image', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA chính (text)</label>
            <input value={hero.cta_primary_text} onChange={e => update('cta_primary_text', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA chính (link)</label>
            <input value={hero.cta_primary_link} onChange={e => update('cta_primary_link', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSettingsPage;
