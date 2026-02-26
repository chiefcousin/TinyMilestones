-- ============================================
-- TinyMilestones - Initial Database Schema
-- ============================================

-- gen_random_uuid() is built into PostgreSQL 13+ (used by Supabase)

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,

  -- Subscription
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  subscription_status TEXT NOT NULL DEFAULT 'inactive',
  trial_ends_at TIMESTAMP WITH TIME ZONE,

  -- Stripe (International)
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,

  -- Razorpay (India)
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,

  -- Payment gateway
  payment_gateway TEXT CHECK (payment_gateway IN ('stripe', 'razorpay')),

  -- Region & Localization
  region TEXT NOT NULL DEFAULT 'US',
  currency TEXT NOT NULL DEFAULT 'USD',
  region_source TEXT NOT NULL DEFAULT 'auto' CHECK (region_source IN ('auto', 'manual')),

  -- Cultural preferences
  cultural_context TEXT NOT NULL DEFAULT 'auto' CHECK (cultural_context IN ('universal', 'indian', 'auto')),

  -- Rate limiting
  activities_generated_today INTEGER NOT NULL DEFAULT 0,
  last_activity_reset DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. CHILDREN
-- ============================================
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birthdate DATE NOT NULL,
  avatar_emoji TEXT NOT NULL DEFAULT '👶',
  preferences JSONB NOT NULL DEFAULT '{
    "materials": "household",
    "activity_duration": "any",
    "indoor_outdoor": "both",
    "notes": ""
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_children_user ON public.children(user_id);

ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own children"
  ON public.children FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- 3. ACTIVITIES
-- ============================================
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('Cognitive', 'Fine Motor', 'Gross Motor', 'Language', 'Social-Emotional')),
  duration TEXT,
  description TEXT NOT NULL,
  why_it_matters TEXT,
  materials TEXT[] DEFAULT '{}',
  tip TEXT,
  illustration_key TEXT,
  is_cultural BOOLEAN NOT NULL DEFAULT FALSE,
  cultural_origin TEXT,
  child_age_months INTEGER NOT NULL,
  is_saved BOOLEAN NOT NULL DEFAULT FALSE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activities_user ON public.activities(user_id, created_at DESC);
CREATE INDEX idx_activities_child ON public.activities(child_id, created_at DESC);
CREATE INDEX idx_activities_saved ON public.activities(user_id, is_saved) WHERE is_saved = TRUE;

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own activities"
  ON public.activities FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- 4. ACTIVITY LOGS (rate limiting & analytics)
-- ============================================
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.children(id) ON DELETE SET NULL,
  domain_filter TEXT,
  activities_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id, created_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own activity logs"
  ON public.activity_logs FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- 5. MILESTONES (Phase 2 - CDC/AAP guidelines)
-- ============================================
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_months INTEGER NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('Cognitive', 'Fine Motor', 'Gross Motor', 'Language', 'Social-Emotional')),
  title TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL DEFAULT 'CDC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_milestones_age ON public.milestones(age_months, domain);

-- Milestones are read-only for all authenticated users
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view milestones"
  ON public.milestones FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- 6. CHILD MILESTONES (Phase 2 - tracking)
-- ============================================
CREATE TABLE public.child_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
  achieved BOOLEAN NOT NULL DEFAULT FALSE,
  achieved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, milestone_id)
);

CREATE INDEX idx_child_milestones_child ON public.child_milestones(child_id);

ALTER TABLE public.child_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage milestones for own children"
  ON public.child_milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.children
      WHERE children.id = child_milestones.child_id
      AND children.user_id = auth.uid()
    )
  );

-- ============================================
-- 7. PAYMENT EVENTS (audit log)
-- ============================================
CREATE TABLE public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay')),
  event_type TEXT NOT NULL,
  gateway_event_id TEXT,
  amount INTEGER,
  currency TEXT,
  raw_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_events_user ON public.payment_events(user_id, created_at DESC);

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment events"
  ON public.payment_events FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 8. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 9. UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER children_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
