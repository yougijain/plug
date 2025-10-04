#!/bin/bash

# Campus Connect Mobile App Setup Script
echo "🚀 Setting up Campus Connect for mobile submission..."

# Check if we're in the right directory
if [ ! -d "campus-connect-mobile" ]; then
    echo "❌ campus-connect-mobile directory not found. Please run this from the project root."
    exit 1
fi

cd campus-connect-mobile

# Install EAS CLI if not already installed
echo "📦 Installing EAS CLI..."
npm install -g @expo/eas-cli

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install additional packages needed for the app
echo "📦 Installing additional packages..."
npm install @supabase/supabase-js @tanstack/react-query @hookform/resolvers zod react-hook-form

# Create basic app structure
echo "📁 Creating app structure..."
mkdir -p assets
mkdir -p src/components
mkdir -p src/screens
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/types

# Create basic App.tsx
echo "📝 Creating basic App.tsx..."
cat > App.tsx << 'EOF'
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campus Connect</Text>
      <Text style={styles.subtitle}>Coming Soon!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.8,
  },
});
EOF

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'eas login' to login to your Expo account"
echo "2. Run 'eas build:configure' to configure build settings"
echo "3. Update app.json with your bundle identifier"
echo "4. Add your app assets to the assets/ folder"
echo "5. Run 'eas build --platform ios --profile production' to build"
echo ""
echo "📖 See APP_STORE_SUBMISSION_GUIDE.md for detailed instructions"
