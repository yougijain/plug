-- Database Setup for Loop App
-- Run this in your Supabase SQL Editor

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('item', 'service', 'ride', 'ticket', 'book', 'sublet')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2),
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold', 'expired')),
    tags TEXT[] DEFAULT '{}',
    is_flash_deal BOOLEAN DEFAULT false,
    flash_deal_expires_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anyone to read active posts
CREATE POLICY "Anyone can read active posts" ON public.posts
    FOR SELECT USING (status = 'active');

-- Allow authenticated users to create posts
CREATE POLICY "Authenticated users can create posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update their own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete their own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_type ON public.posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- Temporarily disable RLS to insert the user, then re-enable it
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Insert the current user into the existing users table
-- Using only columns that definitely exist in SQL context: id, email
INSERT INTO public.users (id, email)
VALUES 
    ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'yougi@example.com')
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create or update RLS policy to allow users to insert their own records
DROP POLICY IF EXISTS "Users can insert their own record" ON public.users;
CREATE POLICY "Users can insert their own record" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create or update RLS policy to allow users to view their own record
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;
CREATE POLICY "Users can view their own record" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Create or update RLS policy to allow users to update their own record
DROP POLICY IF EXISTS "Users can update their own record" ON public.users;
CREATE POLICY "Users can update their own record" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Insert some sample data (optional)
-- Based on inspection: posts table has columns: id, user_id, title, description, price, category, location, type, status, tags, images, created_at, expires_at
INSERT INTO public.posts (user_id, type, title, description, price, category, location, status, tags)
VALUES 
    ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'item', 'iPhone 13 Pro', 'Perfect condition, 128GB, comes with case and charger.', 800.00, 'Electronics', 'Purdue Campus', 'active', ARRAY['iphone', 'electronics', 'phone']),
    ('494dee7d-cd2d-4ef9-bf76-2887a9fe140d', 'service', 'Math Tutoring', 'Calculus and linear algebra tutoring. $20/hour.', 20.00, 'Education', 'Indiana University Campus', 'active', ARRAY['tutoring', 'math', 'education'])
ON CONFLICT DO NOTHING; 