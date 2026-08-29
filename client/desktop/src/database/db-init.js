import { query } from './db-connection.js';

// Create necessary tables with better error handling
async function initializeTables() {
  const tables = [
    {
      name: 'admin_users',
      query: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'admin',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    },
    {
      name: 'login_logs',
      query: `
        CREATE TABLE IF NOT EXISTS login_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES admin_users(id),
          success BOOLEAN NOT NULL,
          login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ip_address VARCHAR(45)
        )
      `
    },
    {
      name: 'students',
      query: `
        CREATE TABLE IF NOT EXISTS students (
          id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          first_name TEXT NOT NULL,
          middle_name TEXT,
          last_name TEXT NOT NULL,
          suffix TEXT,
          lrn BIGINT UNIQUE NOT NULL,
          grade_level TEXT NOT NULL,
          section TEXT,
          gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')) DEFAULT 'Male',
          rfid TEXT UNIQUE,
          status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'hold', 'graduated', 'inactive', 'transferred')),
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `
    },
    {
      name: 'attendance',
      query: `
        CREATE TABLE IF NOT EXISTS attendance (
          id SERIAL PRIMARY KEY,
          student_id INTEGER REFERENCES students(id),
          attendance_date DATE NOT NULL,
          status VARCHAR(10) CHECK (status IN ('present', 'absent', 'late', 'excused')),
          notes TEXT,
          recorded_by INTEGER REFERENCES admin_users(id),
          recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(student_id, attendance_date)
        )
      `
    },
    {
      name: 'rfid_logs',
      query: `
        CREATE TABLE IF NOT EXISTS rfid_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          rfid VARCHAR(255) NOT NULL,
          tap_count INTEGER NOT NULL CHECK (tap_count IN (1, 2)),
          tap_type VARCHAR(10) NOT NULL CHECK (tap_type IN ('time_in', 'time_out')),
          timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
        )
      `
    },
    {
      name: 'announcements',
      query: `
        CREATE TABLE IF NOT EXISTS announcements (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          created_by INTEGER REFERENCES admin_users(id),
          created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
        )
      `
    },
    {
      name: 'student_promotion_history',
      query: `
        CREATE TABLE IF NOT EXISTS student_promotion_history (
          id SERIAL PRIMARY KEY,
          student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          from_grade_section_id INTEGER REFERENCES grade_sections(id),
          to_grade_section_id INTEGER REFERENCES grade_sections(id),
          from_grade_level TEXT NOT NULL,
          to_grade_level TEXT NOT NULL,
          from_section TEXT,
          to_section TEXT,
          promotion_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
          promoted_by INTEGER REFERENCES admin_users(id),
          promotion_type VARCHAR(20) NOT NULL CHECK (promotion_type IN ('individual', 'batch_grade', 'batch_section', 'batch_all', 'graduation')),
          notes TEXT
        )
      `
    },
    {
      name: 'graduated_students',
      query: `
        CREATE TABLE IF NOT EXISTS graduated_students (
          id BIGINT PRIMARY KEY,
          first_name TEXT NOT NULL,
          middle_name TEXT,
          last_name TEXT NOT NULL,
          suffix TEXT,
          lrn BIGINT UNIQUE NOT NULL,
          gender VARCHAR(10),
          rfid TEXT UNIQUE,
          final_grade_section_id INTEGER REFERENCES grade_sections(id),
          final_grade_level TEXT NOT NULL,
          final_section TEXT,
          graduation_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
          graduated_by INTEGER REFERENCES admin_users(id),
          original_student_id BIGINT REFERENCES students(id),
          created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
        )
      `
    }
  ];

  // Create trigger function to ensure graduated students have corresponding records
  const triggerFunction = `
    CREATE OR REPLACE FUNCTION ensure_graduated_has_record()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.status = 'graduated' THEN
        IF NOT EXISTS (SELECT 1 FROM graduated_students WHERE original_student_id = NEW.id) THEN
          RAISE EXCEPTION 'Cannot set student status to graduated without creating a record in graduated_students table';
        END IF;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;

  const trigger = `
    DROP TRIGGER IF EXISTS trg_ensure_graduated_has_record ON students;
    CREATE TRIGGER trg_ensure_graduated_has_record
    BEFORE UPDATE OF status ON students
    FOR EACH ROW
    EXECUTE FUNCTION ensure_graduated_has_record();
  `;

  try {
    for (const table of tables) {
      try {
        await query(table.query);
      } catch (error) {
        console.error(`[DATABASE] Error creating table '${table.name}':`, error.message);
        throw error;
      }
    }
    
    // Create trigger function and trigger for graduated students constraint
    try {
      await query(triggerFunction);
      await query(trigger);
      console.log('[DATABASE] Graduated students constraint trigger created successfully');
    } catch (error) {
      console.error('[DATABASE] Error creating graduated students constraint trigger:', error.message);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing tables:', error.message);
    return false;
  }
}

export {
  initializeTables
};
