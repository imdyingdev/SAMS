-- Test script for promotion tables

-- Test 1: Verify new tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('student_promotion_history', 'graduated_students');

-- Test 2: Verify status field in students table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'students' 
AND column_name = 'status';

-- Test 3: Verify indexes exist for new tables
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('student_promotion_history', 'graduated_students')
AND schemaname = 'public';

-- Test 4: Verify foreign key constraints on student_promotion_history
SELECT conname, contype, pg_get_constraintdef(oid) as constraint_def
FROM pg_constraint 
WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = 'student_promotion_history')
AND contype = 'f';

-- Test 5: Verify check constraints on student_promotion_history
SELECT conname, contype, pg_get_constraintdef(oid) as constraint_def
FROM pg_constraint 
WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = 'student_promotion_history')
AND contype = 'c';

-- Test 6: Verify check constraints on students table for status field
SELECT conname, contype, pg_get_constraintdef(oid) as constraint_def
FROM pg_constraint 
WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = 'students')
AND conname LIKE '%status%';

-- Test 7: Verify data integrity - check existing students still have data
SELECT COUNT(*) as student_count, 
       COUNT(CASE WHEN status IS NULL THEN 1 END) as null_status_count
FROM students;

-- Test 8: Sample insert test (commented out for safety)
-- This would test foreign key constraints by trying to insert invalid data
-- INSERT INTO student_promotion_history (student_id, from_grade_level, to_grade_level, promotion_type)
-- VALUES (99999, '1', '2', 'individual');