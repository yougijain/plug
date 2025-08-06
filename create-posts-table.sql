-- Create the posts table with the exact schema your app expects
-- Based on your React app code and database types

-- 1. Create the posts table
CREATE TABLE public.posts (
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

-- 2. Create indexes for performance
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_type ON public.posts(type);
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);

-- 3. Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
CREATE POLICY "Posts are viewable by everyone" ON public.posts
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Test insert to make sure everything works
INSERT INTO public.posts (user_id, type, title, description, price, category, location, status, tags)
VALUES (
    '494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 
    'item', 
    'Test Post - Delete Me', 
    'This is a test post to verify the table works correctly', 
    25.50, 
    'Test', 
    'Test Location', 
    'active',
    ARRAY['test', 'verification']
);

-- 6. Verify the test post was created
SELECT 'POST CREATION TEST:' as info;
SELECT id, title, price, user_id FROM public.posts WHERE title = 'Test Post - Delete Me';

-- 7. Clean up test post
DELETE FROM public.posts WHERE title = 'Test Post - Delete Me';

-- 8. Final verification
SELECT 'POSTS TABLE READY!' as status;
SELECT 'Table created with ' || COUNT(*) || ' posts' as result FROM public.posts;