-- ============================================================
-- SUCCESS BRIDGE — Supabase Database Setup
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)
-- ============================================================

-- 1. Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  membership_status TEXT NOT NULL DEFAULT 'free' CHECK (membership_status IN ('free', 'active', 'cancelled')),
  stripe_customer_id TEXT,
  ebook_purchased BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: users can update their own profile (but NOT membership_status or stripe_customer_id)
CREATE POLICY "Users can update own profile (non-sensitive fields)"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Only allow updating email, not membership_status, stripe_customer_id, or ebook_purchased
    (
      COALESCE(membership_status = OLD.membership_status, true) AND
      COALESCE(stripe_customer_id = OLD.stripe_customer_id, true) AND
      COALESCE(ebook_purchased = OLD.ebook_purchased, true)
    )
  );

-- Note: The service_role key (used by createAdminClient) automatically bypasses RLS.
-- No separate policy is needed — Supabase treats the service role as a super admin.

-- 2. Create the daily_message_counts table for rate limiting
CREATE TABLE IF NOT EXISTS public.daily_message_counts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 1,
  UNIQUE (user_id, date)
);

ALTER TABLE public.daily_message_counts ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own daily count
CREATE POLICY "Users can read own message count"
  ON public.daily_message_counts
  FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Create the chat_messages table to persist conversation history
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own messages
CREATE POLICY "Users can read own chat messages"
  ON public.chat_messages
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: the service role can insert messages (the API uses the admin client)
-- We'll rely on the service_role key for inserts, but also allow authenticated inserts:
CREATE POLICY "Users can insert own chat messages"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Create the increment_message_count function (used by the API)
CREATE OR REPLACE FUNCTION public.increment_message_count(
  p_user_id UUID,
  p_date DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.daily_message_counts (user_id, date, count)
  VALUES (p_user_id, p_date, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET count = public.daily_message_counts.count + 1;
END;
$$;

-- 5. Create a trigger to auto-create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, membership_status)
  VALUES (new.id, new.email, 'free')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Drop the trigger first if it exists, then create it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
