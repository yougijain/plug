-- Complete fix for the foreign key issue
-- The problem: We need to sync auth.users with public.users

-- 1. Disable RLS to ensure we can see and modify everything
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;

-- 2. Show all auth users (these are the real user IDs from Supabase Auth)
SELECT 'AUTH USERS (Real IDs from Supabase Auth):' as info;
SELECT id, email, created_at FROM auth.users;

-- 3. Show all public users (our custom users table)
SELECT 'PUBLIC USERS (Custom users table):' as info;
SELECT id, email FROM public.users;

-- 4. CRITICAL FIX: Sync auth.users to public.users
-- This ensures every authenticated user has a corresponding record in public.users
INSERT INTO public.users (id, email)
SELECT 
    au.id,
    COALESCE(au.email, 'user@example.com')
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- 5. Verify the sync worked
SELECT 'AFTER SYNC - Public users:' as info;
SELECT id, email FROM public.users;

-- 6. Re-enable RLS with proper policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 7. Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow foreign key validation for users" ON public.users;
DROP POLICY IF EXISTS "Allow foreign key validation" ON public.users;
DROP POLICY IF EXISTS "Allow read for FK validation" ON public.users;
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own record" ON public.users;
DROP POLICY IF EXISTS "Users can insert own record" ON public.users;
DROP POLICY IF EXISTS "Users can update their own record" ON public.users;
DROP POLICY IF EXISTS "Users can update own record" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- 8. Create ONE simple policy that allows ALL reads (needed for FK validation)
CREATE POLICY "public_read" ON public.users
    FOR SELECT USING (true);

-- 9. Create policies for insert/update (only own records)
CREATE POLICY "own_insert" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "own_update" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 10. Fix posts policies too
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;

CREATE POLICY "posts_select" ON public.posts
    FOR SELECT USING (status = 'active');

CREATE POLICY "posts_insert" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "posts_update" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "posts_delete" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- 11. Test that everything works
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get the first auth user ID for testing
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Try to insert a test post
        INSERT INTO public.posts (id, user_id, type, title, description, price, category, location, status)
        VALUES (
            gen_random_uuid(),
            test_user_id,
            'item',
            'Final Test Post',
            'Testing with real auth user ID',
            25.00,
            'Test',
            'Test Location',
            'active'
        );
        
        RAISE NOTICE 'SUCCESS: Test post created with user_id %', test_user_id;
        
        -- Clean up
        DELETE FROM public.posts WHERE title = 'Final Test Post';
    ELSE
        RAISE NOTICE 'No auth users found to test with';
    END IF;
END $$;

SELECT 'FIX COMPLETE - All auth users synced to public.users' as final_status;