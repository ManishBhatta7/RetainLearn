import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY')
    
    if (!deepseekApiKey) {
      console.error('DEEPSEEK_API_KEY not found in environment variables')
      throw new Error('DeepSeek API key not found in environment variables')
    }

    console.log('Testing DeepSeek API connection...')

    // Test the API key with a simple completion request
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: "Say 'The DeepSeek API is working perfectly!'" }],
        max_tokens: 50,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API error response:', errorText)
      
      // Try to parse as JSON, fallback to raw text
      let errorMessage = errorText
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.message || errorJson.error || errorText
      } catch {
        // Use raw text if JSON parsing fails
      }
      
      throw new Error(`DeepSeek API error: ${errorMessage}`)
    }

    const data = await response.json()
    
    return new Response(JSON.stringify({
      success: true,
      message: "DeepSeek API key is working correctly",
      response: data.choices[0].message.content,
      model: "deepseek-chat",
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in test-deepseek function:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})