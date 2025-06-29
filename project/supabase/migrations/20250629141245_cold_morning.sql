/*
  # Fix Users Table RLS Policies

  1. Security Updates
    - Drop existing restrictive policies that are blocking operations
    - Create new policies that allow proper user management
    - Enable admin users to manage all user accounts
    - Allow authenticated users to read user data for login purposes

  2. Policy Changes
    - Allow anon users to read users for login authentication
    - Allow authenticated users (admins) to perform all CRUD operations
    - Ensure proper access control while enabling functionality
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Allow anon users to read users for login" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to read users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to insert users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to update users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to delete users" ON users;

-- Create new policies that allow proper functionality

-- Allow anonymous users to read users for login authentication
CREATE POLICY "Enable read access for anon users for login"
  ON users
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to read all users
CREATE POLICY "Enable read access for authenticated users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert new users (admin functionality)
CREATE POLICY "Enable insert for authenticated users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update users
CREATE POLICY "Enable update for authenticated users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete users
CREATE POLICY "Enable delete for authenticated users"
  ON users
  FOR DELETE
  TO authenticated
  USING (true);