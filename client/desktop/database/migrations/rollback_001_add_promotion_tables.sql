-- Rollback script for promotion tables

-- Drop trigger and function first
DROP TRIGGER IF EXISTS trg_ensure_graduated_has_record ON students;
DROP FUNCTION IF EXISTS ensure_graduated_has_record();

-- Drop indexes first
DROP INDEX IF EXISTS idx_graduated_students_date;
DROP INDEX IF EXISTS idx_graduated_students_lrn;
DROP INDEX IF EXISTS idx_promotion_history_type;
DROP INDEX IF EXISTS idx_promotion_history_date;
DROP INDEX IF EXISTS idx_promotion_history_student_id;

-- Drop tables
DROP TABLE IF EXISTS graduated_students;
DROP TABLE IF EXISTS student_promotion_history;

-- Remove status field from students table
ALTER TABLE students DROP COLUMN IF EXISTS status;