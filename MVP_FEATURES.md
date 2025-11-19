# TicketPlug MVP - Feature List

## 🎯 Core App Concept
**Campus ticket marketplace** - Students buy and sell event tickets on their campus

---

## ✅ MVP Features (Must Have for Launch)

### 1. 🔐 Authentication & User Setup
**Priority: CRITICAL**

- [x] Sign up with .edu email
- [x] Email verification
- [x] Sign in / Sign out
- [x] Campus selection (auto-detect from email domain)
- [x] Age verification (17+)
- [x] Basic user profile (name, university, campus)

**Status**: ✅ Mostly done (needs testing)

---

### 2. 🎫 Browse Tickets (Home Feed)
**Priority: CRITICAL**

- [x] View all active tickets for your campus
- [x] Search tickets (by event name, venue, description)
- [x] Filter by category (Sports, Concert, Party, Theater, Other)
- [x] See ticket details:
  - Event name, date, venue
  - Price per ticket
  - Quantity available
  - Seller reputation
- [x] Save/unsave tickets
- [x] Navigate to ticket detail page

**Status**: ✅ Done (with example data)

---

### 3. ➕ Create Ticket Listing
**Priority: CRITICAL**

- [x] 3-step form:
  - Step 1: Event details (category, name, date, venue)
  - Step 2: Upload ticket images (photos/screenshots)
  - Step 3: Ticket details (title, description, price, quantity)
- [x] Form validation
- [x] Submit and post ticket
- [x] Success confirmation

**Status**: ✅ Done (needs testing)

---

### 4. 🎫 Ticket Detail Page
**Priority: CRITICAL**

- [x] View full ticket information
- [x] See all ticket images
- [x] Seller contact information:
  - Snapchat handle
  - Instagram handle
  - Phone number (optional)
- [x] Seller reputation (score, sales count)
- [x] Save/unsave ticket
- [x] Share ticket
- [x] Report ticket (basic)

**Status**: ✅ Done (needs testing)

---

### 5. 💾 Saved Tickets
**Priority: HIGH**

- [x] View all saved tickets
- [x] Unsave tickets
- [x] Navigate to ticket detail
- [x] Empty state when no saved tickets

**Status**: ✅ Done

---

### 6. 👤 User Profile
**Priority: HIGH**

- [x] View profile information
- [x] See stats (reputation, sales)
- [x] Tabs: Saved, Selling, Buying
- [x] Edit profile (name, social media)
- [x] Sign out
- [x] Delete account (basic)

**Status**: ✅ Done (needs testing)

---

### 7. 🧭 Navigation
**Priority: CRITICAL**

- [x] Bottom navigation bar
- [x] 4 main tabs: Home, Saved, Create, Profile
- [x] Active tab highlighting
- [x] Smooth navigation between pages

**Status**: ✅ Done

---

## 🚫 NOT in MVP (Add Later)

### Nice-to-Have Features (Post-MVP)
- ❌ Real-time chat/messaging
- ❌ In-app payments
- ❌ Push notifications
- ❌ Advanced search filters
- ❌ Ticket recommendations
- ❌ Seller/buyer reviews
- ❌ Admin moderation dashboard
- ❌ Analytics dashboard
- ❌ Social media integration (beyond contact info)
- ❌ Ticket transfer/QR codes
- ❌ Event calendar
- ❌ Price alerts

---

## 🎯 MVP Success Criteria

### Core User Flows That Must Work:

1. **Buyer Flow** ✅
   - Browse tickets on home feed
   - Search/filter tickets
   - Save interesting tickets
   - View ticket details
   - Contact seller (via Snapchat/Instagram/Phone)
   - Complete purchase off-platform

2. **Seller Flow** ✅
   - Create ticket listing
   - Upload ticket images
   - Set price and quantity
   - Post ticket
   - Manage listings (view, mark as sold)
   - Respond to buyer inquiries

3. **Profile Management** ✅
   - View profile
   - Edit profile info
   - Add social media handles
   - View saved tickets
   - View selling history

---

## 🔧 Technical Requirements for MVP

### Must Work:
- [x] User authentication
- [x] Database (Supabase) connection
- [x] Ticket CRUD operations
- [x] Image uploads
- [x] Search functionality
- [x] Navigation
- [x] Responsive design (mobile-first)

### Can Be Basic:
- Basic error handling
- Basic loading states
- Simple UI (no fancy animations needed)
- Basic validation

---

## 📱 Platform Requirements

### MVP Launch:
- ✅ Web app (React)
- ⏳ Mobile app (via Capacitor - after web works)

### Post-MVP:
- Native iOS app
- Native Android app
- Progressive Web App (PWA)

---

## 🐛 Current MVP Status

### ✅ Completed:
- Authentication system
- Home feed with tickets
- Create ticket form
- Ticket detail page
- Saved tickets page
- Profile page
- Navigation
- Example data for demo

### ⚠️ Needs Testing/Fixing:
- Real API integration
- Form submissions
- Image uploads
- Search/filter functionality
- Save/unsave functionality
- Navigation flows
- Error handling

### ❌ Missing:
- Mark ticket as sold
- Delete ticket listing
- Edit ticket listing
- Better error messages
- Loading states everywhere
- Offline handling

---

## 🎯 MVP Launch Checklist

### Before Launch:
- [ ] All core features work
- [ ] Tested on mobile browsers
- [ ] No critical bugs
- [ ] Basic error handling
- [ ] Loading states
- [ ] User can complete full buyer flow
- [ ] User can complete full seller flow
- [ ] Database properly configured
- [ ] Environment variables set
- [ ] Basic security (RLS policies)

### Launch Day:
- [ ] Deploy web app
- [ ] Test on production
- [ ] Monitor for errors
- [ ] Gather user feedback

---

## 📊 MVP Feature Priority

### P0 (Must Have - Blocking Launch):
1. Authentication
2. Browse tickets
3. Create ticket
4. View ticket details
5. Contact seller
6. Basic navigation

### P1 (High Priority - Should Have):
1. Save tickets
2. User profile
3. Search/filter
4. Mark ticket as sold

### P2 (Medium Priority - Nice to Have):
1. Edit ticket
2. Delete ticket
3. Better error messages
4. Loading states

### P3 (Low Priority - Post-MVP):
1. Advanced features
2. Analytics
3. Admin tools
4. Notifications

---

## 🚀 Next Steps for MVP

1. **Fix current issues** (see DEBUG_AND_FIX.md)
2. **Test all core flows**
3. **Add missing P0 features**
4. **Polish UI/UX**
5. **Test on mobile browsers**
6. **Deploy web app**
7. **Wrap with Capacitor for app stores**

---

**Focus on getting the core buyer and seller flows working perfectly!**

