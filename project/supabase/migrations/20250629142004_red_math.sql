/*
  # Fix User Passwords for Demo Login

  1. Updates
    - Update existing demo users with proper password hashes
    - Ensure demo credentials work for manager and executive portals
    
  2. Demo Credentials
    - Manager: manager@educrm.com / manager123
    - Executive: executive@educrm.com / exec123
*/

-- Update existing manager user with correct password hash
UPDATE users 
SET 
  email = 'manager@educrm.com',
  username = 'manager_demo',
  password_hash = 'bWFuYWdlcjEyM3NhbHQ=',  -- base64 encoded 'manager123salt'
  name = 'Demo Manager',
  institution_name = 'Demo Educational Institute'
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- Insert executive user if not exists
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
) VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'Demo Executive',
  'executive@educrm.com',
  '+919876543212',
  'executive',
  'Demo Educational Institute',
  'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  '29AAPFU0939F1ZV',
  '123 Education Street, Tech City',
  'Bangalore',
  'Karnataka',
  'Bangalore Urban',
  'executive_demo',
  'ZXhlYzEyM3NhbHQ=',  -- base64 encoded 'exec123salt'
  '{"states": ["Karnataka"], "districts": ["Bangalore Urban"], "classes": ["12th"], "years": [2024]}',
  true,
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  institution_name = EXCLUDED.institution_name;