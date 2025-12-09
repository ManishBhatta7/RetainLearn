# RetainLearn Android APK - Installation Guide

## Quick Start

### What You'll Need
- Android phone (Android 7.0+ recommended)
- RetainLearn APK file
- ~100 MB free storage space

### Installation Steps

#### Option 1: Direct Installation (Easiest)
1. Download the APK file to your phone
2. Open your file manager
3. Navigate to Downloads folder
4. Tap the APK file
5. If prompted, enable "Install from unknown sources"
6. Tap "Install"
7. Wait for installation to complete
8. Tap "Open" to launch the app

#### Option 2: ADB Installation (For Developers)
```powershell
# Connect Android device via USB
adb devices

# Install APK
adb install RetainLearn-app.apk

# Verify installation
adb shell pm list packages | findstr "retainlearn"
```

#### Option 3: Install Multiple APKs (If Split)
```powershell
adb install-multiple base.apk config.en.apk config.hdpi.apk
```

## First Launch

### Initial Setup
1. **Grant Permissions**
   - Internet access (required for AI features)
   - Storage (optional, for profile picture)

2. **Login**
   - Enter your Supabase email
   - Enter your password
   - Tap "Login"

3. **Explore Features**
   - Dashboard: View your learning stats
   - AI Tutor: Chat with AI tutors
   - NEP Auditor: Get your submissions evaluated
   - Profile: View your progress
   - Settings: Customize your experience

## Features Overview

### 🏠 Dashboard
- View your learning statistics
- Track assignments completed
- Monitor average score
- Maintain your learning streak
- Get daily learning tips

### 🤖 AI Tutor
- Chat with AI tutors (Gemini, GPT-4, DeepSeek)
- Choose learning mode:
  - **Tutor**: Direct explanations
  - **Socratic**: Question-based learning
  - **Coach**: Motivational guidance
  - **Simple**: Easy explanations

### ✓ NEP Auditor
- Submit your essays or assignments
- Get evaluated against NEP 2020 standards
- Compare with global standards (US, Japan, Australia)
- Identify areas for improvement
- Avoid rote learning pitfalls

### 👤 Profile
- View your account information
- Track your learning statistics
- Update profile information
- Change password

### ⚙️ Settings
- Enable/disable dark mode
- Manage notifications
- Choose language (English, Hindi, Spanish)
- Set data usage preferences
- Access privacy policy and terms

## Troubleshooting

### "App not installed"
**Solutions**:
1. Ensure you have enough storage space (>100 MB)
2. Try clearing cache: Settings → Apps → RetainLearn → Storage → Clear Cache
3. Uninstall previous version first
4. Check Android version (7.0+ required)

### "Unknown source" error
**Solutions**:
1. Enable unknown sources:
   - Settings → Security → Unknown Sources → Enable
   - Or Settings → Apps & Notifications → Advanced → Install Unknown Apps → Allow
2. Retry installation

### App crashes on startup
**Solutions**:
1. Force stop the app: Settings → Apps → RetainLearn → Force Stop
2. Clear app cache: Settings → Apps → RetainLearn → Storage → Clear Cache
3. Uninstall and reinstall
4. Restart your phone

### Cannot login
**Solutions**:
1. Check internet connection
2. Verify email and password are correct
3. Reset password at https://retainlearn.com/reset
4. Check if Supabase service is available

### AI Tutor not responding
**Solutions**:
1. Check internet connection (WiFi or 4G)
2. Verify data isn't disabled in settings
3. Try switching AI model in mode selector
4. Restart the app

### NEP Auditor submission fails
**Solutions**:
1. Ensure all fields are filled
2. Check text submission isn't too short
3. Verify internet connection
4. Check Supabase connectivity

## Data & Storage

### What Data is Stored Locally
- Login token (encrypted in secure storage)
- App preferences (settings)
- Cache files

### What Data is Stored Online
- User profile and account info (Supabase)
- Chat history (with AI tutor)
- Audit submissions (NEP auditor)
- Learning statistics

### Privacy
- No personal data sold
- Your submissions are private
- Teachers/admins can only view if they have access
- Comply with data protection laws

## Performance Tips

### Speed Up the App
1. Clear cache regularly (Settings → Clear Cache)
2. Close background apps
3. Ensure good internet connection
4. Update to latest Android version
5. Restart phone if app slows down

### Save Data
1. Enable "Minimal" data usage in settings
2. Disable auto-play for videos
3. Use WiFi for large submissions
4. Download lessons while on WiFi

### Battery Life
1. Disable push notifications (Settings)
2. Reduce screen brightness
3. Limit background app refresh
4. Close app when not in use

## Advanced

### Clear All App Data
```
Settings → Apps → RetainLearn → Storage → Clear Storage
```

### Uninstall App
```
Settings → Apps → RetainLearn → Uninstall
```

### Check App Version
```
Settings → RetainLearn → About → Version
```

### Access Logs (For Support)
```
Settings → Apps → RetainLearn → Permissions → Logs
```

## Getting Help

### In-App Support
- Settings → Send Feedback
- Settings → Help & Support

### Web Support
- Email: support@retainlearn.com
- Website: https://retainlearn.com/support
- Documentation: https://docs.retainlearn.com

### Report Bugs
Include:
- App version (Settings → About)
- Android version
- Device name
- Description of issue
- Steps to reproduce

## Update Instructions

### Check for Updates
1. Open RetainLearn
2. Go to Settings
3. Tap "Check for Updates"
4. Follow on-screen instructions

### Manual Update
1. Download latest APK
2. Tap to install
3. Allow override of existing app
4. App will update with your data intact

## Uninstall

### Remove App
1. Long press RetainLearn icon on home screen
2. Select "Uninstall"
3. Or: Settings → Apps → RetainLearn → Uninstall

### Note
Uninstalling will remove the app but NOT your online data on Supabase. You can reinstall anytime and access your progress.

## System Requirements

| Component | Requirement |
|-----------|-------------|
| **Android Version** | 7.0 (API 24) or higher |
| **RAM** | 2 GB minimum |
| **Storage** | 100 MB free space |
| **Internet** | WiFi or 4G connection |
| **Processor** | ARMv7 or ARMv8 |

## Download Links

### Official Build
- **Build Status**: [View on EAS](https://expo.dev/accounts/manishgamez/projects/vite_react_shadcn_ts)
- **Download**: Available after build completes

### GitHub Release
- Check Releases on GitHub repository

## FAQ

**Q: Can I use the app without internet?**
A: No, the app requires internet for AI features and data sync. Offline mode coming soon.

**Q: Is my data secure?**
A: Yes, all data is encrypted in transit and stored securely on Supabase servers.

**Q: Can I switch between devices?**
A: Yes, login on any Android device with the same account. Your data syncs automatically.

**Q: What if I forget my password?**
A: Tap "Forgot Password?" on the login screen to reset.

**Q: How much data does the app use?**
A: Minimal (~5-10 MB per session). Enable "Minimal" data mode for less usage.

**Q: Can I export my progress?**
A: Yes, contact support@retainlearn.com for data export options.

---

**Version**: 1.0.0
**Last Updated**: 2024
**Support**: support@retainlearn.com
