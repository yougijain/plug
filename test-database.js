// Test script to check database connection
// Run this with: node test-database.js

const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Environment Variables Check:');
console.log('REACT_APP_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('REACT_APP_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');

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

async function testDatabase() {
  console.log('');
  console.log('🔍 Testing database connection...');
  
  try {
    // Test 1: Check if we can connect
    console.log('1. Testing connection...');
    const { data, error } = await supabase.from('posts').select('count').limit(1);
    
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
    
    // Test 3: Try to create a test post
    console.log('3. Testing post creation...');
    const testPost = {
      user_id: '494dee7d-cd2d-4ef9-bf76-2887a9fe140d',
      type: 'item',
      title: 'Test Post',
      description: 'This is a test post',
      price: 10.00,
      category: 'Other',
      location: 'Test Location',
      status: 'active',
      tags: ['test']
    };
    
    const { data: newPost, error: createError } = await supabase
      .from('posts')
      .insert(testPost)
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Post creation failed:', createError.message);
      
      if (createError.message.includes('permission denied')) {
        console.log('💡 Permission denied. Check RLS policies for INSERT.');
      } else if (createError.message.includes('violates not-null constraint')) {
        console.log('💡 Missing required fields. Check table schema.');
      }
      
      return;
    }
    
    console.log('✅ Post creation successful:', newPost.id);
    
    // Clean up: Delete the test post
    console.log('4. Cleaning up test post...');
    await supabase.from('posts').delete().eq('id', newPost.id);
    console.log('✅ Test post deleted');
    
    console.log('🎉 All database tests passed!');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testDatabase(); 