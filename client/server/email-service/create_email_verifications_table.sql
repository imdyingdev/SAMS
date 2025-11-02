-- Create email_verifications table for storing email verification codes
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS email_verifications (
    email TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);

-- Create an index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires_at ON email_verifications(expires_at);

-- Optional: Add RLS (Row Level Security) policies if needed
-- ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations (since this is a service table)
-- CREATE POLICY "Allow all operations on email_verifications" ON email_verifications FOR ALL USING (true);