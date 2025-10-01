# Campus Connect - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Switch to MVP Branch
```bash
git checkout tickets-mvp
```

### Step 2: Install Dependencies (if needed)
```bash
npm install
```

### Step 3: Run Database Migration
1. Open your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Open `supabase/migrations/001_campus_connect_schema.sql`
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click **Run**
7. Verify success - check Table Editor for new tables

### Step 4: Verify Environment Variables
Check that `.env` or `.env.local` has:
```bash
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

### Step 5: Start Development Server
```bash
npm start
```

### Step 6: Test the New Login Flow
1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Try with a .edu email (e.g., test@purdue.edu)
4. Select your campus
5. Enter date of birth (must be 17+)
6. Create account

---

## ✅ What's Working Now

- ✅ New database schema (campuses, tickets, events, reports, reputation)
- ✅ TypeScript types for all new tables
- ✅ API functions for tickets, campuses, reports
- ✅ React hooks for data fetching
- ✅ Updated Login page with .edu validation & campus selection
- ✅ Age 17+ gating

---

## 🚧 What Still Needs Work

### Critical (Do First):
1. **Create Ticket Page** - Update `src/pages/Post.tsx`
2. **Home Feed** - Update `src/pages/Home.tsx` for tickets
3. **Ticket Detail** - Update `src/pages/PostDetail.tsx` with contact info
4. **Privacy Policy** - Create `src/pages/Privacy.tsx`
5. **Terms of Service** - Create `src/pages/Terms.tsx`

### Important (Do Second):
6. Profile page updates
7. Account deletion
8. Report functionality
9. Admin moderation page
10. Navigation cleanup

---

## 🐛 Known Issues

### useAuth Hook Needs Update
The `createUser` call in `useAuth.ts` needs to pass the new required fields:
- `campus_id`
- `date_of_birth`

**Quick Fix:**
In `src/hooks/useAuth.ts`, update the `createUser` call around line 144:
```typescript
await userApi.createUser({
  id: data.user.id,
  email: userData.email,
  name: userData.name,
  university: userData.university,
  campus_id: userData.campus_id,  // ADD THIS
  date_of_birth: userData.date_of_birth,  // ADD THIS
  avatar: userData.avatar,
})
```

And update the `userData` type to include these fields.

---

## 📚 Documentation

- **Full Progress:** See `CAMPUS_CONNECT_MVP_PROGRESS.md`
- **TODO List:** See the interactive TODO list in your editor
- **Database Schema:** See `supabase/migrations/001_campus_connect_schema.sql`
- **API Reference:** See `src/lib/api.ts`

---

## 🆘 Troubleshooting

### "Table doesn't exist" Error
- Run the database migration (Step 3)

### "Campus dropdown is empty"
- Check that campuses were seeded (see migration SQL)
- Verify Supabase RLS policies allow reading campuses

### Type Errors
- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript types are updated (`src/types/database.ts`)

### API Errors
- Check Supabase project URL and anon key in `.env`
- Verify RLS policies in Supabase dashboard
- Check browser console for detailed error messages

---

## 📞 Need Help?

1. Check `CAMPUS_CONNECT_MVP_PROGRESS.md` for detailed info
2. Review the TODO list for what's completed/pending
3. Check console logs for errors
4. Verify database migration ran successfully

---

## 🎯 Your Next Task

**Transform the Post Page to Create Ticket:**

File: `src/pages/Post.tsx` → Rename to `src/pages/CreateTicket.tsx`

Changes needed:
- Remove category grid (tickets only)
- Add event fields: name, date, venue, category
- Add quantity field
- Update form validation
- Call `ticketsApi.create()` instead of `postsApi.create()`

This is the most critical piece - once ticket creation works, you can test the whole flow!

