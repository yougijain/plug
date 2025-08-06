-- Complete schema setup for both users and posts tables
-- This will create everything from scratch

-- 1. Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create posts table with proper foreign key
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('item', 'service', 'ride', 'ticket', 'book', 'sublet')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2),
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold', 'expired')),
    tags TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_type ON public.posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- 4. Disable RLS temporarily to insert data
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;

-- 5. Insert the user
INSERT INTO public.users (id, email)
VALUES ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'yougi@example.com')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- 6. Test inserting a post
INSERT INTO public.posts (user_id, type, title, description, price, category, location, status)
VALUES ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'item', 'Test Post', 'This is a test to verify everything works', 10.00, 'Test', 'Test Location', 'active')
ON CONFLICT (id) DO NOTHING;

-- 7. Verify data was inserted
SELECT 'Users created:' as info, COUNT(*) as count FROM public.users;
SELECT 'Posts created:' as info, COUNT(*) as count FROM public.posts;

-- 8. Clean up test post
DELETE FROM public.posts WHERE title = 'Test Post';

-- 9. Enable RLS with proper policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies for users table
CREATE POLICY "Allow foreign key validation for users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own record" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own record" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 11. Create RLS policies for posts table
CREATE POLICY "Posts are viewable by everyone" ON public.posts
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- 12. Final verification
SELECT 'Setup complete!' as status;
SELECT 'Users in database:' as info, id, email FROM public.users;
SELECT 'Posts in database:' as info, COUNT(*) as count FROM public.posts;