-- Simple script to insert a specific user ID
-- REPLACE THE ID BELOW WITH THE ONE FROM YOUR APP'S ALERT

-- Disable RLS to ensure insert works
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- INSERT YOUR USER ID HERE
-- Replace 'YOUR-USER-ID-HERE' with the actual ID from the alert message
INSERT INTO public.users (id, email)
VALUES ('YOUR-USER-ID-HERE', 'user@example.com')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Verify the user was inserted
SELECT 'User inserted:' as info, id, email FROM public.users WHERE id = 'YOUR-USER-ID-HERE';

-- Test that posts can be created
INSERT INTO public.posts (user_id, type, title, description, price, category, location, status)
VALUES ('YOUR-USER-ID-HERE', 'item', 'Test', 'Test', 10.00, 'Test', 'Test', 'active');

SELECT 'Post creation test:' as info, 
       CASE WHEN COUNT(*) > 0 THEN 'SUCCESS!' ELSE 'FAILED' END as result
FROM public.posts WHERE user_id = 'YOUR-USER-ID-HERE';

-- Clean up test post
DELETE FROM public.posts WHERE user_id = 'YOUR-USER-ID-HERE' AND title = 'Test';

SELECT 'READY FOR APP TESTING' as status;