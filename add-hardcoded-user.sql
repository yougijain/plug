-- Add the hardcoded user ID that the app is trying to use
-- This will fix the immediate foreign key issue

-- Disable RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Add the hardcoded user
INSERT INTO public.users (id, email)
VALUES ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'yougi@example.com')
ON CONFLICT (id) DO NOTHING;

-- Verify the user was added
SELECT 'Hardcoded user added:' as info, id, email FROM public.users WHERE id = '494dee7d-cd2d-4ef9-bf76-2887a9fe140d';

-- Test post creation with this user
INSERT INTO public.posts (user_id, type, title, description, price, category, location, status)
VALUES ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'item', 'Hardcoded Test', 'Testing with hardcoded user', 10.00, 'Test', 'Test', 'active');

SELECT 'Post creation test:' as info, 
       CASE WHEN COUNT(*) > 0 THEN 'SUCCESS!' ELSE 'FAILED' END as result
FROM public.posts WHERE user_id = '494dee7d-cd2d-4ef9-bf76-2887a9fe140d';

-- Clean up test post
DELETE FROM public.posts WHERE title = 'Hardcoded Test';

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

SELECT 'HARDCODED USER FIX COMPLETE' as status;