# Database Schema Comparison

## Expected vs Actual Schema

### What the App Expects:

```typescript
// From src/types/database.ts
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string                    // UUID
          email: string                 // TEXT
          name: string                  // TEXT
          university: string            // TEXT
          avatar?: string               // TEXT (nullable)
          verified: boolean             // BOOLEAN
          created_at: string            // TIMESTAMP
          updated_at: string            // TIMESTAMP
        }
      }
      posts: {
        Row: {
          id: string                    // UUID
          user_id: string               // UUID
          type: 'item' | 'service' | 'ride' | 'ticket' | 'book' | 'sublet'  // TEXT
          title: string                 // TEXT
          description: string           // TEXT
          price?: number                // DECIMAL
          category: string              // TEXT
          location: string              // TEXT
          images?: string[]             // TEXT[]
          created_at: string            // TIMESTAMP
          expires_at?: string           // TIMESTAMP
          status: 'active' | 'sold' | 'expired'  // TEXT
          tags: string[]                // TEXT[]
          is_flash_deal?: boolean       // BOOLEAN
          flash_deal_expires_at?: string // TIMESTAMP
        }
      }
      conversations: {
        Row: {
          id: string                    // UUID
          participants: string[]        // TEXT[] ⚠️ CRITICAL
          last_message_id?: string      // UUID
          unread_count: number          // INTEGER
          created_at: string            // TIMESTAMP
          updated_at: string            // TIMESTAMP
        }
      }
      messages: {
        Row: {
          id: string                    // UUID
          sender_id: string             // UUID
          receiver_id: string           // UUID
          conversation_id: string       // UUID
          post_id?: string              // UUID
          content: string               // TEXT
          created_at: string            // TIMESTAMP
          read: boolean                 // BOOLEAN
        }
      }
      rides: {
        Row: {
          id: string                    // UUID
          driver_id: string             // UUID
          origin: string                // TEXT
          destination: string           // TEXT
          departure_time: string        // TIMESTAMP
          available_seats: number       // INTEGER
          price: number                 // DECIMAL
          description?: string          // TEXT
          status: 'active' | 'full' | 'completed'  // TEXT
          created_at: string            // TIMESTAMP
        }
      }
    }
  }
}
```

## Critical Issues to Check:

### 1. **CRITICAL: conversations.participants**
- **Expected**: `TEXT[]` (array of strings)
- **If Wrong**: `UUID[]` (array of UUIDs)
- **Impact**: "Failed to fetch" errors when app tries to query with string arrays

### 2. **Missing Tables**
- Check if all 5 tables exist: `users`, `posts`, `conversations`, `messages`, `rides`

### 3. **Missing Columns**
- Check if all required columns exist in each table
- Check data types match exactly

### 4. **RLS Policies**
- Check if Row Level Security policies are configured
- Check if policies allow the operations the app needs

## How to Run the Check:

1. **Copy the `check-tables.sql` script**
2. **Paste into Supabase SQL Editor**
3. **Run the script**
4. **Look for ❌ marks** - these indicate problems

## Expected Results:

If everything is correct, you should see:
- ✅ ALL 5 TABLES EXIST
- ✅ All columns match expected types
- ✅ CONVERSATIONS.PARTICIPANTS IS CORRECT (text[])
- ✅ All tables have RLS policies

## If Issues Found:

### If `participants` is wrong type:
```sql
-- Fix conversations.participants column
ALTER TABLE public.conversations 
ALTER COLUMN participants TYPE text[] USING participants::text[];
```

### If tables missing:
```sql
-- Run the complete database-setup.sql script
```

### If RLS policies missing:
```sql
-- The database-setup.sql includes the policies
``` 