-- Fix RLS policies to allow proper foreign key validation
-- The issue is that RLS is blocking the foreign key constraint check

-- 1. Temporarily disable RLS on both tables to allow the operation
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;

-- 2. Verify our user exists
SELECT 'Current users in table:' as info, id, email FROM public.users;

-- 3. Try to insert a test post to see if it works without RLS
INSERT INTO public.posts (user_id, type, title, description, price, category, location, status)
VALUES ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'item', 'Test Post', 'This is a test post', 10.00, 'Test', 'Test Location', 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. Check if the post was created
SELECT 'Test post result:' as info, id, title, user_id FROM public.posts WHERE title = 'Test Post';

-- 5. Clean up the test post
DELETE FROM public.posts WHERE title = 'Test Post';

-- 6. Re-enable RLS with proper policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 7. Create policies that allow the foreign key constraint to work
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own record" ON public.users;
DROP POLICY IF EXISTS "Users can update their own record" ON public.users;

-- Create a policy that allows viewing users for foreign key validation
CREATE POLICY "Allow foreign key validation" ON public.users
    FOR SELECT USING (true);  -- Allow all selects for FK validation

-- Create policies for user management
CREATE POLICY "Users can insert their own record" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own record" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Drop existing post policies
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;

-- Create post policies
CREATE POLICY "Posts are viewable by everyone" ON public.posts
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Final verification
SELECT 'Final verification - Users:' as info, COUNT(*) as user_count FROM public.users;
SELECT 'Final verification - Posts:' as info, COUNT(*) as post_count FROM public.posts;