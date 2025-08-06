# Loop - University Marketplace App

A modern, mobile-first marketplace app for university students to buy, sell, and trade items, services, and rides.

## 🎨 Color Palette

The app uses a carefully designed color palette built around blue and orange with neutral tones:

| Color | Hex | Usage | Purpose |
|-------|-----|-------|---------|
| ⚪️ Light Neutral | #F7F7F7 | 60% | Page backgrounds |
| 🖤 Dark Neutral | #333333 | - | Text/Iconography |
| 🔵 Primary Blue | #1678F2 | 25% | Header/nav, cards |
| 🌐 Light Blue | #56A9FF | 5% | Secondary buttons, links |
| 🟠 Accent Orange | #FF8200 | 7% | Primary CTAs, badges |
| 🟡 Light Orange | #FFC273 | 3% | Hover/pressed states |

## 🚀 Features

- **Authentication**: Secure sign-up/sign-in with Supabase
- **Posts**: Create and browse marketplace posts
- **Search & Filter**: Find items by category and keywords
- **Real-time Updates**: Live updates using Supabase subscriptions
- **Mobile-First Design**: Optimized for mobile devices
- **Demo Mode**: Works without database connection

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Zustand, React Query
- **Forms**: React Hook Form with Zod validation
- **Icons**: Heroicons, Lucide React

## 📱 Pages

- **Home**: Browse and create posts
- **Explore**: Search and filter posts
- **Cruze**: Ride sharing functionality
- **Live Now**: Real-time activity feed
- **Messages**: Chat with other users
- **Login**: Authentication

## 🎯 Design Principles

- **60-30-10 Rule**: Neutrals (60%), Blue (30%), Orange (10%)
- **Complementary Harmony**: Blue (trust) vs Orange (action)
- **Accessible**: All text meets ≥4.5:1 contrast ratio
- **Mobile-First**: Optimized for mobile devices

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Start development server: `npm start`

## 🧹 Recent Cleanup

- Removed unnecessary SQL test files
- Cleaned up test documentation
- Updated color palette to blue/orange theme
- Simplified file structure
- Improved code organization

## 📄 License

MIT License 