-- ============================================================================
-- TicketPlug - Complete Database Setup Script
-- ============================================================================
-- This script DROPS all existing tables and creates a fresh database schema
-- WARNING: This will DELETE ALL DATA. Use only for fresh setup or development.
-- ============================================================================

-- Drop existing tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS public.saved_tickets CASCADE;
DROP TABLE IF EXISTS public.reputation CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.campuses CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.is_valid_edu_email(text) CASCADE;
DROP FUNCTION IF EXISTS public.extract_email_domain(text) CASCADE;
DROP FUNCTION IF EXISTS public.mark_ticket_sold(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.ban_user(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_campuses_updated_at ON public.campuses;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
DROP TRIGGER IF EXISTS update_tickets_updated_at ON public.tickets;

-- ============================================================================
-- 1. CAMPUSES TABLE
-- ============================================================================
CREATE TABLE public.campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL UNIQUE, -- e.g., "purdue.edu", "iu.edu"
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================================
-- 2. USERS TABLE
-- ============================================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
  avatar TEXT,
  
  -- Verification
  verified BOOLEAN DEFAULT false NOT NULL,
  email_verified BOOLEAN DEFAULT false NOT NULL,
  is_edu_email BOOLEAN DEFAULT false NOT NULL,
  
  -- Contact information
  snapchat_handle TEXT,
  instagram_handle TEXT,
  phone_number TEXT,
  
  -- Reputation
  reputation_score INTEGER DEFAULT 0 NOT NULL,
  successful_sales INTEGER DEFAULT 0 NOT NULL,
  
  -- Moderation
  is_banned BOOLEAN DEFAULT false NOT NULL,
  ban_reason TEXT,
  banned_at TIMESTAMPTZ,
  
  -- Profile
  date_of_birth DATE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================================
-- 3. EVENTS TABLE
-- ============================================================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES public.campuses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  venue TEXT,
  description TEXT,
  category TEXT, -- e.g., "sports", "concert", "party", "theater", "other"
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================================
-- 4. TICKETS TABLE
-- ============================================================================
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  campus_id UUID REFERENCES public.campuses(id) ON DELETE CASCADE NOT NULL,
  
  -- Ticket details
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  quantity INTEGER DEFAULT 1 NOT NULL,
  quantity_sold INTEGER DEFAULT 0 NOT NULL,
  
  -- Event details (denormalized for easier querying)
  event_name TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  event_venue TEXT,
  
  -- Images
  images TEXT[] DEFAULT '{}' NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'sold', 'expired', 'removed')),
  
  -- Metadata
  views INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ
);

-- ============================================================================
-- 5. REPORTS TABLE
-- ============================================================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reported_ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================================
-- 6. REPUTATION TABLE
-- ============================================================================
CREATE TABLE public.reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL, -- Positive for good, negative for bad
  reason TEXT,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================================
-- 7. SAVED TICKETS TABLE
-- ============================================================================
CREATE TABLE public.saved_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, ticket_id) -- Prevent duplicate saves
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Campuses
CREATE INDEX idx_campuses_domain ON public.campuses(domain);
CREATE INDEX idx_campuses_is_active ON public.campuses(is_active);

-- Users
CREATE INDEX idx_users_campus_id ON public.users(campus_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_is_banned ON public.users(is_banned);

-- Events
CREATE INDEX idx_events_campus_id ON public.events(campus_id);
CREATE INDEX idx_events_event_date ON public.events(event_date);
CREATE INDEX idx_events_category ON public.events(category);

-- Tickets
CREATE INDEX idx_tickets_seller_id ON public.tickets(seller_id);
CREATE INDEX idx_tickets_campus_id ON public.tickets(campus_id);
CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_event_date ON public.tickets(event_date);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at DESC);

-- Reports
CREATE INDEX idx_reports_reporter_id ON public.reports(reporter_id);
CREATE INDEX idx_reports_reported_ticket_id ON public.reports(reported_ticket_id);
CREATE INDEX idx_reports_reported_user_id ON public.reports(reported_user_id);
CREATE INDEX idx_reports_status ON public.reports(status);

-- Reputation
CREATE INDEX idx_reputation_user_id ON public.reputation(user_id);

-- Saved Tickets
CREATE INDEX idx_saved_tickets_user_id ON public.saved_tickets(user_id);
CREATE INDEX idx_saved_tickets_ticket_id ON public.saved_tickets(ticket_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check if email is .edu
CREATE OR REPLACE FUNCTION public.is_valid_edu_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '\.edu$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract domain from email
CREATE OR REPLACE FUNCTION public.extract_email_domain(email TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(split_part(email, '@', 2));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to mark ticket as sold
CREATE OR REPLACE FUNCTION public.mark_ticket_sold(ticket_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.tickets
  SET 
    status = 'sold',
    sold_at = now(),
    updated_at = now()
  WHERE id = ticket_id;
END;
$$ LANGUAGE plpgsql;

-- Function to ban user
CREATE OR REPLACE FUNCTION public.ban_user(user_id UUID, reason_text TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET 
    is_banned = true,
    ban_reason = reason_text,
    banned_at = now(),
    updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at for campuses
CREATE TRIGGER update_campuses_updated_at
  BEFORE UPDATE ON public.campuses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-update updated_at for users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-update updated_at for events
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-update updated_at for tickets
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_tickets ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CAMPUSES POLICIES
-- ============================================================================

-- Anyone can read active campuses
CREATE POLICY "Campuses are viewable by everyone"
  ON public.campuses FOR SELECT
  USING (is_active = true);

-- ============================================================================
-- USERS POLICIES
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can view other users' profiles (for seller info)
CREATE POLICY "Users can view other profiles"
  ON public.users FOR SELECT
  USING (is_banned = false);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- EVENTS POLICIES
-- ============================================================================

-- Anyone can read events
CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (true);

-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- TICKETS POLICIES
-- ============================================================================

-- Anyone can read active tickets
CREATE POLICY "Active tickets are viewable by everyone"
  ON public.tickets FOR SELECT
  USING (status = 'active');

-- Authenticated users can create tickets
CREATE POLICY "Users can create tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (auth.uid() = seller_id AND auth.role() = 'authenticated');

-- Sellers can update their own tickets
CREATE POLICY "Sellers can update own tickets"
  ON public.tickets FOR UPDATE
  USING (auth.uid() = seller_id);

-- Sellers can delete their own tickets
CREATE POLICY "Sellers can delete own tickets"
  ON public.tickets FOR DELETE
  USING (auth.uid() = seller_id);

-- ============================================================================
-- REPORTS POLICIES
-- ============================================================================

-- Users can create reports
CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- ============================================================================
-- REPUTATION POLICIES
-- ============================================================================

-- Anyone can read reputation
CREATE POLICY "Reputation is viewable by everyone"
  ON public.reputation FOR SELECT
  USING (true);

-- ============================================================================
-- SAVED TICKETS POLICIES
-- ============================================================================

-- Users can view their own saved tickets
CREATE POLICY "Users can view own saved tickets"
  ON public.saved_tickets FOR SELECT
  USING (auth.uid() = user_id);

-- Users can save tickets
CREATE POLICY "Users can save tickets"
  ON public.saved_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unsave tickets
CREATE POLICY "Users can unsave tickets"
  ON public.saved_tickets FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert initial campuses (only IU and Purdue active)
INSERT INTO public.campuses (name, domain, location, is_active) VALUES
  ('Indiana University', 'iu.edu', 'Bloomington, IN', true),
  ('Purdue University', 'purdue.edu', 'West Lafayette, IN', true),
  ('University of Michigan', 'umich.edu', 'Ann Arbor, MI', false),
  ('Ohio State University', 'osu.edu', 'Columbus, OH', false),
  ('Michigan State University', 'msu.edu', 'East Lansing, MI', false),
  ('University of Illinois', 'illinois.edu', 'Urbana-Champaign, IL', false)
ON CONFLICT (domain) DO NOTHING;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ TicketPlug database setup complete!';
  RAISE NOTICE '   - All tables created';
  RAISE NOTICE '   - Indexes created';
  RAISE NOTICE '   - Functions created';
  RAISE NOTICE '   - Triggers created';
  RAISE NOTICE '   - RLS policies enabled';
  RAISE NOTICE '   - Seed data inserted';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Next steps:';
  RAISE NOTICE '   1. Run: npm run db:check';
  RAISE NOTICE '   2. Test the app: npm start';
END $$;

