import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Create a log file
const logFile = fs.createWriteStream('migration-log.txt', { flags: 'a' });
function log(message) {
  logFile.write(message + '\n');
  console.log(message);
}

// Get the app root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple paths for .env file
const possibleEnvPaths = [
  path.join(process.cwd(), '.env'),
  path.join(__dirname, '../../.env'),
  path.join(__dirname, '../../../.env'),
];

log('[MIGRATION] Searching for .env file...');
let envPath = null;
for (const testPath of possibleEnvPaths) {
  log('[MIGRATION] Checking path: ' + testPath + ' exists: ' + fs.existsSync(testPath));
  if (fs.existsSync(testPath)) {
    envPath = testPath;
    log('[MIGRATION] Found .env at: ' + envPath);
    break;
  }
}

if (!envPath) {
  log('[MIGRATION] ERROR: .env file not found in any expected location');
  log('[MIGRATION] Searched paths: ' + JSON.stringify(possibleEnvPaths));
  logFile.end();
  process.exit(1);
}

dotenv.config({ path: envPath });
log('[MIGRATION] .env loaded');

const connectionString = process.env.DATABASE_URL;
log('[MIGRATION] DATABASE_URL found: ' + !!connectionString);

if (!connectionString) {
  log('[MIGRATION] ERROR: DATABASE_URL is not defined in .env file');
  logFile.end();
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

log('[MIGRATION] Pool created');

async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

async function runMigration() {
  log('[MIGRATION] Script started');
  log('[MIGRATION] Database connection configured');
  log('[MIGRATION] About to test connection...');

  // Test connection first
  try {
    const testResult = await query('SELECT NOW() as current_time');
    log('[MIGRATION] Database connection test successful: ' + testResult.rows[0].current_time);
  } catch (error) {
    log('[MIGRATION] Database connection test failed: ' + error.message);
    logFile.end();
    process.exit(1);
  }

  try {
    log('[MIGRATION] Starting Phase 1 constraint update migration...');
    
    // Step 1: Add status column if it doesn't exist
    log('[MIGRATION] Step 1: Adding status column...');
    try {
      await query(`
        ALTER TABLE students 
        ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'
      `);
      log('[MIGRATION] Status column added or already exists');
    } catch (error) {
      log('[MIGRATION] Error adding status column: ' + error.message);
      // Continue anyway as column might already exist
    }
    
    // Step 2: Update the status field constraint
    log('[MIGRATION] Step 2: Updating status field constraint...');
    await query(`ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check`);
    log('[MIGRATION] Dropped existing constraint');
    
    await query(`
      ALTER TABLE students 
      ADD CONSTRAINT students_status_check 
      CHECK (status IN ('active', 'hold', 'graduated', 'inactive', 'transferred'))
    `);
    log('[MIGRATION] Added enhanced status constraint');
    
    // Step 3: Create trigger function
    log('[MIGRATION] Step 3: Creating trigger function...');
    await query(`
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
      $$ LANGUAGE plpgsql
    `);
    log('[MIGRATION] Created trigger function');
    
    // Step 4: Create trigger
    log('[MIGRATION] Step 4: Creating trigger...');
    await query(`DROP TRIGGER IF EXISTS trg_ensure_graduated_has_record ON students`);
    await query(`
      CREATE TRIGGER trg_ensure_graduated_has_record
      BEFORE UPDATE OF status ON students
      FOR EACH ROW
      EXECUTE FUNCTION ensure_graduated_has_record()
    `);
    log('[MIGRATION] Created trigger');
    
    // Step 5: Create student_promotion_history table
    log('[MIGRATION] Step 5: Creating student_promotion_history table...');
    await query(`
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
    `);
    log('[MIGRATION] Created student_promotion_history table');
    
    // Step 6: Create graduated_students table
    log('[MIGRATION] Step 6: Creating graduated_students table...');
    await query(`
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
    `);
    log('[MIGRATION] Created graduated_students table');
    
    // Step 7: Create indexes
    log('[MIGRATION] Step 7: Creating performance indexes...');
    await query(`CREATE INDEX IF NOT EXISTS idx_promotion_history_student_id ON student_promotion_history(student_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_promotion_history_date ON student_promotion_history(promotion_date)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_promotion_history_type ON student_promotion_history(promotion_type)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_graduated_students_lrn ON graduated_students(lrn)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_graduated_students_date ON graduated_students(graduation_date)`);
    log('[MIGRATION] Created performance indexes');
    
    // Step 8: Handle existing graduated students
    log('[MIGRATION] Step 8: Handling existing graduated students...');
    try {
      await query(`
        DO $$
        DECLARE
            graduated_student RECORD;
        BEGIN
            FOR graduated_student IN 
                SELECT id, first_name, middle_name, last_name, suffix, lrn, gender, rfid, grade_level, section
                FROM students 
                WHERE status = 'graduated' 
                AND id NOT IN (SELECT original_student_id FROM graduated_students WHERE original_student_id IS NOT NULL)
            LOOP
                INSERT INTO graduated_students (
                    id, first_name, middle_name, last_name, suffix, lrn, gender, rfid,
                    final_grade_level, final_section, graduation_date, original_student_id, created_at
                ) VALUES (
                    graduated_student.id,
                    graduated_student.first_name,
                    graduated_student.middle_name,
                    graduated_student.last_name,
                    graduated_student.suffix,
                    graduated_student.lrn,
                    graduated_student.gender,
                    graduated_student.rfid,
                    graduated_student.grade_level,
                    graduated_student.section,
                    NOW(),
                    graduated_student.id,
                    NOW()
                );
                
                RAISE NOTICE 'Created graduated_students record for student ID: %', graduated_student.id;
            END LOOP;
        END $$
      `);
      log('[MIGRATION] Processed existing graduated students');
    } catch (error) {
      // Only catch "undefined_table" error (42P01) - tables not created yet
      if (error.code === '42P01') {
        log('[MIGRATION] Tables not yet created (expected for new installations)');
      } else {
        throw error; // Rethrow any other error
      }
    }
    
    // Step 9: Set default status for NULL values
    log('[MIGRATION] Step 9: Setting default status for NULL values...');
    await query(`UPDATE students SET status = 'active' WHERE status IS NULL`);
    log('[MIGRATION] Set default status for NULL values');
    
    log('[MIGRATION] Migration completed successfully');
    logFile.end();
    process.exit(0);
  } catch (error) {
    log('[MIGRATION] Migration failed: ' + error.message);
    log('[MIGRATION] Error details: ' + JSON.stringify(error));
    logFile.end();
    process.exit(1);
  }
}

// Execute the migration
(async () => {
  try {
    await runMigration();
  } catch (error) {
    log('[MIGRATION] Fatal error: ' + error.message);
    logFile.end();
    process.exit(1);
  }
})();