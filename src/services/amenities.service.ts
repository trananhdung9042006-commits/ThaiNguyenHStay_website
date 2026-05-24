import { supabase } from '../lib/supabase';
import type { Amenity } from '../types';

export const amenitiesService = {
  async getAll(): Promise<Amenity[]> {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getAllAdmin(): Promise<Amenity[]> {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async create(amenity: Omit<Amenity, 'id' | 'created_at' | 'updated_at'>): Promise<Amenity> {
    const { data, error } = await supabase
      .from('amenities')
      .insert(amenity)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id: string, updates: Partial<Amenity>): Promise<Amenity> {
    const { data, error } = await supabase
      .from('amenities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('amenities').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
