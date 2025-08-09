-- Complete schema setup for both users and posts tables
-- This will create everything from scratch

-- 1. Create users table if it doesn't exist (with full schema)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    university TEXT NOT NULL,
    avatar TEXT,
    bio TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired')),
    tags TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_flash_deal BOOLEAN DEFAULT FALSE,
    flash_deal_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participants TEXT[] NOT NULL,
    last_message_id UUID,
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create rides table
CREATE TABLE IF NOT EXISTS public.rides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    driver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    available_seats INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'full', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_type ON public.posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON public.rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_departure_time ON public.rides(departure_time);

-- 7. Disable RLS temporarily to insert data
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides DISABLE ROW LEVEL SECURITY;

-- 8. Insert the user (with all required fields)
INSERT INTO public.users (id, email, name, university, verified)
VALUES ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'yougi@example.com', 'Test User', 'Purdue University', false)
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    university = EXCLUDED.university;

-- 9. Test inserting a post
INSERT INTO public.posts (user_id, type, title, description, price, category, location, status)
VALUES ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'item', 'Test Post', 'This is a test to verify everything works', 10.00, 'Test', 'Test Location', 'active')
ON CONFLICT (id) DO NOTHING;

-- 10. Verify data was inserted
SELECT 'Users created:' as info, COUNT(*) as count FROM public.users;
SELECT 'Posts created:' as info, COUNT(*) as count FROM public.posts;

-- 11. Clean up test post
DELETE FROM public.posts WHERE title = 'Test Post';

-- 12. Enable RLS with proper policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- 13. Create RLS policies for users table
CREATE POLICY "Allow foreign key validation for users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own record" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own record" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 14. Create RLS policies for posts table
CREATE POLICY "Posts are viewable by everyone" ON public.posts
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- 15. Create RLS policies for messages and conversations
CREATE POLICY "Users can view their own conversations" ON public.conversations
    FOR SELECT USING (auth.uid()::text = ANY(participants));

CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid()::text = ANY(participants));

CREATE POLICY "Users can update their own conversations" ON public.conversations
    FOR UPDATE USING (auth.uid()::text = ANY(participants));

CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 16. Create RLS policies for rides
CREATE POLICY "Rides are viewable by everyone" ON public.rides
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create their own rides" ON public.rides
    FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Users can update their own rides" ON public.rides
    FOR UPDATE USING (auth.uid() = driver_id);

CREATE POLICY "Users can delete their own rides" ON public.rides
    FOR DELETE USING (auth.uid() = driver_id);

-- 17. Final verification
SELECT 'Setup complete!' as status;
SELECT 'Users in database:' as info, id, email FROM public.users;
SELECT 'Posts in database:' as info, COUNT(*) as count FROM public.posts;