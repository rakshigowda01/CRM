import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Settings, 
  Users, 
  Database, 
  Upload,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Phone,
  FileText,
  UserPlus,
  BarChart3,
  Bell,
  MessageSquare,
  Calendar,
  Eye,
  Filter,
  Download,
  Activity,
  Shield,
  Zap,
  TrendingUp,
  Inbox
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', icon: BarChart3, href: '/dashboard', color: 'text-blue-500' },
      { name: 'Students', icon: Users, href: '/students', color: 'text-green-500' },
    ];

    if (user?.role === 'admin') {
      baseItems.push(
        { name: 'Data Upload', icon: Upload, href: '/upload', color: 'text-purple-500' },
        { name: 'Manager Management', icon: UserPlus, href: '/users', color: 'text-yellow-500' },
        { name: 'Data Requests', icon: Inbox, href: '/data-requests', color: 'text-orange-500' },
        { name: 'Bulk Operations', icon: MessageSquare, href: '/bulk-operations', color: 'text-red-500' },
        { name: 'System Settings', icon: Settings, href: '/settings', color: 'text-gray-500' },
        { name: 'Reports', icon: FileText, href: '/reports', color: 'text-indigo-500' }
      );
    } else if (user?.role === 'manager') {
      baseItems.push(
        { name: 'Data Upload', icon: Upload, href: '/upload', color: 'text-purple-500' },
        { name: 'Executive Management', icon: UserPlus, href: '/users', color: 'text-yellow-500' },
        { name: 'Data Requests', icon: Inbox, href: '/data-requests', color: 'text-orange-500' },
        { name: 'Bulk Operations', icon: MessageSquare, href: '/bulk-operations', color: 'text-red-500' },
        { name: 'Reports', icon: FileText, href: '/reports', color: 'text-indigo-500' },
        { name: 'Settings', icon: Settings, href: '/settings', color: 'text-gray-500' }
      );
    } else if (user?.role === 'executive') {
      baseItems.push(
        { name: 'Call Center', icon: Phone, href: '/call-center', color: 'text-green-500' },
        { name: 'Follow-ups', icon: Calendar, href: '/follow-ups', color: 'text-yellow-500' },
        { name: 'My Reports', icon: BarChart3, href: '/reports', color: 'text-indigo-500' }
      );
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const getRoleConfig = () => {
    switch (user?.role) {
      case 'admin':
        return {
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-600',
          lightBg: 'bg-red-50',
          textColor: 'text-red-600',
          icon: Database,
          title: 'Backend Portal',
          subtitle: 'Data Management & System Control'
        };
      case 'manager':
        return {
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-600',
          lightBg: 'bg-blue-50',
          textColor: 'text-blue-600',
          icon: GraduationCap,
          title: 'Manager Portal',
          subtitle: 'Institution Management'
        };
      case 'executive':
        return {
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-600',
          lightBg: 'bg-green-50',
          textColor: 'text-green-600',
          icon: Phone,
          title: 'Executive Portal',
          subtitle: 'Call Center Operations'
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-600',
          lightBg: 'bg-gray-50',
          textColor: 'text-gray-600',
          icon: Users,
          title: 'Portal',
          subtitle: 'User Dashboard'
        };
    }
  };

  const roleConfig = getRoleConfig();
  const RoleIcon = roleConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className={`bg-gradient-to-r ${roleConfig.color} p-3 rounded-xl mr-3 shadow-lg`}>
                <RoleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">EduCRM Pro</h2>
                <p className="text-xs text-gray-500">{roleConfig.subtitle}</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
              >
                <item.icon className={`w-5 h-5 mr-3 ${item.color} group-hover:scale-110 transition-transform`} />
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200 lg:shadow-sm">
        <div className="flex items-center px-6 py-6 border-b border-gray-200">
          <div className={`bg-gradient-to-r ${roleConfig.color} p-3 rounded-xl mr-4 shadow-lg`}>
            <RoleIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">EduCRM Pro</h2>
            <p className="text-sm text-gray-500">{roleConfig.subtitle}</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
            >
              <item.icon className={`w-5 h-5 mr-3 ${item.color} group-hover:scale-110 transition-transform`} />
              <span className="font-medium group-hover:text-gray-900">{item.name}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-xl">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm overflow-hidden ${!user?.institutionLogo ? roleConfig.bgColor : ''}`}>
              {user?.institutionLogo ? (
                <img 
                  src={user.institutionLogo} 
                  alt={user.institutionName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">{user?.name.charAt(0)}</span>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role === 'admin' ? 'Backend User' : user?.role}</p>
              <p className="text-xs text-gray-400 truncate">{user?.institutionName}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-2 lg:ml-0">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig.lightBg} ${roleConfig.textColor}`}>
                    <Activity className="w-3 h-3 mr-1" />
                    {roleConfig.title}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center px-3 py-1.5 bg-gray-100 rounded-lg">
                  <Shield className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700 truncate max-w-32">
                    {user?.institutionName}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Online
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};