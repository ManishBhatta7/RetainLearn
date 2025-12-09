@echo off
echo 🚀 Deploying Gemini API Fixes...
echo.

REM Check if Supabase CLI is available
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI not found. Please install it first:
    echo npm install -g supabase
    pause
    exit /b 1
)

echo 📋 Checking current deployment status...
supabase functions list

echo.
echo 🔧 Deploying updated Gemini functions...
echo.

echo 1️⃣ Deploying test-gemini function...
supabase functions deploy test-gemini
if %errorlevel% neq 0 (
    echo ❌ Failed to deploy test-gemini
    pause
    exit /b 1
)

echo 2️⃣ Deploying gemini-chat function...
supabase functions deploy gemini-chat
if %errorlevel% neq 0 (
    echo ❌ Failed to deploy gemini-chat
    pause
    exit /b 1
)

echo 3️⃣ Deploying gemini-agent function...
supabase functions deploy gemini-agent
if %errorlevel% neq 0 (
    echo ❌ Failed to deploy gemini-agent
    pause
    exit /b 1
)

echo 4️⃣ Deploying analyze-submission function...
supabase functions deploy analyze-submission
if %errorlevel% neq 0 (
    echo ❌ Failed to deploy analyze-submission
    pause
    exit /b 1
)

echo 5️⃣ Deploying gemini-data-processor function...
supabase functions deploy gemini-data-processor
if %errorlevel% neq 0 (
    echo ❌ Failed to deploy gemini-data-processor
    pause
    exit /b 1
)

echo.
echo ✅ All Gemini functions deployed successfully!
echo.
echo 🔑 Next steps:
echo 1. Set your GEMINI_API_KEY if not already set:
echo    supabase secrets set GEMINI_API_KEY=your_key_here
echo.
echo 2. Test the connection in your app at /gemini-test
echo.
echo 3. If you still have issues, check the troubleshooting guide:
echo    gemini-troubleshooting.md
pause