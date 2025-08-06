-- COMPLETE DATABASE RECREATION SCRIPT
-- This will create all tables from scratch (handles missing tables gracefully)
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. ENABLE EXTENSIONS
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 2. DROP EXISTING OBJECTS (IF THEY EXIST)
-- ========================================

-- Drop triggers (if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_conversation_on_message_insert') THEN
        DROP TRIGGER IF EXISTS update_conversation_on_message_insert ON public.messages;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_conversations_updated_at') THEN
        DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
    END IF;
END $$;

-- Drop functions (if they exist)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_conversation_on_message() CASCADE;
DROP FUNCTION IF EXISTS mark_messages_as_read(UUID, UUID) CASCADE;

-- Drop tables (CASCADE will handle dependencies)
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.rides CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ========================================
-- 3. CREATE TABLES WITH CORRECT SCHEMA
-- ========================================

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

-- Create conversations table (CORRECT: participants as TEXT[])
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participants TEXT[] NOT NULL, -- CORRECT: TEXT[] not UUID[]
  last_message_id UUID,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id) NOT NULL,
  receiver_id UUID REFERENCES public.users(id) NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id) NOT NULL,
  post_id UUID REFERENCES public.posts(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT false
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

-- ========================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ========================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);

-- Posts indexes
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_type ON public.posts(type);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_location ON public.posts(location);
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_posts_is_flash_deal ON public.posts(is_flash_deal);

-- Messages indexes
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_messages_read ON public.messages(read);

-- Conversations indexes
CREATE INDEX idx_conversations_participants ON public.conversations USING GIN(participants);
CREATE INDEX idx_conversations_updated_at ON public.conversations(updated_at DESC);

-- Rides indexes
CREATE INDEX idx_rides_driver_id ON public.rides(driver_id);
CREATE INDEX idx_rides_status ON public.rides(status);
CREATE INDEX idx_rides_departure_time ON public.rides(departure_time);

-- ========================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. CREATE FUNCTIONS
-- ========================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update conversation on message insert
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations 
    SET 
        last_message_id = NEW.id,
        updated_at = NOW(),
        unread_count = unread_count + 1
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(conversation_uuid UUID, user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.messages 
    SET read = true 
    WHERE conversation_id = conversation_uuid 
    AND receiver_id = user_uuid 
    AND read = false;
    
    UPDATE public.conversations 
    SET unread_count = 0 
    WHERE id = conversation_uuid;
END;
$$ language 'plpgsql';

-- ========================================
-- 7. CREATE TRIGGERS
-- ========================================

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for conversation updates
CREATE TRIGGER update_conversation_on_message_insert
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();

-- ========================================
-- 8. CREATE RLS POLICIES (PERMISSIVE FOR TESTING)
-- ========================================

-- Users policies
CREATE POLICY "Enable read access for all users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for authenticated users" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Enable read access for all posts" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for authenticated users" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for authenticated users" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Enable read access for all messages" ON public.messages
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Enable update for authenticated users" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Conversations policies
CREATE POLICY "Enable read access for all conversations" ON public.conversations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid()::text = ANY(participants));

CREATE POLICY "Enable update for authenticated users" ON public.conversations
    FOR UPDATE USING (auth.uid()::text = ANY(participants));

-- Rides policies
CREATE POLICY "Enable read access for all rides" ON public.rides
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.rides
    FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Enable update for authenticated users" ON public.rides
    FOR UPDATE USING (auth.uid() = driver_id);

CREATE POLICY "Enable delete for authenticated users" ON public.rides
    FOR DELETE USING (auth.uid() = driver_id);

-- ========================================
-- 9. VERIFICATION QUERY
-- ========================================
SELECT 
    'VERIFICATION' as check_type,
    COUNT(*) as table_count,
    CASE 
        WHEN COUNT(*) = 5 THEN '✅ ALL TABLES CREATED SUCCESSFULLY'
        ELSE '❌ MISSING TABLES - Expected 5, Found ' || COUNT(*)
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'posts', 'conversations', 'messages', 'rides');

-- Check conversations.participants specifically
SELECT 
    'CRITICAL CHECK' as check_type,
    CASE 
        WHEN data_type = 'text[]' THEN '✅ CONVERSATIONS.PARTICIPANTS IS CORRECT (text[])'
        WHEN data_type = 'uuid[]' THEN '❌ CONVERSATIONS.PARTICIPANTS IS WRONG (uuid[])'
        ELSE '❌ CONVERSATIONS.PARTICIPANTS COLUMN NOT FOUND'
    END as participants_status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'conversations' 
AND column_name = 'participants'; 