/*
  # Fix Users Table RLS Policies

  1. Security Updates
    - Drop existing restrictive policies on users table
    - Create proper policies for admin operations
    - Allow authenticated users to read users for authentication
    - Allow admins to perform all CRUD operations
    - Allow users to read their own data

  2. Policy Details
    - Admin users can perform all operations (SELECT, INSERT, UPDATE, DELETE)
    - Authenticated users can read users table for login/authentication purposes
    - Users can read their own profile data
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Enable read access for anon users for login" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON users;

-- Create new comprehensive policies

-- Allow anyone to read users table for authentication (login process)
CREATE POLICY "Allow authentication access"
  ON users
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow admin users to perform all operations
CREATE POLICY "Allow admin full access"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin' 
      AND u.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin' 
      AND u.is_active = true
    )
  );

-- Allow users to read their own data
CREATE POLICY "Allow users to read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own data (excluding role and critical fields)
CREATE POLICY "Allow users to update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND OLD.role = NEW.role 
    AND OLD.username = NEW.username
  );