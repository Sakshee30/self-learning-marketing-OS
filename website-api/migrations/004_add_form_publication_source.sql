ALTER TABLE website_form_versions
  ADD COLUMN IF NOT EXISTS source_revision text;

CREATE UNIQUE INDEX IF NOT EXISTS website_form_versions_source_revision
  ON website_form_versions (form_id, source_revision)
  WHERE source_revision IS NOT NULL;
