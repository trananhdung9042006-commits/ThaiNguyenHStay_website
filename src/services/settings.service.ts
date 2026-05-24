import { supabase } from '../lib/supabase';
import type { SiteSettings } from '../types';

export const settingsService = {
  async getAll(): Promise<SiteSettings> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) throw new Error(error.message);

    const settings: Record<string, unknown> = {};
    for (const row of data ?? []) {
      settings[row.key] = row.value;
    }

    return {
      site_name: (settings.site_name as string) || 'ThaiNguyen Stay',
      site_tagline: (settings.site_tagline as string) || '',
      logo_url: (settings.logo_url as string) || '',
      seo_title: (settings.seo_title as string) || '',
      seo_description: (settings.seo_description as string) || '',
      footer_description: (settings.footer_description as string) || '',
      footer_services: (settings.footer_services as string[]) || [],
      social_links: (settings.social_links as SiteSettings['social_links']) || { facebook: '#', instagram: '#', youtube: '#', tiktok: '#' },
      nav_links: (settings.nav_links as SiteSettings['nav_links']) || [],
    };
  },

  async update(key: string, value: unknown): Promise<void> {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) throw new Error(error.message);
  },

  async updateMultiple(updates: Record<string, unknown>): Promise<void> {
    const rows = Object.entries(updates).map(([key, value]) => ({ key, value }));
    const { error } = await supabase
      .from('site_settings')
      .upsert(rows, { onConflict: 'key' });

    if (error) throw new Error(error.message);
  },
};
