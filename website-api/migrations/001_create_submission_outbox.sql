CREATE TABLE IF NOT EXISTS website_form_versions (
  id uuid PRIMARY KEY,
  form_id text NOT NULL,
  version integer NOT NULL CHECK (version > 0),
  schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (form_id, version)
);

CREATE UNIQUE INDEX IF NOT EXISTS website_form_versions_one_published
  ON website_form_versions (form_id)
  WHERE status = 'published';

CREATE TABLE IF NOT EXISTS website_submissions (
  id uuid PRIMARY KEY,
  form_id text NOT NULL,
  form_version_id uuid NOT NULL REFERENCES website_form_versions(id),
  idempotency_key text,
  request_fingerprint text NOT NULL,
  fields jsonb NOT NULL,
  source jsonb NOT NULL DEFAULT '{}'::jsonb,
  received_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS website_submissions_idempotency
  ON website_submissions (form_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS website_submissions_received_at
  ON website_submissions (received_at DESC);

CREATE TABLE IF NOT EXISTS website_outbox_events (
  id uuid PRIMARY KEY,
  event_type text NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  payload jsonb NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  available_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  last_error text
);

CREATE UNIQUE INDEX IF NOT EXISTS website_outbox_submission_accepted_once
  ON website_outbox_events (aggregate_id, event_type);

CREATE INDEX IF NOT EXISTS website_outbox_pending
  ON website_outbox_events (available_at, occurred_at)
  WHERE processed_at IS NULL;
