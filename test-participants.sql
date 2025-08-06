-- Quick test to verify conversations.participants column type
-- Run this in your Supabase SQL Editor

-- Check conversations.participants specifically
SELECT 
    'CONVERSATIONS.PARTICIPANTS CHECK' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'participants') 
        THEN 
            CASE 
                WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'participants') = 'text[]'
                THEN '✅ PARTICIPANTS IS CORRECT (text[])'
                ELSE '❌ PARTICIPANTS IS WRONG TYPE'
            END
        ELSE '❌ PARTICIPANTS COLUMN NOT FOUND'
    END as participants_status;

-- Show the actual data type
SELECT 
    'PARTICIPANTS DATA TYPE' as check_type,
    data_type,
    CASE 
        WHEN data_type = 'text[]' THEN '✅ CORRECT'
        WHEN data_type = 'uuid[]' THEN '❌ WRONG - SHOULD BE text[]'
        ELSE '❌ UNEXPECTED TYPE'
    END as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'conversations' 
AND column_name = 'participants'; 