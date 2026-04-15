-- =============================================
-- Les Retraités Travaillent — Schéma initial
-- Migration 001
-- =============================================

-- Extension PostGIS pour la géolocalisation
CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================================
-- TABLE: user_profiles
-- Extension du auth.users de Supabase
-- =============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('retiree', 'client', 'company', 'admin')),
  first_name TEXT NOT NULL,
  last_name TEXT,
  avatar_url TEXT,
  city TEXT,
  department TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  bio TEXT,
  phone TEXT,
  date_of_birth DATE,
  skills JSONB DEFAULT '[]',
  availability JSONB DEFAULT '{}',
  travel_radius_km INTEGER DEFAULT 20,
  -- Champs entreprise
  company_name TEXT,
  siret TEXT,
  company_size TEXT,
  sector TEXT,
  -- Calculés
  average_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_missions INTEGER DEFAULT 0,
  response_rate NUMERIC(5,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_super_pro BOOLEAN DEFAULT FALSE,
  -- Préférences
  font_size TEXT DEFAULT 'normal' CHECK (font_size IN ('normal', 'large', 'xlarge')),
  notification_preferences JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: services (Marketplace)
-- =============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price_type TEXT NOT NULL CHECK (price_type IN ('hourly', 'fixed', 'negotiable')),
  price_amount NUMERIC(10,2),
  location GEOGRAPHY(POINT, 4326),
  city TEXT,
  department TEXT,
  availability_slots JSONB DEFAULT '[]',
  photos TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'paused', 'archived')),
  views_count INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: bookings (Réservations)
-- =============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id),
  client_id UUID NOT NULL REFERENCES user_profiles(id),
  provider_id UUID NOT NULL REFERENCES user_profiles(id),
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed')),
  cancellation_reason TEXT,
  cancelled_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: conversations
-- =============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids UUID[] NOT NULL,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: messages
-- =============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES user_profiles(id),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: reviews (Avis)
-- =============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) UNIQUE,
  reviewer_id UUID NOT NULL REFERENCES user_profiles(id),
  reviewee_id UUID NOT NULL REFERENCES user_profiles(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL CHECK (char_length(comment) >= 20),
  response TEXT,
  response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: notifications
-- =============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: chat_messages (Assistant IA)
-- =============================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_services_location ON services USING GIST (location);
CREATE INDEX idx_services_search ON services USING GIN (search_vector);
CREATE INDEX idx_services_category_status ON services (category, status);
CREATE INDEX idx_services_provider ON services (provider_id);
CREATE INDEX idx_bookings_provider ON bookings (provider_id, status);
CREATE INDEX idx_bookings_client ON bookings (client_id, status);
CREATE INDEX idx_messages_conversation ON messages (conversation_id, created_at);
CREATE INDEX idx_notifications_user ON notifications (user_id, read_at, created_at);
CREATE INDEX idx_user_profiles_role ON user_profiles (role);
CREATE INDEX idx_user_profiles_city ON user_profiles (city);

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update search_vector on services
CREATE OR REPLACE FUNCTION update_service_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('french',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' ||
    array_to_string(COALESCE(NEW.tags, '{}'), ' ')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_services_search
  BEFORE INSERT OR UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_service_search_vector();

-- Auto-update average_rating on user_profiles
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles SET
    average_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviewee_id = COALESCE(NEW.reviewee_id, OLD.reviewee_id)),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE reviewee_id = COALESCE(NEW.reviewee_id, OLD.reviewee_id)),
    is_super_pro = (SELECT COUNT(*) >= 10 AND AVG(rating) >= 4.5 FROM reviews WHERE reviewee_id = COALESCE(NEW.reviewee_id, OLD.reviewee_id))
  WHERE id = COALESCE(NEW.reviewee_id, OLD.reviewee_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reviews_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- RLS POLICIES
-- =============================================

-- user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published services are viewable by everyone" ON services
  FOR SELECT USING (status = 'published' OR auth.uid() = provider_id);
CREATE POLICY "Providers can insert own services" ON services
  FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Providers can update own services" ON services
  FOR UPDATE USING (auth.uid() = provider_id);
CREATE POLICY "Providers can delete own services" ON services
  FOR DELETE USING (auth.uid() = provider_id);

-- bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = provider_id);
CREATE POLICY "Clients can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Participants can update bookings" ON bookings
  FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = provider_id);

-- conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view conversations" ON conversations
  FOR SELECT USING (auth.uid() = ANY(participant_ids));
CREATE POLICY "Authenticated users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = ANY(participant_ids));

-- messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view messages" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE auth.uid() = ANY(participant_ids)
    )
  );
CREATE POLICY "Participants can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT id FROM conversations WHERE auth.uid() = ANY(participant_ids)
    )
  );

-- reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);
CREATE POLICY "Reviewers can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Reviewees can respond to reviews" ON reviews
  FOR UPDATE USING (auth.uid() = reviewee_id);

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own chat messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
