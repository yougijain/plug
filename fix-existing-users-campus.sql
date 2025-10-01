-- Fix existing users who don't have campus_id set
-- Run this in Supabase SQL Editor if you have existing test accounts

-- Option 1: Update specific user by email (RECOMMENDED)
-- Replace 'your.email@purdue.edu' with your actual email
UPDATE public.users 
SET campus_id = (
  SELECT id FROM public.campuses 
  WHERE domain = 'purdue.edu'  -- Change this to match your email domain
  LIMIT 1
)
WHERE email = 'your.email@purdue.edu'  -- Replace with your actual email
  AND campus_id IS NULL;

-- Option 2: Auto-assign campus based on email domain (BULK UPDATE)
-- This will update ALL users without campus_id
UPDATE public.users 
SET campus_id = (
  SELECT c.id 
  FROM public.campuses c
  WHERE LOWER(users.email) LIKE '%@' || c.domain
  LIMIT 1
)
WHERE campus_id IS NULL
  AND is_edu_email = true;

-- Option 3: Check which users need fixing
SELECT 
  id,
  email,
  name,
  university,
  campus_id,
  SPLIT_PART(email, '@', 2) as email_domain
FROM public.users
WHERE campus_id IS NULL;

-- After running the fix, verify it worked:
SELECT 
  u.id,
  u.email,
  u.name,
  c.name as campus_name,
  c.domain
FROM public.users u
LEFT JOIN public.campuses c ON u.campus_id = c.id
ORDER BY u.created_at DESC
LIMIT 10;

