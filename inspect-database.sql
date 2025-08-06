-- Comprehensive database inspection script
-- This will show us exactly what exists in your Supabase database

-- 1. List all tables in the public schema
SELECT 'TABLES IN PUBLIC SCHEMA:' as section;
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. List all columns for each table we find
SELECT 'USERS TABLE STRUCTURE:' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

SELECT 'POSTS TABLE STRUCTURE:' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'posts'
ORDER BY ordinal_position;

-- 3. Check for foreign key constraints
SELECT 'FOREIGN KEY CONSTRAINTS:' as section;
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public';

-- 4. Check RLS status
SELECT 'ROW LEVEL SECURITY STATUS:' as section;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public';

-- 5. List RLS policies
SELECT 'RLS POLICIES:' as section;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public';

-- 6. Check actual data in tables
SELECT 'DATA IN USERS TABLE:' as section;
SELECT COUNT(*) as user_count FROM public.users;

-- Try to show users data (might fail due to RLS)
DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Temporarily disable RLS to see data
    EXECUTE 'ALTER TABLE public.users DISABLE ROW LEVEL SECURITY';
    
    -- Show users
    RAISE NOTICE 'Users in table:';
    FOR rec IN SELECT id, email FROM public.users LOOP
        RAISE NOTICE 'User: % - %', rec.id, rec.email;
    END LOOP;
    
    -- Re-enable RLS
    EXECUTE 'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not access users table: %', SQLERRM;
END $$;

-- Check posts table existence and data
SELECT 'DATA IN POSTS TABLE:' as section;
DO $$
BEGIN
    EXECUTE 'SELECT COUNT(*) FROM public.posts';
    RAISE NOTICE 'Posts table exists and accessible';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Posts table issue: %', SQLERRM;
END $$;

-- 7. Check auth schema (if accessible)
SELECT 'AUTH SCHEMA TABLES:' as section;
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'auth'
ORDER BY table_name;

-- Final summary
SELECT 'INSPECTION COMPLETE' as final_status;