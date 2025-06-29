import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Database, Phone, ArrowLeft, Shield, Users, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onBackToWelcome: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onBackToWelcome }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<'admin' | 'manager' | 'executive'>('manager');

  // Check for pre-selected portal from URL or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const portalParam = urlParams.get('portal') as 'admin' | 'manager' | 'executive';
    const storedPortal = localStorage.getItem('selectedPortal') as 'admin' | 'manager' | 'executive';
    
    if (portalParam) {
      setSelectedPortal(portalParam);
      // Set demo credentials based on portal
      const credentials = getPortalCredentials(portalParam);
      setFormData(credentials);
    } else if (storedPortal) {
      setSelectedPortal(storedPortal);
      // Set demo credentials based on portal
      const credentials = getPortalCredentials(storedPortal);
      setFormData(credentials);
      // Clear stored portal
      localStorage.removeItem('selectedPortal');
    }
  }, []);

  const getPortalCredentials = (portal: string) => {
    switch (portal) {
      case 'admin':
        return { email: 'rakshigowda628@gmail.com', password: 'Rakshi@01' };
      case 'manager':
        return { email: 'manager@educrm.com', password: 'manager123' };
      case 'executive':
        return { email: 'executive@educrm.com', password: 'exec123' };
      default:
        return { email: '', password: '' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password, selectedPortal);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handlePortalChange = (portal: 'admin' | 'manager' | 'executive') => {
    setSelectedPortal(portal);
    const credentials = getPortalCredentials(portal);
    setFormData(credentials);
  };

  const getPortalInfo = () => {
    switch (selectedPortal) {
      case 'admin':
        return {
          title: 'Backend Portal',
          subtitle: 'Data Management & System Control',
          description: 'Complete system control, data uploads, user management, and CRM operations',
          color: 'from-red-500 to-red-600',
          lightColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-600',
          icon: Database,
          features: ['Upload Student Data', 'Create Manager Accounts', 'Bulk Communications', 'System Administration']
        };
      case 'manager':
        return {
          title: 'Manager Portal', 
          subtitle: 'Institution Management',
          description: 'Oversee student data, manage executives, and track performance',
          color: 'from-blue-500 to-blue-600',
          lightColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-600',
          icon: GraduationCap,
          features: ['Dashboard Analytics', 'Executive Management', 'Data Requests', 'Performance Reports']
        };
      case 'executive':
        return {
          title: 'Executive Portal',
          subtitle: 'Call Center Operations',
          description: 'Handle student calls, manage follow-ups, and track conversions',
          color: 'from-green-500 to-green-600',
          lightColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-600',
          icon: Phone,
          features: ['Call Management', 'Follow-up Scheduling', 'Student Profiles', 'Task Queue']
        };
    }
  };

  const portalInfo = getPortalInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={onBackToWelcome}
            className="flex items-center text-blue-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold">EduCRM Pro</div>
              <div className="text-blue-200 text-sm">Advanced Education CRM</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {/* Portal Selection */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Welcome Back
            </h2>
            <p className="text-blue-200 text-center mb-8">
              Select your portal and sign in to continue
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { key: 'admin', label: 'Backend', icon: Database, color: 'red' },
                { key: 'manager', label: 'Manager', icon: GraduationCap, color: 'blue' },
                { key: 'executive', label: 'Executive', icon: Phone, color: 'green' }
              ].map((portal) => (
                <button
                  key={portal.key}
                  onClick={() => handlePortalChange(portal.key as any)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedPortal === portal.key
                      ? `border-${portal.color}-500 bg-${portal.color}-500/20`
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  }`}
                >
                  <portal.icon className={`w-6 h-6 mx-auto mb-2 ${
                    selectedPortal === portal.key 
                      ? `text-${portal.color}-400` 
                      : 'text-slate-400'
                  }`} />
                  <div className={`text-sm font-medium ${
                    selectedPortal === portal.key 
                      ? `text-${portal.color}-300` 
                      : 'text-slate-300'
                  }`}>
                    {portal.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Portal Info Card */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 mb-8">
              <div className="flex items-center mb-4">
                <div className={`bg-gradient-to-r ${portalInfo.color} p-3 rounded-xl mr-4`}>
                  <portalInfo.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{portalInfo.title}</h3>
                  <p className="text-slate-300 text-sm">{portalInfo.subtitle}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4">{portalInfo.description}</p>
              <div className="grid grid-cols-2 gap-2">
                {portalInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-xs text-slate-400">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${portalInfo.color} mr-2`}></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10 w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r ${portalInfo.color} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Sign in to {portalInfo.title}
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
              <p className="text-xs text-slate-400 mb-3 text-center font-medium">
                Demo Credentials for Testing:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-slate-600/30 rounded-lg">
                  <span className="text-red-300 font-medium">Backend:</span>
                  <span className="text-slate-300">rakshigowda628@gmail.com / Rakshi@01</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-600/30 rounded-lg">
                  <span className="text-blue-300 font-medium">Manager:</span>
                  <span className="text-slate-300">manager@educrm.com / manager123</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-600/30 rounded-lg">
                  <span className="text-green-300 font-medium">Executive:</span>
                  <span className="text-slate-300">executive@educrm.com / exec123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};