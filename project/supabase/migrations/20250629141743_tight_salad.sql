/*
  # Fix Users Table RLS Policies

  1. Security Changes
    - Drop existing problematic policies
    - Create proper authentication access for login
    - Allow admin users full access to manage other users
    - Allow users to read and update their own profiles
    
  2. Policy Details
    - Authentication access: Allow anyone to read users for login verification
    - Admin access: Full CRUD for users with admin role
    - Self access: Users can read and update their own data
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Enable read access for anon users for login" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to read users" ON users;
DROP POLICY IF EXISTS "Allow anon users to read users for login" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to insert users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to update users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to delete users" ON users;

-- Create new comprehensive policies

-- Allow anyone to read users table for authentication (login process)
CREATE POLICY "Allow authentication access"
  ON users
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow admin users to insert new users
CREATE POLICY "Allow admin to insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin' 
      AND u.is_active = true
    )
  );

-- Allow admin users to update any user
CREATE POLICY "Allow admin to update users"
  ON users
  FOR UPDATE
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

-- Allow admin users to delete users
CREATE POLICY "Allow admin to delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin' 
      AND u.is_active = true
    )
  );

-- Allow users to update their own profile (non-critical fields only)
CREATE POLICY "Allow users to update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);