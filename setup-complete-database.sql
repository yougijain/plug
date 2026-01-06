-- ============================================================================
-- TicketPlug - Complete Database Setup Script
-- ============================================================================
-- This script creates the ENTIRE database schema from scratch
-- Run this in Supabase SQL Editor to set up everything at once
-- ============================================================================

-- ============================================================================
-- 1. CREATE USERS TABLE (if it doesn't exist)
-- ============================================================================
-- Note: Supabase has auth.users, but we need public.users for profiles
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  avatar TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. CREATE CAMPUSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL UNIQUE, -- e.g., "purdue.edu"
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 3. UPDATE USERS TABLE (Add TicketPlug-specific columns)
-- ============================================================================
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES public.campuses(id),
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_edu_email BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS snapchat_handle TEXT,
  ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS successful_sales INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ban_reason TEXT,
  ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- ============================================================================
-- 4. CREATE EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES public.campuses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  venue TEXT,
  description TEXT,
  category TEXT, -- e.g., "sports", "concert", "party", "theater", "other"
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 5. CREATE TICKETS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  campus_id UUID REFERENCES public.campuses(id) ON DELETE CASCADE NOT NULL,
  
  -- Ticket details
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  quantity INTEGER DEFAULT 1,
  quantity_sold INTEGER DEFAULT 0,
  
  -- Event details (denormalized for easier querying)
  event_name TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  event_venue TEXT,
  
  -- Images
  images TEXT[] DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'removed')),
  
  -- Metadata
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ
);

-- ============================================================================
-- 6. CREATE REPORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reported_ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 7. CREATE REPUTATION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE SET NULL,
  change_amount INTEGER NOT NULL, -- positive or negative
  reason TEXT NOT NULL, -- e.g., "completed_sale", "verified_purchase", "report_violation"
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 8. CREATE SAVED_TICKETS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.saved_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, ticket_id)
);

-- ============================================================================
-- 9. CREATE INDEXES (for performance)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_tickets_campus ON public.tickets(campus_id);
CREATE INDEX IF NOT EXISTS idx_tickets_seller ON public.tickets(seller_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON public.tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON public.tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_event_date ON public.tickets(event_date);
CREATE INDEX IF NOT EXISTS idx_events_campus ON public.events(campus_id);
CREATE INDEX IF NOT EXISTS idx_users_campus ON public.users(campus_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reputation_user ON public.reputation(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_tickets_user ON public.saved_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_tickets_ticket ON public.saved_tickets(ticket_id);

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Campuses: Public read
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Campuses are viewable by everyone" ON public.campuses;
CREATE POLICY "Campuses are viewable by everyone" ON public.campuses FOR SELECT USING (true);

-- Users: Users can read all verified users, update own profile
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view verified users on their campus" ON public.users;
CREATE POLICY "Users can view verified users on their campus" ON public.users 
  FOR SELECT USING (email_verified = true AND is_banned = false);
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Events: Public read, authenticated create
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events" ON public.events 
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Tickets: Campus members can view, sellers can manage
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active tickets viewable by campus members" ON public.tickets;
CREATE POLICY "Active tickets viewable by campus members" ON public.tickets 
  FOR SELECT USING (
    status = 'active' 
    AND campus_id IN (SELECT campus_id FROM public.users WHERE id = auth.uid())
  );
DROP POLICY IF EXISTS "Sellers can insert their tickets" ON public.tickets;
CREATE POLICY "Sellers can insert their tickets" ON public.tickets 
  FOR INSERT WITH CHECK (auth.uid() = seller_id);
DROP POLICY IF EXISTS "Sellers can update their tickets" ON public.tickets;
CREATE POLICY "Sellers can update their tickets" ON public.tickets 
  FOR UPDATE USING (auth.uid() = seller_id);
DROP POLICY IF EXISTS "Sellers can delete their tickets" ON public.tickets;
CREATE POLICY "Sellers can delete their tickets" ON public.tickets 
  FOR DELETE USING (auth.uid() = seller_id);

-- Reports: Users can create, admins can manage
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports" ON public.reports 
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Users can view their own reports" ON public.reports 
  FOR SELECT USING (auth.uid() = reporter_id);

-- Reputation: Public read for user's own reputation
ALTER TABLE public.reputation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view all reputation" ON public.reputation;
CREATE POLICY "Users can view all reputation" ON public.reputation FOR SELECT USING (true);

-- Saved Tickets: Users manage their own
ALTER TABLE public.saved_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own saved tickets" ON public.saved_tickets;
CREATE POLICY "Users can view own saved tickets" ON public.saved_tickets 
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can save tickets" ON public.saved_tickets;
CREATE POLICY "Users can save tickets" ON public.saved_tickets 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can unsave tickets" ON public.saved_tickets;
CREATE POLICY "Users can unsave tickets" ON public.saved_tickets 
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 11. TRIGGERS (Auto-update updated_at timestamps)
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_campuses_updated_at ON public.campuses;
CREATE TRIGGER update_campuses_updated_at BEFORE UPDATE ON public.campuses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tickets_updated_at ON public.tickets;
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 12. HELPER FUNCTIONS
-- ============================================================================

-- Function to validate .edu email domain
CREATE OR REPLACE FUNCTION is_valid_edu_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.edu$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract domain from email
CREATE OR REPLACE FUNCTION extract_email_domain(email TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(SPLIT_PART(email, '@', 2));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to mark ticket as sold
CREATE OR REPLACE FUNCTION mark_ticket_sold(ticket_id UUID, quantity_to_mark INTEGER DEFAULT NULL)
RETURNS void AS $$
DECLARE
  ticket_record RECORD;
  mark_qty INTEGER;
BEGIN
  SELECT * INTO ticket_record FROM public.tickets WHERE id = ticket_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Ticket not found';
  END IF;
  
  mark_qty := COALESCE(quantity_to_mark, ticket_record.quantity);
  
  UPDATE public.tickets 
  SET 
    quantity_sold = quantity_sold + mark_qty,
    status = CASE 
      WHEN (quantity_sold + mark_qty) >= quantity THEN 'sold'
      ELSE status
    END,
    sold_at = CASE 
      WHEN (quantity_sold + mark_qty) >= quantity THEN now()
      ELSE sold_at
    END
  WHERE id = ticket_id;
  
  -- Add reputation to seller
  INSERT INTO public.reputation (user_id, ticket_id, change_amount, reason)
  VALUES (ticket_record.seller_id, ticket_id, 10, 'completed_sale');
  
  UPDATE public.users 
  SET 
    reputation_score = reputation_score + 10,
    successful_sales = successful_sales + 1
  WHERE id = ticket_record.seller_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle user ban
CREATE OR REPLACE FUNCTION ban_user(user_id UUID, reason TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.users 
  SET 
    is_banned = true,
    ban_reason = reason,
    banned_at = now()
  WHERE id = user_id;
  
  -- Remove all active tickets
  UPDATE public.tickets 
  SET status = 'removed'
  WHERE seller_id = user_id AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 13. SEED DATA (Initial campuses - only IU and Purdue active)
-- ============================================================================
INSERT INTO public.campuses (name, domain, location, is_active) VALUES
  ('Indiana University', 'iu.edu', 'Bloomington, IN', true),
  ('Purdue University', 'purdue.edu', 'West Lafayette, IN', true),
  ('University of Michigan', 'umich.edu', 'Ann Arbor, MI', false),
  ('Ohio State University', 'osu.edu', 'Columbus, OH', false),
  ('Michigan State University', 'msu.edu', 'East Lansing, MI', false),
  ('University of Illinois', 'illinois.edu', 'Urbana-Champaign, IL', false)
ON CONFLICT (domain) DO UPDATE SET
  is_active = EXCLUDED.is_active,
  location = EXCLUDED.location;

-- ============================================================================
-- 14. TABLE COMMENTS (Documentation)
-- ============================================================================
COMMENT ON TABLE public.campuses IS 'Verified universities and colleges';
COMMENT ON TABLE public.tickets IS 'Event ticket listings';
COMMENT ON TABLE public.events IS 'Campus events';
COMMENT ON TABLE public.reports IS 'User and ticket reports for moderation';
COMMENT ON TABLE public.reputation IS 'User reputation transaction history';
COMMENT ON TABLE public.saved_tickets IS 'User saved/bookmarked tickets';

-- ============================================================================
-- ✅ SETUP COMPLETE!
-- ============================================================================
-- Run: npm run db:check to verify everything is set up correctly
-- ============================================================================

