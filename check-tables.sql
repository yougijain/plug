-- Comprehensive Database Schema Check
-- Run this in your Supabase SQL Editor to see what tables exist and their structure

-- ========================================
-- 1. LIST ALL TABLES IN PUBLIC SCHEMA
-- ========================================
SELECT 
    'ALL TABLES' as check_type,
    table_name,
    table_type,
    CASE 
        WHEN table_name IN ('users', 'posts', 'conversations', 'messages', 'rides') 
        THEN '✅ EXPECTED' 
        ELSE '❌ UNEXPECTED' 
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ========================================
-- 2. CHECK EACH EXPECTED TABLE STRUCTURE
-- ========================================

-- USERS TABLE
SELECT 
    'USERS TABLE' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name = 'id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'email' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'name' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'university' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'avatar' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'verified' AND data_type = 'boolean' THEN '✅'
        WHEN column_name = 'created_at' AND data_type LIKE '%timestamp%' THEN '✅'
        WHEN column_name = 'updated_at' AND data_type LIKE '%timestamp%' THEN '✅'
        ELSE '❌'
    END as matches_expected
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- POSTS TABLE
SELECT 
    'POSTS TABLE' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name = 'id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'user_id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'type' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'title' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'description' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'price' AND data_type LIKE '%decimal%' THEN '✅'
        WHEN column_name = 'category' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'location' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'images' AND data_type = 'text[]' THEN '✅'
        WHEN column_name = 'created_at' AND data_type LIKE '%timestamp%' THEN '✅'
        WHEN column_name = 'expires_at' AND data_type LIKE '%timestamp%' THEN '✅'
        WHEN column_name = 'status' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'tags' AND data_type = 'text[]' THEN '✅'
        WHEN column_name = 'is_flash_deal' AND data_type = 'boolean' THEN '✅'
        WHEN column_name = 'flash_deal_expires_at' AND data_type LIKE '%timestamp%' THEN '✅'
        ELSE '❌'
    END as matches_expected
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'posts'
ORDER BY ordinal_position;

-- CONVERSATIONS TABLE
SELECT 
    'CONVERSATIONS TABLE' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name = 'id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'participants' AND data_type = 'text[]' THEN '✅'
        WHEN column_name = 'participants' AND data_type = 'uuid[]' THEN '❌ SHOULD BE text[]'
        WHEN column_name = 'last_message_id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'unread_count' AND data_type = 'integer' THEN '✅'
        WHEN column_name = 'created_at' AND data_type LIKE '%timestamp%' THEN '✅'
        WHEN column_name = 'updated_at' AND data_type LIKE '%timestamp%' THEN '✅'
        ELSE '❌'
    END as matches_expected
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'conversations'
ORDER BY ordinal_position;

-- MESSAGES TABLE
SELECT 
    'MESSAGES TABLE' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name = 'id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'sender_id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'receiver_id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'conversation_id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'post_id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'content' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'created_at' AND data_type LIKE '%timestamp%' THEN '✅'
        WHEN column_name = 'read' AND data_type = 'boolean' THEN '✅'
        ELSE '❌'
    END as matches_expected
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'messages'
ORDER BY ordinal_position;

-- RIDES TABLE
SELECT 
    'RIDES TABLE' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name = 'id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'driver_id' AND data_type = 'uuid' THEN '✅'
        WHEN column_name = 'origin' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'destination' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'departure_time' AND data_type LIKE '%timestamp%' THEN '✅'
        WHEN column_name = 'available_seats' AND data_type = 'integer' THEN '✅'
        WHEN column_name = 'price' AND data_type LIKE '%decimal%' THEN '✅'
        WHEN column_name = 'description' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'status' AND data_type = 'text' THEN '✅'
        WHEN column_name = 'created_at' AND data_type LIKE '%timestamp%' THEN '✅'
        ELSE '❌'
    END as matches_expected
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'rides'
ORDER BY ordinal_position;

-- ========================================
-- 3. CHECK RLS POLICIES
-- ========================================
SELECT 
    'RLS POLICIES' as check_type,
    tablename,
    policyname,
    cmd,
    CASE 
        WHEN tablename IN ('users', 'posts', 'conversations', 'messages', 'rides') 
        AND policyname IS NOT NULL 
        THEN '✅ HAS POLICIES' 
        ELSE '❌ MISSING POLICIES' 
    END as status
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- 4. SUMMARY OF ISSUES
-- ========================================
SELECT 
    'SUMMARY' as check_type,
    CASE 
        WHEN COUNT(*) = 5 THEN '✅ ALL 5 TABLES EXIST'
        ELSE '❌ MISSING TABLES - Expected 5, Found ' || COUNT(*)
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'posts', 'conversations', 'messages', 'rides');

-- Check for the critical participants column issue
SELECT 
    'CRITICAL ISSUE CHECK' as check_type,
    CASE 
        WHEN data_type = 'text[]' THEN '✅ CONVERSATIONS.PARTICIPANTS IS CORRECT (text[])'
        WHEN data_type = 'uuid[]' THEN '❌ CONVERSATIONS.PARTICIPANTS IS WRONG (uuid[]) - NEEDS TO BE text[]'
        ELSE '❌ CONVERSATIONS.PARTICIPANTS COLUMN NOT FOUND'
    END as participants_status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'conversations' 
AND column_name = 'participants'; 