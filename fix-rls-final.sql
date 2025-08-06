-- Final RLS fix to allow post creation
-- The issue is RLS is blocking foreign key constraint validation

-- 1. Check current user exists
SELECT 'Current user status:' as info, id, email FROM public.users WHERE id = '494dee7d-cd2d-4ef9-bf76-2887a9fe140d';

-- 2. Temporarily disable RLS on users table to allow FK validation
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 3. Test post creation works now
INSERT INTO public.posts (user_id, type, title, description, price, category, location, status)
VALUES (
    '494dee7d-cd2d-4ef9-bf76-2887a9fe140d',
    'item',
    'RLS Test Post',
    'Testing if post creation works with RLS disabled on users',
    15.00,
    'Test',
    'Test Location',
    'active'
);

-- 4. Verify test post was created
SELECT 'Test post created:' as info, id, title, user_id FROM public.posts WHERE title = 'RLS Test Post';

-- 5. Clean up test post
DELETE FROM public.posts WHERE title = 'RLS Test Post';

-- 6. Create a new RLS policy that allows FK validation
-- Re-enable RLS but with a policy that allows foreign key checks
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow foreign key validation for users" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own record" ON public.users;
DROP POLICY IF EXISTS "Users can update their own record" ON public.users;

-- Create new policies that work with foreign keys
CREATE POLICY "Allow read for FK validation" ON public.users
    FOR SELECT USING (true);  -- Allow all reads for FK constraints

CREATE POLICY "Users can insert own record" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own record" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 7. Test that post creation still works with new RLS policies
INSERT INTO public.posts (user_id, type, title, description, price, category, location, status)
VALUES (
    '494dee7d-cd2d-4ef9-bf76-2887a9fe140d',
    'item',
    'Final Test Post',
    'Testing if post creation works with new RLS policies',
    20.00,
    'Test',
    'Test Location',
    'active'
);

-- 8. Verify final test
SELECT 'Final test result:' as info, 
       CASE WHEN COUNT(*) > 0 THEN 'SUCCESS - Post creation works!' ELSE 'FAILED' END as status
FROM public.posts WHERE title = 'Final Test Post';

-- 9. Clean up final test post
DELETE FROM public.posts WHERE title = 'Final Test Post';

SELECT 'RLS FIX COMPLETE' as final_status;