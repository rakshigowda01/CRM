import React, { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { Plus, Edit, Trash2, User, Mail, Phone, Building, FileText, X, Upload, Eye, EyeOff, Save, Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { INDIAN_STATES, DISTRICTS_BY_STATE } from '../constants/data';
import { UserService, CreateUserData, UserRecord } from '../services/userService';
import toast from 'react-hot-toast';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  district: string;
  institutionName: string;
  gstNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
  institutionLogo: string;
  role: 'manager' | 'executive';
  dataScope: {
    states: string[];
    districts: string[];
    classes: string[];
    years: number[];
  };
}

export const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    district: '',
    institutionName: '',
    gstNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    institutionLogo: '',
    role: user?.role === 'admin' ? 'manager' : 'executive',
    dataScope: {
      states: [],
      districts: [],
      classes: [],
      years: []
    }
  });

  const availableClasses = [
    '10th', '11th', '12th', 'B.Tech', 'B.E', 'B.Sc', 'B.Com', 'B.A', 'BBA', 'BCA', 
    'M.Tech', 'M.E', 'M.Sc', 'M.Com', 'M.A', 'MBA', 'MCA', 'MBBS', 'BDS', 'NEET', 'JEE'
  ];

  const availableYears = Array.from({ length: 11 }, (_, i) => 2015 + i);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await UserService.getAllUsers();
      
      // Filter users based on current user role
      let filteredUsers = allUsers;
      if (user?.role === 'admin') {
        // Admin can see managers and executives (not other admins)
        filteredUsers = allUsers.filter(u => u.role !== 'admin');
      } else if (user?.role === 'manager') {
        // Manager can only see executives
        filteredUsers = allUsers.filter(u => u.role === 'executive');
      }
      
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        setFormData(prev => ({ ...prev, institutionLogo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!formData.institutionLogo) {
      toast.error('Please upload an institution logo');
      return;
    }

    try {
      setLoading(true);

      const userData: CreateUserData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        institutionName: formData.institutionName,
        institutionLogo: formData.institutionLogo,
        gstNumber: formData.gstNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        district: formData.district,
        username: formData.username,
        password: formData.password,
        dataScope: formData.dataScope,
        createdBy: user?.id
      };

      if (editingUser) {
        // Update existing user
        const result = await UserService.updateUser(editingUser, userData);
        if (result.success) {
          toast.success(`${formData.role === 'manager' ? 'Manager' : 'Executive'} updated successfully`);
          await loadUsers();
        } else {
          toast.error(result.error || `Failed to update ${formData.role}`);
          return;
        }
      } else {
        // Create new user
        const result = await UserService.createUser(userData);
        if (result.success) {
          toast.success(`${formData.role === 'manager' ? 'Manager' : 'Executive'} created successfully! Login credentials are ready for use.`);
          await loadUsers();
        } else {
          toast.error(result.error || `Failed to create ${formData.role}`);
          return;
        }
      }
      
      // Reset form
      setShowModal(false);
      setEditingUser(null);
      setLogoPreview('');
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        district: '',
        institutionName: '',
        gstNumber: '',
        username: '',
        password: '',
        confirmPassword: '',
        institutionLogo: '',
        role: user?.role === 'admin' ? 'manager' : 'executive',
        dataScope: {
          states: [],
          districts: [],
          classes: [],
          years: []
        }
      });
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId: string) => {
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        address: userToEdit.address || '',
        city: userToEdit.city || '',
        state: userToEdit.state || '',
        district: userToEdit.district || '',
        institutionName: userToEdit.institution_name || '',
        gstNumber: userToEdit.gst_number || '',
        username: userToEdit.username,
        password: '',
        confirmPassword: '',
        institutionLogo: userToEdit.institution_logo || '',
        role: userToEdit.role as 'manager' | 'executive',
        dataScope: userToEdit.data_scope || {
          states: [],
          districts: [],
          classes: [],
          years: []
        }
      });
      setLogoPreview(userToEdit.institution_logo || '');
      setEditingUser(userId);
      setShowModal(true);
    }
  };

  const handleDelete = async (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (confirm(`Are you sure you want to delete this ${userToDelete?.role}? This action cannot be undone.`)) {
      try {
        const result = await UserService.deleteUser(userId);
        if (result.success) {
          toast.success(`${userToDelete?.role === 'manager' ? 'Manager' : 'Executive'} deleted successfully`);
          await loadUsers();
        } else {
          toast.error(result.error || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const result = await UserService.toggleUserStatus(userId);
      if (result.success) {
        toast.success('User status updated');
        await loadUsers();
      } else {
        toast.error(result.error || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const getAvailableDistricts = () => {
    return formData.state ? DISTRICTS_BY_STATE[formData.state] || [] : [];
  };

  const getPageTitle = () => {
    if (user?.role === 'admin') {
      return 'User Management';
    } else if (user?.role === 'manager') {
      return 'Executive Management';
    }
    return 'User Management';
  };

  const getPageDescription = () => {
    if (user?.role === 'admin') {
      return 'Create and manage institution managers and executives with complete portal access and data scope control';
    } else if (user?.role === 'manager') {
      return 'Create and manage executives for your institution with call center access and student assignments';
    }
    return 'Manage users in your organization';
  };

  const getCreateButtonText = () => {
    if (user?.role === 'admin') {
      return 'Create User';
    } else if (user?.role === 'manager') {
      return 'Create Executive';
    }
    return 'Create User';
  };

  // Check access permissions
  if (user?.role !== 'admin' && user?.role !== 'manager') {
    return (
      <Layout title="User Management">
        <div className="text-center py-12">
          <X className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">
            Only Backend and Manager portal users can access user management. Contact your system administrator.
          </p>
        </div>
      </Layout>
    );
  }

  if (loading && users.length === 0) {
    return (
      <Layout title={getPageTitle()}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={getPageTitle()}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
              <p className="text-gray-600 mt-1">
                {getPageDescription()}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              {getCreateButtonText()}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {user?.role === 'admin' ? 'Total Managers' : 'Total Executives'}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {user?.role === 'admin' 
                    ? users.filter(u => u.role === 'manager').length
                    : users.filter(u => u.role === 'executive').length
                  }
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{users.filter(u => u.is_active).length}</p>
              </div>
              <div className="bg-green-500 p-3 rounded-xl">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {user?.role === 'admin' ? 'Executives' : 'Inactive Users'}
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {user?.role === 'admin' 
                    ? users.filter(u => u.role === 'executive').length
                    : users.filter(u => !u.is_active).length
                  }
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-xl">
                <Phone className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {users.filter(u => {
                    const createdDate = new Date(u.created_at);
                    const now = new Date();
                    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-xl">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User & Institution
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Login Credentials
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No {user?.role === 'admin' ? 'Users' : 'Executives'} Found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Create your first {user?.role === 'admin' ? 'user account' : 'executive account'} to get started.
                      </p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {getCreateButtonText()}
                      </button>
                    </td>
                  </tr>
                ) : (
                  users.map((userRecord) => (
                    <tr key={userRecord.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-xl overflow-hidden mr-4 border border-gray-200">
                            {userRecord.institution_logo ? (
                              <img 
                                src={userRecord.institution_logo} 
                                alt={userRecord.institution_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Building className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{userRecord.name}</div>
                            <div className="text-sm text-gray-600">{userRecord.institution_name || 'No institution'}</div>
                            <div className="text-xs text-gray-500 capitalize">{userRecord.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{userRecord.email}</div>
                        <div className="text-sm text-gray-600">{userRecord.phone}</div>
                        <div className="text-xs text-gray-500">{userRecord.city}, {userRecord.state}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">Username:</span> {userRecord.username}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Password: Set during creation
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Ready for login
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userRecord.is_active 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userRecord.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <div className="text-xs text-gray-500">
                            Created: {new Date(userRecord.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(userRecord.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(userRecord.id)}
                            className={`p-1 rounded transition-colors ${
                              userRecord.is_active 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={userRecord.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(userRecord.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingUser ? `Edit ${formData.role === 'manager' ? 'Manager' : 'Executive'}` : `Create New ${formData.role === 'manager' ? 'Manager' : 'Executive'}`}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingUser(null);
                      setLogoPreview('');
                    }}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Role Selection (only for admin) */}
                {user?.role === 'admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Role *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                        <input
                          type="radio"
                          name="role"
                          value="manager"
                          checked={formData.role === 'manager'}
                          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'manager' | 'executive' }))}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Manager</div>
                          <div className="text-sm text-gray-500">Institution management access</div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                        <input
                          type="radio"
                          name="role"
                          value="executive"
                          checked={formData.role === 'executive'}
                          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'manager' | 'executive' }))}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Executive</div>
                          <div className="text-sm text-gray-500">Call center operations access</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Institution Logo */}
                <div className="text-center">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution Logo *
                    </label>
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 overflow-hidden">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Max 5MB, JPG/PNG format</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Personal Information
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter complete address"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <select
                          required
                          value={formData.state}
                          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value, district: '' }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          District *
                        </label>
                        <select
                          required
                          value={formData.district}
                          onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={!formData.state}
                        >
                          <option value="">Select District</option>
                          {getAvailableDistricts().map(district => (
                            <option key={district} value={district}>{district}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter city"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Institution & Login Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Institution & Login Information
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.institutionName}
                        onChange={(e) => setFormData(prev => ({ ...prev, institutionName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter institution name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.gstNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter GST number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter username for login"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Scope Configuration (only for managers or if admin creating manager) */}
                {(formData.role === 'manager' || user?.role === 'admin') && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Data Scope Configuration
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Accessible States
                        </label>
                        <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                          {INDIAN_STATES.map(state => (
                            <label key={state} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.dataScope.states.includes(state)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({
                                      ...prev,
                                      dataScope: {
                                        ...prev.dataScope,
                                        states: [...prev.dataScope.states, state]
                                      }
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      dataScope: {
                                        ...prev.dataScope,
                                        states: prev.dataScope.states.filter(s => s !== state)
                                      }
                                    }));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{state}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Accessible Classes
                        </label>
                        <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                          {availableClasses.map(className => (
                            <label key={className} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.dataScope.classes.includes(className)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({
                                      ...prev,
                                      dataScope: {
                                        ...prev.dataScope,
                                        classes: [...prev.dataScope.classes, className]
                                      }
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      dataScope: {
                                        ...prev.dataScope,
                                        classes: prev.dataScope.classes.filter(c => c !== className)
                                      }
                                    }));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{className}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Accessible Years
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableYears.map(year => (
                            <label key={year} className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                              <input
                                type="checkbox"
                                checked={formData.dataScope.years.includes(year)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({
                                      ...prev,
                                      dataScope: {
                                        ...prev.dataScope,
                                        years: [...prev.dataScope.years, year]
                                      }
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      dataScope: {
                                        ...prev.dataScope,
                                        years: prev.dataScope.years.filter(y => y !== year)
                                      }
                                    }));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{year}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingUser(null);
                      setLogoPreview('');
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {editingUser ? `Update ${formData.role === 'manager' ? 'Manager' : 'Executive'}` : `Create ${formData.role === 'manager' ? 'Manager' : 'Executive'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};