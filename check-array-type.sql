-- Check the actual array element type of participants column
-- Run this in your Supabase SQL Editor

-- Get detailed column information
SELECT 
    'DETAILED PARTICIPANTS CHECK' as check_type,
    column_name,
    data_type,
    udt_name,
    CASE 
        WHEN udt_name = 'text' THEN '✅ CORRECT - text[]'
        WHEN udt_name = 'uuid' THEN '❌ WRONG - uuid[]'
        ELSE '❓ UNKNOWN TYPE: ' || udt_name
    END as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'conversations' 
AND column_name = 'participants';

-- Test inserting a text array to see if it works
INSERT INTO public.conversations (participants, unread_count) 
VALUES (ARRAY['test-user-1', 'test-user-2'], 0)
ON CONFLICT DO NOTHING;

-- Check if the insert worked
SELECT 
    'INSERT TEST' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.conversations WHERE participants = ARRAY['test-user-1', 'test-user-2']) 
        THEN '✅ TEXT ARRAY INSERT WORKED'
        ELSE '❌ TEXT ARRAY INSERT FAILED'
    END as status;

-- Show the test data
SELECT 
    'TEST DATA' as check_type,
    id,
    participants,
    pg_typeof(participants) as actual_type
FROM public.conversations 
WHERE participants = ARRAY['test-user-1', 'test-user-2'];

-- Clean up test data
DELETE FROM public.conversations WHERE participants = ARRAY['test-user-1', 'test-user-2']; 