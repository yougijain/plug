-- Safe database inspection that won't fail on missing tables

-- 1. Show all tables
SELECT '=== ALL TABLES IN PUBLIC SCHEMA ===' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- 2. Show users table structure (if exists)
SELECT '=== USERS TABLE STRUCTURE ===' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public')
        THEN 'users table exists'
        ELSE 'users table does not exist'
    END as users_status;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users' 
ORDER BY ordinal_position;

-- 3. Check for posts table
SELECT '=== POSTS TABLE STATUS ===' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts' AND table_schema = 'public')
        THEN 'posts table exists'
        ELSE 'posts table DOES NOT EXIST'
    END as posts_status;

-- 4. Show RLS status for existing tables
SELECT '=== RLS STATUS ===' as info;
SELECT tablename, rowsecurity as rls_enabled FROM pg_tables WHERE schemaname = 'public';

-- 5. Show user count safely
SELECT '=== USERS DATA ===' as info;
SELECT COUNT(*) as user_count FROM public.users;

-- 6. Try to show actual user data
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
SELECT '=== ACTUAL USERS ===' as info;
SELECT id, email FROM public.users;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

SELECT '=== SUMMARY ===' as info;
SELECT 'Inspection complete - posts table missing' as conclusion;