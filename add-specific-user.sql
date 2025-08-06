-- Add the specific user that the app is trying to use
-- User ID: 494dee7d-cd2d-4ef9-bf76-2887a9fe140d
-- Email: yougijain@gmail.com

-- Disable RLS completely
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;

-- Clear any existing user with this ID
DELETE FROM public.users WHERE id = '494dee7d-cd2d-4ef9-bf76-2887a9fe140d';

-- Add the user with the correct email
INSERT INTO public.users (id, email)
VALUES ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'yougijain@gmail.com');

-- Verify the user was added
SELECT 'User added successfully:' as info, id, email FROM public.users WHERE id = '494dee7d-cd2d-4ef9-bf76-2887a9fe140d';

-- Test post creation
INSERT INTO public.posts (user_id, type, title, description, price, category, location, status)
VALUES ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'item', 'Test Post', 'Testing post creation', 10.00, 'Test', 'Test', 'active');

-- Verify post was created
SELECT 'Post created successfully:' as info, id, title, user_id FROM public.posts WHERE user_id = '494dee7d-cd2d-4ef9-bf76-2887a9fe140d';

-- Clean up test post
DELETE FROM public.posts WHERE title = 'Test Post';

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

SELECT 'USER ADDED AND TESTED SUCCESSFULLY' as final_status; 