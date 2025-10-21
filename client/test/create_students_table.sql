-- Create the users table for mobile authentication
-- This references the existing students table
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id BIGINT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    
    -- Foreign key constraint to existing students table
    CONSTRAINT fk_users_student_id 
        FOREIGN KEY (student_id) 
        REFERENCES students(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Add comments to describe the table and columns
COMMENT ON TABLE users IS 'User authentication table for mobile app, linked to students table.';
COMMENT ON COLUMN users.id IS 'Unique identifier for each user account.';
COMMENT ON COLUMN users.student_id IS 'References students.id - allows login with LRN or student ID.';
COMMENT ON COLUMN users.email IS 'Student email address for login.';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password for security.';
COMMENT ON COLUMN users.is_active IS 'Whether the user account is active and can login.';
COMMENT ON COLUMN users.created_at IS 'Timestamp when user account was created.';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when user account was last updated.';
COMMENT ON COLUMN users.last_login IS 'Timestamp of last successful login.';

-- Create a view for easy student-user data retrieval
CREATE VIEW student_users AS
SELECT 
    u.id as user_id,
    u.email,
    u.is_active,
    u.created_at as user_created_at,
    u.last_login,
    s.id as student_id,
    s.first_name,
    s.middle_name,
    s.last_name,
    s.suffix,
    s.lrn,
    s.grade_level,
    s.rfid,
    s.gender,
    s.created_at as student_created_at
FROM users u
JOIN students s ON u.student_id = s.id
WHERE u.is_active = true;

COMMENT ON VIEW student_users IS 'Combined view of users and students data for mobile app authentication.';

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at();

-- Create function to update last_login timestamp
CREATE OR REPLACE FUNCTION update_user_last_login(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET last_login = NOW() 
    WHERE email = user_email AND is_active = true;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_user_last_login(TEXT) IS 'Updates last_login timestamp for a user by email.';

-- Login methods supported:
-- 1. Email + Password
-- 2. LRN + Password  
-- 3. Student ID + Password
--
-- Example query to find user by any identifier:
-- SELECT u.*, s.first_name, s.last_name, s.lrn
-- FROM users u
-- JOIN students s ON u.student_id = s.id
-- WHERE u.is_active = true 
--   AND (u.email = $1 OR s.lrn::text = $1 OR s.id::text = $1);
