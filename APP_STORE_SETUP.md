# TicketPlug - App Store Submission Guide

## 🚀 Quick Start

### 1. Install Expo CLI
```bash
npm install -g expo-cli eas-cli
```

### 2. Initialize React Native Project
```bash
# In your project root
npx create-expo-app@latest ticketplug-native --template blank-typescript
cd ticketplug-native
```

### 3. Install Dependencies
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @supabase/supabase-js @tanstack/react-query zustand date-fns
npm install react-native-reanimated react-native-gesture-handler
npm install @expo/vector-icons expo-image-picker expo-sharing expo-linking
```

### 4. Copy Source Files
Copy your `src` folder to the new React Native project, then convert files.

## 📱 Project Structure

```
ticketplug-native/
├── App.tsx (React Native entry)
├── app.json (Expo config)
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── screens/ (converted from pages/)
│   ├── components/ (converted)
│   ├── hooks/ (mostly unchanged)
│   ├── lib/ (mostly unchanged)
│   └── types/ (unchanged)
└── assets/
    ├── icon.png (1024x1024)
    ├── splash.png (1242x2436)
    └── adaptive-icon.png (1024x1024)
```

## 🔄 Conversion Checklist

### Core Files
- [x] package.json → React Native dependencies
- [x] app.json → Expo configuration
- [ ] App.tsx → React Native navigation
- [ ] All screens (Home, Saved, CreateTicket, Profile, TicketDetail)
- [ ] All components (Navigation, etc.)
- [ ] Styling (Tailwind → StyleSheet)

### Key Changes
1. **Navigation**: React Router → React Navigation
2. **Icons**: Heroicons → @expo/vector-icons
3. **Styling**: Tailwind classes → StyleSheet
4. **Components**: div → View, button → Pressable, etc.
5. **Images**: img → Image from react-native
6. **Forms**: input → TextInput

## 📦 App Store Requirements

### iOS
- Bundle ID: `com.ticketplug.app`
- App icons (all sizes)
- Splash screen
- Privacy permissions (camera, photos)
- Info.plist configuration

### Android
- Package: `com.ticketplug.app`
- App icons (adaptive)
- Splash screen
- Permissions (camera, storage)
- AndroidManifest.xml

## 🏗️ Build Commands

```bash
# Development
npm start
npm run ios
npm run android

# Production builds (requires EAS)
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## ✅ Testing Checklist

See TESTING_GUIDE_RN.md for complete testing instructions.

