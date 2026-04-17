-- =====================================================
--  003 — Job Board (Missions B2B)
--  Companies post mission offers, retirees apply
-- =====================================================

CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  department TEXT,
  remote_allowed BOOLEAN NOT NULL DEFAULT FALSE,
  contract_type TEXT NOT NULL CHECK (
    contract_type IN ('one_shot', 'recurring', 'part_time', 'consulting')
  ),
  duration_estimate TEXT,
  budget_type TEXT NOT NULL CHECK (
    budget_type IN ('hourly', 'daily', 'fixed', 'negotiable')
  ),
  budget_min INTEGER,
  budget_max INTEGER,
  required_skills JSONB NOT NULL DEFAULT '[]',
  start_date DATE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (
    status IN ('draft', 'open', 'closed', 'filled', 'archived')
  ),
  applications_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  search_vector tsvector
    GENERATED ALWAYS AS (
      setweight(to_tsvector('french', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('french', coalesce(description, '')), 'B') ||
      setweight(to_tsvector('french', coalesce(category, '')), 'C') ||
      setweight(to_tsvector('french', coalesce(city, '')), 'C')
    ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE INDEX idx_missions_status ON missions (status, created_at DESC);
CREATE INDEX idx_missions_category ON missions (category);
CREATE INDEX idx_missions_city ON missions (city);
CREATE INDEX idx_missions_company ON missions (company_id);
CREATE INDEX idx_missions_search ON missions USING GIN (search_vector);

-- Mission applications
CREATE TABLE mission_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  cover_message TEXT NOT NULL,
  proposed_rate INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn')
  ),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (mission_id, applicant_id)
);

CREATE INDEX idx_applications_mission ON mission_applications (mission_id, status);
CREATE INDEX idx_applications_applicant ON mission_applications (applicant_id, created_at DESC);

-- Counter trigger
CREATE OR REPLACE FUNCTION bump_mission_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE missions
       SET applications_count = applications_count + 1,
           updated_at = NOW()
     WHERE id = NEW.mission_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE missions
       SET applications_count = GREATEST(applications_count - 1, 0),
           updated_at = NOW()
     WHERE id = OLD.mission_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bump_mission_applications
AFTER INSERT OR DELETE ON mission_applications
FOR EACH ROW EXECUTE FUNCTION bump_mission_applications_count();

-- Updated_at triggers
CREATE TRIGGER trg_missions_updated_at BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_mission_applications_updated_at BEFORE UPDATE ON mission_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
--  RLS
-- =====================================================
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_applications ENABLE ROW LEVEL SECURITY;

-- Public can read open missions
CREATE POLICY "Open missions are viewable by everyone" ON missions
  FOR SELECT USING (status = 'open' OR auth.uid() = company_id);

-- Only companies can create missions, scoped to themselves
CREATE POLICY "Companies create their own missions" ON missions
  FOR INSERT WITH CHECK (
    auth.uid() = company_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'company'
    )
  );

CREATE POLICY "Companies update their own missions" ON missions
  FOR UPDATE USING (auth.uid() = company_id);

CREATE POLICY "Companies delete their own missions" ON missions
  FOR DELETE USING (auth.uid() = company_id);

-- Applications: applicant + mission owner can view
CREATE POLICY "Applicant or mission owner reads applications" ON mission_applications
  FOR SELECT USING (
    auth.uid() = applicant_id OR
    auth.uid() = (SELECT company_id FROM missions WHERE id = mission_id)
  );

CREATE POLICY "Retirees apply to missions" ON mission_applications
  FOR INSERT WITH CHECK (
    auth.uid() = applicant_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'retiree'
    ) AND
    EXISTS (
      SELECT 1 FROM missions
      WHERE id = mission_id AND status = 'open'
    )
  );

-- Applicant withdraws OR mission owner updates status
CREATE POLICY "Applicant updates own application" ON mission_applications
  FOR UPDATE USING (auth.uid() = applicant_id);

CREATE POLICY "Mission owner reviews applications" ON mission_applications
  FOR UPDATE USING (
    auth.uid() = (SELECT company_id FROM missions WHERE id = mission_id)
  );
