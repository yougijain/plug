# Testing Guide for Loop App

## 🚀 Quick Start Testing

### 1. **Set up Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project called "loop-test"
3. Get your credentials from Settings > API:
   - Project URL: `https://your-project-ref.supabase.co`
   - Anon Key: `your_anon_key_here`

### 2. **Update Environment Variables**
Replace the values in your `.env` file:
```env
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. **Set up the Database**
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire contents of `database-setup.sql`
4. Click "Run" to execute the script

### 4. **Start the App**
```bash
npm start
```
The app will open at `http://localhost:3000`

## 🧪 **Testing Scenarios**

### **Authentication Testing**
1. **Sign Up Test**:
   - Click "Sign Up" tab
   - Fill in: Name, Email, University, Password
   - Click "Create Account"
   - ✅ Should create account and log you in

2. **Sign In Test**:
   - Click "Sign In" tab
   - Enter your email and password
   - Click "Sign In"
   - ✅ Should log you in successfully

3. **Sign Out Test**:
   - Click "Sign Out" in the header
   - ✅ Should log you out and show login screen

### **Posts Testing**
1. **View Posts**:
   - After logging in, you should see sample posts
   - ✅ Should display posts with user info, prices, descriptions

2. **Search & Filter**:
   - Try the search bar with keywords like "MacBook"
   - Try category filters (Items, Services, Rides)
   - ✅ Should filter posts correctly

3. **Infinite Scroll**:
   - Scroll down to see "Load More" button
   - ✅ Should load more posts when clicked

### **Messaging Testing**
1. **View Conversations**:
   - Go to Messages tab
   - ✅ Should show conversation list (empty initially)

2. **Create Conversation** (if you have multiple users):
   - Create another test account
   - Try to start a conversation
   - ✅ Should create new conversation

### **Real-time Testing**
1. **Open multiple browser tabs**:
   - Log in with same account in different tabs
   - Create a post in one tab
   - ✅ Should appear in other tabs automatically

2. **Test real-time messaging**:
   - Open messages in different tabs
   - Send a message in one tab
   - ✅ Should appear instantly in other tabs

## 🐛 **Common Issues & Solutions**

### **"Missing Supabase environment variables"**
- Check your `.env` file exists
- Verify the variable names are correct
- Restart the development server

### **"Authentication error"**
- Check your Supabase project is active
- Verify your anon key is correct
- Check the database setup was successful

### **"No posts showing"**
- Check the database setup script ran successfully
- Verify the sample data was inserted
- Check browser console for errors

### **"Real-time not working"**
- Check your Supabase project has real-time enabled
- Verify you're using the correct project URL
- Check browser console for connection errors

## 🔧 **Debugging Tools**

### **React Query DevTools**
- Open your app
- Look for the React Query DevTools panel
- Check query states and cache

### **Browser DevTools**
- Open Console tab
- Look for any error messages
- Check Network tab for API calls

### **Supabase Dashboard**
- Go to your Supabase dashboard
- Check Authentication > Users
- Check Table Editor for data
- Check Logs for errors

## 📊 **Performance Testing**

### **Load Testing**
1. **Create many posts**:
   - Sign up multiple accounts
   - Create 50+ posts
   - Test infinite scroll performance

2. **Test real-time with many users**:
   - Open 10+ browser tabs
   - Send messages simultaneously
   - Check for performance issues

### **Mobile Testing**
1. **Responsive design**:
   - Test on mobile browser
   - Check all features work on small screens
   - Test touch interactions

## 🎯 **Feature Testing Checklist**

### ✅ **Authentication**
- [ ] Sign up with new email
- [ ] Sign in with existing account
- [ ] Sign out functionality
- [ ] Error handling for invalid credentials

### ✅ **Posts**
- [ ] View all posts
- [ ] Search functionality
- [ ] Category filtering
- [ ] Infinite scroll
- [ ] Real-time updates

### ✅ **Messaging**
- [ ] View conversations
- [ ] Send messages
- [ ] Real-time message updates
- [ ] Read/unread status

### ✅ **UI/UX**
- [ ] Loading states
- [ ] Error messages
- [ ] Responsive design
- [ ] Navigation between tabs

## 🚀 **Production Testing**

### **Before Deployment**
1. **Test with real data**:
   - Create realistic posts
   - Test with multiple users
   - Verify all features work

2. **Performance testing**:
   - Test with 100+ posts
   - Check loading times
   - Test on slow connections

3. **Security testing**:
   - Verify RLS policies work
   - Test user permissions
   - Check data isolation

## 📝 **Test Data**

The database setup includes sample data:
- **Users**: John Doe, Jane Smith, Mike Johnson
- **Posts**: MacBook Pro, Math Tutoring, Airport Ride
- **Universities**: Purdue University, Indiana University

## 🆘 **Getting Help**

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase dashboard logs
3. Verify your environment variables
4. Restart the development server
5. Check the README.md for setup instructions

---

**Happy testing! 🎉** 