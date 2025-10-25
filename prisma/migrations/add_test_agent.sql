-- Add a test agent for development
INSERT INTO agents (id, username, email, password_hash, full_name, role, store_id, is_active, created_at)
VALUES (
  'agent-test-123',
  'testagent',
  'agent@test.com',
  '$2b$10$dummy.hash.for.testing.purposes.only',
  'Test Agent',
  'agent',
  'store-main-qc',
  true,
  NOW()
)
ON CONFLICT (id) DO NOTHING;
