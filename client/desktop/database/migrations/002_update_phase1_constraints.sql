-- Migration to update Phase 1 with enhanced status options and trigger-based constraints
-- This updates existing Phase 1 implementation to use constraint-based approach

-- Step 1: Update the status field constraint to include new options
-- First, drop the existing constraint if it exists
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check;

-- Add the enhanced status constraint with new options
ALTER TABLE students 
ADD CONSTRAINT students_status_check 
CHECK (status IN ('active', 'hold', 'graduated', 'inactive', 'transferred'));

-- Step 2: Create trigger function to ensure graduated students have corresponding records
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

-- Step 3: Create trigger to enforce the constraint
DROP TRIGGER IF EXISTS trg_ensure_graduated_has_record ON students;
CREATE TRIGGER trg_ensure_graduated_has_record
BEFORE UPDATE OF status ON students
FOR EACH ROW
EXECUTE FUNCTION ensure_graduated_has_record();

-- Step 4: Handle existing graduated students data
-- For any students already marked as graduated, ensure they have corresponding records
-- If they don't have records in graduated_students, create them based on current data
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
END $$;

-- Step 5: Set default status for any NULL values
UPDATE students SET status = 'active' WHERE status IS NULL;

-- Step 6: Verify the migration
SELECT 'Migration completed successfully' as status;