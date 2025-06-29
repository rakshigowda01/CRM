/*
  # Update students table schema

  1. Schema Updates
    - Add missing columns if they don't exist
    - Rename classexam to class if needed
    - Ensure all required columns are present
  
  2. Security
    - Enable RLS on students table
    - Add policies for authenticated users to manage student data
    
  3. Performance
    - Add indexes on commonly queried columns
*/

-- First, let's handle the table structure
DO $$ 
BEGIN
  -- Check if students table exists, if not create it
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    CREATE TABLE students (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      studentname text NOT NULL,
      gender text NOT NULL,
      contactnumber text NOT NULL,
      fathername text NOT NULL,
      mothername text NOT NULL,
      parentsnumber text NOT NULL,
      studentmailid text UNIQUE NOT NULL,
      address text NOT NULL,
      pincode text NOT NULL,
      state text NOT NULL,
      classexam text NOT NULL,
      year integer NOT NULL,
      collegeschool text NOT NULL,
      entranceexam text NOT NULL,
      stream text NOT NULL,
      rank integer,
      board text NOT NULL,
      district text NOT NULL,
      city text NOT NULL,
      dateofbirth date,
      category text NOT NULL DEFAULT 'General',
      examspreparing text[] NOT NULL DEFAULT '{}',
      marks10th integer NOT NULL DEFAULT 0,
      marks12th integer,
      graduationmarks integer,
      institutionname text NOT NULL,
      admissionstatus text NOT NULL DEFAULT 'new',
      followupstatus text NOT NULL DEFAULT 'pending',
      lastcontactdate timestamptz,
      nextfollowupdate timestamptz,
      callstatus text,
      calloutcome text,
      notes text,
      assignedto uuid,
      assignedexecutive text,
      tags text[] NOT NULL DEFAULT '{}',
      createdat timestamptz DEFAULT now(),
      updatedat timestamptz DEFAULT now(),
      createdby uuid,
      lastupdatedby uuid
    );
  END IF;

  -- Add missing columns if they don't exist
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'student_name') THEN
    ALTER TABLE students ADD COLUMN student_name text;
    -- Copy data from existing column if it exists
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'studentname') THEN
      UPDATE students SET student_name = studentname WHERE student_name IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'contact_number') THEN
    ALTER TABLE students ADD COLUMN contact_number text;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'contactnumber') THEN
      UPDATE students SET contact_number = contactnumber WHERE contact_number IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'father_name') THEN
    ALTER TABLE students ADD COLUMN father_name text;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'fathername') THEN
      UPDATE students SET father_name = fathername WHERE father_name IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'mother_name') THEN
    ALTER TABLE students ADD COLUMN mother_name text;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'mothername') THEN
      UPDATE students SET mother_name = mothername WHERE mother_name IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'parents_number') THEN
    ALTER TABLE students ADD COLUMN parents_number text;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'parentsnumber') THEN
      UPDATE students SET parents_number = parentsnumber WHERE parents_number IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'student_mail_id') THEN
    ALTER TABLE students ADD COLUMN student_mail_id text;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'studentmailid') THEN
      UPDATE students SET student_mail_id = studentmailid WHERE student_mail_id IS NULL;
    END IF;
  END IF;

  -- Handle the class column - rename classexam to class
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'class') THEN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'classexam') THEN
      ALTER TABLE students RENAME COLUMN classexam TO class;
    ELSE
      ALTER TABLE students ADD COLUMN class text NOT NULL DEFAULT '12th';
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'college_school') THEN
    ALTER TABLE students ADD COLUMN college_school text;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'collegeschool') THEN
      UPDATE students SET college_school = collegeschool WHERE college_school IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'entrance_exam') THEN
    ALTER TABLE students ADD COLUMN entrance_exam text;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'entranceexam') THEN
      UPDATE students SET entrance_exam = entranceexam WHERE entrance_exam IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'date_of_birth') THEN
    ALTER TABLE students ADD COLUMN date_of_birth date;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'dateofbirth') THEN
      UPDATE students SET date_of_birth = dateofbirth WHERE date_of_birth IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'exams_preparing') THEN
    ALTER TABLE students ADD COLUMN exams_preparing text[] DEFAULT '{}';
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'examspreparing') THEN
      UPDATE students SET exams_preparing = examspreparing WHERE exams_preparing IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'marks_10th') THEN
    ALTER TABLE students ADD COLUMN marks_10th integer DEFAULT 0;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'marks10th') THEN
      UPDATE students SET marks_10th = marks10th WHERE marks_10th IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'marks_12th') THEN
    ALTER TABLE students ADD COLUMN marks_12th integer;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'marks12th') THEN
      UPDATE students SET marks_12th = marks12th WHERE marks_12th IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'graduation_marks') THEN
    ALTER TABLE students ADD COLUMN graduation_marks integer;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'graduationmarks') THEN
      UPDATE students SET graduation_marks = graduationmarks WHERE graduation_marks IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'institution_name') THEN
    ALTER TABLE students ADD COLUMN institution_name text;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'institutionname') THEN
      UPDATE students SET institution_name = institutionname WHERE institution_name IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'admission_status') THEN
    ALTER TABLE students ADD COLUMN admission_status text DEFAULT 'new';
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'admissionstatus') THEN
      UPDATE students SET admission_status = admissionstatus WHERE admission_status IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'follow_up_status') THEN
    ALTER TABLE students ADD COLUMN follow_up_status text DEFAULT 'pending';
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'followupstatus') THEN
      UPDATE students SET follow_up_status = followupstatus WHERE follow_up_status IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'call_status') THEN
    ALTER TABLE students ADD COLUMN call_status text;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'callstatus') THEN
      UPDATE students SET call_status = callstatus WHERE call_status IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'call_outcome') THEN
    ALTER TABLE students ADD COLUMN call_outcome text;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'calloutcome') THEN
      UPDATE students SET call_outcome = calloutcome WHERE call_outcome IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'assigned_to') THEN
    ALTER TABLE students ADD COLUMN assigned_to uuid;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'assignedto') THEN
      UPDATE students SET assigned_to = assignedto WHERE assigned_to IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'assigned_executive') THEN
    ALTER TABLE students ADD COLUMN assigned_executive text;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'assignedexecutive') THEN
      UPDATE students SET assigned_executive = assignedexecutive WHERE assigned_executive IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'created_at') THEN
    ALTER TABLE students ADD COLUMN created_at timestamptz DEFAULT now();
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'createdat') THEN
      UPDATE students SET created_at = createdat WHERE created_at IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'updated_at') THEN
    ALTER TABLE students ADD COLUMN updated_at timestamptz DEFAULT now();
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'updatedat') THEN
      UPDATE students SET updated_at = updatedat WHERE updated_at IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'created_by') THEN
    ALTER TABLE students ADD COLUMN created_by uuid;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'createdby') THEN
      UPDATE students SET created_by = createdby WHERE created_by IS NULL;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'last_updated_by') THEN
    ALTER TABLE students ADD COLUMN last_updated_by uuid;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'lastupdatedby') THEN
      UPDATE students SET last_updated_by = lastupdatedby WHERE last_updated_by IS NULL;
    END IF;
  END IF;

END $$;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable read access for authenticated users" ON students;
  DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON students;
  DROP POLICY IF EXISTS "Enable update access for authenticated users" ON students;
  DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON students;
  DROP POLICY IF EXISTS "Enable read access for all users" ON students;
  DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON students;
  DROP POLICY IF EXISTS "Enable update access for authenticated users" ON students;
  DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON students;
EXCEPTION
  WHEN undefined_table THEN
    -- Table doesn't exist yet, continue
    NULL;
  WHEN undefined_object THEN
    -- Policy doesn't exist, continue
    NULL;
END $$;

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON students
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON students
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS students_state_idx ON students(state);
CREATE INDEX IF NOT EXISTS students_class_idx ON students(class);
CREATE INDEX IF NOT EXISTS students_year_idx ON students(year);
CREATE INDEX IF NOT EXISTS students_admission_status_idx ON students(admission_status);
CREATE INDEX IF NOT EXISTS students_assigned_to_idx ON students(assigned_to);
CREATE INDEX IF NOT EXISTS students_created_at_idx ON students(created_at);
CREATE INDEX IF NOT EXISTS students_student_mail_id_idx ON students(student_mail_id);
CREATE INDEX IF NOT EXISTS students_contact_number_idx ON students(contact_number);

-- Add unique constraint on student_mail_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'students' 
    AND constraint_name = 'students_student_mail_id_key'
  ) THEN
    ALTER TABLE students ADD CONSTRAINT students_student_mail_id_key UNIQUE (student_mail_id);
  END IF;
EXCEPTION
  WHEN duplicate_table THEN
    -- Constraint already exists, continue
    NULL;
END $$;