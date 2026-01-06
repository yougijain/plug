# TicketPlug 🎫

A campus-exclusive ticket marketplace mobile application built with React Native and Expo, designed to connect college students for safe, verified ticket buying and selling.

## 📱 Overview

TicketPlug solves the problem of unverified ticket transactions on college campuses by providing a secure, campus-exclusive platform where only verified students can buy and sell event tickets. The app ensures trust through .edu email verification, built-in reputation systems, and campus-specific filtering.

## 🎯 Project Status

### ✅ Completed

- **Project Setup & Configuration**
  - Expo SDK 51.0.0 initialized with TypeScript
  - React Native development environment configured
  - Web, iOS, and Android build configurations
  - EAS Build setup for production deployments
  - App Store and Play Store submission configurations

- **Development Environment**
  - Cross-platform development setup (iOS, Android, Web)
  - Hot reload and fast refresh enabled
  - TypeScript configuration with strict mode
  - Basic UI components and styling system

- **Infrastructure**
  - Project structure established
  - Navigation dependencies installed
  - Asset management configured
  - Build pipeline configured for app store submission

### 🚧 In Progress

- **Core Features Development**
  - Authentication system (Sign In/Sign Up with .edu email verification)
  - Home feed with ticket browsing and filtering
  - Ticket creation and listing functionality
  - User profile and saved tickets management
  - Navigation structure implementation

### 📋 Planned Features

- **MVP Features**
  - User authentication with .edu email verification
  - Campus-specific ticket browsing
  - Multi-step ticket creation form with image upload
  - Ticket detail pages with seller contact information
  - Saved tickets functionality
  - User profile with reputation system
  - Search and filter capabilities

- **Backend Integration**
  - Supabase database connection
  - User authentication via Supabase Auth
  - Image storage with Supabase Storage
  - Real-time data synchronization
  - Row-level security policies

- **Advanced Features (Post-MVP)**
  - Push notifications
  - In-app messaging
  - Payment integration (Stripe)
  - QR code ticket validation
  - Admin dashboard

## 🛠️ Tech Stack

### Frontend
- **Framework**: React Native (Expo SDK 51)
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: Zustand (planned)
- **Data Fetching**: React Query (planned)
- **Forms**: React Hook Form + Zod (planned)
- **Styling**: React Native StyleSheet

### Backend (Planned)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Supabase REST API
- **Serverless Functions**: Supabase Edge Functions

### Third-Party Services (Planned)
- **Payments**: Stripe Connect
- **Push Notifications**: Expo Push Notifications / FCM
- **Email**: Resend/Mailgun via Edge Functions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (install globally: `npm install -g expo-cli`)
- Expo Go app (for mobile testing) or iOS Simulator / Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plug3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platform**
   ```bash
   npm run web      # Web browser
   npm run ios      # iOS Simulator (Mac only)
   npm run android  # Android Emulator
   ```

### Development Commands

```bash
npm start              # Start Expo development server
npm run web            # Run on web browser
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run build:ios      # Build production iOS app
npm run build:android  # Build production Android app
npm run build:all      # Build for both platforms
```

## 📁 Project Structure

```
plug3/
├── App.tsx                 # Main application entry point
├── app.json                # Expo configuration
├── eas.json                # EAS Build configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── APP_STORE_SUBMISSION.md # App store submission guide
└── README.md              # This file
```

## 🎨 Design Principles

- **Mobile-First**: Optimized for mobile devices with responsive design
- **Campus-Exclusive**: Verified .edu email addresses only
- **Trust & Safety**: Built-in reputation system and user verification
- **Simple UX**: Intuitive 3-step ticket creation process
- **Fast Performance**: Optimized for quick browsing and posting

## 🔒 Security & Privacy

- .edu email verification required for all users
- Campus-specific data isolation
- Row-level security policies (planned)
- Secure image storage
- User data privacy compliance

## 📊 Business Model

- **MVP**: Free platform with direct payments (Venmo, Zelle, cash)
- **Future Revenue**: Featured listings, premium badges, campus partnerships

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and configuration
- [x] Development environment
- [x] Build pipeline setup

### Phase 2: Core Features 🚧
- [ ] Authentication system
- [ ] Navigation structure
- [ ] Home feed implementation
- [ ] Ticket creation flow
- [ ] User profile system

### Phase 3: Backend Integration 📋
- [ ] Supabase database setup
- [ ] Authentication integration
- [ ] Image upload functionality
- [ ] Real-time data sync

### Phase 4: Polish & Launch 📋
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Performance optimization
- [ ] App store submission

## 📝 Development Notes

- The project uses Expo's managed workflow for simplified development
- TypeScript is configured with strict mode for type safety
- EAS Build is configured for cloud-based production builds
- Web support is enabled for rapid development and testing

## 🤝 Contributing

This is a personal project. For questions or collaboration inquiries, please contact the project maintainer.

## 📄 License

Private project - All rights reserved

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [App Store Submission Guide](./APP_STORE_SUBMISSION.md)

---

**Status**: Active Development | **Version**: 1.0.0 | **Last Updated**: 2024
