# Supabase Integration Setup Guide

## 1. Environment Variables

Create a `.env` file in your project root with your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  avatar TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  type TEXT CHECK (type IN ('item', 'service', 'ride', 'ticket', 'book', 'sublet')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2),
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'sold', 'expired')) DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',
  is_flash_deal BOOLEAN DEFAULT false,
  flash_deal_expires_at TIMESTAMP WITH TIME ZONE
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id) NOT NULL,
  receiver_id UUID REFERENCES public.users(id) NOT NULL,
  post_id UUID REFERENCES public.posts(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participants UUID[] NOT NULL,
  last_message_id UUID REFERENCES public.messages(id),
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rides table
CREATE TABLE public.rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES public.users(id) NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  available_seats INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'full', 'completed')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages they're part of" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id);

CREATE POLICY "Users can view conversations they're part of" ON public.conversations FOR SELECT USING (auth.uid() = ANY(participants));
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = ANY(participants));
CREATE POLICY "Users can update conversations they're part of" ON public.conversations FOR UPDATE USING (auth.uid() = ANY(participants));

CREATE POLICY "Rides are viewable by everyone" ON public.rides FOR SELECT USING (true);
CREATE POLICY "Users can create rides" ON public.rides FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "Users can update own rides" ON public.rides FOR UPDATE USING (auth.uid() = driver_id);
CREATE POLICY "Users can delete own rides" ON public.rides FOR DELETE USING (auth.uid() = driver_id);
```

## 3. Additional Integrations Installed

- **@tanstack/react-query**: Data fetching and caching
- **zustand**: State management
- **react-hook-form**: Form handling
- **@hookform/resolvers**: Form validation
- **zod**: Schema validation

## 4. Features Available

### Authentication
- Sign up/Sign in with email
- Auth state management
- Protected routes

### Data Management
- Type-safe database operations
- Real-time subscriptions
- Optimistic updates
- Error handling

### State Management
- Global app state with Zustand
- Server state with React Query
- Form state with React Hook Form

### Development Tools
- React Query DevTools
- TypeScript support
- Hot reloading

## 5. Next Steps

1. Set up your Supabase project and get your credentials
2. Add your credentials to `.env`
3. Run the SQL commands in Supabase
4. Update your components to use the new APIs
5. Test the authentication flow

## 6. Additional Recommendations

### For Production:
- Add error boundaries
- Implement proper loading states
- Add retry logic for failed requests
- Set up monitoring and analytics

### For Enhanced UX:
- Add toast notifications
- Implement infinite scrolling
- Add search and filtering
- Implement real-time messaging

### For Security:
- Add input validation
- Implement rate limiting
- Set up proper CORS policies
- Add audit logging 