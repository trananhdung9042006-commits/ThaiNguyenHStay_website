import { supabase } from '../lib/supabase';

const BUCKET = 'images';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadService = {
  async upload(file: File, folder: string): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Chỉ chấp nhận file hình ảnh');
    }
    if (file.size > MAX_SIZE) {
      throw new Error('File quá lớn (tối đa 5MB)');
    }

    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  },

  async delete(url: string): Promise<void> {
    const path = url.split(`/storage/v1/object/public/${BUCKET}/`)[1];
    if (!path) return;

    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw new Error(error.message);
  },
};
