-- This will be handled by Prisma migrations, but keeping for reference
-- Run: npx prisma migrate dev --name init

-- Sample data for testing
INSERT INTO "User" (id, email, name) VALUES 
('demo-user-1', 'demo@example.com', 'Demo User')
ON CONFLICT (email) DO NOTHING;
