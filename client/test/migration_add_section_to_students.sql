-- Migration: Add section column to students table
-- Date: 2025-10-30
-- Description: Adds a section field to organize students within their grade levels

ALTER TABLE public.students
ADD COLUMN section TEXT;

-- Add comment to the column
COMMENT ON COLUMN public.students.section IS 'The section/class within the grade level (e.g., Section A, Section B)';

-- Create an index for better query performance when filtering by section
CREATE INDEX idx_students_section ON public.students(section);

-- Optional: Add a check constraint to ensure section is not empty if provided
-- ALTER TABLE public.students ADD CONSTRAINT students_section_not_empty CHECK (section IS NULL OR length(trim(section)) > 0);