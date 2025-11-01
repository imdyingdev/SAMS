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
          gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')) DEFAULT 'Male',
          rfid TEXT UNIQUE,
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
    }
  ];

  try {
    for (const table of tables) {
      try {
        await query(table.query);
      } catch (error) {
        console.error(`[DATABASE] Error creating table '${table.name}':`, error.message);
        throw error;
      }
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
