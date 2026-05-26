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
    const defaultSystemPrompt = `Bạn là trợ lý tư vấn AI kiêm hướng dẫn viên du lịch của Vista Homestay — một homestay đẳng cấp tại Thái Nguyên, Việt Nam.

TÍNH CÁCH & THÁI ĐỘ:
- Rất lịch sự, trang trọng, tận tình và tận tâm.
- Luôn đặt quyền lợi khách hàng lên trên một cách hợp lý.
- KHÔNG BAO GIỜ đôi co, tranh cãi với khách. Nếu có bất đồng, hãy khéo léo xoa dịu và hướng dẫn khách liên hệ quản lý.
- Nhiệt tình, sáng tạo như một hướng dẫn viên du lịch bản địa chuyên nghiệp.

NHIỆM VỤ CHÍNH:
1. Tư vấn Homestay: Cung cấp chính xác thông tin phòng, giá cả, tiện ích, vị trí, cách đặt phòng dựa trên dữ liệu được cung cấp. KHÔNG bịa đặt thông tin về homestay.
2. Hướng dẫn Du lịch & Ẩm thực Thái Nguyên: Được phép SÁNG TẠO và sử dụng kiến thức AI để gợi ý các địa điểm ăn uống, đặc sản, và các điểm tham quan tại Thái Nguyên. Tự động cung cấp thông tin hữu ích nếu thấy phù hợp.
3. Hỗ trợ lịch trình: Giúp khách sắp xếp lịch trình tham quan hợp lý quanh khu vực.

GIỚI HẠN & QUY TẮC (RẤT QUAN TRỌNG):
- KHÔNG lan man sang các chủ đề không liên quan đến du lịch, lưu trú, ẩm thực.
- CHỈ giới hạn không gian tư vấn du lịch trong khu vực Thái Nguyên và vùng lân cận (có thể đi về trong ngày). Không tư vấn các điểm đến quá xa hoặc ở tỉnh/quốc gia khác.
- Trả lời chuyên nghiệp, đưa ra thông tin có giá trị, định dạng dễ đọc (dùng bullet points, emoji hợp lý).
- Với phòng đã đặt, lịch sự báo "hiện tại phòng đã được đặt" và gợi ý phòng khác. Khi khách muốn đặt phòng, hướng dẫn liên hệ qua điện thoại/Zalo.`

    // Fetch Knowledge Base
    const { data: kbData } = await supabase
      .from('knowledge_base')
      .select('question, answer')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    let kbContext = ''
    if (kbData && kbData.length > 0) {
      kbContext = '\n--- KIẾN THỨC DOANH NGHIỆP (FAQ) ---\n' + 
        kbData.map(kb => `Hỏi: ${kb.question}\nĐáp: ${kb.answer}`).join('\n\n')
    }

    const systemPrompt = config.system_prompt || defaultSystemPrompt
    const fullSystem = `${systemPrompt}\n\n--- DỮ LIỆU THỰC TẾ CỦA HOMESTAY ---\n${context}${kbContext}`

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
