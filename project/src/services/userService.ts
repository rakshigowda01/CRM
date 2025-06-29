import { supabase } from '../lib/supabase';

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'executive';
  institutionName?: string;
  institutionLogo?: string;
  gstNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  district?: string;
  username: string;
  password: string;
  dataScope?: {
    states: string[];
    districts: string[];
    classes: string[];
    years: number[];
  };
  createdBy?: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'executive';
  institution_name?: string;
  institution_logo?: string;
  gst_number?: string;
  address?: string;
  city?: string;
  state?: string;
  district?: string;
  username: string;
  data_scope?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export class UserService {
  // Simple password hashing (in production, use proper bcrypt)
  private static hashPassword(password: string): string {
    // Simple hash for demo - in production use bcrypt
    return btoa(password + 'salt');
  }

  // Verify password
  private static verifyPassword(password: string, hash: string): boolean {
    return btoa(password + 'salt') === hash;
  }

  // Create a new user
  static async createUser(userData: CreateUserData): Promise<{ success: boolean; user?: UserRecord; error?: string }> {
    try {
      // Check if username or email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id, username, email')
        .or(`username.eq.${userData.username},email.eq.${userData.email}`)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError);
        return { success: false, error: 'Failed to check existing user' };
      }

      if (existingUser) {
        if (existingUser.username === userData.username) {
          return { success: false, error: 'Username already exists' };
        }
        if (existingUser.email === userData.email) {
          return { success: false, error: 'Email already exists' };
        }
      }

      // Hash the password
      const passwordHash = this.hashPassword(userData.password);

      // Insert the new user
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          institution_name: userData.institutionName,
          institution_logo: userData.institutionLogo,
          gst_number: userData.gstNumber,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          district: userData.district,
          username: userData.username,
          password_hash: passwordHash,
          data_scope: userData.dataScope || {},
          created_by: userData.createdBy,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return { success: false, error: error.message };
      }

      return { success: true, user: data };
    } catch (error) {
      console.error('Error in createUser:', error);
      return { success: false, error: 'Failed to create user' };
    }
  }

  // Authenticate user
  static async authenticateUser(username: string, password: string): Promise<{ success: boolean; user?: UserRecord; error?: string }> {
    try {
      // Find user by username or email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .or(`username.eq.${username},email.eq.${username}`)
        .eq('is_active', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error finding user:', error);
        return { success: false, error: 'Authentication failed' };
      }

      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Verify password
      if (!this.verifyPassword(password, user.password_hash)) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Update last login (optional)
      await supabase
        .from('users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', user.id);

      return { success: true, user };
    } catch (error) {
      console.error('Error in authenticateUser:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Get all users
  static async getAllUsers(): Promise<UserRecord[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw new Error(`Failed to fetch users: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Database fetch error:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(userId: string, updates: Partial<CreateUserData>): Promise<{ success: boolean; user?: UserRecord; error?: string }> {
    try {
      const updateData: any = {
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        role: updates.role,
        institution_name: updates.institutionName,
        institution_logo: updates.institutionLogo,
        gst_number: updates.gstNumber,
        address: updates.address,
        city: updates.city,
        state: updates.state,
        district: updates.district,
        username: updates.username,
        data_scope: updates.dataScope,
        updated_at: new Date().toISOString()
      };

      // Only update password if provided
      if (updates.password) {
        updateData.password_hash = this.hashPassword(updates.password);
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        return { success: false, error: error.message };
      }

      return { success: true, user: data };
    } catch (error) {
      console.error('Error in updateUser:', error);
      return { success: false, error: 'Failed to update user' };
    }
  }

  // Delete user
  static async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  }

  // Toggle user active status
  static async toggleUserStatus(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First get current status
      const { data: currentUser, error: fetchError } = await supabase
        .from('users')
        .select('is_active')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching user status:', fetchError);
        return { success: false, error: 'Failed to fetch user status' };
      }

      if (!currentUser) {
        return { success: false, error: 'User not found' };
      }

      // Toggle status
      const { error } = await supabase
        .from('users')
        .update({ 
          is_active: !currentUser.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error toggling user status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in toggleUserStatus:', error);
      return { success: false, error: 'Failed to toggle user status' };
    }
  }

  // Test database connection
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Users table connection test failed:', error);
        return false;
      }

      console.log('Users table connection test successful');
      return true;
    } catch (error) {
      console.error('Users table connection test error:', error);
      return false;
    }
  }
}