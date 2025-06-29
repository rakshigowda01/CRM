/*
  # Fix Students Table RLS Policies

  1. Security Changes
    - Drop existing restrictive policies that prevent inserts
    - Create proper INSERT policy for authenticated users
    - Update SELECT policy to allow users to read students they have access to
    - Add UPDATE and DELETE policies for proper data management
    
  2. Policy Details
    - INSERT: Allow all authenticated users to insert student records
    - SELECT: Allow all authenticated users to read student records
    - UPDATE: Allow all authenticated users to update student records
    - DELETE: Allow all authenticated users to delete student records
    
  Note: These policies assume role-based access control is handled at the application level.
  For more granular control, additional policies can be added based on user roles.
*/

-- Drop existing policies that are causing issues
DROP POLICY IF EXISTS "Users can read own data" ON students;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON students;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON students;

-- Create new comprehensive policies for the students table
CREATE POLICY "Allow authenticated users to insert students"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read students"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update students"
  ON students
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete students"
  ON students
  FOR DELETE
  TO authenticated
  USING (true);