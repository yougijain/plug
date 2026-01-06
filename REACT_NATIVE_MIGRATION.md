# React Native Migration Guide

## Overview
Converting TicketPlug from React Web to React Native for iOS and Android app store submission.

## Key Changes Required

### 1. Dependencies
- Replace `react-router-dom` → `@react-navigation/native` + `@react-navigation/bottom-tabs`
- Replace `@heroicons/react` → `react-native-vector-icons` or `@expo/vector-icons`
- Replace `tailwindcss` → React Native StyleSheet
- Replace `framer-motion` → `react-native-reanimated`
- Add `expo` for easier app store builds
- Keep: `@supabase/supabase-js`, `@tanstack/react-query`, `zustand`, `date-fns`

### 2. Component Changes
- `div` → `View`
- `button` → `TouchableOpacity` or `Pressable`
- `input` → `TextInput`
- `img` → `Image`
- `p`, `h1`, `h2`, etc. → `Text`
- `a` → `TouchableOpacity` with navigation

### 3. Styling
- Tailwind classes → StyleSheet.create()
- Flexbox remains similar
- Colors, spacing, typography need conversion

### 4. Navigation
- React Router → React Navigation
- Bottom tabs navigation
- Stack navigation for detail pages

### 5. Platform-Specific
- iOS: Info.plist, AppDelegate
- Android: AndroidManifest.xml, MainActivity
- App icons and splash screens

## Migration Strategy
1. Set up React Native project structure
2. Convert core components first
3. Convert pages one by one
4. Update navigation
5. Test on both platforms
6. Prepare for app store submission

