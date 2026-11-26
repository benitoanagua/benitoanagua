-- Projects CMS schema. Public project records are read from D1 by the runtime loaders.
CREATE TABLE IF NOT EXISTS portfolio_projects (
  slug TEXT PRIMARY KEY NOT NULL,
  area TEXT NOT NULL CHECK (area IN ('dev', 'design', 'graphic', 'analysis', 'games')),
  year TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  status TEXT CHECK (status IS NULL OR status IN ('wip', 'done', 'spec')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  content_es TEXT NOT NULL CHECK (json_valid(content_es)),
  content_en TEXT NOT NULL CHECK (json_valid(content_en)),
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_published_order
  ON portfolio_projects (is_published, sort_order, featured);
