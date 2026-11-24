-- Portfolio-only content storage. Keep the design system and project/catalog content out of this database.
CREATE TABLE IF NOT EXISTS portfolio_content (
  locale TEXT NOT NULL CHECK (locale IN ('es', 'en')),
  content_key TEXT NOT NULL CHECK (
    content_key IN ('cv', 'site', 'skill_stories', 'ui_copy')
  ),
  payload_json TEXT NOT NULL CHECK (json_valid(payload_json)),
  source_path TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (locale, content_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_portfolio_content_updated_at
  ON portfolio_content (updated_at);

-- Public CV file metadata only. Binary PDF/image assets remain in Pages static
-- assets or R2; D1 stores their public path and descriptive metadata.
CREATE TABLE IF NOT EXISTS portfolio_cv_documents (
  locale TEXT NOT NULL CHECK (locale IN ('es', 'en')),
  document_key TEXT NOT NULL,
  label TEXT NOT NULL,
  public_path TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_current INTEGER NOT NULL DEFAULT 1 CHECK (is_current IN (0, 1)),
  PRIMARY KEY (locale, document_key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_portfolio_cv_documents_current
  ON portfolio_cv_documents (locale, is_current, sort_order);
