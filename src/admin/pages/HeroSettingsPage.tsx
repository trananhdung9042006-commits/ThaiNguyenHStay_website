import { useState, useEffect } from 'react';
import { heroService } from '../../services/hero.service';
import { useToast } from '../../contexts/ToastContext';
import type { HeroContent, HeroFeature, HeroStat } from '../../types';
import { Save, Plus, X, Trash2 } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

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

  // Features management
  const addFeature = () => {
    if (!hero) return;
    const features = [...(hero.features || []), { icon: 'Star', label: '', sublabel: '' }];
    update('features', features);
  };
  const updateFeature = (index: number, field: keyof HeroFeature, value: string) => {
    if (!hero) return;
    const features = [...(hero.features || [])];
    features[index] = { ...features[index], [field]: value };
    update('features', features);
  };
  const removeFeature = (index: number) => {
    if (!hero) return;
    update('features', (hero.features || []).filter((_, i) => i !== index));
  };

  // Stats management
  const addStat = () => {
    if (!hero) return;
    update('stats', [...(hero.stats || []), { value: '', label: '' }]);
  };
  const updateStat = (index: number, field: keyof HeroStat, value: string) => {
    if (!hero) return;
    const stats = [...(hero.stats || [])];
    stats[index] = { ...stats[index], [field]: value };
    update('stats', stats);
  };
  const removeStat = (index: number) => {
    if (!hero) return;
    update('stats', (hero.stats || []).filter((_, i) => i !== index));
  };

  if (loading) return <div className="h-96 bg-[#111827] rounded-2xl animate-pulse" />;
  if (!hero) return <p className="text-gray-500">Chưa có dữ liệu hero. Hãy chạy seed.sql trước.</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Hero Section</h1>
          <p className="text-gray-400 text-sm mt-1">Banner hiển thị trên trang chủ</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/20">
          <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      {/* Basic fields */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-white">Nội dung chính</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Location Badge</label>
          <input value={hero.location_badge} onChange={e => update('location_badge', e.target.value)}
            className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tiêu đề dòng 1</label>
            <input value={hero.title_line1} onChange={e => update('title_line1', e.target.value)}
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tiêu đề dòng 2 (highlight)</label>
            <input value={hero.title_line2} onChange={e => update('title_line2', e.target.value)}
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả</label>
          <textarea value={hero.description || ''} onChange={e => update('description', e.target.value)} rows={3}
            className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
        </div>
        <ImageUploader value={hero.background_image} onChange={(url) => update('background_image', url)} folder="hero" label="Hình nền" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">CTA chính (text)</label>
            <input value={hero.cta_primary_text} onChange={e => update('cta_primary_text', e.target.value)}
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">CTA chính (link)</label>
            <input value={hero.cta_primary_link} onChange={e => update('cta_primary_link', e.target.value)}
              className="w-full bg-[#0B0F19] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors" />
          </div>
        </div>
      </div>

      {/* Features editor */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-white">Features</h2>
          <button onClick={addFeature} className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            <Plus className="w-4 h-4" /> Thêm
          </button>
        </div>
        {(hero.features || []).map((f, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
            <div className="flex-1 grid grid-cols-3 gap-3">
              <input value={f.icon} onChange={e => updateFeature(i, 'icon', e.target.value)} placeholder="Icon (Lucide)"
                className="bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
              <input value={f.label} onChange={e => updateFeature(i, 'label', e.target.value)} placeholder="Label"
                className="bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
              <input value={f.sublabel} onChange={e => updateFeature(i, 'sublabel', e.target.value)} placeholder="Sublabel"
                className="bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
            </div>
            <button onClick={() => removeFeature(i)} className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {(hero.features || []).length === 0 && <p className="text-gray-500 text-sm text-center py-4">Chưa có feature nào</p>}
      </div>

      {/* Stats editor */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-white">Thống kê hiển thị</h2>
          <button onClick={addStat} className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            <Plus className="w-4 h-4" /> Thêm
          </button>
        </div>
        {(hero.stats || []).map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input value={s.value} onChange={e => updateStat(i, 'value', e.target.value)} placeholder="Giá trị (VD: 500+)"
                className="bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
              <input value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Nhãn (VD: Khách hài lòng)"
                className="bg-[#0B0F19] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
            </div>
            <button onClick={() => removeStat(i)} className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {(hero.stats || []).length === 0 && <p className="text-gray-500 text-sm text-center py-4">Chưa có stat nào</p>}
      </div>
    </div>
  );
}

export default HeroSettingsPage;
