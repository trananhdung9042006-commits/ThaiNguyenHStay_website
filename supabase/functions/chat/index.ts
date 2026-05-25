import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

Deno.serve(async (req) => {
  // 1. Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, history, context } = await req.json()
    if (!message) {
      throw new Error('Message is required')
    }

    // 2. Initialize Supabase client with Service Role Key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 3. Get Chatbot Config
    const { data: config, error: configError } = await supabase
      .from('chatbot_config')
      .select('*')
      .limit(1)
      .single()

    if (configError || !config) {
      throw new Error('Failed to load chatbot config')
    }

    if (!config.is_active) {
      throw new Error('Chatbot is currently disabled')
    }

    if (!config.api_key_encrypted) {
      throw new Error('No API key configured')
    }

    // 4. Construct System Prompt
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
- Với phòng đã đặt, nói "hiện tại phòng đã được đặt" và gợi ý phòng khác`

    const systemPrompt = config.system_prompt || defaultSystemPrompt
    const fullSystem = `${systemPrompt}\n\n--- DỮ LIỆU THỰC TẾ CỦA HOMESTAY ---\n${context}`

    const messages = [
      { role: 'system', content: fullSystem },
      ...(history || []).slice(-10).map((m: ChatMessage) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ]

    let aiResponse = ''

    // 5. Call AI Provider
    if (config.api_provider === 'gemini') {
      const model = config.model || 'gemini-2.0-flash'
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.api_key_encrypted}`
      
      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: fullSystem }] },
          contents,
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.max_tokens,
          },
        }),
      })

      if (!response.ok) throw new Error(await response.text())
      const data = await response.json()
      aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi.'

    } else if (config.api_provider === 'anthropic') {
      const endpoint = config.api_endpoint || 'https://api.anthropic.com/v1/messages'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.api_key_encrypted,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: config.max_tokens,
          temperature: config.temperature,
          system: fullSystem,
          messages: messages.filter(m => m.role !== 'system'),
        }),
      })

      if (!response.ok) throw new Error(await response.text())
      const data = await response.json()
      aiResponse = data.content?.[0]?.text || 'Không có phản hồi.'

    } else {
      // OpenAI / Groq / Custom API (OpenAI-compatible)
      const endpoint = config.api_endpoint || (
        config.api_provider === 'openai' ? 'https://api.openai.com/v1/chat/completions' :
        config.api_provider === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' : ''
      )

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
      })

      if (!response.ok) throw new Error(await response.text())
      const data = await response.json()
      aiResponse = data.choices?.[0]?.message?.content || 'Không có phản hồi.'
    }

    return new Response(JSON.stringify({ reply: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
