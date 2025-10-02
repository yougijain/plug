-- Test script to check campuses table
-- Run this in your Supabase SQL editor

-- Check if campuses table exists
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'campuses' 
ORDER BY ordinal_position;

-- Check if campuses table has data
SELECT COUNT(*) as campus_count FROM public.campuses;

-- Show all campuses
SELECT id, name, domain, location, is_active FROM public.campuses ORDER BY name;

-- Check if campuses are active
SELECT COUNT(*) as active_campuses FROM public.campuses WHERE is_active = true;
