# Gemini API Connection Troubleshooting Guide

## Quick Fix Steps

### 1. Verify API Key Setup
```bash
# Check if GEMINI_API_KEY is set
supabase secrets list | findstr GEMINI_API_KEY

# If not set, add your API key
supabase secrets set GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 2. Deploy Updated Functions
```bash
# Deploy all Gemini-related functions
supabase functions deploy test-gemini
supabase functions deploy gemini-chat
supabase functions deploy gemini-agent
supabase functions deploy analyze-submission
supabase functions deploy gemini-data-processor
```

### 3. Test the Connection
Visit your app's Gemini test page and click "Test Gemini Connection" to verify everything works.

## Common Issues & Solutions

### Issue 1: "Gemini API key not found in environment variables"
**Solution**: Your API key isn't set in Supabase. Run:
```bash
supabase secrets set GEMINI_API_KEY=your_key_here
```

### Issue 2: "Quota Exceeded" or Rate Limiting
**Solution**: 
- Check your Google AI Studio quota at https://makersuite.google.com/app/apikey
- Consider upgrading to a paid plan if you're hitting free tier limits
- Add retry logic with exponential backoff

### Issue 3: "Network Error" or Connection Refused
**Solution**:
- Check your internet connection
- Verify Google's API endpoints are accessible
- Check if your network/firewall blocks outbound requests

### Issue 4: "Invalid API Key"
**Solution**:
- Verify your API key is correct and active
- Check if the key has the right permissions
- Regenerate a new key if necessary

### Issue 5: Model Not Found (404 errors)
**Solution**: 
- I've updated all functions to use `gemini-2.0-flash-exp` which is the latest experimental version
- If you still get 404s, the model might be temporarily unavailable

## Getting a Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Choose your project or create a new one
4. Copy the key and set it in Supabase

## Testing Your Setup

Use the built-in test component at `/gemini-test` in your app, or test directly:

```bash
# Test the function directly
curl -X POST https://your-project.supabase.co/functions/v1/test-gemini \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Environment Variables Required

Make sure these are set in your Supabase project:
- `GEMINI_API_KEY`: Your Google AI Studio API key
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (for server-side operations)

## Need More Help?

1. Check the browser console for detailed error messages
2. Look at Supabase function logs in your dashboard
3. Verify your API key has proper quotas and permissions
4. Try the updated Gemini 2.0 Flash model (already updated in your code)