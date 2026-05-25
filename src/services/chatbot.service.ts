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

    // 3. Call AI API
    try {
      const defaultSystemPrompt = `Bạn là trợ lý tư vấn AI của Vista Homestay — một homestay đẳng cấp tại Thái Nguyên, Việt Nam.

NHIỆM VỤ:
- Tư vấn khách hàng về phòng, giá cả, tiện ích, vị trí, cách đặt phòng
- Trả lời thân thiện, ngắn gọn, chuyên nghiệp bằng tiếng Việt
- Gợi ý phòng phù hợp dựa trên nhu cầu khách
- Hướng dẫn đặt phòng, thanh toán, chính sách hủy
- Nếu không biết câu trả lời, hãy hướng dẫn khách liên hệ trực tiếp qua điện thoại/Zalo

QUY TẮC:
- Luôn trả lời bằng tiếng Việt
- Ngắn gọn, tối đa 3-4 câu cho mỗi câu trả lời trừ khi khách hỏi chi tiết
- Sử dụng emoji phù hợp để tạo cảm giác thân thiện
- Khi giới thiệu phòng, nêu rõ giá, sức chứa, diện tích
- Nếu khách muốn đặt phòng, hướng dẫn liên hệ qua điện thoại hoặc Zalo
- KHÔNG bịa thông tin không có trong dữ liệu
- Với phòng đã đặt, nói "hiện tại phòng đã được đặt" và gợi ý phòng khác`;

      const systemPrompt = config.system_prompt || defaultSystemPrompt;
      const fullSystem = `${systemPrompt}\n\n--- DỮ LIỆU THỰC TẾ CỦA HOMESTAY ---\n${context}`;

      const aiMessages = [
        { role: 'system' as const, content: fullSystem },
        ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: message },
      ];

      return await this.callAIProvider(aiMessages, config);
    } catch (err) {
      console.error('AI API error:', err);
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

  async callAIProvider(
    messages: { role: string; content: string }[],
    config: ChatbotConfig
  ): Promise<string> {
    const endpoint = config.api_endpoint || PROVIDER_ENDPOINTS[config.api_provider];
    if (!endpoint) throw new Error(`Unknown provider: ${config.api_provider}`);

    // Anthropic has a different API format
    if (config.api_provider === 'anthropic') {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.api_key_encrypted,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: config.max_tokens,
          temperature: config.temperature,
          system: messages.find(m => m.role === 'system')?.content || '',
          messages: messages.filter(m => m.role !== 'system'),
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Anthropic API error ${response.status}: ${errText}`);
      }
      const data = await response.json();
      return data.content?.[0]?.text || 'Không có phản hồi.';
    }

    // Gemini - use native Gemini API (more reliable than OpenAI-compatible)
    if (config.api_provider === 'gemini') {
      const model = config.model || 'gemini-2.0-flash';
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.api_key_encrypted}`;

      // Convert messages to Gemini format
      const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const response = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.max_tokens,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi.';
    }

    // OpenAI-compatible (OpenAI, Groq, Custom)
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.api_key_encrypted}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: config.max_tokens,
        temperature: config.temperature,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Không có phản hồi.';
  },
};
