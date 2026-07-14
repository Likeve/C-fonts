-- Migration: add indexes to user_purchases for columns used in WHERE, JOIN, and ORDER BY
-- The UNIQUE(user_id, font_id) constraint already covers composite lookups,
-- but individual indexes on user_id and font_id improve single-column filtering.

CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id
  ON user_purchases (user_id);

CREATE INDEX IF NOT EXISTS idx_user_purchases_font_id
  ON user_purchases (font_id);

CREATE INDEX IF NOT EXISTS idx_user_purchases_created_at
  ON user_purchases (created_at DESC);
