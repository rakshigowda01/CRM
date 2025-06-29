import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Phone, 
  Globe, 
  Save, 
  Eye, 
  EyeOff,
  Edit3,
  Trash2,
  Plus,
  X,
  Filter,
  MapPin,
  GraduationCap,
  Calendar,
  Users,
  Building,
  Sliders
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { INDIAN_STATES, DISTRICTS_BY_STATE, EXAMS, CLASSES } from '../constants/data';
import toast from 'react-hot-toast';

interface FilterItem {
  id: string;
  name: string;
  value: string;
  isActive: boolean;
  order: number;
}

interface PortalSettings {
  id: string;
  portalType: 'manager' | 'executive';
  features: {
    dashboard: boolean;
    studentManagement: boolean;
    bulkOperations: boolean;
    reports: boolean;
    callCenter: boolean;
    dataUpload: boolean;
    userManagement: boolean;
  };
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canExport: boolean;
    canAssign: boolean;
  };
  uiSettings: {
    theme: 'light' | 'dark' | 'auto';
    compactMode: boolean;
    showAdvancedFilters: boolean;
  };
}

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [editingFilter, setEditingFilter] = useState<string | null>(null);
  const [newFilterItem, setNewFilterItem] = useState('');
  const [selectedFilterType, setSelectedFilterType] = useState<'states' | 'districts' | 'classes' | 'years' | 'exams'>('states');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    institutionName: user?.institutionName || '',
    gstNumber: user?.gstNumber || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || ''
  });

  // Mock filter data - in real app this would come from database
  const [filterData, setFilterData] = useState({
    states: INDIAN_STATES.map((state, index) => ({
      id: `state-${index}`,
      name: state,
      value: state,
      isActive: true,
      order: index
    })),
    districts: Object.values(DISTRICTS_BY_STATE).flat().map((district, index) => ({
      id: `district-${index}`,
      name: district,
      value: district,
      isActive: true,
      order: index
    })),
    classes: CLASSES.map((cls, index) => ({
      id: `class-${index}`,
      name: cls,
      value: cls,
      isActive: true,
      order: index
    })),
    years: Array.from({ length: 11 }, (_, i) => 2015 + i).map((year, index) => ({
      id: `year-${index}`,
      name: year.toString(),
      value: year.toString(),
      isActive: true,
      order: index
    })),
    exams: EXAMS.map((exam, index) => ({
      id: `exam-${index}`,
      name: exam,
      value: exam,
      isActive: true,
      order: index
    }))
  });

  // Mock portal settings
  const [portalSettings, setPortalSettings] = useState<PortalSettings[]>([
    {
      id: 'manager-settings',
      portalType: 'manager',
      features: {
        dashboard: true,
        studentManagement: true,
        bulkOperations: true,
        reports: true,
        callCenter: false,
        dataUpload: true,
        userManagement: true
      },
      permissions: {
        canEdit: true,
        canDelete: true,
        canExport: true,
        canAssign: true
      },
      uiSettings: {
        theme: 'light',
        compactMode: false,
        showAdvancedFilters: true
      }
    },
    {
      id: 'executive-settings',
      portalType: 'executive',
      features: {
        dashboard: true,
        studentManagement: true,
        bulkOperations: false,
        reports: true,
        callCenter: true,
        dataUpload: false,
        userManagement: false
      },
      permissions: {
        canEdit: true,
        canDelete: false,
        canExport: false,
        canAssign: false
      },
      uiSettings: {
        theme: 'light',
        compactMode: true,
        showAdvancedFilters: false
      }
    }
  ]);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleAddFilterItem = () => {
    if (!newFilterItem.trim()) {
      toast.error('Please enter a filter item name');
      return;
    }

    const newItem: FilterItem = {
      id: `${selectedFilterType}-${Date.now()}`,
      name: newFilterItem.trim(),
      value: newFilterItem.trim(),
      isActive: true,
      order: filterData[selectedFilterType].length
    };

    setFilterData(prev => ({
      ...prev,
      [selectedFilterType]: [...prev[selectedFilterType], newItem]
    }));

    setNewFilterItem('');
    toast.success(`Added ${newFilterItem} to ${selectedFilterType}`);
  };

  const handleDeleteFilterItem = (type: string, id: string) => {
    setFilterData(prev => ({
      ...prev,
      [type]: prev[type as keyof typeof prev].filter(item => item.id !== id)
    }));
    toast.success('Filter item deleted');
  };

  const handleToggleFilterItem = (type: string, id: string) => {
    setFilterData(prev => ({
      ...prev,
      [type]: prev[type as keyof typeof prev].map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    }));
  };

  const handleUpdatePortalSettings = (portalId: string, updates: Partial<PortalSettings>) => {
    setPortalSettings(prev =>
      prev.map(portal =>
        portal.id === portalId ? { ...portal, ...updates } : portal
      )
    );
    toast.success('Portal settings updated');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'filters', label: 'Filter Management', icon: Filter },
    { id: 'portals', label: 'Portal Settings', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Database }
  ];

  const getTabsForRole = () => {
    if (user?.role === 'admin') {
      return tabs;
    } else if (user?.role === 'manager') {
      return tabs.filter(tab => !['system', 'filters', 'portals'].includes(tab.id));
    } else {
      return tabs.filter(tab => !['system', 'security', 'filters', 'portals'].includes(tab.id));
    }
  };

  const availableTabs = getTabsForRole();

  const getFilterIcon = (type: string) => {
    switch (type) {
      case 'states': return MapPin;
      case 'districts': return Building;
      case 'classes': return GraduationCap;
      case 'years': return Calendar;
      case 'exams': return Users;
      default: return Filter;
    }
  };

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
          <p className="text-gray-600">
            Manage your account settings, filter configurations, and portal preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <nav className="space-y-2">
                {availableTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Institution Name
                        </label>
                        <input
                          type="text"
                          value={formData.institutionName}
                          onChange={(e) => setFormData(prev => ({ ...prev, institutionName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GST Number
                        </label>
                        <input
                          type="text"
                          value={formData.gstNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Management Tab */}
              {activeTab === 'filters' && user?.role === 'admin' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Filter Management</h3>
                  
                  {/* Filter Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Filter Type to Manage
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {(['states', 'districts', 'classes', 'years', 'exams'] as const).map((type) => {
                        const Icon = getFilterIcon(type);
                        return (
                          <button
                            key={type}
                            onClick={() => setSelectedFilterType(type)}
                            className={`p-4 border-2 rounded-xl transition-all ${
                              selectedFilterType === type
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm font-medium capitalize">{type}</div>
                            <div className="text-xs text-gray-500">
                              {filterData[type].filter(item => item.isActive).length} active
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add New Filter Item */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-3">Add New {selectedFilterType.slice(0, -1)}</h4>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newFilterItem}
                        onChange={(e) => setNewFilterItem(e.target.value)}
                        placeholder={`Enter new ${selectedFilterType.slice(0, -1)} name`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFilterItem()}
                      />
                      <button
                        onClick={handleAddFilterItem}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Filter Items List */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Manage {selectedFilterType} ({filterData[selectedFilterType].length} total)
                    </h4>
                    
                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                      <div className="divide-y divide-gray-200">
                        {filterData[selectedFilterType].map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-3 ${
                                item.isActive ? 'bg-green-500' : 'bg-gray-300'
                              }`}></div>
                              <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">
                                  {item.isActive ? 'Active' : 'Inactive'} • Order: {item.order}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleToggleFilterItem(selectedFilterType, item.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  item.isActive 
                                    ? 'text-green-600 hover:bg-green-100' 
                                    : 'text-gray-400 hover:bg-gray-100'
                                }`}
                                title={item.isActive ? 'Deactivate' : 'Activate'}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingFilter(item.id)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFilterItem(selectedFilterType, item.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Portal Settings Tab */}
              {activeTab === 'portals' && user?.role === 'admin' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Portal Settings</h3>
                  
                  <div className="space-y-8">
                    {portalSettings.map((portal) => (
                      <div key={portal.id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 capitalize">
                              {portal.portalType} Portal Configuration
                            </h4>
                            <p className="text-sm text-gray-600">
                              Configure features, permissions, and UI settings for {portal.portalType} users
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            portal.portalType === 'manager' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {portal.portalType === 'manager' ? 'Institution Portal' : 'Telecaller Portal'}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Features */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Available Features</h5>
                            <div className="space-y-3">
                              {Object.entries(portal.features).map(([feature, enabled]) => (
                                <label key={feature} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={enabled}
                                    onChange={(e) => handleUpdatePortalSettings(portal.id, {
                                      features: { ...portal.features, [feature]: e.target.checked }
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-700 capitalize">
                                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Permissions */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Permissions</h5>
                            <div className="space-y-3">
                              {Object.entries(portal.permissions).map(([permission, enabled]) => (
                                <label key={permission} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={enabled}
                                    onChange={(e) => handleUpdatePortalSettings(portal.id, {
                                      permissions: { ...portal.permissions, [permission]: e.target.checked }
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-700 capitalize">
                                    {permission.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* UI Settings */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">UI Settings</h5>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Theme
                                </label>
                                <select
                                  value={portal.uiSettings.theme}
                                  onChange={(e) => handleUpdatePortalSettings(portal.id, {
                                    uiSettings: { ...portal.uiSettings, theme: e.target.value as any }
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                  <option value="light">Light</option>
                                  <option value="dark">Dark</option>
                                  <option value="auto">Auto</option>
                                </select>
                              </div>
                              
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={portal.uiSettings.compactMode}
                                  onChange={(e) => handleUpdatePortalSettings(portal.id, {
                                    uiSettings: { ...portal.uiSettings, compactMode: e.target.checked }
                                  })}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Compact Mode</span>
                              </label>
                              
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={portal.uiSettings.showAdvancedFilters}
                                  onChange={(e) => handleUpdatePortalSettings(portal.id, {
                                    uiSettings: { ...portal.uiSettings, showAdvancedFilters: e.target.checked }
                                  })}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Advanced Filters</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h3>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                          <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Push Notifications</h4>
                          <p className="text-sm text-gray-600">Receive browser push notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          onClick={handleSave}
                          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Tab */}
              {activeTab === 'system' && user?.role === 'admin' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">System Settings</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Database Status</h4>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">Connected</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">System Health</h4>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">99.9% Uptime</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Storage Used</h4>
                        <div className="text-sm text-gray-600">2.4 TB / 10 TB</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Active Users</h4>
                        <div className="text-sm text-gray-600">2,847 online</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};