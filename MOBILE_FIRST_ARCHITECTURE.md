# TicketPlug - Mobile-First Architecture Plan

## 🎯 Strategy: Build Native Mobile App from Scratch

**Decision**: Build as React Native app from the start, optimized for iOS and Android app stores.

---

## 📱 Tech Stack

### Core Framework
- **React Native** with **Expo** (for easier app store builds)
- **TypeScript** (keep type safety)

### Navigation
- **React Navigation** (bottom tabs + stack navigation)
- `@react-navigation/bottom-tabs` - Bottom navigation
- `@react-navigation/native-stack` - Screen navigation

### State Management
- **Zustand** (reuse existing store)
- **React Query** (reuse for data fetching)

### Backend
- **Supabase** (same backend, works perfectly with React Native)

### UI Components
- **React Native** core components (View, Text, Pressable, etc.)
- **@expo/vector-icons** (for icons)
- **StyleSheet** (native styling, no Tailwind)

### Forms & Validation
- **React Hook Form** (works with React Native)
- **Zod** (same validation schemas)

### Image Handling
- **expo-image-picker** (camera/photo library)
- **expo-image** (optimized image component)

---

## 📂 Project Structure

```
ticketplug-mobile/
├── App.tsx                    # Root component with navigation
├── app.json                   # Expo configuration
├── package.json
├── tsconfig.json
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx   # Main navigation setup
│   ├── screens/                # All screens (converted from pages/)
│   │   ├── Login.tsx
│   │   ├── Home.tsx
│   │   ├── CreateTicket.tsx
│   │   ├── TicketDetail.tsx
│   │   ├── Saved.tsx
│   │   └── Profile.tsx
│   ├── components/            # Reusable components
│   │   └── Navigation.tsx      # Bottom tab bar
│   ├── hooks/                 # Custom hooks (mostly unchanged)
│   │   ├── useAuth.ts
│   │   ├── useTickets.ts
│   │   ├── useCampuses.ts
│   │   └── useSavedTickets.ts
│   ├── lib/                   # Core logic (mostly unchanged)
│   │   ├── api.ts             # Supabase API calls
│   │   ├── supabase.ts        # Supabase client
│   │   ├── store.ts           # Zustand store
│   │   └── queryClient.ts     # React Query setup
│   ├── types/                 # TypeScript types (unchanged)
│   │   ├── index.ts
│   │   └── database.ts
│   └── styles/                # Shared styles
│       └── theme.ts           # Colors, spacing, typography
└── assets/
    ├── icon.png               # App icon (1024x1024)
    └── splash.png             # Splash screen
```

---

## ✅ What Can Be Reused (90% of Code)

### 1. **Types** (`src/types/`)
- ✅ **100% reusable** - No changes needed
- All TypeScript interfaces work in React Native

### 2. **API Layer** (`src/lib/api.ts`)
- ✅ **95% reusable** - Supabase works identically
- Minor: Remove any web-specific code

### 3. **State Management** (`src/lib/store.ts`)
- ✅ **100% reusable** - Zustand works in React Native
- No changes needed

### 4. **Hooks** (`src/hooks/`)
- ✅ **90% reusable** - Logic is the same
- Minor: Update navigation calls

### 5. **Supabase Client** (`src/lib/supabase.ts`)
- ✅ **100% reusable** - Works identically
- No changes needed

### 6. **Form Validation** (Zod schemas)
- ✅ **100% reusable** - Same validation logic
- No changes needed

---

## ❌ What Must Be Rewritten

### 1. **All Screens** (`src/pages/` → `src/screens/`)
- Convert HTML elements to React Native components
- Replace Tailwind with StyleSheet
- Update navigation (React Router → React Navigation)

### 2. **Components** (`src/components/`)
- Convert to React Native components
- Replace icons (Heroicons → Expo Icons)

### 3. **Navigation** (`App.tsx`)
- Replace React Router with React Navigation
- Set up bottom tabs + stack navigation

### 4. **Styling**
- Convert all Tailwind classes to StyleSheet
- Create theme file for colors/spacing

---

## 🔄 Conversion Pattern

### Example: Converting Login Screen

**Before (React Web):**
```tsx
import { useNavigate } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <button onClick={() => navigate('/home')}>Sign In</button>
    </div>
  );
};
```

**After (React Native):**
```tsx
import { useNavigation } from '@react-navigation/native';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Text>Sign In</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
});
```

---

## 🚀 Implementation Steps

### Phase 1: Setup (Day 1)
1. ✅ Create Expo project
2. ✅ Install dependencies
3. ✅ Copy reusable code (types, API, hooks, store)
4. ✅ Set up Supabase connection
5. ✅ Configure navigation structure

### Phase 2: Core Screens (Days 2-3)
1. ✅ Convert Login screen
2. ✅ Convert Home screen
3. ✅ Convert CreateTicket screen
4. ✅ Convert TicketDetail screen
5. ✅ Convert Saved and Profile screens

### Phase 3: Polish (Day 4)
1. ✅ Add navigation bar
2. ✅ Style all screens
3. ✅ Test image uploads
4. ✅ Test all user flows

### Phase 4: Testing (Day 5)
1. ✅ Test on iOS simulator
2. ✅ Test on Android emulator
3. ✅ Fix platform-specific issues
4. ✅ Performance optimization

### Phase 5: App Store Prep (Day 6)
1. ✅ Create app icons
2. ✅ Create splash screens
3. ✅ Configure app.json
4. ✅ Build for production

---

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@react-navigation/native-stack": "^6.9.0",
    "react-native-screens": "~3.29.0",
    "react-native-safe-area-context": "4.8.0",
    "@supabase/supabase-js": "^2.53.0",
    "@tanstack/react-query": "^5.84.1",
    "zustand": "^5.0.7",
    "react-hook-form": "^7.62.0",
    "@hookform/resolvers": "^5.2.1",
    "zod": "^4.0.14",
    "date-fns": "^2.29.0",
    "@expo/vector-icons": "^14.0.0",
    "expo-image-picker": "~14.7.0",
    "expo-image": "~1.10.0",
    "expo-sharing": "~11.10.0",
    "react-native-reanimated": "~3.6.0",
    "react-native-gesture-handler": "~2.14.0"
  }
}
```

---

## 🎨 Design System

### Colors (from your current theme)
```typescript
export const colors = {
  primary: '#4F46E5',      // Indigo
  secondary: '#7C3AED',     // Purple
  background: '#F5F7FA',
  white: '#FFFFFF',
  text: '#0E1F33',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
};
```

### Spacing
```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

---

## ✅ Advantages of This Approach

1. **Native Performance** - Better than Capacitor
2. **Native Feel** - True mobile app experience
3. **Better UX** - Optimized for touch interactions
4. **App Store Ready** - Built for iOS/Android from start
5. **Future-Proof** - Easier to add native features later
6. **Reuse Logic** - 90% of business logic stays the same

---

## ⚠️ Considerations

1. **More Work Upfront** - Need to rewrite UI layer
2. **No Web Version** - Would need separate web app later
3. **Learning Curve** - React Native has different patterns
4. **Testing** - Need iOS/Android simulators

---

## 🚀 Ready to Start?

Let's build this as a proper mobile app! The architecture is solid, and we can reuse most of your existing code.

