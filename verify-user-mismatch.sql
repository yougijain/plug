-- Check for user ID mismatch issue

-- 1. Show ALL users in the users table (bypass RLS)
SET row_security = off;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

SELECT 'ALL USERS IN DATABASE:' as info;
SELECT id, email FROM public.users;

-- 2. Check if there are multiple user IDs or mismatches
SELECT 'USER COUNT:' as info, COUNT(*) as total_users FROM public.users;

-- 3. Check the specific user we've been trying to use
SELECT 'SPECIFIC USER CHECK:' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.users WHERE id = '494dee7d-cd2d-4ef9-bf76-2887a9fe140d')
        THEN 'User 494dee7d exists'
        ELSE 'User 494dee7d DOES NOT EXIST'
    END as status;

-- 4. Check auth.users table to see what auth IDs exist
SELECT 'AUTH USERS:' as info;
SELECT id, email, created_at FROM auth.users;

-- 5. The problem might be that the auth.users ID doesn't match public.users ID
-- Let's check if there's a mismatch
SELECT 'MISMATCH CHECK:' as info;
SELECT 
    'Auth users not in public.users:' as issue,
    au.id as auth_id,
    au.email as auth_email
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

SELECT 
    'Public users not in auth.users:' as issue,
    pu.id as public_id,
    pu.email as public_email
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE au.id IS NULL;

-- 6. SOLUTION: Insert ALL auth users into public.users
INSERT INTO public.users (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- 7. Verify the fix
SELECT 'AFTER FIX - Users in public.users:' as info;
SELECT id, email FROM public.users;

SELECT 'FIX COMPLETE' as status;