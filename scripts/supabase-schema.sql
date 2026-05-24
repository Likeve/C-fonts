-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/yidmtrrbeilhjxegdqae/sql/new

-- Track which fonts each user has downloaded (free downloads)
CREATE TABLE IF NOT EXISTS user_downloads (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  font_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, font_id)
);

-- Track user plans (free / unlimited)
CREATE TABLE IF NOT EXISTS user_plans (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'unlimited')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create free plan row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_plans (user_id, plan) VALUES (NEW.id, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enable RLS
ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

-- user_downloads policies
CREATE POLICY "Users can read own downloads"
  ON user_downloads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own downloads"
  ON user_downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- user_plans policies
CREATE POLICY "Users can read own plan"
  ON user_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own plan"
  ON user_plans FOR UPDATE
  USING (auth.uid() = user_id);
