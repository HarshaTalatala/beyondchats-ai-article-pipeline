-- PostgreSQL schema for articles table (Neon-compatible)

CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'original',
  original_article_id BIGINT REFERENCES articles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful index for fetch ordering
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles (created_at DESC);
