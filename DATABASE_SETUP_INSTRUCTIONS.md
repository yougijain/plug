# Database Setup Instructions - TicketPlug

## 🚀 Quick Setup (Recommended)

### Step 1: Run the Full Setup Script

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project
   - Navigate to **SQL Editor**

2. **Run the Setup Script**
   - Open the file: `supabase/migrations/000_full_setup.sql`
   - Copy the **entire contents**
   - Paste into Supabase SQL Editor
   - Click **Run** (or press Ctrl+Enter)

3. **Verify Setup**
   ```bash
   npm run db:check
   ```

---

## ⚠️ Important Notes

### What This Script Does:
- ✅ **DROPS** all existing tables (deletes all data)
- ✅ **CREATES** all required tables fresh
- ✅ **SETS UP** indexes, functions, triggers
- ✅ **CONFIGURES** Row Level Security (RLS) policies
- ✅ **SEEDS** initial campus data (IU and Purdue active)

### When to Use:
- ✅ Fresh database setup
- ✅ Development/testing
- ✅ Resetting database
- ❌ **DO NOT USE** on production with real user data!

---

## 📋 What Gets Created

### Tables:
1. `campuses` - University/college information
2. `users` - User profiles
3. `events` - Event information
4. `tickets` - Ticket listings
5. `reports` - User/ticket reports
6. `reputation` - Reputation tracking
7. `saved_tickets` - Saved/bookmarked tickets

### Features:
- ✅ All indexes for performance
- ✅ Auto-update timestamps (triggers)
- ✅ Helper functions (mark sold, ban user, etc.)
- ✅ Row Level Security (RLS) policies
- ✅ Foreign key constraints
- ✅ Data validation (CHECK constraints)

---

## 🧪 After Running the Script

### Test the Setup:
```bash
npm run db:check
```

### Expected Output:
```
✅ Supabase connection successful!
✅ campuses: Table exists and accessible
✅ users: Table exists and accessible
✅ events: Table exists and accessible
✅ tickets: Table exists and accessible
✅ reports: Table exists and accessible
✅ reputation: Table exists and accessible
✅ saved_tickets: Table exists and accessible
✅ Found 2 active campus(es):
   - Indiana University (iu.edu)
   - Purdue University (purdue.edu)
```

---

## 🔧 Troubleshooting

### Error: "permission denied"
- **Fix**: Make sure you're using the SQL Editor in Supabase Dashboard (not API)

### Error: "relation already exists"
- **Fix**: The script should handle this, but if it persists, manually drop tables first

### Error: "function already exists"
- **Fix**: The script drops functions first, should be fine

### Tables created but test fails
- **Fix**: Check RLS policies - they might be blocking access
- Run: `ALTER TABLE public.campuses DISABLE ROW LEVEL SECURITY;` (temporarily for testing)

---

## 📝 Manual Setup (Alternative)

If you prefer to set up manually:
1. Use the schema in `src/types/database.ts` as reference
2. Create tables one by one
3. Add indexes
4. Set up RLS policies
5. Seed campus data

---

## ✅ Verification Checklist

After running the script, verify:
- [ ] All 7 tables exist
- [ ] Can query campuses (should see IU and Purdue)
- [ ] RLS policies are enabled
- [ ] Functions work (test in SQL Editor)
- [ ] `npm run db:check` passes

---

**Ready to set up? Run the SQL script in Supabase Dashboard!**
