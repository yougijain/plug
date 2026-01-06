# 🧪 TicketPlug - Step-by-Step Testing Guide

## 🎯 Testing Strategy

We'll test the app **end-to-end** starting from the first user interaction (Sign Up) through all features.

### Tools We'll Use:
1. **Browser DevTools** - Check console for errors, network requests
2. **Supabase Dashboard** - Verify database operations
3. **Manual Testing** - Click through all features
4. **Database Check Script** - Verify data persistence

---

## 📋 Testing Steps

### ✅ STEP 1: Sign Up Flow
**Goal**: Create a new account and verify email

**What to Test:**
1. Open app → Should show Login page
2. Click "Sign Up" tab
3. Fill form:
   - Name: "Test User"
   - Email: `test@iu.edu` (or `test@purdue.edu`)
   - Campus: Should auto-select from email domain
   - Date of Birth: Pick date (17+ years old)
   - Password: `testpassword123`
   - Check "Agree to Terms"
4. Click "Create Account"
5. **Expected**: 
   - Success message
   - Form switches to Sign In
   - Email verification sent

**What to Check:**
- [ ] Form validation works (try invalid inputs)
- [ ] Campus auto-selects from email domain
- [ ] No console errors
- [ ] Success message appears
- [ ] Check Supabase Dashboard → Auth → Users (should see new user)
- [ ] Check Supabase Dashboard → Database → users table (should see profile)

**Common Issues:**
- ❌ "Email already registered" → User exists, use different email or sign in
- ❌ "Campus not found" → Check campuses table has IU/Purdue
- ❌ "Profile creation failed" → Check RLS policies

---

### ✅ STEP 2: Email Verification
**Goal**: Verify email and complete sign up

**What to Test:**
1. Check email inbox for verification link
2. Click verification link
3. **Expected**: Redirects back to app, email verified

**What to Check:**
- [ ] Email received (check spam folder)
- [ ] Verification link works
- [ ] Redirects to app
- [ ] Check Supabase Dashboard → Auth → Users → Email verified = true

**Common Issues:**
- ❌ Email not received → Check Supabase email settings
- ❌ Link doesn't work → Check redirect URL in Supabase config
- ❌ "localhost unreachable" → Check Supabase redirect URLs include localhost

---

### ✅ STEP 3: Sign In Flow
**Goal**: Login with verified account

**What to Test:**
1. On Login page, use Sign In form
2. Enter email and password
3. Click "Sign In"
4. **Expected**: 
   - Redirects to Home page
   - User profile loaded
   - Navigation visible

**What to Check:**
- [ ] No console errors
- [ ] Redirects to Home (`/`)
- [ ] User data loaded (check Profile page)
- [ ] Navigation bar visible at bottom
- [ ] Check browser console → Network tab → Should see API calls

**Common Issues:**
- ❌ "Infinite loading" → Check `ensureUserProfile` function
- ❌ "Email not confirmed" → Verify email first
- ❌ "Profile not found" → Check user profile exists in database

---

### ✅ STEP 4: Home Feed (Browse Tickets)
**Goal**: View and interact with tickets

**What to Test:**
1. Should see Home page with ticket feed
2. Test search: Type event name
3. Test filter: Select category (Sports, Concert, etc.)
4. Click on a ticket card
5. **Expected**: Navigate to ticket detail page

**What to Check:**
- [ ] Tickets load (if any exist)
- [ ] Search filters tickets
- [ ] Category filter works
- [ ] Clicking ticket navigates to detail page
- [ ] No console errors
- [ ] Check Network tab → API calls to `/tickets`

**Common Issues:**
- ❌ "No tickets found" → Normal if database is empty
- ❌ "Search not working" → Check search logic in Home.tsx
- ❌ "Filter not working" → Check category filter logic

---

### ✅ STEP 5: Create Ticket
**Goal**: Create a new ticket listing

**What to Test:**
1. Click "Create" in navigation (or "Sell Your Tickets" button)
2. **Step 1**: Fill event details
   - Category: Sports
   - Event Name: "IU vs Purdue Basketball"
   - Date: Future date
   - Venue: "Assembly Hall"
3. Click "Next"
4. **Step 2**: Upload images
   - Click "Upload Images"
   - Select 1-2 images
   - Images should preview
5. Click "Next"
6. **Step 3**: Ticket details
   - Title: "Section 101, Row 5"
   - Description: "Great seats!"
   - Price: 50.00
   - Quantity: 2
7. Click "Post Ticket"
8. **Expected**: 
   - Success message
   - Redirects to Home
   - New ticket appears in feed

**What to Check:**
- [ ] Form validation works
- [ ] Images upload (check Supabase Storage)
- [ ] Ticket created in database
- [ ] Success message appears
- [ ] Ticket appears in Home feed
- [ ] Check Supabase Dashboard → Storage → post-images bucket
- [ ] Check Supabase Dashboard → Database → tickets table

**Common Issues:**
- ❌ "Images not uploading" → Check storage bucket exists
- ❌ "Ticket not created" → Check RLS policies
- ❌ "Form validation errors" → Check required fields

---

### ✅ STEP 6: Ticket Detail Page
**Goal**: View full ticket details and interact

**What to Test:**
1. Click on any ticket from Home feed
2. View ticket details:
   - Event info
   - Images
   - Price, quantity
   - Seller info
3. Click "Save" button (heart icon)
4. Click "Share" button
5. **Expected**: 
   - All details visible
   - Save works (heart fills)
   - Share opens share dialog

**What to Check:**
- [ ] All ticket data displays correctly
- [ ] Images load
- [ ] Seller contact info visible
- [ ] Save button works
- [ ] Share button works
- [ ] Check database → saved_tickets table

**Common Issues:**
- ❌ "Ticket not found" → Check ticket ID in URL
- ❌ "Save not working" → Check saved_tickets API
- ❌ "Images not loading" → Check storage bucket permissions

---

### ✅ STEP 7: Saved Tickets
**Goal**: View and manage saved tickets

**What to Test:**
1. Click "Saved" in navigation
2. View saved tickets list
3. Click "Unsave" on a ticket
4. Click "View Details" on a ticket
5. **Expected**: 
   - Saved tickets list shows
   - Unsave removes ticket
   - View Details navigates to ticket page

**What to Check:**
- [ ] Saved tickets load
- [ ] Unsave works
- [ ] Navigation works
- [ ] Empty state shows if no saved tickets
- [ ] Check database → saved_tickets table

---

### ✅ STEP 8: Profile Page
**Goal**: View and edit profile

**What to Test:**
1. Click "Profile" in navigation
2. View profile info:
   - Name, email, university
   - Stats (reputation, sales)
3. Click "Edit Profile"
4. Update:
   - Name
   - Snapchat handle
   - Instagram handle
   - Phone number
5. Save changes
6. Click "Sign Out"
7. **Expected**: 
   - Profile displays correctly
   - Edit works
   - Changes save
   - Sign out works

**What to Check:**
- [ ] Profile data loads
- [ ] Stats display correctly
- [ ] Edit form works
- [ ] Changes persist
- [ ] Sign out redirects to Login
- [ ] Check database → users table updated

---

## 🐛 Debugging Tips

### Check Browser Console:
- Open DevTools (F12)
- Look for red errors
- Check Network tab for failed API calls

### Check Supabase Dashboard:
- **Auth → Users**: See all users, email verification status
- **Database → Tables**: See all data
- **Storage → Buckets**: See uploaded images
- **Logs**: See API errors

### Check Database:
```bash
npm run db:check
```

---

## ✅ Success Criteria

All steps pass when:
1. ✅ User can sign up
2. ✅ Email verification works
3. ✅ User can sign in
4. ✅ Home feed loads
5. ✅ User can create tickets
6. ✅ User can view ticket details
7. ✅ User can save/unsave tickets
8. ✅ User can view saved tickets
9. ✅ User can edit profile
10. ✅ User can sign out

---

## 🚀 Let's Start Testing!

We'll go through each step together and fix any issues we find.

