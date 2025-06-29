/*
  # Update students table to make only required fields mandatory

  1. Schema Changes
    - Make only student_name, contact_number, class, year, and state required
    - Make all other fields optional with appropriate defaults
    
  2. Field Requirements
    - Required: student_name, contact_number, class, year, state
    - Optional: All other fields with sensible defaults
*/

-- Update column constraints to make only required fields NOT NULL
DO $$ 
BEGIN
  -- Make optional fields nullable
  ALTER TABLE students ALTER COLUMN gender DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN father_name DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN mother_name DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN parents_number DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN student_mail_id DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN address DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN pincode DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN college_school DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN entrance_exam DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN stream DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN board DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN district DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN city DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN category DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN exams_preparing DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN marks_10th DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN institution_name DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN admission_status DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN follow_up_status DROP NOT NULL;
  ALTER TABLE students ALTER COLUMN tags DROP NOT NULL;

  -- Set defaults for optional fields
  ALTER TABLE students ALTER COLUMN gender SET DEFAULT 'not_specified';
  ALTER TABLE students ALTER COLUMN father_name SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN mother_name SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN parents_number SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN student_mail_id SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN address SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN pincode SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN college_school SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN entrance_exam SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN stream SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN board SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN district SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN city SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN category SET DEFAULT 'General';
  ALTER TABLE students ALTER COLUMN exams_preparing SET DEFAULT '{}';
  ALTER TABLE students ALTER COLUMN marks_10th SET DEFAULT 0;
  ALTER TABLE students ALTER COLUMN institution_name SET DEFAULT '';
  ALTER TABLE students ALTER COLUMN admission_status SET DEFAULT 'new';
  ALTER TABLE students ALTER COLUMN follow_up_status SET DEFAULT 'pending';
  ALTER TABLE students ALTER COLUMN tags SET DEFAULT '{}';

  -- Ensure required fields are NOT NULL
  ALTER TABLE students ALTER COLUMN student_name SET NOT NULL;
  ALTER TABLE students ALTER COLUMN contact_number SET NOT NULL;
  ALTER TABLE students ALTER COLUMN class SET NOT NULL;
  ALTER TABLE students ALTER COLUMN year SET NOT NULL;
  ALTER TABLE students ALTER COLUMN state SET NOT NULL;

EXCEPTION
  WHEN others THEN
    -- Handle any errors gracefully
    RAISE NOTICE 'Error updating constraints: %', SQLERRM;
END $$;

-- Drop the unique constraint on student_mail_id since it's now optional
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'students' 
    AND constraint_name = 'students_student_mail_id_key'
  ) THEN
    ALTER TABLE students DROP CONSTRAINT students_student_mail_id_key;
  END IF;
EXCEPTION
  WHEN others THEN
    -- Constraint doesn't exist or other error, continue
    NULL;
END $$;

-- Create a partial unique index on student_mail_id for non-empty values only
CREATE UNIQUE INDEX IF NOT EXISTS students_student_mail_id_unique_idx 
ON students(student_mail_id) 
WHERE student_mail_id IS NOT NULL AND student_mail_id != '';