import { Pool } from 'pg';

const connectionString = 'postgresql://postgres:dfgv847389t7v09cf802345v34@db.dieyszynhfhlplalfawk.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

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
  console.log('[MIGRATION] Script started');
  console.log('[MIGRATION] About to test connection...');

  // Test connection first
  try {
    const testResult = await query('SELECT NOW() as current_time');
    console.log('[MIGRATION] Database connection test successful:', testResult.rows[0].current_time);
  } catch (error) {
    console.error('[MIGRATION] Database connection test failed:', error.message);
    process.exit(1);
  }

  try {
    console.log('[MIGRATION] Starting Phase 1 constraint update migration...');
    
    // Step 1: Add status column if it doesn't exist
    console.log('[MIGRATION] Step 1: Adding status column...');
    try {
      await query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'`);
      console.log('[MIGRATION] Status column added or already exists');
    } catch (error) {
      console.log('[MIGRATION] Status column already exists or error:', error.message);
    }
    
    // Step 2: Update the status field constraint
    console.log('[MIGRATION] Step 2: Updating status field constraint...');
    try {
      await query(`ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check`);
      console.log('[MIGRATION] Dropped existing constraint');
    } catch (error) {
      console.log('[MIGRATION] No existing constraint to drop (expected for new installations)');
    }
    
    await query(`
      ALTER TABLE students 
      ADD CONSTRAINT students_status_check 
      CHECK (status IN ('active', 'hold', 'graduated', 'inactive', 'transferred'))
    `);
    console.log('[MIGRATION] Added enhanced status constraint');
    
    // Step 3: Create trigger function
    console.log('[MIGRATION] Step 3: Creating trigger function...');
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
    console.log('[MIGRATION] Created trigger function');
    
    // Step 4: Create trigger
    console.log('[MIGRATION] Step 4: Creating trigger...');
    await query(`DROP TRIGGER IF EXISTS trg_ensure_graduated_has_record ON students`);
    await query(`
      CREATE TRIGGER trg_ensure_graduated_has_record
      BEFORE UPDATE OF status ON students
      FOR EACH ROW
      EXECUTE FUNCTION ensure_graduated_has_record()
    `);
    console.log('[MIGRATION] Created trigger');
    
    // Step 5: Handle existing graduated students
    console.log('[MIGRATION] Step 5: Handling existing graduated students...');
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
      console.log('[MIGRATION] Processed existing graduated students');
    } catch (error) {
      console.log('[MIGRATION] No existing graduated students to process or tables not yet created:', error.message);
    }
    
    // Step 6: Set default status for NULL values
    console.log('[MIGRATION] Step 6: Setting default status for NULL values...');
    try {
      await query(`UPDATE students SET status = 'active' WHERE status IS NULL`);
      console.log('[MIGRATION] Set default status for NULL values');
    } catch (error) {
      console.log('[MIGRATION] No students table or no NULL status values:', error.message);
    }
    
    console.log('[MIGRATION] Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('[MIGRATION] Migration failed:', error.message);
    console.error('[MIGRATION] Error details:', error);
    process.exit(1);
  }
}

runMigration();