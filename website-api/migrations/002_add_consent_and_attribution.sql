CREATE TABLE IF NOT EXISTS website_consent_records (
  id uuid PRIMARY KEY,
  subject_id uuid NOT NULL,
  policy_version text NOT NULL,
  decisions jsonb NOT NULL,
  source jsonb NOT NULL DEFAULT '{}'::jsonb,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS website_consent_records_subject_history
  ON website_consent_records (subject_id, recorded_at DESC, id DESC);

ALTER TABLE website_submissions
  ADD COLUMN IF NOT EXISTS consent_record_id uuid REFERENCES website_consent_records(id),
  ADD COLUMN IF NOT EXISTS attribution jsonb NOT NULL DEFAULT '{"status":"unknown"}'::jsonb;

CREATE INDEX IF NOT EXISTS website_submissions_consent_record
  ON website_submissions (consent_record_id)
  WHERE consent_record_id IS NOT NULL;
