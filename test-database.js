// Test script to check database connection
// Run this with: node test-database.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const testEmail = process.env.TEST_EMAIL;
const testPassword = process.env.TEST_PASSWORD;

console.log('🔍 Environment Variables Check:');
console.log('REACT_APP_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('REACT_APP_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY (optional):', serviceRoleKey ? '✅ Set' : 'ℹ️ Not set');
console.log('TEST_EMAIL/TEST_PASSWORD (optional):', testEmail && testPassword ? '✅ Set' : 'ℹ️ Not set');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('');
  console.log('💡 To fix this:');
  console.log('1. Make sure you have a .env file in your project root');
  console.log('2. The .env file should contain:');
  console.log('   REACT_APP_SUPABASE_URL=your_supabase_url');
  console.log('   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('3. Restart your development server after creating the .env file');
  process.exit(1);
}

console.log('');
console.log('✅ Environment variables found!');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;

async function testDatabase() {
  console.log('');
  console.log('🔍 Testing database connection...');
  
  try {
    // Test 1: Check if we can connect
    console.log('1. Testing connection...');
    const { data, error } = await supabase.from('posts').select('id').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      
      if (error.message.includes('relation "posts" does not exist')) {
        console.log('💡 The posts table does not exist. Run the database-setup.sql script in Supabase.');
      } else if (error.message.includes('permission denied')) {
        console.log('💡 Permission denied. Check RLS policies.');
      }
      
      return;
    }
    
    console.log('✅ Connection successful');
    
    // Test 2: Check posts count
    console.log('2. Checking posts count...');
    const { count, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Count query failed:', countError.message);
      return;
    }
    
    console.log(`✅ Found ${count} posts in database`);
    
    // Test 3: Try to create a test post with proper auth context
    console.log('3. Testing post creation...');

    if (testEmail && testPassword) {
      // Ensure the test user exists (if service role provided), then sign in
      if (supabaseAdmin) {
        try {
          const { data: createdUser, error: createUserErr } = await supabaseAdmin.auth.admin.createUser({
            email: testEmail,
            password: testPassword,
            email_confirm: true,
          });
          if (createUserErr && !String(createUserErr.message || '').includes('already registered')) {
            console.warn('⚠️ Could not create test user (may already exist):', createUserErr.message);
          } else if (createdUser?.user?.id) {
            console.log('✅ Ensured test user exists:', createdUser.user.id);
          }
        } catch (e) {
          console.warn('⚠️ Admin createUser failed (may already exist):', e.message || e);
        }
      }

      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      if (signInErr || !signInData?.user) {
        console.log('ℹ️ Sign-in failed or user missing. Skipping insert test.');
        console.log('🎉 Connectivity to Supabase confirmed.');
        return;
      }

      const ownerId = signInData.user.id;
      const { data: newPost, error: postErr } = await supabase
        .from('posts')
        .insert({
          user_id: ownerId,
          type: 'item',
          title: 'Test Post',
          description: 'This is a test post',
          price: 10.0,
          category: 'Other',
          location: 'Test Location',
          status: 'active',
          tags: ['test'],
        })
        .select()
        .single();

      if (postErr) {
        console.error('❌ Post creation failed:', postErr.message || postErr);
        return;
      }

      console.log('✅ Post creation successful:', newPost.id);
      console.log('4. Cleaning up test post...');
      await supabase.from('posts').delete().eq('id', newPost.id);
      console.log('✅ Test post deleted');
      console.log('🎉 Connectivity tests completed!');
      return;
    }

    console.log('ℹ️ TEST_EMAIL/TEST_PASSWORD not set. Skipping insert test.');
    console.log('🎉 Connectivity to Supabase confirmed.');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testDatabase(); 