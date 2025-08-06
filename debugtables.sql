-- DEBUG SCRIPT: Check what exists and create tables step by step
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. CHECK WHAT TABLES EXIST
-- ========================================
SELECT 
    'EXISTING TABLES' as check_type,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ========================================
-- 2. CREATE TABLES ONE BY ONE
-- ========================================

-- First, create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  avatar TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check if users table was created
SELECT 
    'USERS TABLE CHECK' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') 
        THEN '✅ USERS TABLE CREATED'
        ELSE '❌ USERS TABLE NOT CREATED'
    END as status;

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
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

-- Check if posts table was created
SELECT 
    'POSTS TABLE CHECK' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') 
        THEN '✅ POSTS TABLE CREATED'
        ELSE '❌ POSTS TABLE NOT CREATED'
    END as status;

-- Create conversations table (THIS IS THE CRITICAL ONE)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participants TEXT[] NOT NULL, -- CORRECT: TEXT[] not UUID[]
  last_message_id UUID,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check if conversations table was created
SELECT 
    'CONVERSATIONS TABLE CHECK' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conversations') 
        THEN '✅ CONVERSATIONS TABLE CREATED'
        ELSE '❌ CONVERSATIONS TABLE NOT CREATED'
    END as status;

-- Check conversations.participants specifically
SELECT 
    'CONVERSATIONS.PARTICIPANTS CHECK' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'participants') 
        THEN 
            CASE 
                WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'participants') = 'text[]'
                THEN '✅ PARTICIPANTS IS CORRECT (text[])'
                ELSE '❌ PARTICIPANTS IS WRONG TYPE'
            END
        ELSE '❌ PARTICIPANTS COLUMN NOT FOUND'
    END as participants_status;

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id) NOT NULL,
  receiver_id UUID REFERENCES public.users(id) NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id) NOT NULL,
  post_id UUID REFERENCES public.posts(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);

-- Check if messages table was created
SELECT 
    'MESSAGES TABLE CHECK' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') 
        THEN '✅ MESSAGES TABLE CREATED'
        ELSE '❌ MESSAGES TABLE NOT CREATED'
    END as status;

-- Create rides table
CREATE TABLE IF NOT EXISTS public.rides (
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

-- Check if rides table was created
SELECT 
    'RIDES TABLE CHECK' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rides') 
        THEN '✅ RIDES TABLE CREATED'
        ELSE '❌ RIDES TABLE NOT CREATED'
    END as status;

-- ========================================
-- 3. FINAL VERIFICATION
-- ========================================
SELECT 
    'FINAL VERIFICATION' as check_type,
    COUNT(*) as table_count,
    CASE 
        WHEN COUNT(*) = 5 THEN '✅ ALL 5 TABLES EXIST'
        ELSE '❌ MISSING TABLES - Expected 5, Found ' || COUNT(*)
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'posts', 'conversations', 'messages', 'rides'); 