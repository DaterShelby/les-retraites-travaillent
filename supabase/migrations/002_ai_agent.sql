-- =============================================
-- AI AGENT — Conversations & messages with Claude
-- Sprint 3: Personalized voice-first agent (BPI USP)
-- =============================================

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content TEXT NOT NULL,
  tool_calls JSONB,
  tool_call_id TEXT,
  model TEXT,
  input_tokens INT,
  output_tokens INT,
  cache_read_tokens INT,
  cache_creation_tokens INT,
  finish_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations (user_id, last_message_at DESC);
CREATE INDEX idx_ai_messages_conversation ON ai_messages (conversation_id, created_at);

-- =============================================
-- RLS
-- =============================================
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_conversations_owner_select"
  ON ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "ai_conversations_owner_insert"
  ON ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ai_conversations_owner_update"
  ON ai_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "ai_conversations_owner_delete"
  ON ai_conversations FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "ai_messages_owner_select"
  ON ai_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
        AND ai_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "ai_messages_owner_insert"
  ON ai_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
        AND ai_conversations.user_id = auth.uid()
    )
  );

-- =============================================
-- TRIGGER: bump last_message_at on new message
-- =============================================
CREATE OR REPLACE FUNCTION bump_ai_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ai_conversations
  SET last_message_at = NEW.created_at,
      updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bump_ai_conversation_last_message
  AFTER INSERT ON ai_messages
  FOR EACH ROW
  EXECUTE FUNCTION bump_ai_conversation_last_message();
