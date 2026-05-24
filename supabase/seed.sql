-- ============================================================
-- ThaiNguyen Stay — Seed Data
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- SITE SETTINGS
-- ============================================================
INSERT INTO site_settings (key, value) VALUES
  ('site_name', '"ThaiNguyen Stay"'),
  ('site_tagline', '"Homestay Đẳng Cấp Thái Nguyên"'),
  ('logo_url', '""'),
  ('seo_title', '"ThaiNguyen Stay - Homestay Đẳng Cấp Thái Nguyên"'),
  ('seo_description', '"ThaiNguyen Stay - Homestay đẳng cấp tại Thái Nguyên, Việt Nam. Đặt phòng nhanh chóng qua điện thoại, Zalo, QR Code."'),
  ('footer_description', '"Trải nghiệm homestay đẳng cấp tại Thái Nguyên. Nơi nghỉ dưỡng yên bình giữa thiên nhiên, mang lại những kỷ niệm đáng nhớ."'),
  ('footer_services', '["Đặt phòng trực tuyến", "Dịch vụ ăn uống", "Tổ chức sự kiện", "Tham quan du lịch", "Cho thuê xe máy"]'),
  ('social_links', '{"facebook": "#", "instagram": "#", "youtube": "#", "tiktok": "#"}'),
  ('nav_links', '[{"name": "Trang chủ", "href": "#home"}, {"name": "Phòng ốc", "href": "#rooms"}, {"name": "Tiện ích", "href": "#amenities"}, {"name": "Vị trí", "href": "#location"}, {"name": "Liên hệ", "href": "#contact"}]')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- HERO CONTENT
-- ============================================================
INSERT INTO hero_content (
  location_badge, title_line1, title_line2, description,
  background_image, features, stats,
  cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link
) VALUES (
  'Thái Nguyên, Việt Nam',
  'Trải nghiệm Homestay',
  'Đẳng Cấp',
  'Nơi nghỉ dưỡng yên bình giữa thiên nhiên Thái Nguyên. Không gian ấm cúng, tiện nghi hiện đại và dịch vụ tận tâm mang lại trải nghiệm đáng nhớ.',
  '/images/hero-bg.jpg',
  '[{"icon": "Star", "label": "4.9/5", "sublabel": "500+ đánh giá"}, {"icon": "Shield", "label": "An toàn", "sublabel": "24/7 bảo vệ"}, {"icon": "Clock", "label": "Nhanh chóng", "sublabel": "Đặt phòng 1 phút"}]',
  '[{"value": "15+", "label": "Phòng ốc"}, {"value": "2000+", "label": "Khách hàng"}, {"value": "5", "label": "Năm kinh nghiệm"}, {"value": "99%", "label": "Hài lòng"}]',
  'Xem phòng', '#rooms',
  'Liên hệ ngay', '#contact'
);

-- ============================================================
-- ROOMS (6 rooms from original)
-- ============================================================
INSERT INTO rooms (name, price, capacity, size, image_url, amenities, sort_order) VALUES
  ('Phòng Deluxe View Núi', '800.000đ', '2-3 người', '35m²', '/images/room-deluxe.jpg', '["wifi", "tv", "ac", "coffee"]', 1),
  ('Phòng Family Gia Đình', '1.200.000đ', '4-5 người', '55m²', '/images/room-family.jpg', '["wifi", "tv", "ac", "utensils", "car"]', 2),
  ('Bungalow Riêng Tư', '1.500.000đ', '2 người', '45m²', '/images/room-bungalow.jpg', '["wifi", "tv", "ac", "coffee", "wind"]', 3),
  ('Nhà Cổ Truyền', '2.000.000đ', '6-8 người', '80m²', '/images/room-traditional.jpg', '["wifi", "tv", "ac", "utensils", "car", "wind"]', 4),
  ('Studio Hiện Đại', '600.000đ', '2 người', '28m²', '/images/room-studio.jpg', '["wifi", "tv", "ac"]', 5),
  ('VIP Suite', '2.500.000đ', '4 người', '70m²', '/images/room-vip.jpg', '["wifi", "tv", "ac", "coffee", "utensils", "car", "wind"]', 6);

-- ============================================================
-- AMENITIES (12 from original)
-- ============================================================
INSERT INTO amenities (icon, title, description, sort_order) VALUES
  ('Wifi', 'WiFi Cao Tốc', 'Kết nối internet tốc độ cao miễn phí toàn khu vực', 1),
  ('Car', 'Bãi Đậu Xe', 'Chỗ đậu xe an toàn, miễn phí cho khách hàng', 2),
  ('Coffee', 'Quán Café', 'Không gian café thư giãn với đồ uống ngon', 3),
  ('Snowflake', 'Điều Hòa', 'Hệ thống điều hòa hiện đại mọi phòng', 4),
  ('Tv', 'Smart TV', 'Tivi thông minh với nhiều kênh giải trí', 5),
  ('Dumbbell', 'Phòng Gym', 'Trang thiết bị hiện đại để rèn luyện sức khỏe', 6),
  ('Utensils', 'Nhà Hàng', 'Ẩm thực địa phương và món ăn đa dạng', 7),
  ('Shield', 'An Ninh 24/7', 'Hệ thống an ninh và camera giám sát', 8),
  ('TreePine', 'Vườn Thượng Uyển', 'Không gian xanh mát, thư giãn', 9),
  ('Waves', 'Hồ Bơi', 'Hồ bơi ngoài trời với view đẹp', 10),
  ('Flame', 'BBQ Party', 'Dịch vụ nướng BBQ tổ chức tiệc', 11),
  ('PawPrint', 'Thú Cưng', 'Chấp nhận thú cưng (có phí)', 12);

-- ============================================================
-- LOCATION INFO
-- ============================================================
INSERT INTO location_info (
  address, google_maps_link, phone,
  section_subtitle, section_title, section_description
) VALUES (
  'Đường Nguyễn Du, Phường Túc Duyên, Thành phố Thái Nguyên, Tỉnh Thái Nguyên',
  'https://maps.google.com',
  '0912.345.678',
  'Vị Trí Đắc Địa',
  'Khám Phá Thái Nguyên',
  'Homestay của chúng tôi nằm ở vị trí thuận tiện, dễ dàng di chuyển đến các điểm du lịch nổi tiếng'
);

-- ============================================================
-- ATTRACTIONS
-- ============================================================
INSERT INTO attractions (name, distance, travel_time, sort_order) VALUES
  ('Hồ Núi Cốc', '15km', '25 phút', 1),
  ('Đền Đuổm', '8km', '15 phút', 2),
  ('Làng chè Tân Cương', '20km', '35 phút', 3),
  ('Thác Ba Dội', '30km', '50 phút', 4);

-- ============================================================
-- CONTACT INFO
-- ============================================================
INSERT INTO contact_info (key, value) VALUES
  ('phone', '{"number": "0912.345.678", "link": "tel:+84912345678"}'),
  ('zalo', '{"number": "0912.345.678", "link": "https://zalo.me/0912345678"}'),
  ('email', '{"address": "booking@thainguyenstay.com"}'),
  ('address', '{"full": "Đường Nguyễn Du, Phường Túc Duyên, Thành phố Thái Nguyên, Tỉnh Thái Nguyên"}'),
  ('bank_info', '{"bank": "MB Bank", "account": "0123 456 789", "qr_image": "/images/qr-code.png"}'),
  ('working_hours', '[{"day": "Thứ 2 - Thứ 6", "hours": "08:00 - 22:00"}, {"day": "Thứ 7", "hours": "07:00 - 23:00"}, {"day": "Chủ Nhật", "hours": "07:00 - 23:00"}, {"day": "Lễ Tết", "hours": "24/24"}]'),
  ('booking_methods', '[{"title": "Gọi Điện Thoại", "detail": "0912.345.678", "link": "tel:+84912345678", "color": "green"}, {"title": "Zalo", "detail": "0912.345.678", "link": "https://zalo.me/0912345678", "color": "blue"}, {"title": "Quét QR Code", "detail": "MB Bank", "link": "#", "color": "purple"}]'),
  ('cancellation_policy', '[{"rule": "Đặt cọc 30% giá trị phòng", "type": "info"}, {"rule": "Hủy trước 48 giờ: hoàn 100%", "type": "success"}, {"rule": "Hủy trước 24 giờ: hoàn 50%", "type": "warning"}, {"rule": "Hủy dưới 24 giờ: không hoàn", "type": "danger"}]'),
  ('section_subtitle', '"Liên Hệ & Đặt Phòng"'),
  ('section_title', '"Đặt Phòng Nhanh Chóng"'),
  ('section_description', '"Nhiều phương thức đặt phòng tiện lợi, hỗ trợ 24/7"')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- CHATBOT CONFIG (default - inactive)
-- ============================================================
INSERT INTO chatbot_config (
  is_active, api_provider, model, system_prompt, welcome_message, quick_replies
) VALUES (
  false,
  'openai',
  'gpt-4o-mini',
  'Bạn là trợ lý ảo của ThaiNguyen Stay, một homestay cao cấp tại Thái Nguyên, Việt Nam. Hãy trả lời thân thiện, chuyên nghiệp bằng tiếng Việt. Sử dụng thông tin được cung cấp để trả lời chính xác về phòng ốc, giá cả, tiện ích, vị trí và chính sách đặt phòng.',
  'Xin chào! 👋 Tôi là trợ lý ảo của ThaiNguyen Stay. Tôi có thể giúp bạn tìm phòng, xem giá, hoặc giải đáp thắc mắc. Bạn cần hỗ trợ gì?',
  '["Xem phòng & giá", "Vị trí & đường đi", "Đặt phòng", "Liên hệ tư vấn"]'
);

-- ============================================================
-- SAMPLE KNOWLEDGE BASE
-- ============================================================
INSERT INTO knowledge_base (category, question, answer, keywords, sort_order) VALUES
  ('đặt_phòng', 'Làm sao để đặt phòng?', 'Quý khách có thể đặt phòng qua 3 cách: Gọi điện thoại 0912.345.678, nhắn tin Zalo 0912.345.678, hoặc quét mã QR để chuyển khoản đặt cọc. Chúng tôi hỗ trợ 24/7!', '{đặt phòng, booking, đặt, phòng}', 1),
  ('giá_cả', 'Giá phòng bao nhiêu?', 'Giá phòng từ 600.000đ đến 2.500.000đ/đêm tùy loại phòng. Phòng Studio: 600.000đ, Deluxe: 800.000đ, Family: 1.200.000đ, Bungalow: 1.500.000đ, Nhà Cổ Truyền: 2.000.000đ, VIP Suite: 2.500.000đ.', '{giá, bao nhiêu, tiền, cost, price}', 2),
  ('chính_sách', 'Chính sách hủy phòng?', 'Đặt cọc 30% giá trị phòng. Hủy trước 48 giờ: hoàn 100%. Hủy trước 24 giờ: hoàn 50%. Hủy dưới 24 giờ: không hoàn tiền cọc.', '{hủy, cancel, hoàn tiền, refund, chính sách}', 3),
  ('vị_trí', 'Homestay ở đâu?', 'ThaiNguyen Stay tọa lạc tại Đường Nguyễn Du, Phường Túc Duyên, Thành phố Thái Nguyên. Gần các điểm du lịch: Hồ Núi Cốc (15km), Đền Đuổm (8km), Làng chè Tân Cương (20km).', '{ở đâu, địa chỉ, vị trí, location, address, đường}', 4),
  ('tiện_ích', 'Homestay có những tiện ích gì?', 'Chúng tôi có WiFi cao tốc, bãi đậu xe, quán café, điều hòa, Smart TV, phòng gym, nhà hàng, hồ bơi, khu BBQ, vườn thượng uyển, và chấp nhận thú cưng. An ninh 24/7 với camera giám sát.', '{tiện ích, amenity, wifi, gym, pool, hồ bơi}', 5),
  ('dịch_vụ', 'Check-in và check-out lúc mấy giờ?', 'Check-in từ 14:00 và check-out trước 12:00. Quý khách có thể liên hệ trước để sắp xếp early check-in hoặc late check-out.', '{check-in, check-out, giờ, thời gian}', 6);
