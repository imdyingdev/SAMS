-- Rollback script for Phase 1 constraint updates

-- Step 1: Drop the trigger and function
DROP TRIGGER IF EXISTS trg_ensure_graduated_has_record ON students;
DROP FUNCTION IF EXISTS ensure_graduated_has_record();

-- Step 2: Drop the enhanced status constraint
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check;

-- Step 3: Restore the original simple status constraint
ALTER TABLE students 
ADD CONSTRAINT students_status_check 
CHECK (status IN ('active', 'graduated'));

-- Step 4: Note: We do not remove the graduated_students records created during migration
-- as they provide historical data integrity

SELECT 'Rollback completed successfully' as status;