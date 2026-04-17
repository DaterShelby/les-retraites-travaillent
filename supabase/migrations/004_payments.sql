-- =====================================================
--  004 — Stripe payments + Connect for marketplace
-- =====================================================

-- Stripe Connect account on user_profiles (retirees + companies)
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_account_status TEXT
    CHECK (stripe_account_status IN ('pending', 'restricted', 'active', 'rejected')),
  ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN NOT NULL DEFAULT FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_stripe_account
  ON user_profiles (stripe_account_id) WHERE stripe_account_id IS NOT NULL;

-- Add payment fields to bookings
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS amount_total INTEGER,           -- in cents
  ADD COLUMN IF NOT EXISTS platform_fee INTEGER,           -- our commission in cents
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'eur',
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'released', 'refunded', 'failed')),
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS released_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent
  ON bookings (stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_checkout_session
  ON bookings (stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;

-- =====================================================
--  TABLE: payment_events (Stripe webhook audit log)
-- =====================================================
CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_events_booking
  ON payment_events (booking_id, processed_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_events_type
  ON payment_events (event_type, processed_at DESC);

-- RLS — payment_events is admin-only via service role; lock it down
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payment_events not exposed" ON payment_events
  FOR SELECT USING (FALSE);
