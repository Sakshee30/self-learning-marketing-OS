ALTER TABLE website_outbox_events
  ADD COLUMN IF NOT EXISTS locked_until timestamptz,
  ADD COLUMN IF NOT EXISTS lock_token uuid,
  ADD COLUMN IF NOT EXISTS dead_lettered_at timestamptz;

CREATE INDEX IF NOT EXISTS website_outbox_claimable
  ON website_outbox_events (event_type, available_at, occurred_at)
  WHERE processed_at IS NULL AND dead_lettered_at IS NULL;

CREATE TABLE IF NOT EXISTS website_delivery_attempts (
  id uuid PRIMARY KEY,
  outbox_event_id uuid NOT NULL REFERENCES website_outbox_events(id) ON DELETE CASCADE,
  destination_key text NOT NULL,
  attempt_number integer NOT NULL CHECK (attempt_number > 0),
  outcome text NOT NULL CHECK (outcome IN ('succeeded', 'failed')),
  response_status integer CHECK (response_status IS NULL OR response_status BETWEEN 100 AND 599),
  error_code text,
  error_message text,
  started_at timestamptz NOT NULL,
  completed_at timestamptz NOT NULL,
  UNIQUE (outbox_event_id, destination_key, attempt_number)
);

CREATE INDEX IF NOT EXISTS website_delivery_attempts_event_history
  ON website_delivery_attempts (outbox_event_id, completed_at DESC);
