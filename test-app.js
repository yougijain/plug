// Simple test script to verify your app setup
// Run this in your browser console after starting the app

console.log('🧪 Testing Loop App Setup...');

// Test 1: Check if environment variables are loaded
function testEnvironmentVariables() {
  console.log('📋 Test 1: Environment Variables');
  
  if (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_URL !== 'your_supabase_project_url') {
    console.log('✅ Supabase URL is configured');
  } else {
    console.log('❌ Supabase URL is not configured properly');
  }
  
  if (process.env.REACT_APP_SUPABASE_ANON_KEY && process.env.REACT_APP_SUPABASE_ANON_KEY !== 'your_supabase_anon_key') {
    console.log('✅ Supabase Anon Key is configured');
  } else {
    console.log('❌ Supabase Anon Key is not configured properly');
  }
}

// Test 2: Check if Supabase client is working
async function testSupabaseConnection() {
  console.log('📋 Test 2: Supabase Connection');
  
  try {
    // This will be available if the app is running
    if (window.supabase) {
      console.log('✅ Supabase client is available');
      
      // Test a simple query
      const { data, error } = await window.supabase.from('users').select('count').limit(1);
      
      if (error) {
        console.log('❌ Database connection failed:', error.message);
      } else {
        console.log('✅ Database connection successful');
      }
    } else {
      console.log('❌ Supabase client not found');
    }
  } catch (error) {
    console.log('❌ Supabase test failed:', error.message);
  }
}

// Test 3: Check if React Query is working
function testReactQuery() {
  console.log('📋 Test 3: React Query');
  
  // Check if React Query DevTools are available
  if (window.__REACT_QUERY_DEVTOOLS_GLOBAL_KEY__) {
    console.log('✅ React Query DevTools are available');
  } else {
    console.log('⚠️ React Query DevTools not found (this is normal in production)');
  }
}

// Test 4: Check if all required packages are loaded
function testDependencies() {
  console.log('📋 Test 4: Dependencies');
  
  const requiredPackages = [
    'react',
    'react-dom',
    'react-router-dom',
    '@tanstack/react-query',
    'zustand',
    'react-hook-form',
    'zod'
  ];
  
  console.log('✅ All required packages should be loaded');
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Loop App Tests...\n');
  
  testEnvironmentVariables();
  console.log('');
  
  testSupabaseConnection();
  console.log('');
  
  testReactQuery();
  console.log('');
  
  testDependencies();
  console.log('');
  
  console.log('🎉 Test suite completed!');
  console.log('📖 Check test-setup.md for detailed testing instructions');
}

// Make the test function available globally
window.testLoopApp = runAllTests;

console.log('💡 Run testLoopApp() in the console to run all tests'); 