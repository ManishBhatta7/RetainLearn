// Simple test script to check Gemini connection
const testGeminiConnection = async () => {
  try {
    console.log('🧪 Testing Gemini API connection...');
    
    // Test using the deployed Supabase function
    const response = await fetch('https://gwarmogcmeehajnevbmi.supabase.co/functions/v1/test-gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3YXJtb2djbWVlaGFqbmV2Ym1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NTQ5NDQsImV4cCI6MjA0NjQzMDk0NH0.4e9bK6zVzF8zO7q8zF8zO7q8zF8zO7q8zF8zO7q8zF8' // This is a placeholder, use your actual anon key
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Gemini connection successful!');
      console.log('Response:', data.response);
    } else {
      console.log('❌ Gemini connection failed:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Test the chat function
const testGeminiChat = async (prompt = "Hello, are you working?") => {
  try {
    console.log('💬 Testing Gemini chat...');
    
    const response = await fetch('https://gwarmogcmeehajnevbmi.supabase.co/functions/v1/gemini-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3YXJtb2djbWVlaGFqbmV2Ym1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NTQ5NDQsImV4cCI6MjA0NjQzMDk0NH0.4e9bK6zVzF8zO7q8zF8zO7q8zF8zO7q8zF8zO7q8zF8'
      },
      body: JSON.stringify({
        prompt: prompt,
        systemPrompt: "You are a helpful assistant."
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Gemini chat successful!');
      console.log('Response:', data.response);
    } else {
      console.log('❌ Gemini chat failed:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Chat test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Run tests
console.log('Starting Gemini API tests...\n');

// Note: Replace the placeholder auth token with your actual Supabase anon key
// You can find it in your Supabase dashboard under Settings > API
console.log('⚠️  IMPORTANT: Update the Authorization token in this script with your actual Supabase anon key!\n');

testGeminiConnection().then(result => {
  if (result.success) {
    return testGeminiChat("Can you confirm that you're working properly?");
  }
}).then(() => {
  console.log('\n🎯 Test completed!');
}).catch(error => {
  console.error('Test suite failed:', error);
});