# Loop - University Community App

A modern React-based marketplace and community platform for university students, built with TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Marketplace**: Buy, sell, and trade items, services, and rides
- **Real-time Updates**: Live activity feed with flash deals
- **Ride Sharing**: Find and offer rides to campus destinations
- **Messaging**: Direct communication between users
- **Responsive Design**: Mobile-first interface with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand, React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Icons**: Heroicons

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account (for full features)

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd loop
npm install
```

### 2. Environment Setup

#### Option A: Demo Mode (No Setup Required)
The app will run in demo mode without Supabase credentials, showing sample data.

#### Option B: Full Features (Supabase Setup)
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 🎯 Demo Mode

When running without Supabase credentials, the app automatically enters **Demo Mode**:

- ✅ **All UI features work** - Navigation, pages, components
- ✅ **Sample data** - Mock posts, rides, messages
- ✅ **Responsive design** - Mobile-first interface
- ⚠️ **No real authentication** - Uses demo user
- ⚠️ **No database persistence** - Data resets on refresh

**Demo Mode Banner**: You'll see a yellow banner indicating demo mode is active.

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utilities, API, store
├── pages/         # Page components
├── types/         # TypeScript type definitions
└── App.tsx        # Main app component
```

## 🐛 Recent Bug Fixes

- ✅ **TypeScript compatibility** - Updated to v5.0+ for Zod v4
- ✅ **Type inconsistencies** - Aligned all types with database schema
- ✅ **Navigation styling** - Fixed color references
- ✅ **Authentication flow** - Centralized auth state management
- ✅ **Demo mode** - Added fallback for missing Supabase credentials
- ✅ **React Hook warnings** - Fixed all dependency arrays
- ✅ **ESLint warnings** - Cleaned up unused imports and variables

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | For full features |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anon key | For full features |

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify

1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Add environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🆘 Troubleshooting

### Common Issues

**Blank Page**: 
- Check browser console for errors
- Ensure all dependencies are installed
- Verify environment variables (if using Supabase)

**Build Errors**:
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript version compatibility

**Authentication Issues**:
- Verify Supabase credentials in `.env`
- Check Supabase project settings
- Ensure RLS policies are configured

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for university communities** 