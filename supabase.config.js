module.exports = {
  // Supabase project configuration
  project: {
    url: process.env.REACT_APP_SUPABASE_URL,
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  
  // Database schema reference
  schema: {
    tables: ['users', 'posts', 'messages', 'conversations', 'rides'],
    types: './src/types/database.ts'
  },
  
  // API patterns
  api: {
    patterns: './src/lib/api.ts',
    auth: './src/lib/supabase.ts'
  }
} 