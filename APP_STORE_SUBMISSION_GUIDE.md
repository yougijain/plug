# Campus Connect - App Store Submission Guide

## 🚀 Prerequisites

### 1. Apple Developer Account
- **Cost**: $99/year
- **Required**: For iOS App Store submission
- **Sign up**: [developer.apple.com](https://developer.apple.com)

### 2. App Store Connect Access
- **Required**: To manage your app listing
- **Access**: Through your Apple Developer account

### 3. Expo Account
- **Free**: For building and managing your app
- **Sign up**: [expo.dev](https://expo.dev)

## 📱 Step 1: Set Up Expo Project

### Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### Login to Expo
```bash
eas login
```

### Initialize EAS in your project
```bash
cd campus-connect-mobile
eas build:configure
```

## 🏗️ Step 2: Configure Build Settings

### Update eas.json with your details:
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-apple-team-id"
      }
    }
  }
}
```

### Update app.json with your bundle identifier:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.campusconnect"
    }
  }
}
```

## 🎨 Step 3: Prepare App Assets

### Required Assets:
- **App Icon**: 1024x1024px (PNG)
- **Splash Screen**: 1242x2436px (PNG)
- **Screenshots**: 
  - iPhone 6.7" (1290x2796px)
  - iPhone 6.5" (1242x2688px)
  - iPhone 5.5" (1242x2208px)

### Create assets folder structure:
```
campus-connect-mobile/
├── assets/
│   ├── icon.png (1024x1024)
│   ├── splash.png (1242x2436)
│   ├── adaptive-icon.png (1024x1024)
│   └── favicon.png (32x32)
```

## 🔧 Step 4: Environment Variables

### Create .env file:
```bash
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Add to app.json:
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your_supabase_url",
      "supabaseAnonKey": "your_supabase_anon_key"
    }
  }
}
```

## 🏗️ Step 5: Build for Production

### Build iOS app:
```bash
eas build --platform ios --profile production
```

### Build Android app:
```bash
eas build --platform android --profile production
```

## 📋 Step 6: App Store Connect Setup

### 1. Create New App
- Go to [App Store Connect](https://appstoreconnect.apple.com)
- Click "My Apps" → "+" → "New App"
- Fill in app information:
  - **Name**: Campus Connect
  - **Primary Language**: English
  - **Bundle ID**: com.yourcompany.campusconnect
  - **SKU**: campus-connect-ios

### 2. App Information
- **Category**: Social Networking
- **Content Rights**: No
- **Age Rating**: 17+ (due to user-generated content)

### 3. Pricing and Availability
- **Price**: Free
- **Availability**: All countries or select specific regions

## 📝 Step 7: App Store Listing

### App Description:
```
Campus Connect - The trusted ticket marketplace for college students

🎟️ Buy and sell event tickets safely within your campus community
🏫 Verified .edu email addresses only
💰 Direct payments via Venmo, Zelle, or cash
🛡️ Built-in reputation system for trusted sellers
📱 Simple, secure, and student-focused

Perfect for:
• Sports events and games
• Concerts and shows
• Parties and social events
• Theater performances
• Campus activities

Join thousands of students buying and selling tickets on their campus!
```

### Keywords:
```
tickets, campus, college, university, events, sports, concert, party, student, marketplace, safe, verified
```

### What's New:
```
🎉 Welcome to Campus Connect!

• Buy and sell event tickets within your campus community
• Verified .edu email addresses for trusted transactions
• Direct payments via Venmo, Zelle, or cash
• Built-in reputation system for safe trading
• Simple, student-focused interface

Start trading tickets safely on your campus today!
```

## 🚀 Step 8: Submit for Review

### 1. Upload Build
```bash
eas submit --platform ios --profile production
```

### 2. Complete App Store Connect
- Add all required metadata
- Upload screenshots
- Set up app review information
- Submit for review

### 3. App Review Information
- **Contact Information**: Your contact details
- **Demo Account**: Test account for reviewers
- **Notes**: Explain any special features or requirements

## ⏱️ Timeline

- **Build Time**: 10-20 minutes
- **App Review**: 24-48 hours (typically)
- **Total Time**: 1-3 days

## 🔍 Review Guidelines

### Ensure your app follows:
- **App Store Review Guidelines**
- **No in-app purchases** (since you're using off-platform payments)
- **Clear payment disclosure** in app description
- **Age-appropriate content**
- **Proper privacy policy**

## 📞 Support

### If rejected:
1. Read the rejection reason carefully
2. Make necessary changes
3. Resubmit with explanation
4. Contact Apple if needed

### Common rejection reasons:
- Missing privacy policy
- Unclear payment methods
- Age rating issues
- Missing app description
- Incomplete metadata

## 🎯 Success Tips

1. **Test thoroughly** before submission
2. **Follow Apple's guidelines** exactly
3. **Provide clear app description**
4. **Include all required metadata**
5. **Be patient** with the review process

Good luck with your App Store submission! 🚀
