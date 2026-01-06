# Debug & Fix Guide - TicketPlug Web App

## 🎯 Goal: Fix Web App → Then Add Capacitor

---

## Step 1: Identify What's Broken 🔍

### Quick Diagnostic

1. **Start the app**
   ```bash
   npm start
   ```

2. **Open browser console** (F12)
   - Look for RED errors
   - Note any error messages
   - Check Network tab for failed requests

3. **Test each page**
   - Home page: Does it load?
   - Saved page: Does it load?
   - Create Ticket: Does it load?
   - Profile: Does it load?
   - Ticket Detail: Does it load?

4. **Test navigation**
   - Bottom nav buttons work?
   - Back buttons work?
   - Links work?

---

## Step 2: Common Issues & Fixes 🛠️

### Issue 1: "Supabase environment variables missing"

**Symptoms**: App crashes on load, console shows Supabase error

**Fix**:
1. Create `.env` file in project root:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   ```
2. Restart dev server (`npm start`)

### Issue 2: "Cannot read property of undefined"

**Symptoms**: White screen or component crashes

**Fix**: Add null checks:
```tsx
// Before
{ticket.users.name}

// After
{ticket.users?.name || 'Unknown'}
```

### Issue 3: Images not loading

**Symptoms**: Broken image icons

**Fix**: Check image URLs, add error handling:
```tsx
<Image 
  src={ticket.images?.[0]} 
  onError={(e) => e.target.src = '/placeholder.png'}
/>
```

### Issue 4: Navigation not working

**Symptoms**: Clicking buttons does nothing

**Fix**: Check React Router setup, ensure routes are correct

### Issue 5: API calls failing

**Symptoms**: No data loads, console shows 401/403 errors

**Fix**: 
- Check Supabase RLS policies
- Verify API keys
- Check network tab for error details

---

## Step 3: Systematic Testing ✅

### Test Checklist

#### Home Page
- [ ] Page loads without errors
- [ ] Example tickets display
- [ ] Search bar works
- [ ] Category filter works
- [ ] Save/unsave buttons work
- [ ] "View Details" buttons work
- [ ] Navigation to other pages works

#### Saved Page
- [ ] Page loads
- [ ] Saved tickets display
- [ ] Unsave button works
- [ ] "View Details" works
- [ ] Back button works

#### Create Ticket Page
- [ ] Page loads
- [ ] Step 1 (Event Details) works
- [ ] Step 2 (Photos) works
- [ ] Step 3 (Ticket Info) works
- [ ] Form validation works
- [ ] Submit button works

#### Profile Page
- [ ] Page loads
- [ ] User info displays
- [ ] Tabs work (Saved, Selling, Buying)
- [ ] Settings button works

#### Ticket Detail Page
- [ ] Page loads with ticket ID
- [ ] All ticket info displays
- [ ] Save button works
- [ ] Share button works
- [ ] Report button works
- [ ] Back button works

#### Navigation
- [ ] Bottom nav highlights active page
- [ ] All 4 tabs navigate correctly
- [ ] Create button (FAB) works

---

## Step 4: Fix Issues One by One 🔧

### Priority Order:
1. **Critical**: App won't start
2. **High**: Pages won't load
3. **Medium**: Features don't work
4. **Low**: Styling issues

### For Each Issue:
1. Identify the error (check console)
2. Find the file causing it
3. Fix the code
4. Test the fix
5. Move to next issue

---

## Step 5: Verify Everything Works ✅

### Final Checklist:
- [ ] No console errors
- [ ] All pages load
- [ ] All buttons work
- [ ] Navigation works
- [ ] Forms work
- [ ] Data displays correctly
- [ ] Works on mobile browser
- [ ] Works on desktop browser

---

## Step 6: Once Web App Works → Add Capacitor 📱

**Only proceed to Capacitor after web app is fully working!**

See `CAPACITOR_SETUP.md` for next steps.

---

## 🆘 Need Help?

**Tell me:**
1. What page/feature is broken?
2. What error message do you see? (from console)
3. What happens when you try to use it?

**I'll help you fix it!**

