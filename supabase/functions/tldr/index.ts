import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY')!
const SUPABASE_URL  = Deno.env.get('SUPABASE_URL')!
const SUPABASE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Validate auth token
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

  const { text } = await req.json()
  if (!text || text.trim().length < 20) {
    return new Response('Text too short', { status: 400, headers: corsHeaders })
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Summarize the following text in three ways. Return only valid JSON with keys "short" (1-2 sentences), "bullets" (array of 3-5 strings), and "simple" (plain-language explanation, 2-3 sentences).

Text:
${text.slice(0, 4000)}`
      }]
    })
  })

  const claude = await response.json()
  const raw = claude.content?.[0]?.text?.trim()

  // Log usage (fire and forget)
  supabase.from('usage_logs').insert({
    user_id: user.id,
    feature: 'tldr',
    input_word_count: text.split(/\s+/).length,
    model: 'claude-haiku-4-5-20251001',
  }).then(() => {})

  let result
  try {
    const jsonStr = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    result = JSON.parse(jsonStr)
  } catch {
    return new Response('Parse error', { status: 500, headers: corsHeaders })
  }

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'content-type': 'application/json' }
  })
})
