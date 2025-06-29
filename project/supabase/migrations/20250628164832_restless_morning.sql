-- Add INSERT policy for students table to allow authenticated users to insert records
-- Use DROP IF EXISTS to handle case where policy might already exist
DROP POLICY IF EXISTS "Allow authenticated users to insert students" ON students;

CREATE POLICY "Allow authenticated users to insert students"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (true);