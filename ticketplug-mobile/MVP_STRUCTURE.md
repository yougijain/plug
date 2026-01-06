# TicketPlug - MVP Structure & Business Proposition

## 🎯 Business Proposition

### Problem
College students struggle to buy/sell event tickets safely on campus. Current solutions (Facebook groups, GroupMe) are:
- Unverified users (scams, fake tickets)
- No reputation system
- Disorganized (hard to find tickets)
- No campus-specific filtering

### Solution
**TicketPlug** - A verified, campus-exclusive ticket marketplace where:
- Only .edu email addresses can join
- Built-in reputation system for trusted sellers
- Campus-specific (only see tickets from your school)
- Simple, mobile-first interface

### Value Proposition
**For Buyers:**
- Find tickets for campus events easily
- Verify sellers are real students
- See seller reputation before buying
- Direct contact (Snapchat, Instagram, phone)

**For Sellers:**
- Quick listing (3 steps)
- Reach only your campus community
- Build reputation for future sales
- No platform fees (direct payment)

### Revenue Model (Future)
- Optional featured listings
- Premium seller badges
- Campus partnerships

---

## 📱 MVP Features (Must Work)

### 1. Authentication & Onboarding
**Status**: ✅ Structure ready, needs implementation

**Requirements:**
- Sign up with .edu email only
- Email verification required
- Auto-detect campus from email domain
- Age verification (17+)
- Create user profile on first login

**User Flow:**
1. Open app → See Login screen
2. Tap "Sign Up"
3. Enter: Name, .edu email, password, DOB
4. Campus auto-selected from email
5. Verify email via link
6. Profile created automatically
7. Redirected to Home

**Technical:**
- Supabase Auth
- User profile in `users` table
- Campus matching from `campuses` table

---

### 2. Home Feed (Browse Tickets)
**Status**: ⏳ Needs implementation

**Requirements:**
- Display all active tickets for user's campus
- Show: Event name, date, venue, price, quantity, seller name
- Search by event name/venue
- Filter by category (Sports, Concert, Party, Theater, Other)
- Pull-to-refresh
- Infinite scroll (pagination)

**User Flow:**
1. See ticket cards in feed
2. Tap ticket → View details
3. Use search bar → Filter results
4. Select category → Filter by type
5. Pull down → Refresh feed

**Technical:**
- Query `tickets` table filtered by `campus_id`
- Join with `users` for seller info
- Search: `title`, `event_name`, `description`
- Filter: `category` field

---

### 3. Create Ticket Listing
**Status**: ⏳ Needs implementation

**Requirements:**
- 3-step form:
  1. Event details (category, name, date, venue)
  2. Upload images (1-5 photos)
  3. Ticket details (title, description, price, quantity)
- Form validation
- Image upload to Supabase Storage
- Success confirmation

**User Flow:**
1. Tap "Create" tab
2. Step 1: Select category, enter event info
3. Step 2: Take photos or select from gallery
4. Step 3: Enter ticket details, price
5. Tap "Post Ticket"
6. See success message
7. Redirected to Home (new ticket visible)

**Technical:**
- Multi-step form (React Hook Form)
- Image picker (Expo Image Picker)
- Upload to `post-images` bucket
- Insert into `tickets` table
- Create `event` record if new

---

### 4. Ticket Detail Page
**Status**: ⏳ Needs implementation

**Requirements:**
- Full ticket information
- Image gallery (swipeable)
- Seller contact info:
  - Name, university
  - Snapchat handle
  - Instagram handle
  - Phone number (optional)
- Seller reputation (score, sales count)
- Save/unsave button
- Share button
- Report button

**User Flow:**
1. Tap ticket from feed
2. View all details and images
3. Tap "Save" → Ticket saved
4. Tap seller contact → Opens app (Snapchat/Instagram) or dials phone
5. Tap "Share" → Share ticket link
6. Tap "Report" → Report inappropriate content

**Technical:**
- Query ticket by ID
- Join with `users` for seller info
- Save to `saved_tickets` table
- Share via Expo Sharing
- Report to `reports` table

---

### 5. Saved Tickets
**Status**: ⏳ Needs implementation

**Requirements:**
- List all saved tickets
- Unsave tickets
- Navigate to ticket detail
- Empty state when no saved tickets

**User Flow:**
1. Tap "Saved" tab
2. See list of saved tickets
3. Tap ticket → View details
4. Tap "Unsave" → Remove from saved

**Technical:**
- Query `saved_tickets` table
- Join with `tickets` for full info
- Delete from `saved_tickets` on unsave

---

### 6. User Profile
**Status**: ⏳ Needs implementation

**Requirements:**
- Display user info (name, email, university)
- Stats: Reputation score, successful sales
- Tabs: Saved, Selling, Buying
- Edit profile (name, social handles, phone)
- Sign out

**User Flow:**
1. Tap "Profile" tab
2. View profile and stats
3. Tap "Edit" → Update info
4. Switch tabs → View saved/selling tickets
5. Tap "Sign Out" → Return to Login

**Technical:**
- Query user from `users` table
- Query tickets where `seller_id = user.id`
- Update user profile
- Sign out via Supabase Auth

---

## 🔧 Technical Architecture

### Frontend (React Native)
- **Framework**: Expo + React Native
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State**: Zustand
- **Data Fetching**: React Query
- **Forms**: React Hook Form + Zod
- **Styling**: StyleSheet (React Native)

### Backend (Supabase)
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (for images)
- **API**: Supabase REST API

### Database Tables
1. `campuses` - University information
2. `users` - User profiles
3. `events` - Event information
4. `tickets` - Ticket listings
5. `saved_tickets` - User saved tickets
6. `reports` - User/ticket reports
7. `reputation` - Reputation history

---

## ✅ MVP Success Criteria

### Must Work End-to-End:

1. **User can sign up**
   - Create account with .edu email
   - Verify email
   - Profile created automatically

2. **User can browse tickets**
   - See tickets for their campus
   - Search and filter tickets
   - View ticket details

3. **User can create listing**
   - Complete 3-step form
   - Upload images
   - Post ticket successfully

4. **User can save tickets**
   - Save interesting tickets
   - View saved tickets
   - Unsave tickets

5. **User can contact seller**
   - View seller contact info
   - Open Snapchat/Instagram/Phone

6. **User can manage profile**
   - View profile and stats
   - Edit profile information
   - Sign out

---

## 🚫 NOT in MVP

- In-app payments
- Real-time chat
- Push notifications
- Admin dashboard
- Advanced search filters
- Ticket recommendations
- Reviews/ratings system
- Analytics dashboard

---

## 📊 Key Metrics (Post-MVP)

- Active users per campus
- Tickets posted per day
- Successful transactions
- User retention
- Average time to sell

---

## 🎯 Launch Requirements

### Before Launch:
- [ ] All 6 MVP features working
- [ ] Tested on iOS and Android
- [ ] Database properly configured
- [ ] Storage bucket created
- [ ] Environment variables set
- [ ] Error handling implemented
- [ ] Loading states everywhere
- [ ] Empty states handled

### Launch Checklist:
- [ ] App Store submission ready
- [ ] Google Play submission ready
- [ ] Privacy policy URL
- [ ] Terms of service
- [ ] Support email configured
- [ ] Initial campus data seeded

---

## 🔄 Development Phases

### Phase 1: Core Setup ✅
- Project structure
- Navigation
- Basic screens
- Supabase connection

### Phase 2: Authentication ⏳
- Login/Sign up screens
- Email verification
- Profile creation

### Phase 3: Ticket Management ⏳
- Home feed
- Create ticket
- Ticket detail
- Saved tickets

### Phase 4: Profile & Polish ⏳
- Profile screen
- Edit profile
- Error handling
- Loading states

### Phase 5: Testing & Launch ⏳
- Test all flows
- Fix bugs
- App store prep
- Submit to stores

---

## 💡 Business Model

### Current (MVP): Free
- No fees for users
- Direct payments (Venmo, Zelle, cash)
- Platform provides connection only

### Future Revenue:
1. **Featured Listings** - $2-5 to boost ticket visibility
2. **Premium Badges** - $1/month for verified seller badge
3. **Campus Partnerships** - Revenue share with event organizers
4. **Advertising** - Local business ads (post-MVP)

---

## 🎯 Target Market

### Primary:
- College students (18-24)
- Active event-goers
- Sports fans, concert-goers

### Secondary:
- Event organizers
- Campus organizations
- Alumni (for special events)

---

## 📈 Growth Strategy

1. **Campus-by-Campus Rollout**
   - Start with 2-3 campuses (IU, Purdue)
   - Word-of-mouth growth
   - Expand to more campuses

2. **Campus Ambassadors**
   - Student representatives
   - Promote on campus
   - Organize events

3. **Partnerships**
   - Student organizations
   - Event venues
   - Campus ticketing offices

---

## 🔒 Trust & Safety

### MVP Safety Features:
- .edu email verification only
- User reputation system
- Report functionality
- Age verification (17+)
- Campus-specific (no cross-campus)

### Future:
- ID verification
- Transaction escrow
- Dispute resolution
- Admin moderation

---

## 📱 Platform Strategy

### MVP: Mobile App Only
- iOS App Store
- Google Play Store
- Native mobile experience

### Future:
- Web version (for desktop users)
- Progressive Web App (PWA)

---

## ✅ Current Status

### Completed:
- ✅ Project structure
- ✅ Database schema
- ✅ Navigation setup
- ✅ Core screens (placeholders)
- ✅ API layer structure
- ✅ Type definitions

### In Progress:
- ⏳ Authentication flow
- ⏳ Screen implementations
- ⏳ Image upload
- ⏳ Testing

### Next Steps:
1. Implement Login screen
2. Implement Home feed
3. Implement Create ticket
4. Test end-to-end flows
5. Prepare for app store

---

**This MVP focuses on core functionality: connecting buyers and sellers on campus safely and simply.**

