# 🧪 TicketPlug - Feature Testing Guide

## 📋 Pre-Testing Checklist

### Build Status
- ✅ Build compiles successfully
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ Mock user is set up (bypasses login for demo)

### Start the App
```bash
npm start
```
The app will open at `http://localhost:3000`

---

## 🎯 Feature-by-Feature Testing

### 1. 🏠 HOME PAGE (`/`)

#### Visual Checks
- [ ] **Header displays correctly**
  - TicketPlug logo and branding visible
  - University name shows (Indiana University)
  - Heart icon (Saved) with badge count
  - Bell icon (Notifications) with indicator
  
- [ ] **Search bar works**
  - Search input is visible and functional
  - Category filter dropdown works
  - Can type in search box
  
- [ ] **Example tickets display**
  - 4 example tickets are visible
  - Each ticket shows:
    - [ ] Event image
    - [ ] Event name (e.g., "Purdue vs Indiana Basketball")
    - [ ] Event date and time
    - [ ] Venue location
    - [ ] Ticket title
    - [ ] Description (truncated)
    - [ ] Price per ticket
    - [ ] Quantity available
    - [ ] Seller name and reputation
    - [ ] Heart icon (save/unsave)
    - [ ] "View Details" button

#### Functional Tests
- [ ] **Search functionality**
  - Type in search box → tickets filter
  - Search by event name works
  - Search by venue works
  - Search by description works
  
- [ ] **Category filter**
  - Click filter button → dropdown opens
  - Select category → tickets filter
  - "All" shows all tickets
  
- [ ] **Save/Unsave tickets**
  - Click heart icon → ticket saves (heart fills red)
  - Click again → ticket unsaves (heart outline)
  - Saved count in header updates
  
- [ ] **Navigation**
  - Click "View Details" → navigates to ticket detail page
  - Click ticket card → navigates to ticket detail page
  - Click "Sell Your Tickets" button → navigates to create ticket page
  
- [ ] **Empty state** (if no tickets)
  - Shows empty state message
  - "Post Your First Ticket" button works

---

### 2. 💾 SAVED TICKETS PAGE (`/saved`)

#### Visual Checks
- [ ] **Header displays correctly**
  - Back button works
  - "Saved Tickets" title visible
  - Layout is clean
  
- [ ] **Example saved tickets display**
  - 2 example saved tickets visible
  - Each ticket shows:
    - [ ] Event image
    - [ ] Event name, date, venue
    - [ ] Ticket title and description
    - [ ] Price and quantity
    - [ ] Seller info
    - [ ] Filled red heart icon (saved state)
    - [ ] "View Details" button

#### Functional Tests
- [ ] **Unsave functionality**
  - Click filled heart → ticket unsaves
  - Ticket disappears from saved list
  - Header count updates
  
- [ ] **Navigation**
  - Click "View Details" → navigates to ticket detail
  - Click ticket card → navigates to ticket detail
  - Back button → returns to home
  
- [ ] **Empty state** (if no saved tickets)
  - Shows heart icon in circle
  - "Nothing saved yet" message
  - "Browse Tickets" button works

---

### 3. ➕ CREATE TICKET PAGE (`/create-ticket`)

#### Visual Checks
- [ ] **Header displays correctly**
  - Back/Cancel button visible
  - Step indicator shows (1, 2, 3)
  - Current step highlighted
  - Progress bar shows completion
  
- [ ] **Step 1: Event Details**
  - Title: "What event is this for?"
  - Category selection (Sports, Concert, Party, Theater, Other)
  - Event name input
  - Event date & time picker
  - Venue input
  - "Continue" button

- [ ] **Step 2: Add Photos**
  - Title: "Add Photos"
  - File upload area (drag & drop or click)
  - Preview of selected images
  - Can remove images
  - "Continue" button

- [ ] **Step 3: Ticket Details**
  - Title: "Ticket Details"
  - Listing title input
  - Description textarea
  - Price per ticket input
  - Quantity input
  - Payment info note
  - "Post Ticket" button

#### Functional Tests
- [ ] **Step 1 validation**
  - Try to continue without category → button disabled
  - Try to continue without event name → button disabled
  - Try to continue without date → button disabled
  - Fill all required fields → button enables
  - Click category → category selects
  - Date picker works
  - Click "Continue" → moves to step 2

- [ ] **Step 2 functionality**
  - Click upload area → file picker opens
  - Select images → previews show
  - Can select multiple images (up to 5)
  - Can remove images
  - Click "Continue" → moves to step 3

- [ ] **Step 3 validation**
  - Try to post without title → button disabled
  - Fill title → button enables
  - Price input accepts decimals
  - Quantity input accepts numbers
  - Click "Post Ticket" → shows success modal (or navigates)

- [ ] **Navigation**
  - Back button on step 1 → cancels/goes back
  - Back button on step 2/3 → goes to previous step
  - Success modal → navigates to home

---

### 4. 🎫 TICKET DETAIL PAGE (`/tickets/:id`)

#### Visual Checks
- [ ] **Header displays correctly**
  - Back button works
  - Share button visible
  - Report button visible (if not seller)
  
- [ ] **Ticket information displays**
  - [ ] Event image(s) (can swipe if multiple)
  - [ ] Event name (large, prominent)
  - [ ] Event date and time
  - [ ] Venue location
  - [ ] Ticket title
  - [ ] Full description
  - [ ] Price per ticket (large, highlighted)
  - [ ] Quantity available
  - [ ] Status badge (if sold/expired)

- [ ] **Seller information**
  - [ ] Seller avatar/initials
  - [ ] Seller name
  - [ ] Reputation score (stars)
  - [ ] Successful sales count
  - [ ] Contact information:
    - [ ] Snapchat handle (if provided)
    - [ ] Instagram handle (if provided)
    - [ ] Phone number (if provided)

#### Functional Tests
- [ ] **Save/Unsave**
  - Click heart icon → saves/unsaves ticket
  - State persists when navigating away and back
  
- [ ] **Share functionality**
  - Click share button → share options appear
  - Can copy link
  - Share to social media works (if implemented)
  
- [ ] **Report ticket**
  - Click report button → report modal/form opens
  - Can select reason
  - Can submit report
  
- [ ] **Contact seller**
  - Snapchat link works (if provided)
  - Instagram link works (if provided)
  - Phone number is clickable (if provided)
  
- [ ] **Navigation**
  - Back button → returns to previous page
  - Click seller info → navigates to seller profile (if implemented)

---

### 5. 👤 PROFILE PAGE (`/profile`)

#### Visual Checks
- [ ] **Profile header**
  - User avatar/initials
  - User name
  - University name
  - Edit button
  
- [ ] **Profile stats**
  - Rating (stars)
  - Total sales
  - Reply rate
  
- [ ] **Tabs**
  - "Saved" tab
  - "Selling" tab
  - "Buying" tab
  
- [ ] **Social media section**
  - Instagram (if added)
  - Snapchat (if added)
  - Phone number (if added)
  - Edit button

#### Functional Tests
- [ ] **Tab switching**
  - Click "Saved" → shows saved tickets
  - Click "Selling" → shows tickets user is selling
  - Click "Buying" → shows tickets user bought
  
- [ ] **Saved tab**
  - Shows saved tickets (or empty state)
  - Empty state shows heart icon (not broken SVG)
  - "Browse Tickets" button works
  
- [ ] **Selling tab**
  - Shows user's active tickets
  - Can mark tickets as sold
  - Empty state shows appropriate icon
  
- [ ] **Buying tab**
  - Shows purchased tickets
  - Empty state shows appropriate icon
  
- [ ] **Settings**
  - Click settings → settings modal opens
  - Can edit profile
  - Can add/update social media
  - Can sign out
  - Can delete account

---

### 6. 🧭 NAVIGATION BAR (Bottom)

#### Visual Checks
- [ ] **All 4 tabs visible**
  - Home icon
  - Saved icon (heart)
  - Create icon (plus, FAB style)
  - Profile icon
  
- [ ] **Active state**
  - Current page tab is highlighted
  - Active tab has indigo background
  - Icons change color when active

#### Functional Tests
- [ ] **Navigation works**
  - Click Home → navigates to `/`
  - Click Saved → navigates to `/saved`
  - Click Create (FAB) → navigates to `/create-ticket`
  - Click Profile → navigates to `/profile`
  
- [ ] **Active state updates**
  - Navigate between pages → correct tab highlights
  - Active state persists on page refresh

---

### 7. 🎨 UI/UX CHECKS

#### Design Consistency
- [ ] **Color scheme**
  - Indigo/purple gradient used consistently
  - Buttons use gradient
  - Cards have proper shadows
  - Text is readable (good contrast)
  
- [ ] **Animations**
  - Page transitions are smooth
  - Button hover effects work
  - Loading states show spinners
  - Toast notifications appear/disappear smoothly
  
- [ ] **Responsive design**
  - Works on mobile viewport
  - Text doesn't overflow
  - Images scale properly
  - Buttons are tappable size
  
- [ ] **Accessibility**
  - Buttons have aria-labels
  - Images have alt text
  - Keyboard navigation works
  - Focus states visible

---

### 8. 🔄 DATA FLOW TESTS

#### Mock Data
- [ ] **Example tickets display**
  - Home page shows 4 example tickets
  - Saved page shows 2 example tickets
  - All tickets have complete data
  - Images load correctly
  
- [ ] **User data**
  - Mock user is set correctly
  - User info appears in profile
  - User name appears in header

#### State Management
- [ ] **Save/Unsave state**
  - Saving a ticket updates saved count
  - Saved tickets appear in Saved page
  - Unsaving removes from Saved page
  - State persists across navigation
  
- [ ] **Navigation state**
  - URL updates correctly
  - Browser back/forward works
  - Direct URL access works

---

## 🐛 Known Issues to Watch For

1. **Image Loading**
   - Check if Unsplash images load (may be slow)
   - Verify image fallbacks work

2. **Navigation**
   - Ensure all routes work
   - Check 404 handling

3. **Form Validation**
   - All required fields validated
   - Error messages display correctly

4. **Empty States**
   - All empty states show proper icons
   - No broken SVG references

---

## ✅ Testing Checklist Summary

### Critical Path
1. ✅ Home page displays tickets
2. ✅ Can navigate to ticket detail
3. ✅ Can save/unsave tickets
4. ✅ Saved page shows saved tickets
5. ✅ Create ticket form works (all 3 steps)
6. ✅ Profile page displays correctly
7. ✅ Navigation bar works
8. ✅ All buttons are functional

### Nice to Have
- [ ] Search filters correctly
- [ ] Category filter works
- [ ] Share functionality works
- [ ] Report functionality works
- [ ] Settings modal works

---

## 📝 Notes for Testing

- **Current State**: Login is bypassed with mock user
- **Data**: Using example tickets (not real database)
- **Focus Areas**: 
  1. UI/UX flow
  2. Button functionality
  3. Navigation
  4. Form validation
  5. Empty states

---

## 🚀 Next Steps After Testing

1. **Fix any bugs found**
2. **Connect to real database** (remove mock data)
3. **Enable authentication** (remove mock user)
4. **Test with real data**
5. **Performance optimization**
6. **Final polish**

---

**Happy Testing! 🎉**

