import { supabase } from '../lib/supabase';
import type { ChatbotConfig, KnowledgeEntry, ChatMessage } from '../types';
import { PROVIDER_ENDPOINTS } from '../types';

export const chatbotService = {
  // --- Config ---
  async getConfig(): Promise<ChatbotConfig | null> {
    const { data, error } = await supabase
      .from('chatbot_config')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  },

  async updateConfig(id: string, updates: Partial<ChatbotConfig>): Promise<ChatbotConfig> {
    const { data, error } = await supabase
      .from('chatbot_config')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // --- Knowledge Base ---
  async getKnowledge(): Promise<KnowledgeEntry[]> {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async createKnowledge(entry: Omit<KnowledgeEntry, 'id' | 'created_at' | 'updated_at'>): Promise<KnowledgeEntry> {
    const { data, error } = await supabase
      .from('knowledge_base')
      .insert(entry)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateKnowledge(id: string, updates: Partial<KnowledgeEntry>): Promise<KnowledgeEntry> {
    const { data, error } = await supabase
      .from('knowledge_base')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteKnowledge(id: string): Promise<void> {
    const { error } = await supabase.from('knowledge_base').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // --- Chat Sessions ---
  async getOrCreateSession(sessionId: string): Promise<string> {
    const { data } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (data) return data.id;

    const { data: newSession, error } = await supabase
      .from('chat_sessions')
      .insert({
        session_id: sessionId,
        messages: [],
        metadata: { user_agent: navigator.userAgent },
      })
      .select('id')
      .single();

    if (error) throw new Error(error.message);
    return newSession.id;
  },

  async saveMessages(sessionId: string, messages: ChatMessage[]): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ messages })
      .eq('session_id', sessionId);

    if (error) throw new Error(error.message);
  },

  // --- Send Message (calls AI) ---
  async sendMessage(
    message: string,
    history: ChatMessage[],
    config: ChatbotConfig,
    context: string
  ): Promise<string> {
    // 1. Check knowledge base first for exact matches
    const kbAnswer = await this.searchKnowledgeBase(message);
    if (kbAnswer) return kbAnswer;

    // 2. If no API key, return fallback with context-aware response
    if (!config.api_key_encrypted) {
      return this.fallbackResponse(message, context);
    }

    // 3. Call AI API via Supabase Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message, history, context }
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      
      return data?.reply || this.fallbackResponse(message, context);
    } catch (err) {
      console.error('Edge function error:', err);
      return this.fallbackResponse(message, context);
    }
  },

  // Fallback when no API key or API fails
  fallbackResponse(message: string, context: string): string {
    const q = message.toLowerCase();

    if (q.includes('phòng') || q.includes('giá') || q.includes('room') || q.includes('price')) {
      const lines = context.split('\n').filter(l => l.startsWith('- ') && l.includes('/đêm'));
      if (lines.length > 0) {
        return `🏨 Chúng tôi hiện có ${lines.length} phòng trống:\n\n${lines.join('\n')}\n\n📞 Liên hệ đặt phòng qua điện thoại hoặc Zalo nhé!`;
      }
    }

    if (q.includes('đặt') || q.includes('booking')) {
      return '📱 Để đặt phòng, bạn có thể:\n\n1. Gọi trực tiếp qua số điện thoại\n2. Nhắn Zalo\n3. Gửi email\n\nĐội ngũ chúng tôi sẽ xác nhận và hướng dẫn thanh toán ngay!';
    }

    if (q.includes('vị trí') || q.includes('địa chỉ') || q.includes('đường')) {
      const addressLine = context.match(/Địa chỉ: (.+)/);
      if (addressLine) {
        return `📍 Chúng tôi ở: ${addressLine[1]}\n\nBạn có thể bấm nút "Chỉ đường trên Google Maps" ở mục Vị trí trên website để xem đường đi nhé!`;
      }
    }

    return 'Cảm ơn bạn đã liên hệ! 😊 Để được tư vấn chi tiết, vui lòng gọi điện hoặc nhắn Zalo cho chúng tôi. Đội ngũ Vista Homestay luôn sẵn sàng hỗ trợ bạn!';
  },

  async searchKnowledgeBase(query: string): Promise<string | null> {
    const { data } = await supabase
      .from('knowledge_base')
      .select('answer, keywords')
      .eq('is_active', true);

    if (!data) return null;

    const queryLower = query.toLowerCase();
    for (const entry of data) {
      const keywords = entry.keywords || [];
      const matched = keywords.some((kw: string) => queryLower.includes(kw.toLowerCase()));
      if (matched) return entry.answer;
    }

    return null;
  },

  // Deprecated: Direct provider calls moved to Edge Function
  // keeping method signature empty or removed to avoid TS errors
  // (We removed the callAIProvider method entirely)
};
