import { supabase } from '../lib/supabase';
import type { LocationInfo, Attraction } from '../types';

export const locationService = {
  async get(): Promise<LocationInfo | null> {
    const { data, error } = await supabase
      .from('location_info')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  },

  async update(id: string, updates: Partial<LocationInfo>): Promise<LocationInfo> {
    const { data, error } = await supabase
      .from('location_info')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAttractions(): Promise<Attraction[]> {
    const { data, error } = await supabase
      .from('attractions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getAllAttractions(): Promise<Attraction[]> {
    const { data, error } = await supabase
      .from('attractions')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async createAttraction(attraction: Omit<Attraction, 'id' | 'created_at'>): Promise<Attraction> {
    const { data, error } = await supabase
      .from('attractions')
      .insert(attraction)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateAttraction(id: string, updates: Partial<Attraction>): Promise<Attraction> {
    const { data, error } = await supabase
      .from('attractions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteAttraction(id: string): Promise<void> {
    const { error } = await supabase.from('attractions').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
