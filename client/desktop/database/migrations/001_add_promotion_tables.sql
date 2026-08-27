-- Add status field to students table with enhanced options
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' 
CHECK (status IN ('active', 'hold', 'graduated', 'inactive', 'transferred'));

-- Create promotion history table
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
);

-- Create graduated students archive table
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
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_promotion_history_student_id ON student_promotion_history(student_id);
CREATE INDEX IF NOT EXISTS idx_promotion_history_date ON student_promotion_history(promotion_date);
CREATE INDEX IF NOT EXISTS idx_promotion_history_type ON student_promotion_history(promotion_type);
CREATE INDEX IF NOT EXISTS idx_graduated_students_lrn ON graduated_students(lrn);
CREATE INDEX IF NOT EXISTS idx_graduated_students_date ON graduated_students(graduation_date);

-- Create trigger function to ensure graduated students have corresponding records in graduated_students table
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

-- Create trigger to enforce the constraint
DROP TRIGGER IF EXISTS trg_ensure_graduated_has_record ON students;
CREATE TRIGGER trg_ensure_graduated_has_record
BEFORE UPDATE OF status ON students
FOR EACH ROW
EXECUTE FUNCTION ensure_graduated_has_record();