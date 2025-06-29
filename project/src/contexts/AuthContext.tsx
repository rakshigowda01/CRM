import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { UserService } from '../services/userService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, portal: 'admin' | 'manager' | 'executive') => {
    setLoading(true);
    try {
      // First try database authentication
      const authResult = await UserService.authenticateUser(email, password);
      
      if (authResult.success && authResult.user) {
        const dbUser = authResult.user;
        
        // Check if user role matches the selected portal
        if (dbUser.role !== portal) {
          throw new Error(`Invalid portal selection. This account is for ${dbUser.role} portal.`);
        }

        // Convert database user to app user format
        const mockUser: User = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          phone: dbUser.phone,
          role: dbUser.role,
          institutionName: dbUser.institution_name || '',
          institutionLogo: dbUser.institution_logo || '',
          gstNumber: dbUser.gst_number || '',
          address: dbUser.address || '',
          city: dbUser.city || '',
          state: dbUser.state || '',
          username: dbUser.username,
          password: '', // Don't store password in frontend
          dataScope: dbUser.data_scope || {
            states: [],
            districts: [],
            classes: [],
            years: []
          },
          permissions: [
            {
              id: '1',
              name: 'Full Access',
              resource: 'all',
              actions: ['create', 'read', 'update', 'delete']
            }
          ],
          isActive: dbUser.is_active,
          createdAt: dbUser.created_at,
          updatedAt: dbUser.updated_at
        };

        const token = 'jwt-token-' + Date.now();
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        return;
      }

      // Fallback to hardcoded credentials for demo purposes
      if (portal === 'admin' && email === 'rakshigowda628@gmail.com' && password === 'Rakshi@01') {
        const mockUser: User = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Backend Administrator',
          email: 'rakshigowda628@gmail.com',
          phone: '+919876543210',
          role: 'admin',
          institutionName: 'EduCRM Backend System',
          institutionLogo: '',
          gstNumber: '27AAPFU0939F1ZV',
          address: '123 Demo Street, Demo City',
          city: 'Demo City',
          state: 'Maharashtra',
          username: 'admin',
          password: '',
          dataScope: {
            states: [],
            districts: [],
            classes: [],
            years: []
          },
          permissions: [
            {
              id: '1',
              name: 'Full Access',
              resource: 'all',
              actions: ['create', 'read', 'update', 'delete']
            }
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const token = 'mock-jwt-token';
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }

      // Demo credentials for manager portal
      if (portal === 'manager' && email === 'manager@educrm.com' && password === 'manager123') {
        const mockUser: User = {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Demo Manager',
          email: 'manager@educrm.com',
          phone: '+919876543210',
          role: 'manager',
          institutionName: 'Demo Educational Institute',
          institutionLogo: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
          gstNumber: '29AAPFU0939F1ZV',
          address: '123 Education Street, Tech City',
          city: 'Bangalore',
          state: 'Karnataka',
          username: 'manager_demo',
          password: '',
          dataScope: {
            states: ['Karnataka', 'Tamil Nadu'],
            districts: ['Bangalore Urban', 'Chennai'],
            classes: ['12th', 'B.Tech', 'B.Sc'],
            years: [2023, 2024, 2025]
          },
          permissions: [
            {
              id: '1',
              name: 'Manager Access',
              resource: 'institution',
              actions: ['create', 'read', 'update', 'delete']
            }
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const token = 'manager-jwt-token';
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }

      // Demo credentials for executive portal
      if (portal === 'executive' && email === 'executive@educrm.com' && password === 'exec123') {
        const mockUser: User = {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Demo Executive',
          email: 'executive@educrm.com',
          phone: '+919876543212',
          role: 'executive',
          institutionName: 'Demo Educational Institute',
          institutionLogo: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
          gstNumber: '29AAPFU0939F1ZV',
          address: '123 Education Street, Tech City',
          city: 'Bangalore',
          state: 'Karnataka',
          username: 'executive_demo',
          password: '',
          dataScope: {
            states: ['Karnataka'],
            districts: ['Bangalore Urban'],
            classes: ['12th'],
            years: [2024]
          },
          permissions: [
            {
              id: '1',
              name: 'Executive Access',
              resource: 'students',
              actions: ['read', 'update']
            }
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const token = 'executive-jwt-token';
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};