# 🧪 TicketPlug React Native - Testing Guide

## 📋 Pre-Testing Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
# iOS
npm run ios

# Android
npm run android

# Or use Expo Go app
npm start
```

### 3. Test on Both Platforms
- ✅ iOS Simulator/Device
- ✅ Android Emulator/Device

---

## 🎯 Feature-by-Feature Testing

### 1. 🏠 HOME SCREEN

#### Visual Checks
- [ ] **Header displays correctly**
  - TicketPlug logo visible
  - University name shows
  - Heart icon (Saved) with badge
  - Bell icon (Notifications)
  
- [ ] **Search bar**
  - Search input visible and functional
  - Category filter works
  - Keyboard appears on focus
  
- [ ] **Ticket cards**
  - 4 example tickets visible
  - Images load correctly
  - All ticket info displays:
    - Event name, date, venue
    - Price, quantity
    - Seller info
    - Save button
    - View Details button

#### Functional Tests
- [ ] **Search**
  - Type in search → filters tickets
  - Search by event name works
  - Search by venue works
  
- [ ] **Category filter**
  - Tap filter → dropdown opens
  - Select category → filters tickets
  
- [ ] **Save/Unsave**
  - Tap heart → saves ticket
  - Tap again → unsaves
  - Badge count updates
  
- [ ] **Navigation**
  - Tap "View Details" → navigates
  - Tap ticket card → navigates
  - Tap "Sell Tickets" → navigates to create

#### Platform-Specific
- [ ] **iOS**: Pull to refresh works
- [ ] **Android**: Swipe gestures work
- [ ] **Both**: Keyboard dismisses properly

---

### 2. 💾 SAVED TICKETS SCREEN

#### Visual Checks
- [ ] Header with back button
- [ ] 2 example saved tickets
- [ ] Filled heart icons (saved state)
- [ ] All ticket info displays

#### Functional Tests
- [ ] **Unsave**
  - Tap heart → unsaves ticket
  - Ticket removed from list
  
- [ ] **Navigation**
  - Tap "View Details" → navigates
  - Back button → returns to home

---

### 3. ➕ CREATE TICKET SCREEN

#### Step 1: Event Details
- [ ] Category selection works
- [ ] Event name input works
- [ ] Date picker opens (native)
- [ ] Venue input works
- [ ] Continue button enables when valid

#### Step 2: Photos
- [ ] Image picker opens
- [ ] Can select from library
- [ ] Can take photo (camera)
- [ ] Image previews show
- [ ] Can remove images
- [ ] Continue button works

#### Step 3: Ticket Details
- [ ] Title input works
- [ ] Description textarea works
- [ ] Price input (numeric keyboard)
- [ ] Quantity input (numeric keyboard)
- [ ] Post button works

#### Platform-Specific
- [ ] **iOS**: Native date picker
- [ ] **Android**: Native date picker
- [ ] **Both**: Image picker permissions work

---

### 4. 🎫 TICKET DETAIL SCREEN

#### Visual Checks
- [ ] Event images display
- [ ] All ticket info visible
- [ ] Seller contact info shows
- [ ] Share button works
- [ ] Report button works

#### Functional Tests
- [ ] **Save/Unsave**
  - Heart icon toggles
  - State persists
  
- [ ] **Share**
  - Tap share → native share sheet opens
  - Can share to other apps
  
- [ ] **Contact seller**
  - Snapchat link opens app
  - Instagram link opens app
  - Phone number is tappable
  
- [ ] **Report**
  - Tap report → modal opens
  - Can submit report

---

### 5. 👤 PROFILE SCREEN

#### Visual Checks
- [ ] User avatar/initials
- [ ] User name and university
- [ ] Stats display (rating, sales)
- [ ] Tabs work (Saved, Selling, Buying)
- [ ] Social media section

#### Functional Tests
- [ ] **Tab switching**
  - Tap tabs → content changes
  - Active tab highlights
  
- [ ] **Settings**
  - Tap settings → modal opens
  - Can edit profile
  - Can sign out
  - Can delete account

---

### 6. 🧭 BOTTOM NAVIGATION

#### Visual Checks
- [ ] 4 tabs visible
- [ ] Active tab highlighted
- [ ] Icons display correctly

#### Functional Tests
- [ ] **Navigation**
  - Tap Home → navigates
  - Tap Saved → navigates
  - Tap Create (FAB) → navigates
  - Tap Profile → navigates
  
- [ ] **Active state**
  - Correct tab highlights
  - Persists on refresh

---

### 7. 🔐 AUTHENTICATION (When Enabled)

#### Sign Up
- [ ] Email input works
- [ ] Password input works
- [ ] Campus selection works
- [ ] Date of birth picker works
- [ ] Form validation works
- [ ] Sign up succeeds

#### Sign In
- [ ] Email/password inputs work
- [ ] Sign in succeeds
- [ ] Session persists
- [ ] Auto-login works

#### Sign Out
- [ ] Sign out button works
- [ ] Returns to login screen
- [ ] Session cleared

---

### 8. 📱 PLATFORM-SPECIFIC TESTS

#### iOS
- [ ] App launches correctly
- [ ] Status bar styling correct
- [ ] Safe area insets work
- [ ] Haptic feedback works
- [ ] Native animations smooth
- [ ] Keyboard handling correct
- [ ] Deep linking works (if implemented)

#### Android
- [ ] App launches correctly
- [ ] Status bar styling correct
- [ ] Back button works
- [ ] Material design elements
- [ ] Keyboard handling correct
- [ ] Deep linking works (if implemented)

---

### 9. 🎨 UI/UX CHECKS

#### Design
- [ ] Colors consistent (indigo/purple)
- [ ] Typography readable
- [ ] Spacing consistent
- [ ] Shadows/elevation work
- [ ] Gradients display correctly

#### Performance
- [ ] App loads quickly
- [ ] Images load smoothly
- [ ] Navigation is smooth
- [ ] No lag on interactions
- [ ] Memory usage reasonable

#### Accessibility
- [ ] Screen reader support
- [ ] Touch targets adequate size
- [ ] Color contrast sufficient
- [ ] Text scales properly

---

### 10. 🔄 DATA & STATE

#### Mock Data
- [ ] Example tickets display
- [ ] User data shows correctly
- [ ] Images load from URLs

#### State Management
- [ ] Save/unsave persists
- [ ] Navigation state persists
- [ ] Form data persists (during creation)
- [ ] User session persists

---

## 🐛 Common Issues to Check

1. **Image Loading**
   - [ ] Images load from URLs
   - [ ] Placeholders show while loading
   - [ ] Error handling for failed loads

2. **Keyboard**
   - [ ] Keyboard doesn't cover inputs
   - [ ] Dismisses on outside tap
   - [ ] Correct keyboard type (numeric, email, etc.)

3. **Navigation**
   - [ ] Back button works
   - [ ] Deep linking works
   - [ ] Navigation state persists

4. **Permissions**
   - [ ] Camera permission requested
   - [ ] Photo library permission requested
   - [ ] Permission denied handling

5. **Network**
   - [ ] Handles offline state
   - [ ] Shows loading states
   - [ ] Error messages display

---

## 📦 Pre-Submission Checklist

### iOS
- [ ] App icons (all sizes) added
- [ ] Splash screen configured
- [ ] Bundle ID set correctly
- [ ] Version number set
- [ ] Build number incremented
- [ ] Privacy descriptions added
- [ ] App Store screenshots prepared
- [ ] App description written

### Android
- [ ] App icons (adaptive) added
- [ ] Splash screen configured
- [ ] Package name set correctly
- [ ] Version code set
- [ ] Version name set
- [ ] Permissions declared
- [ ] Play Store screenshots prepared
- [ ] App description written

### Both
- [ ] App name correct
- [ ] Version number matches
- [ ] Environment variables set
- [ ] API keys configured
- [ ] No console.logs in production
- [ ] Error handling comprehensive
- [ ] Loading states everywhere
- [ ] Empty states handled

---

## 🚀 Build & Submit

### Build
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### Submit
```bash
# iOS (requires App Store Connect setup)
eas submit --platform ios

# Android (requires Google Play Console setup)
eas submit --platform android
```

---

**Happy Testing! 🎉**

