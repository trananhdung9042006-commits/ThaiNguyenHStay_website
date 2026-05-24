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
    // 1. Check knowledge base first
    const kbAnswer = await this.searchKnowledgeBase(message);
    if (kbAnswer) return kbAnswer;

    // 2. If no API key, return fallback
    if (!config.api_key_encrypted) {
      return 'Xin lỗi, chatbot chưa được cấu hình. Vui lòng liên hệ trực tiếp qua số điện thoại hoặc Zalo để được hỗ trợ!';
    }

    // 3. Call AI API
    try {
      const systemMessage = `${config.system_prompt}\n\nThông tin website:\n${context}`;
      const messages = [
        { role: 'system' as const, content: systemMessage },
        ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: message },
      ];

      return await this.callAIProvider(messages, config);
    } catch (err) {
      console.error('AI API error:', err);
      return 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng liên hệ trực tiếp qua số điện thoại 0912.345.678 hoặc Zalo để được hỗ trợ ngay!';
    }
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

      if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);
      const data = await response.json();
      return data.content?.[0]?.text || 'Không có phản hồi.';
    }

    // OpenAI-compatible (OpenAI, Gemini, Groq, Custom)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.api_provider === 'gemini') {
      headers['Authorization'] = `Bearer ${config.api_key_encrypted}`;
    } else {
      headers['Authorization'] = `Bearer ${config.api_key_encrypted}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: config.max_tokens,
        temperature: config.temperature,
      }),
    });

    if (!response.ok) throw new Error(`AI API error: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Không có phản hồi.';
  },
};
