-- Tinder for Movies - Database Schema
-- Run this SQL in your Supabase SQL Editor to create all necessary tables

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MOVIES TABLE
-- Stores the catalog of movies users can swipe through
-- ============================================
CREATE TABLE IF NOT EXISTS movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  poster_url TEXT,
  genres TEXT[], -- Array of genre strings (e.g., ['Action', 'Thriller'])
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SESSIONS TABLE
-- Represents a matching session between users
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USERS TABLE
-- Represents participants in a session (User A and User B)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SWIPES TABLE
-- Records each user's swipe decision on a movie
-- ============================================
CREATE TABLE IF NOT EXISTS swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  choice TEXT NOT NULL CHECK (choice IN ('yes', 'no')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure each user can only swipe once per movie
  UNIQUE(user_id, movie_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_movie_id ON swipes(movie_id);
CREATE INDEX IF NOT EXISTS idx_users_session_id ON users(session_id);
CREATE INDEX IF NOT EXISTS idx_swipes_choice ON swipes(choice);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- For MVP, we'll disable RLS to keep things simple
-- In production, you'd want to enable RLS with proper policies
-- ============================================
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access to all tables (MVP only - not for production!)
CREATE POLICY "Allow public read access on movies" ON movies FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on movies" ON movies FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on sessions" ON sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on users" ON users FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on swipes" ON swipes FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on swipes" ON swipes FOR INSERT WITH CHECK (true);

-- ============================================
-- HELPFUL VIEWS
-- ============================================

-- View to get session details with user counts
CREATE OR REPLACE VIEW session_details AS
SELECT
  s.id,
  s.session_name,
  s.created_at,
  COUNT(DISTINCT u.id) as user_count,
  COUNT(DISTINCT sw.id) as total_swipes
FROM sessions s
LEFT JOIN users u ON s.id = u.session_id
LEFT JOIN swipes sw ON u.id = sw.user_id
GROUP BY s.id, s.session_name, s.created_at;

-- ============================================
-- HELPER FUNCTION: Get matches for a session
-- Returns all movies that ALL users in a session liked
-- ============================================
CREATE OR REPLACE FUNCTION get_session_matches(session_uuid UUID)
RETURNS TABLE (
  movie_id UUID,
  title TEXT,
  year INTEGER,
  poster_url TEXT,
  genres TEXT[],
  description TEXT
) AS $$
DECLARE
  total_users INTEGER;
BEGIN
  -- Get the total number of users in the session
  SELECT COUNT(*) INTO total_users
  FROM users
  WHERE session_id = session_uuid;

  -- If there are no users, return empty result
  IF total_users = 0 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT DISTINCT
    m.id,
    m.title,
    m.year,
    m.poster_url,
    m.genres,
    m.description
  FROM movies m
  WHERE m.id IN (
    -- Get movies where ALL users said 'yes'
    -- This works by counting how many 'yes' swipes each movie has
    -- and only including movies where the count equals total_users
    SELECT s.movie_id
    FROM swipes s
    INNER JOIN users u ON s.user_id = u.id
    WHERE u.session_id = session_uuid
      AND s.choice = 'yes'
    GROUP BY s.movie_id
    HAVING COUNT(DISTINCT s.user_id) = total_users
  )
  ORDER BY m.title;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE movies IS 'Catalog of movies that users can swipe through';
COMMENT ON TABLE sessions IS 'Matching sessions between users';
COMMENT ON TABLE users IS 'Participants in a session';
COMMENT ON TABLE swipes IS 'Records of user swipe decisions on movies';
COMMENT ON FUNCTION get_session_matches IS 'Returns all movies that ALL users in a session liked';
