-- ============================================================
-- ThaiNguyen Stay — Initial Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Admin',
  role TEXT NOT NULL DEFAULT 'admin',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. SITE SETTINGS (key-value store)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. HERO CONTENT
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_badge TEXT DEFAULT 'Thái Nguyên, Việt Nam',
  title_line1 TEXT DEFAULT 'Trải nghiệm Homestay',
  title_line2 TEXT DEFAULT 'Đẳng Cấp',
  description TEXT,
  background_image TEXT DEFAULT '/images/hero-bg.jpg',
  features JSONB DEFAULT '[]'::jsonb,
  stats JSONB DEFAULT '[]'::jsonb,
  cta_primary_text TEXT DEFAULT 'Xem phòng',
  cta_primary_link TEXT DEFAULT '#rooms',
  cta_secondary_text TEXT DEFAULT 'Liên hệ ngay',
  cta_secondary_link TEXT DEFAULT '#contact',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 4. ROOMS
-- ============================================================
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  capacity TEXT,
  size TEXT,
  image_url TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_booked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. AMENITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6. LOCATION INFO
-- ============================================================
CREATE TABLE IF NOT EXISTS location_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  map_embed_url TEXT,
  google_maps_link TEXT DEFAULT 'https://maps.google.com',
  latitude DECIMAL,
  longitude DECIMAL,
  phone TEXT,
  section_subtitle TEXT DEFAULT 'Vị Trí Đắc Địa',
  section_title TEXT DEFAULT 'Khám Phá Thái Nguyên',
  section_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 7. ATTRACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  distance TEXT,
  travel_time TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 8. CONTACT INFO (key-value store)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 9. CHATBOT CONFIG
-- ============================================================
CREATE TABLE IF NOT EXISTS chatbot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active BOOLEAN DEFAULT false,
  api_provider TEXT DEFAULT 'openai',
  api_key_encrypted TEXT,
  api_endpoint TEXT,
  model TEXT DEFAULT 'gpt-4o-mini',
  system_prompt TEXT DEFAULT 'Bạn là trợ lý ảo của ThaiNguyen Stay, một homestay cao cấp tại Thái Nguyên. Hãy trả lời thân thiện, chuyên nghiệp bằng tiếng Việt. Sử dụng thông tin được cung cấp để trả lời chính xác.',
  welcome_message TEXT DEFAULT 'Xin chào! 👋 Tôi là trợ lý ảo của ThaiNguyen Stay. Tôi có thể giúp bạn tìm phòng, xem giá, hoặc giải đáp thắc mắc. Bạn cần hỗ trợ gì?',
  quick_replies JSONB DEFAULT '["Xem phòng & giá", "Vị trí & đường đi", "Đặt phòng", "Liên hệ tư vấn"]'::jsonb,
  max_tokens INTEGER DEFAULT 500,
  temperature DECIMAL DEFAULT 0.7,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 10. KNOWLEDGE BASE
-- ============================================================
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 11. CHAT SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'profiles', 'site_settings', 'hero_content', 'rooms',
      'amenities', 'location_info', 'contact_info',
      'chatbot_config', 'knowledge_base', 'chat_sessions'
    ])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON %s;
      CREATE TRIGGER update_%s_updated_at
        BEFORE UPDATE ON %s
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- PUBLIC READ policies
CREATE POLICY "Public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Public read" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read" ON amenities FOR SELECT USING (true);
CREATE POLICY "Public read" ON location_info FOR SELECT USING (true);
CREATE POLICY "Public read" ON attractions FOR SELECT USING (true);
CREATE POLICY "Public read" ON contact_info FOR SELECT USING (true);

-- ADMIN FULL ACCESS policies
CREATE POLICY "Admin full access" ON profiles FOR ALL USING (is_admin());
CREATE POLICY "Admin manage" ON site_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage" ON hero_content FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage" ON rooms FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage" ON amenities FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage" ON location_info FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage" ON attractions FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage" ON contact_info FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage" ON chatbot_config FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage" ON knowledge_base FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Knowledge base public read (for chatbot)
CREATE POLICY "Public read" ON knowledge_base FOR SELECT USING (is_active = true);

-- Chat sessions: public insert & update (visitors), admin read
CREATE POLICY "Public insert" ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON chat_sessions FOR UPDATE USING (true);
CREATE POLICY "Admin read sessions" ON chat_sessions FOR SELECT USING (is_admin());
CREATE POLICY "Public read own" ON chat_sessions FOR SELECT USING (true);

-- Profiles: users can read own profile
CREATE POLICY "Users read own" ON profiles FOR SELECT USING (auth.uid() = id);

-- ============================================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Admin'),
    'admin'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Admin upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND is_admin());

CREATE POLICY "Admin update images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images' AND is_admin());

CREATE POLICY "Admin delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND is_admin());
