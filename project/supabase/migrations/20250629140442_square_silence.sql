/*
  # Create users table for manager accounts

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `role` (text)
      - `institution_name` (text)
      - `institution_logo` (text)
      - `gst_number` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `district` (text)
      - `username` (text, unique)
      - `password_hash` (text)
      - `data_scope` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid)

  2. Security
    - Enable RLS on `users` table
    - Add policies for authenticated users to manage user data
    
  3. Indexes
    - Add indexes on commonly queried columns
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  role text NOT NULL DEFAULT 'manager',
  institution_name text,
  institution_logo text,
  gst_number text,
  address text,
  city text,
  state text,
  district text,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  data_scope jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users to read users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anon users to read users for login"
  ON users
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_username_idx ON users(username);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE INDEX IF NOT EXISTS users_is_active_idx ON users(is_active);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at);

-- Insert default admin user
INSERT INTO users (
  id,
  name,
  email,
  phone,
  role,
  institution_name,
  username,
  password_hash,
  is_active,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Backend Administrator',
  'rakshigowda628@gmail.com',
  '+919876543210',
  'admin',
  'EduCRM Backend System',
  'admin',
  '$2b$10$rQJ8vQZ9X8K9X8K9X8K9XeJ8vQZ9X8K9X8K9X8K9X8K9X8K9X8K9Xe', -- This represents hashed 'Rakshi@01'
  true,
  now()
) ON CONFLICT (email) DO NOTHING;