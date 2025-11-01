-- This script updates the students table.
-- 1. Renames the 'rfid_id' column to 'rfid'.
-- 2. Changes the 'lrn' column from text to a numeric type (BIGINT).

BEGIN;

-- Rename the column
ALTER TABLE public.students RENAME COLUMN rfid_id TO rfid;

-- Change LRN column to BIGINT. 
-- The USING clause is necessary to cast the existing text data to a number.
ALTER TABLE public.students ALTER COLUMN lrn TYPE BIGINT USING lrn::BIGINT;

COMMIT;

-- You can run this script using a PostgreSQL client like psql or a GUI tool like DBeaver/PgAdmin.
-- Example using psql:
-- psql "your_database_connection_url" -f "c:\Users\monde\Documents\SAMS\client\test\migration_01_update_students_table.sql"
