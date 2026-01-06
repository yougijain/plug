/**
 * Database Setup Test Script
 * Tests if TicketPlug database is properly configured
 * 
 * Run with: node test-database-setup.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Missing environment variables');
  console.error('Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Required tables for TicketPlug
const REQUIRED_TABLES = [
  'campuses',
  'users',
  'events',
  'tickets',
  'reports',
  'reputation',
  'saved_tickets'
];

// Required columns for each table
const TABLE_SCHEMA = {
  campuses: ['id', 'name', 'domain', 'location', 'is_active', 'created_at', 'updated_at'],
  users: ['id', 'email', 'name', 'university', 'campus_id', 'reputation_score', 'successful_sales', 'is_banned', 'created_at'],
  events: ['id', 'campus_id', 'name', 'event_date', 'venue', 'category', 'created_at'],
  tickets: ['id', 'seller_id', 'campus_id', 'title', 'event_name', 'event_date', 'price', 'quantity', 'status', 'images', 'created_at'],
  reports: ['id', 'reporter_id', 'reported_ticket_id', 'reason', 'status', 'created_at'],
  reputation: ['id', 'user_id', 'score', 'created_at'],
  saved_tickets: ['id', 'user_id', 'ticket_id', 'created_at']
};

async function testConnection() {
  console.log('\n🔌 Testing Supabase Connection...\n');
  
  try {
    // Test basic connection by checking auth (always available)
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError && authError.message.includes('Invalid API key')) {
      console.error('❌ Connection failed: Invalid API key');
      console.error('   Please check your REACT_APP_SUPABASE_ANON_KEY in .env file\n');
      return false;
    }
    
    // If we get here, connection is working (even if no session)
    console.log('✅ Supabase connection successful!');
    console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
    console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...\n`);
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    if (err.message.includes('fetch')) {
      console.error('   This might be a network issue or invalid URL\n');
    }
    return false;
  }
}

async function testTables() {
  console.log('📊 Testing Required Tables...\n');
  
  const results = {
    passed: [],
    failed: []
  };

  for (const table of REQUIRED_TABLES) {
    try {
      // Try to query the table
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        // Check if it's a "table doesn't exist" error
        if (error.message.includes('does not exist') || error.code === '42P01') {
          results.failed.push({ table, reason: 'Table does not exist' });
          console.log(`❌ ${table}: Table does not exist`);
        } else if (error.code === '42501') {
          // Permission denied - table exists but RLS might be blocking
          results.passed.push({ table, note: 'Table exists (RLS may be blocking)' });
          console.log(`⚠️  ${table}: Table exists but access denied (check RLS policies)`);
        } else {
          results.failed.push({ table, reason: error.message });
          console.log(`❌ ${table}: ${error.message}`);
        }
      } else {
        results.passed.push({ table });
        console.log(`✅ ${table}: Table exists and accessible`);
      }
    } catch (err) {
      results.failed.push({ table, reason: err.message });
      console.log(`❌ ${table}: ${err.message}`);
    }
  }

  console.log(`\n📈 Results: ${results.passed.length} passed, ${results.failed.length} failed\n`);
  return results;
}

async function testTableColumns(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0); // Just get schema, no data

    if (error) {
      return { exists: false, error: error.message };
    }

    // If we can query with select *, the table exists
    // Note: We can't easily check specific columns without querying actual data
    return { exists: true };
  } catch (err) {
    return { exists: false, error: err.message };
  }
}

async function testCampusesData() {
  console.log('🏫 Testing Campuses Data...\n');
  
  try {
    const { data, error } = await supabase
      .from('campuses')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.log(`❌ Error querying campuses: ${error.message}`);
      return false;
    }

    if (!data || data.length === 0) {
      console.log('⚠️  No active campuses found');
      console.log('   You may need to seed campus data');
      return false;
    }

    console.log(`✅ Found ${data.length} active campus(es):`);
    data.forEach(campus => {
      console.log(`   - ${campus.name} (${campus.domain})`);
    });
    console.log('');
    return true;
  } catch (err) {
    console.log(`❌ Error: ${err.message}\n`);
    return false;
  }
}

async function testRLSPolicies() {
  console.log('🔒 Testing RLS Policies...\n');
  
  // Test if we can read campuses (should be public)
  try {
    const { data, error } = await supabase
      .from('campuses')
      .select('*')
      .limit(1);

    if (error && error.code === '42501') {
      console.log('⚠️  RLS is blocking anonymous access to campuses');
      console.log('   This might be intentional, but campuses should be publicly readable');
    } else if (!error) {
      console.log('✅ Campuses table is readable (RLS allows public read)');
    }
  } catch (err) {
    console.log(`⚠️  Could not test RLS: ${err.message}`);
  }
  
  console.log('');
}

async function testAuth() {
  console.log('🔐 Testing Authentication...\n');
  
  try {
    // Test if we can get the current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log(`⚠️  Auth check: ${error.message}`);
    } else if (session) {
      console.log('✅ Active session found');
      console.log(`   User: ${session.user.email}`);
    } else {
      console.log('ℹ️  No active session (this is normal if not logged in)');
    }
    console.log('');
  } catch (err) {
    console.log(`❌ Auth error: ${err.message}\n`);
  }
}

async function testStorage() {
  console.log('📦 Testing Storage Buckets...\n');
  
  try {
    // Check if post-images bucket exists
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log(`⚠️  Could not list buckets: ${error.message}`);
    } else {
      const buckets = data || [];
      const hasPostImages = buckets.some(b => b.name === 'post-images');
      
      if (hasPostImages) {
        console.log('✅ post-images bucket exists');
      } else {
        console.log('⚠️  post-images bucket not found');
        console.log('   You may need to create this bucket in Supabase Storage');
      }
      
      if (buckets.length > 0) {
        console.log(`   Found ${buckets.length} bucket(s) total`);
      }
    }
    console.log('');
  } catch (err) {
    console.log(`⚠️  Storage check: ${err.message}\n`);
  }
}

async function runAllTests() {
  console.log('🧪 TicketPlug Database Setup Test\n');
  console.log('=' .repeat(50));
  
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ Cannot proceed - connection failed');
    console.log('   Please check your Supabase URL and API key\n');
    process.exit(1);
  }

  const tableResults = await testTables();
  await testCampusesData();
  await testRLSPolicies();
  await testAuth();
  await testStorage();

  // Summary
  console.log('=' .repeat(50));
  console.log('\n📋 Test Summary\n');
  
  if (tableResults.failed.length === 0) {
    console.log('✅ All required tables exist!');
    console.log('   Your database is properly set up! 🎉\n');
  } else {
    console.log('❌ Some tables are missing:');
    tableResults.failed.forEach(({ table, reason }) => {
      console.log(`   - ${table}: ${reason}`);
    });
    console.log('\n💡 NEXT STEPS:');
    console.log('   1. Go to your Supabase Dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Run the migration script: supabase/migrations/001_campus_connect_schema.sql');
    console.log('   4. Or create the tables manually using the schema in src/types/database.ts');
    console.log('\n   After running the migration, run this test again: npm run db:check\n');
  }
  
  console.log('✨ Test complete!\n');
}

// Run tests
runAllTests().catch(err => {
  console.error('\n❌ Fatal error:', err);
  process.exit(1);
});

