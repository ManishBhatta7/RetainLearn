# RetainLearn Mobile APK - Deployment Guide

## Overview
This document covers the complete deployment of RetainLearn as an Android APK built with React Native (Expo) and Supabase backend.

## Build Status
- **Build Start Time**: Build submitted to EAS (Expo Application Services)
- **Build Link**: https://expo.dev/accounts/manishgamez/projects/vite_react_shadcn_ts/builds/5fb304e4-dd4e-43d3-ae6f-ea1ea619a93d
- **Status**: Queued (Free tier - waiting in queue)
- **Build Type**: APK (Android Package)

## Project Structure

```
mobile/
├── app.json                    # Expo configuration (SDK, package name, icons)
├── eas.json                    # EAS build profiles
├── package.json                # Dependencies
├── App.tsx                      # Main navigation (Tab + Stack)
├── lib/
│   └── supabase.ts             # Supabase client setup
└── screens/
    ├── auth/
    │   └── LoginScreen.tsx      # Email/password Supabase auth
    ├── DashboardScreen.tsx       # Home screen with stats
    ├── AITutorScreen.tsx         # Chat interface (Gemini/GPT/DeepSeek)
    ├── NEPAuditorScreen.tsx      # Student submission auditor
    ├── ProfileScreen.tsx         # User profile & stats
    └── SettingsScreen.tsx        # App settings
```

## Core Features Implemented

### 1. Authentication
- **File**: `mobile/screens/auth/LoginScreen.tsx`
- **Method**: Supabase email/password auth
- **Token Storage**: AsyncStorage (persistent across app restarts)
- **Features**:
  - Email/password login
  - Error handling & user feedback
  - Automatic token persistence
  - Logout from Profile screen

### 2. Dashboard (Home)
- **File**: `mobile/screens/DashboardScreen.tsx`
- **Features**:
  - User greeting with name from Supabase auth
  - Statistics cards (assignments, avg score, day streak, lessons)
  - Quick action buttons (Start lesson, View progress)
  - Daily learning tip
  - Navigation to all major features

### 3. AI Tutor Chat
- **File**: `mobile/screens/AITutorScreen.tsx`
- **Features**:
  - Multi-mode selection (Tutor/Socratic/Coach/Simple)
  - Multi-model support (Gemini, GPT-4, DeepSeek)
  - Real-time chat interface using FlatList
  - API integration with `gemini-agent` Supabase edge function
  - Typing indicators during API calls
  - Error handling & retry logic

### 4. NEP 2020 Auditor
- **File**: `mobile/screens/NEPAuditorScreen.tsx`
- **Features**:
  - Student submission form (name, subject, text)
  - Integration with `nep-auditor` Supabase edge function
  - Scoring breakdown (5 criteria)
  - Global standards comparison (US, Japan, Australia)
  - Rote learning detection & warning
  - Improvement strategies
  - Color-coded severity indicators (excellent/good/needs-improvement/critical)

### 5. User Profile
- **File**: `mobile/screens/ProfileScreen.tsx`
- **Features**:
  - User avatar (from initials)
  - Profile information (name, email, role)
  - Learning statistics
  - Account settings (email display, password change)
  - App version
  - Logout button with confirmation

### 6. Settings
- **File**: `mobile/screens/SettingsScreen.tsx`
- **Features**:
  - Display settings (dark mode toggle)
  - Notification preferences
  - Language selection (English, Hindi, Spanish)
  - Data usage settings (Auto, WiFi Only, Minimal)
  - Cache management
  - App version & update checking
  - Legal links (privacy, terms)
  - Feedback & support

## Navigation Structure

```
App (Root)
├── Authenticated Users
│   └── Tab Navigator (5 tabs)
│       ├── Dashboard (Home)
│       ├── AITutor (Chat)
│       ├── NEPAuditor (Audit)
│       ├── Profile (User)
│       └── Settings (Preferences)
└── Unauthenticated Users
    └── Stack Navigator
        └── LoginScreen
```

## Backend Integration

### Supabase Configuration
- **Location**: `mobile/lib/supabase.ts`
- **Auth**: Uses same Supabase project as web app
- **Features**:
  - AsyncStorage-based token persistence
  - Automatic session management
  - Edge function integration

### API Endpoints Used
1. **gemini-agent** (AITutor)
   - Request: Chat message + mode + model
   - Response: AI-generated response

2. **nep-auditor** (NEP Auditor)
   - Request: Student submission (name, subject, text, etc.)
   - Response: Score, breakdown, global comparison, strategies

## Building the APK

### Option 1: EAS Cloud Build (Recommended)
```bash
cd mobile
npm install -g eas-cli
eas build --platform android
```

**Status**: Build queued on EAS (free tier)
**Link**: https://expo.dev/accounts/manishgamez/projects/vite_react_shadcn_ts

**Steps**:
1. Create EAS account (free tier available)
2. Run `eas build --platform android`
3. Choose build profile (preview/production)
4. Wait for cloud build to complete (~15-30 min)
5. Download APK when ready

### Option 2: Local Build (Requires macOS/Linux)
```bash
cd mobile
eas build --platform android --local
```

**Requirements**:
- macOS or Linux (Windows not supported for local builds)
- Android SDK installed
- Gradle installed

## Installation on Android Device

### Prerequisites
- Android device (API 24+) or Android emulator
- USB debugging enabled (for physical device)
- USB cable

### Steps

1. **Download APK**
   - From EAS dashboard or download link provided after build

2. **Transfer to Device** (Physical Device)
   ```powershell
   adb push path/to/app.apk /sdcard/Download/
   ```

3. **Install APK**
   ```powershell
   adb install /sdcard/Download/app.apk
   ```

   OR manually:
   - Copy APK to device
   - Open File Manager
   - Navigate to Download folder
   - Tap APK to install
   - Allow installation from unknown sources if prompted

4. **Launch App**
   - Open RetainLearn from app drawer
   - Login with Supabase credentials
   - Allow permissions as needed

### Emulator Installation
```powershell
adb install-multiple app.apk
```

## Testing Checklist

### Authentication
- [ ] Login with valid email/password
- [ ] Token persists after app restart
- [ ] Logout clears session
- [ ] Invalid credentials show error

### Dashboard
- [ ] User name displays correctly
- [ ] Stats load from mock data
- [ ] Quick action buttons navigate correctly
- [ ] Daily tip displays

### AI Tutor
- [ ] Mode selector works (4 modes)
- [ ] Model selector works (3 models)
- [ ] Chat sends messages
- [ ] Responses appear with typing indicator
- [ ] Error handling for API failures

### NEP Auditor
- [ ] Form validation (required fields)
- [ ] Submission generates audit
- [ ] Results display with color coding
- [ ] Breakdown shows all 5 criteria
- [ ] Global comparison displays
- [ ] Strategies show improvement tips

### Profile
- [ ] User info displays
- [ ] Stats show
- [ ] Avatar displays
- [ ] Logout works

### Settings
- [ ] Dark mode toggle works
- [ ] Notification toggle works
- [ ] Language selection works
- [ ] Data usage setting changes

## Troubleshooting

### Build Issues

**Error: "Unsupported platform, macOS or Linux is required"**
- Use EAS cloud build (`eas build --platform android`) instead of local build

**Error: "EAS project not configured"**
- Add `"owner": "your_username"` to `app.json` expo section
- Ensure EAS credentials are set up

**Error: "Android application id not configured"**
- EAS will prompt you to set it during build
- Or add to `app.json`:
  ```json
  "android": {
    "package": "com.retainlearn.mobile"
  }
  ```

### Runtime Issues

**App crashes on login**
- Check Supabase credentials in `mobile/lib/supabase.ts`
- Verify internet connection
- Check Supabase auth settings

**API calls fail**
- Verify edge functions deployed to Supabase
- Check JWT token in AsyncStorage
- Review Supabase function logs

**Chat not working**
- Confirm gemini-agent function exists in Supabase
- Check API keys for AI models (Gemini/OpenAI)
- Review network requests in Supabase logs

**NEP Auditor errors**
- Confirm nep-auditor function exists
- Check database has user metadata
- Verify function returns proper response format

## Performance Optimization

### Current Optimizations
- **FlatList** for chat messages (efficient scrolling)
- **AsyncStorage** for token caching
- **Native navigation** with React Navigation
- **Lazy loading** of screens

### Future Improvements
- Offline support with SQLite
- Image compression for chat attachments
- Response caching
- Background sync for submissions
- Dark mode support

## Security Considerations

1. **API Keys**: All stored in Supabase (edge functions)
2. **Tokens**: AsyncStorage with encryption (native Android)
3. **SSL/TLS**: All API communication encrypted
4. **Permissions**: Minimal required permissions requested
5. **User Data**: Only stored in Supabase, cleared on logout

## Dependencies Summary

```json
{
  "core": [
    "expo",
    "react-native",
    "react"
  ],
  "navigation": [
    "@react-navigation/native",
    "@react-navigation/bottom-tabs",
    "@expo/vector-icons"
  ],
  "backend": [
    "@supabase/supabase-js",
    "@react-native-async-storage/async-storage"
  ],
  "utilities": [
    "axios",
    "react-native-markdown-display"
  ]
}
```

## Release Notes

### Version 1.0.0
- ✅ Complete feature parity with web app
- ✅ Multi-model AI tutor (Gemini, GPT, DeepSeek)
- ✅ NEP 2020 auditor with global standards
- ✅ User authentication & profile management
- ✅ Settings & preferences
- ✅ Responsive UI for mobile

## Next Steps

1. **Monitor EAS Build**
   - Check build status at EAS dashboard
   - Download APK when complete

2. **Test on Device**
   - Install APK on Android device
   - Test all features per checklist
   - Report issues

3. **Production Deployment**
   - Configure signing keys
   - Build for production
   - Submit to Google Play Store
   - Handle app store requirements

4. **Future Features**
   - Offline support
   - Push notifications
   - Dark mode UI
   - In-app purchases (premium features)
   - Video lessons integration
   - Essay checker with OCR

## Support

For build issues: https://docs.expo.dev/build-reference/
For Supabase issues: https://supabase.com/docs
For React Native issues: https://reactnative.dev/docs/getting-started

## Build Output
```
Build Link: https://expo.dev/accounts/manishgamez/projects/vite_react_shadcn_ts/builds/5fb304e4-dd4e-43d3-ae6f-ea1ea619a93d
Status: Building (queued)
ETA: 15-30 minutes (free tier queue)
```

---
**Last Updated**: 2024
**App Version**: 1.0.0
**Built With**: Expo, React Native, TypeScript, Supabase
