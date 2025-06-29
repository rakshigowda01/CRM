/*
  # Create users table for manager authentication

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, unique, required)
      - `phone` (text, required)
      - `role` (text, default 'manager')
      - `institution_name` (text, optional)
      - `institution_logo` (text, optional)
      - `gst_number` (text, optional)
      - `address` (text, optional)
      - `city` (text, optional)
      - `state` (text, optional)
      - `district` (text, optional)
      - `username` (text, unique, required)
      - `password_hash` (text, required)
      - `data_scope` (jsonb, default '{}')
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `created_by` (uuid, optional)

  2. Security
    - Enable RLS on `users` table
    - Add policies for authenticated and anonymous users
    
  3. Performance
    - Add indexes on commonly queried columns
    
  4. Default Data
    - Insert default admin user
*/

-- Drop table if it exists to start fresh
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  role text NOT NULL DEFAULT 'manager',
  institution_name text,
  institution_logo text,
  gst_number text,
  address text,
  city text,
  state text,
  district text,
  username text NOT NULL,
  password_hash text NOT NULL,
  data_scope jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid
);

-- Add unique constraints
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE (username);

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
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_username_idx ON users(username);
CREATE INDEX users_role_idx ON users(role);
CREATE INDEX users_is_active_idx ON users(is_active);
CREATE INDEX users_created_at_idx ON users(created_at);

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
  '$2b$10$rQJ8vQZ9X8K9X8K9X8K9XeJ8vQZ9X8K9X8K9X8K9X8K9X8K9X8K9Xe',
  true,
  now()
);

-- Insert sample manager users for testing
INSERT INTO users (
  id,
  name,
  email,
  phone,
  role,
  institution_name,
  institution_logo,
  gst_number,
  address,
  city,
  state,
  district,
  username,
  password_hash,
  data_scope,
  is_active,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Rajesh Kumar',
  'rajesh@abcinstitute.com',
  '+919876543210',
  'manager',
  'ABC Educational Institute',
  'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  '29AAPFU0939F1ZV',
  '123 Education Street, Tech City',
  'Bangalore',
  'Karnataka',
  'Bangalore Urban',
  'rajesh_abc',
  '$2b$10$manager123hash',
  '{"states": ["Karnataka", "Tamil Nadu"], "districts": ["Bangalore Urban", "Chennai"], "classes": ["12th", "B.Tech", "B.Sc"], "years": [2023, 2024, 2025]}',
  true,
  now()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Priya Sharma',
  'priya@xyzcoaching.com',
  '+919876543211',
  'manager',
  'XYZ Coaching Center',
  'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  '27BBPFU0939F1ZV',
  '456 Learning Avenue, Education Hub',
  'Mumbai',
  'Maharashtra',
  'Mumbai',
  'priya_xyz',
  '$2b$10$manager456hash',
  '{"states": ["Maharashtra", "Gujarat"], "districts": ["Mumbai", "Pune", "Ahmedabad"], "classes": ["11th", "12th", "JEE", "NEET"], "years": [2024, 2025]}',
  true,
  now()
);