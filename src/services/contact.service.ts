import { supabase } from '../lib/supabase';
import type { ContactData } from '../types';

export const contactService = {
  async getAll(): Promise<ContactData> {
    const { data, error } = await supabase
      .from('contact_info')
      .select('key, value');

    if (error) throw new Error(error.message);

    const info: Record<string, unknown> = {};
    for (const row of data ?? []) {
      info[row.key] = row.value;
    }

    return {
      phone: (info.phone as ContactData['phone']) || { number: '', link: '' },
      zalo: (info.zalo as ContactData['zalo']) || { number: '', link: '' },
      email: (info.email as ContactData['email']) || { address: '' },
      address: (info.address as ContactData['address']) || { full: '' },
      bank_info: (info.bank_info as ContactData['bank_info']) || { bank: '', account: '', qr_image: '' },
      working_hours: (info.working_hours as ContactData['working_hours']) || [],
      booking_methods: (info.booking_methods as ContactData['booking_methods']) || [],
      cancellation_policy: (info.cancellation_policy as ContactData['cancellation_policy']) || [],
      section_subtitle: (info.section_subtitle as string) || 'Liên Hệ & Đặt Phòng',
      section_title: (info.section_title as string) || 'Đặt Phòng Nhanh Chóng',
      section_description: (info.section_description as string) || '',
    };
  },

  async update(key: string, value: unknown): Promise<void> {
    const { error } = await supabase
      .from('contact_info')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) throw new Error(error.message);
  },

  async updateMultiple(updates: Record<string, unknown>): Promise<void> {
    const rows = Object.entries(updates).map(([key, value]) => ({ key, value }));
    const { error } = await supabase
      .from('contact_info')
      .upsert(rows, { onConflict: 'key' });

    if (error) throw new Error(error.message);
  },
};
