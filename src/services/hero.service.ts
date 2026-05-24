import { supabase } from '../lib/supabase';
import type { HeroContent } from '../types';

export const heroService = {
  async get(): Promise<HeroContent | null> {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  },

  async update(id: string, updates: Partial<HeroContent>): Promise<HeroContent> {
    const { data, error } = await supabase
      .from('hero_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
