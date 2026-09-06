import { query } from './db.js';

const ddl = `
CREATE TABLE IF NOT EXISTS registrations (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  branch        TEXT NOT NULL,
  year          TEXT,
  email         TEXT NOT NULL UNIQUE,
  whatsapp      TEXT NOT NULL,
  accommodation TEXT NOT NULL,
  domain        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations (email);
`;

try {
  await query(ddl);
  console.log('Schema ready.');
  process.exit(0);
} catch (err) {
  console.error('Schema setup failed:', err.message);
  process.exit(1);
}
