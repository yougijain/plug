# Campus Connect Mobile App

This is the React Native version of Campus Connect, built with Expo for App Store submission.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### 3. Login to Expo
```bash
eas login
```

### 4. Configure Build
```bash
eas build:configure
```

### 5. Build for iOS
```bash
eas build --platform ios --profile production
```

## 📱 Development

### Run on iOS Simulator
```bash
npm run ios
```

### Run on Android
```bash
npm run android
```

### Run on Web
```bash
npm run web
```

## 🏗️ Building for Production

### iOS App Store
```bash
eas build --platform ios --profile production
```

### Android Play Store
```bash
eas build --platform android --profile production
```

## 📋 App Store Submission

See the main project's `APP_STORE_SUBMISSION_GUIDE.md` for detailed instructions.

## 🔧 Configuration

### Environment Variables
Create a `.env` file with:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### App Configuration
Update `app.json` with your:
- Bundle identifier
- App name
- Version
- Icons and splash screen

## 📦 Dependencies

- **Expo**: React Native framework
- **Supabase**: Backend and authentication
- **React Query**: Data fetching
- **React Hook Form**: Form handling
- **Zod**: Schema validation

## 🎯 Next Steps

1. Copy your web app components to React Native
2. Adapt UI for mobile screens
3. Test on devices
4. Build and submit to App Store

## 📞 Support

For issues with the mobile app setup, check:
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
