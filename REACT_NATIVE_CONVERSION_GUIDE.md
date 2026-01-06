# React Native Conversion - Complete Guide

## ⚠️ Important Note

Converting a React web app to React Native is essentially a **complete rewrite**. The core logic (hooks, API calls, state management) can be reused, but all UI components must be rewritten.

## 🎯 Recommended Approach

### Option 1: Use Capacitor (Easier)
- Keep your existing React web app
- Wrap it with Capacitor for native features
- Faster to implement
- Can submit to app stores
- **Recommended for faster time-to-market**

### Option 2: Full React Native (Better Performance)
- Complete rewrite in React Native
- Better performance
- Native feel
- More work upfront
- **Recommended for long-term**

## 📋 What Needs Conversion

### ✅ Can Reuse (Minimal Changes)
- `src/types/` - Type definitions
- `src/lib/api.ts` - API calls (minor changes)
- `src/lib/store.ts` - Zustand store
- `src/hooks/` - Custom hooks (minor changes)
- `src/lib/supabase.ts` - Supabase client (minor changes)

### ❌ Must Rewrite (Complete Changes)
- All `src/pages/` - Convert to React Native screens
- All `src/components/` - Convert to React Native components
- `src/App.tsx` - Convert to React Navigation
- All styling - Tailwind → StyleSheet

## 🔄 Conversion Pattern

### Example: Converting a Page

**Before (React Web):**
```tsx
import { useNavigate } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <button onClick={() => navigate('/tickets/1')}>
        View Details
      </button>
    </div>
  );
};
```

**After (React Native):**
```tsx
import { useNavigation } from '@react-navigation/native';
import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate('TicketDetail', { id: '1' })}>
        <Text>View Details</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

## 📱 Key Component Replacements

| Web Component | React Native Component |
|--------------|------------------------|
| `<div>` | `<View>` |
| `<button>` | `<Pressable>` or `<TouchableOpacity>` |
| `<input>` | `<TextInput>` |
| `<img>` | `<Image>` |
| `<p>`, `<h1>`, etc. | `<Text>` |
| `<a>` | `<Pressable>` with navigation |
| `className` | `style` prop with StyleSheet |

## 🎨 Styling Conversion

**Before (Tailwind):**
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md">
```

**After (StyleSheet):**
```tsx
<View style={styles.card}>
// ...
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

## 🚀 Next Steps

1. **Choose your approach** (Capacitor vs React Native)
2. **Set up new project** (if React Native)
3. **Convert files systematically**:
   - Start with App.tsx and navigation
   - Convert one screen at a time
   - Test after each conversion
4. **Update dependencies** in package.json
5. **Test on both platforms**
6. **Prepare for app store submission**

## 📚 Resources

- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Docs](https://docs.expo.dev/)
- [Capacitor Docs](https://capacitorjs.com/)

---

**I recommend starting with Capacitor for faster implementation, then considering a full React Native rewrite later if needed.**

