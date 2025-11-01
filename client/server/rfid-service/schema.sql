-- RFID Attendance Logs Table
-- This table stores all RFID tap/scan events

CREATE TABLE IF NOT EXISTS rfid_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfid VARCHAR(255) NOT NULL,
    tap_count INTEGER NOT NULL CHECK (tap_count IN (1, 2)),
    tap_type VARCHAR(10) NOT NULL CHECK (tap_type IN ('time_in', 'time_out')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries by RFID
CREATE INDEX IF NOT EXISTS idx_rfid_logs_rfid ON rfid_logs(rfid);

-- Create index for faster queries by timestamp
CREATE INDEX IF NOT EXISTS idx_rfid_logs_timestamp ON rfid_logs(timestamp DESC);

-- Create index for faster queries by tap_count
CREATE INDEX IF NOT EXISTS idx_rfid_logs_tap_count ON rfid_logs(tap_count);

-- Enable Row Level Security (RLS)
ALTER TABLE rfid_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on rfid_logs" ON rfid_logs
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Optional: Create a view to get the latest status for each RFID
CREATE OR REPLACE VIEW rfid_latest_status AS
SELECT DISTINCT ON (rfid)
    rfid,
    tap_count,
    tap_type,
    timestamp,
    CASE 
        WHEN tap_count = 1 THEN 'Timed In'
        WHEN tap_count = 2 THEN 'Timed Out'
    END as status
FROM rfid_logs
ORDER BY rfid, timestamp DESC;
