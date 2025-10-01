# Campus Connect - Tickets MVP Transformation Progress

## Overview
This document tracks the transformation of the "Plug" marketplace into "Campus Connect", a ticket-only MVP focused on verified campus communities.

**Branch:** `tickets-mvp`

---

## ✅ COMPLETED

### 1. Database Architecture (✓)
- **Location:** `supabase/migrations/001_campus_connect_schema.sql`
- Created comprehensive schema with:
  - `campuses` table - Verified universities with .edu domains
  - `events` table - Campus events for tickets
  - `tickets` table - Event ticket listings (replaces posts)
  - `reports` table - User and ticket moderation
  - `reputation` table - User reputation tracking
  - `saved_tickets` table - Bookmarked tickets
  - Updated `users` table with campus relationships, reputation scores, contact info
  
- **RLS Policies:** Full row-level security implemented
- **Functions:** `is_valid_edu_email()`, `mark_ticket_sold()`, `ban_user()`
- **Seed Data:** 6 initial campuses (Purdue, IU, Michigan, OSU, MSU, Illinois)

**Action Required:** Run this migration in your Supabase project:
```bash
# In Supabase SQL Editor, run:
supabase/migrations/001_campus_connect_schema.sql
```

### 2. TypeScript Types (✓)
- **Updated:** `src/types/database.ts` - Full type definitions for new schema
- **Updated:** `src/types/index.ts` - Helper types and interfaces

### 3. API Layer (✓)
- **Location:** `src/lib/api.ts`
- **New APIs:**
  - `campusesApi` - Get campuses, search by domain
  - `ticketsApi` - CRUD for tickets, mark sold, search/filter
  - `reportsApi` - Create and manage reports
  - `savedTicketsApi` - Save/unsave tickets
- **Updated:** `userApi` - Added campus relationships, account deletion

### 4. React Hooks (✓)
- **New:** `src/hooks/useTickets.ts` - Ticket management with React Query
- **New:** `src/hooks/useCampuses.ts` - Campus data fetching
- **New:** `src/hooks/useReports.ts` - Report creation and management
- **Existing:** `src/hooks/useAuth.ts` - (Needs minor updates for new User type)

### 5. Login Page (✓)
- **Location:** `src/pages/Login.tsx`
- **Features:**
  - Campus Connect branding (gradient purple/indigo theme)
  - .edu email validation
  - Campus dropdown (auto-selected from email domain)
  - Age 17+ gating (date of birth field)
  - Terms & Privacy Policy checkbox
  - Modern gradient UI with animations

---

## 🚧 IN PROGRESS / TODO

### 6. Create Ticket Page (Pending)
**File:** `src/pages/Post.tsx` → Rename to `CreateTicket.tsx`

**Required Changes:**
- Remove category selection (tickets only)
- Add event-specific fields:
  - Event name (required)
  - Event date & time (required)
  - Event venue (optional)
  - Event category (sports, concert, party, theater, other)
  - Quantity of tickets (default 1)
  - Price per ticket
- Keep image upload functionality
- Update API calls to use `ticketsApi.create()`
- Update form validation for ticket-specific data

### 7. Home Feed (Pending)
**File:** `src/pages/Home.tsx`

**Required Changes:**
- Show only tickets (filter by `status = 'active'`)
- Display event details prominently:
  - Event name
  - Event date/time
  - Venue
  - Price per ticket
  - Quantity available
- Remove "Live Now" banner
- Update search to filter tickets by event name, venue, description
- Filter by campus (show only user's campus)
- Add "Report" button to ticket cards

### 8. Ticket Detail Page (Critical)
**File:** `src/pages/PostDetail.tsx` → Rename to `TicketDetail.tsx`

**Required Changes:**
- Display full ticket information
- Show seller reputation score and badges
- **Replace messaging with contact info:**
  - Show seller's Snapchat handle
  - Show seller's Instagram handle
  - Show seller's phone number (if provided)
  - Add "Contact on Venmo/Zelle" instructions
- Add "Report Ticket" button
- Add "Mark as Sold" button (for seller only)
- Show "# sold / total quantity"
- Update API to use `ticketsApi.getById()`

### 9. Profile Page (Pending)
**File:** `src/pages/Profile.tsx`

**Required Changes:**
- Display reputation score prominently
- Show badges (e.g., "Verified Seller", "Top Seller")
- Display successful sales count
- Add editable contact info section:
  - Snapchat handle (optional)
  - Instagram handle (optional)
  - Phone number (optional)
- Add "Delete Account" button
- Link to Privacy Policy and Terms
- Show user's active listings
- Show user's sales history

### 10. Settings/Account Page (New)
**File:** `src/pages/Settings.tsx` (Create new)

**Required Features:**
- Edit contact information
- Change password
- Email preferences
- **Delete Account** (with confirmation modal)
- Links to legal pages
- Support email: support@campusconnect.app

### 11. Saved/Bookmarked Tickets (Update)
**File:** `src/pages/Saved.tsx`

**Required Changes:**
- Update to use `savedTicketsApi.getSaved()`
- Display saved tickets as cards
- Remove cart functionality
- Simple list of bookmarked tickets

### 12. Admin Moderation Page (New)
**File:** `src/pages/Admin.tsx` (Create new)

**Required Features:**
- View all pending reports
- Review reported tickets/users
- Ban users (calls `ban_user()` function)
- Remove tickets
- Add admin notes
- Mark reports as resolved/dismissed
- Dashboard with stats (# reports, # bans, etc.)

**Note:** Add admin role check in RLS policies

### 13. Legal Pages (Critical for App Store)
**Files to Create:**
- `src/pages/Privacy.tsx` - Privacy Policy
- `src/pages/Terms.tsx` - Terms of Service

**Required Content:**
- **Privacy Policy:**
  - Data collection (email, name, campus, DOB, contact info)
  - How data is used
  - Data sharing (none for MVP)
  - User rights (access, deletion)
  - Cookie policy
  - Contact: support@campusconnect.app
  
- **Terms of Service:**
  - Age requirement (17+)
  - .edu email requirement
  - Off-platform payment disclaimer
  - No liability for transactions
  - Prohibited content
  - Account termination
  - Dispute resolution

### 14. Navigation (Update)
**File:** `src/components/Navigation.tsx`

**Required Changes:**
- Remove "Messages" icon/route
- Remove "Cart" icon
- Keep: Home, Create Ticket, Saved, Profile
- Simplify to 4 main nav items
- Update icons and labels

### 15. App Routing (Update)
**File:** `src/App.tsx`

**Required Changes:**
- Remove unused routes:
  - `/messages`
  - `/cart`
  - `/cruze`
  - `/live`
  - `/explore`
- Add new routes:
  - `/tickets/:id` (ticket detail)
  - `/create` (create ticket)
  - `/saved` (saved tickets)
  - `/profile` (user profile)
  - `/settings` (account settings)
  - `/admin` (moderation, role-gated)
  - `/privacy` (privacy policy)
  - `/terms` (terms of service)
- Update branding (page title, meta tags)

### 16. Branding Updates
**Files to Update:**
- App title: "Campus Connect" everywhere
- Color scheme: Indigo/Purple gradient theme
- Logo: 🎟️ ticket emoji (replace Plug logo)
- Tagline: "Buy and sell tickets on your campus"
- Update `public/index.html` metadata
- Update README.md

### 17. Remove Unused Code
**Files to Delete:**
- `src/pages/Messages.tsx`
- `src/pages/Cart.tsx`
- `src/pages/Cruze.tsx`
- `src/pages/LiveNow.tsx`
- `src/pages/Explore.tsx`
- `src/hooks/useMessages.ts`
- `src/components/TwoFactorAuth.tsx` (if not using 2FA)

**Code to Remove:**
- All references to `messagesApi`
- All references to `ridesApi`
- Flash deal logic
- Live Now functionality

---

## 🎯 CRITICAL PATH TO MVP LAUNCH

### Phase 1: Core Functionality (Week 1)
1. ✅ Database schema migration
2. ⏳ Update CreateTicket page (transform Post.tsx)
3. ⏳ Update Home feed for tickets
4. ⏳ Update/create TicketDetail page with contact info
5. ⏳ Update Profile with reputation
6. ⏳ Test full ticket flow: create → view → save → mark sold

### Phase 2: Compliance & Safety (Week 1-2)
7. ⏳ Create Privacy Policy page
8. ⏳ Create Terms of Service page
9. ⏳ Implement Report functionality
10. ⏳ Create Admin moderation page
11. ⏳ Add Account Deletion
12. ⏳ Test age gating (already in Login)

### Phase 3: Polish & Testing (Week 2)
13. ⏳ Update Navigation
14. ⏳ Update App routing
15. ⏳ Rebrand throughout (Campus Connect)
16. ⏳ Remove unused code
17. ⏳ End-to-end testing
18. ⏳ Fix any linter errors

### Phase 4: Deployment Prep (Week 2-3)
19. ⏳ Environment variables setup
20. ⏳ Build production version
21. ⏳ TestFlight setup
22. ⏳ App Store submission preparation
23. ⏳ Write App Review notes explaining off-platform payments

---

## 📝 IMPORTANT NOTES

### Database Migration
**You MUST run the SQL migration before the app will work:**
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy contents of `supabase/migrations/001_campus_connect_schema.sql`
4. Run the SQL
5. Verify tables created in Table Editor

### useAuth Hook Update Needed
The `useAuth` hook needs minor updates to work with the new `User` type that includes:
- `campus_id`
- `date_of_birth`
- `reputation_score`
- Contact info fields

Update the `createUser` call in `useAuth.ts` to pass all required fields.

### API Testing
Before building UI, test the API endpoints:
```typescript
// Test in browser console
import { ticketsApi, campusesApi } from './lib/api'

// Get campuses
const campuses = await campusesApi.getAll()
console.log(campuses)

// Create test ticket
const ticket = await ticketsApi.create({
  seller_id: 'YOUR_USER_ID',
  campus_id: 'CAMPUS_ID',
  title: 'Test Ticket',
  event_name: 'Basketball Game',
  event_date: '2025-10-15T19:00:00Z',
  price: 25,
  quantity: 2
})
```

### Off-Platform Payments
**App Store Compliance:** You're using off-platform payments (Venmo/Zelle). In App Review notes, clearly state:
- "This app facilitates peer-to-peer ticket sales"
- "All payments happen off-platform via Venmo, Zelle, or cash"
- "We do not process any payments or take any fees"
- "Users exchange contact info and arrange payment directly"

### Rate Limiting
Consider adding rate limiting to prevent abuse:
- Max 10 tickets per user per day
- Max 5 reports per user per day
- Use Supabase Edge Functions if needed

---

## 🚀 NEXT IMMEDIATE STEPS

1. **Run Database Migration** (5 minutes)
   - Copy SQL from migration file
   - Run in Supabase SQL Editor
   - Verify tables created

2. **Update CreateTicket Page** (2-3 hours)
   - Transform Post.tsx
   - Add event-specific fields
   - Test ticket creation

3. **Update Home Feed** (1-2 hours)
   - Filter for tickets only
   - Display event info
   - Test with created tickets

4. **Create TicketDetail Page** (2-3 hours)
   - Show seller contact info
   - Add Report button
   - Test viewing tickets

5. **Create Legal Pages** (2-3 hours)
   - Write Privacy Policy
   - Write Terms of Service
   - Link from Login and Profile

After these 5 steps, you'll have a working MVP core!

---

## 📧 SUPPORT

For questions or issues:
- **Developer:** Check this progress doc and TODO list
- **Users (when live):** support@campusconnect.app

---

## 📌 VERSION INFO

- **Branch:** `tickets-mvp`
- **Last Updated:** October 1, 2025
- **Status:** In Development
- **Target Launch:** TBD (2-3 weeks)

---

## 🔄 TESTING CHECKLIST

Before launch, test:
- [ ] User signup with .edu email
- [ ] Age validation (reject < 17)
- [ ] Campus auto-detection from email
- [ ] Create ticket with all fields
- [ ] View ticket detail
- [ ] Save/unsave tickets
- [ ] Report ticket
- [ ] Mark ticket as sold
- [ ] Update profile contact info
- [ ] Delete account
- [ ] Admin view reports
- [ ] Admin ban user
- [ ] Privacy/Terms pages load
- [ ] Mobile responsive design
- [ ] Cross-browser testing

