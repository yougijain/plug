-- Simple script to insert user record only
-- This script focuses on just getting the user into the users table

-- Temporarily disable RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Try the most basic insert possible
INSERT INTO public.users (id, email)
VALUES ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'yougi@example.com')
ON CONFLICT (id) DO NOTHING;

-- Check if the insert worked
SELECT 'User insert result:', id, email FROM public.users WHERE id = '494dee7d-cd2d-4ef9-bf76-2887a9fe140d';

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;