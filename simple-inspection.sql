-- Simple database inspection with clear output

-- 1. Show all tables
SELECT '=== TABLES ===' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- 2. Show users table structure
SELECT '=== USERS TABLE COLUMNS ===' as info;
SELECT column_name, data_type, is_nullable FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users' ORDER BY ordinal_position;

-- 3. Show posts table structure
SELECT '=== POSTS TABLE COLUMNS ===' as info;
SELECT column_name, data_type, is_nullable FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'posts' ORDER BY ordinal_position;

-- 4. Show RLS status
SELECT '=== RLS STATUS ===' as info;
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- 5. Show user count
SELECT '=== USER COUNT ===' as info;
SELECT COUNT(*) as users FROM public.users;

-- 6. Show posts count (if table exists)
SELECT '=== POSTS COUNT ===' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts' AND table_schema = 'public')
        THEN (SELECT COUNT(*)::text FROM public.posts)
        ELSE 'posts table does not exist'
    END as posts_count;