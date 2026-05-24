// ============================================================
// ThaiNguyen Stay — Shared TypeScript Types
// ============================================================

// --- Site Settings ---
export interface NavLink {
  name: string;
  href: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  logo_url: string;
  seo_title: string;
  seo_description: string;
  footer_description: string;
  footer_services: string[];
  social_links: SocialLinks;
  nav_links: NavLink[];
}

// --- Hero ---
export interface HeroFeature {
  icon: string;
  label: string;
  sublabel: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroContent {
  id: string;
  location_badge: string;
  title_line1: string;
  title_line2: string;
  description: string;
  background_image: string;
  features: HeroFeature[];
  stats: HeroStat[];
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  cta_secondary_link: string;
  updated_at: string;
}

// --- Rooms ---
export interface Room {
  id: string;
  name: string;
  price: string;
  capacity: string;
  size: string;
  image_url: string;
  amenities: string[];
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Amenities ---
export interface Amenity {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Location ---
export interface LocationInfo {
  id: string;
  address: string;
  map_embed_url: string | null;
  google_maps_link: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  section_subtitle: string;
  section_title: string;
  section_description: string;
  updated_at: string;
}

export interface Attraction {
  id: string;
  name: string;
  distance: string;
  travel_time: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// --- Contact ---
export interface ContactPhone {
  number: string;
  link: string;
}

export interface ContactEmail {
  address: string;
}

export interface ContactAddress {
  full: string;
}

export interface BankInfo {
  bank: string;
  account: string;
  qr_image: string;
}

export interface WorkingHour {
  day: string;
  hours: string;
}

export interface BookingMethod {
  title: string;
  detail: string;
  link: string;
  color: string;
}

export interface CancellationRule {
  rule: string;
  type: string;
}

export interface ContactData {
  phone: ContactPhone;
  zalo: ContactPhone;
  email: ContactEmail;
  address: ContactAddress;
  bank_info: BankInfo;
  working_hours: WorkingHour[];
  booking_methods: BookingMethod[];
  cancellation_policy: CancellationRule[];
  section_subtitle: string;
  section_title: string;
  section_description: string;
}

// --- Chatbot ---
export const AI_PROVIDERS = ['openai', 'gemini', 'anthropic', 'groq', 'custom'] as const;
export type AIProvider = typeof AI_PROVIDERS[number];

export const PROVIDER_MODELS: Record<AIProvider, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  gemini: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  anthropic: ['claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022'],
  groq: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'],
  custom: [],
};

export const PROVIDER_ENDPOINTS: Record<string, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
};

export interface ChatbotConfig {
  id: string;
  is_active: boolean;
  api_provider: AIProvider;
  api_key_encrypted: string;
  api_endpoint: string | null;
  model: string;
  system_prompt: string;
  welcome_message: string;
  quick_replies: string[];
  max_tokens: number;
  temperature: number;
  updated_at: string;
}

export interface KnowledgeEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  session_id: string;
  messages: ChatMessage[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// --- Aggregate Site Data ---
export interface SiteData {
  settings: SiteSettings;
  hero: HeroContent | null;
  rooms: Room[];
  amenities: Amenity[];
  location: LocationInfo | null;
  attractions: Attraction[];
  contact: ContactData;
}

// --- Amenity Icon Map ---
export const AMENITY_ICON_MAP: Record<string, { icon: string; label: string }> = {
  wifi: { icon: 'Wifi', label: 'WiFi miễn phí' },
  tv: { icon: 'Tv', label: 'Smart TV' },
  ac: { icon: 'Snowflake', label: 'Điều hòa' },
  coffee: { icon: 'Coffee', label: 'Bếp mini' },
  utensils: { icon: 'Utensils', label: 'Ăn uống' },
  car: { icon: 'Car', label: 'Chỗ đậu xe' },
  wind: { icon: 'Wind', label: 'Ban công' },
};

// --- Knowledge Base Categories ---
export const KB_CATEGORIES = [
  { value: 'đặt_phòng', label: 'Đặt phòng' },
  { value: 'giá_cả', label: 'Giá cả' },
  { value: 'tiện_ích', label: 'Tiện ích' },
  { value: 'vị_trí', label: 'Vị trí' },
  { value: 'chính_sách', label: 'Chính sách' },
  { value: 'dịch_vụ', label: 'Dịch vụ' },
  { value: 'khác', label: 'Khác' },
] as const;
