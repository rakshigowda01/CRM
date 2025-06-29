import React from 'react';
import { Layout } from '../components/common/Layout';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Mail,
  MessageSquare,
  Upload,
  FileText,
  Activity,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  UserCheck,
  BarChart3,
  Target,
  Zap,
  Award,
  Filter,
  Download,
  Eye,
  ArrowUp,
  ArrowDown,
  UserPlus,
  Database,
  Inbox
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle Quick Action button clicks
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'upload':
        navigate('/upload');
        break;
      case 'add-manager':
        navigate('/users');
        break;
      case 'add-executive':
        navigate('/users');
        break;
      case 'data-requests':
        navigate('/data-requests');
        break;
      case 'bulk-ops':
        navigate('/bulk-operations');
        break;
      case 'reports':
        navigate('/reports');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'call-center':
        navigate('/call-center');
        break;
      case 'follow-ups':
        // For now, navigate to call center - can be changed to dedicated follow-ups page
        navigate('/call-center');
        break;
      case 'my-students':
        navigate('/students');
        break;
      case 'my-reports':
        navigate('/reports');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const getStatsForRole = () => {
    if (user?.role === 'admin') {
      return [
        {
          name: 'Total Students',
          value: '1,547,892',
          change: '+12.5%',
          changeType: 'positive',
          icon: Users,
          color: 'bg-blue-500',
          description: 'Across all institutions'
        },
        {
          name: 'Active Managers',
          value: '2,847',
          change: '+8.2%',
          changeType: 'positive',
          icon: GraduationCap,
          color: 'bg-green-500',
          description: 'Institution managers'
        },
        {
          name: 'Data Requests',
          value: '156',
          change: '+23%',
          changeType: 'positive',
          icon: FileText,
          color: 'bg-purple-500',
          description: 'Pending approvals'
        },
        {
          name: 'System Health',
          value: '99.9%',
          change: '+0.1%',
          changeType: 'positive',
          icon: Activity,
          color: 'bg-yellow-500',
          description: 'Uptime this month'
        }
      ];
    } else if (user?.role === 'manager') {
      return [
        {
          name: 'My Students',
          value: '45,234',
          change: '+15.3%',
          changeType: 'positive',
          icon: Users,
          color: 'bg-blue-500',
          description: 'Under management'
        },
        {
          name: 'Active Executives',
          value: '28',
          change: '+3',
          changeType: 'positive',
          icon: UserCheck,
          color: 'bg-green-500',
          description: 'Telecaller team'
        },
        {
          name: 'This Month Admissions',
          value: '1,247',
          change: '+18.7%',
          changeType: 'positive',
          icon: GraduationCap,
          color: 'bg-purple-500',
          description: 'Successful enrollments'
        },
        {
          name: 'Conversion Rate',
          value: '23.4%',
          change: '+2.8%',
          changeType: 'positive',
          icon: TrendingUp,
          color: 'bg-yellow-500',
          description: 'Lead to admission'
        }
      ];
    } else {
      return [
        {
          name: 'Assigned Students',
          value: '1,456',
          change: '+45',
          changeType: 'positive',
          icon: Users,
          color: 'bg-blue-500',
          description: 'In my queue'
        },
        {
          name: 'Calls Today',
          value: '89',
          change: '+12',
          changeType: 'positive',
          icon: Phone,
          color: 'bg-green-500',
          description: 'Completed calls'
        },
        {
          name: 'Follow-ups Due',
          value: '23',
          change: '-5',
          changeType: 'negative',
          icon: Calendar,
          color: 'bg-purple-500',
          description: 'Pending today'
        },
        {
          name: 'Conversions',
          value: '12',
          change: '+4',
          changeType: 'positive',
          icon: CheckCircle,
          color: 'bg-yellow-500',
          description: 'This week'
        }
      ];
    }
  };

  const getChartData = () => {
    if (user?.role === 'admin') {
      return {
        admissionTrends: [
          { month: 'Jan', admissions: 12400, leads: 45600 },
          { month: 'Feb', admissions: 15600, leads: 52300 },
          { month: 'Mar', admissions: 18900, leads: 48900 },
          { month: 'Apr', admissions: 22100, leads: 61200 },
          { month: 'May', admissions: 25800, leads: 67800 },
          { month: 'Jun', admissions: 28400, leads: 72100 }
        ],
        stateDistribution: [
          { name: 'Maharashtra', value: 28, color: '#3B82F6' },
          { name: 'Karnataka', value: 22, color: '#10B981' },
          { name: 'Tamil Nadu', value: 18, color: '#F59E0B' },
          { name: 'Gujarat', value: 15, color: '#EF4444' },
          { name: 'Others', value: 17, color: '#8B5CF6' }
        ]
      };
    } else if (user?.role === 'manager') {
      return {
        admissionTrends: [
          { month: 'Jan', admissions: 124, leads: 456 },
          { month: 'Feb', admissions: 156, leads: 523 },
          { month: 'Mar', admissions: 189, leads: 489 },
          { month: 'Apr', admissions: 221, leads: 612 },
          { month: 'May', admissions: 258, leads: 678 },
          { month: 'Jun', admissions: 284, leads: 721 }
        ],
        executivePerformance: [
          { name: 'Rahul S.', calls: 145, conversions: 23 },
          { name: 'Priya M.', calls: 132, conversions: 19 },
          { name: 'Amit K.', calls: 128, conversions: 18 },
          { name: 'Sneha P.', calls: 119, conversions: 16 },
          { name: 'Vikash G.', calls: 115, conversions: 15 }
        ]
      };
    } else {
      return {
        dailyActivity: [
          { day: 'Mon', calls: 45, followups: 12, conversions: 3 },
          { day: 'Tue', calls: 52, followups: 15, conversions: 4 },
          { day: 'Wed', calls: 48, followups: 11, conversions: 2 },
          { day: 'Thu', calls: 61, followups: 18, conversions: 5 },
          { day: 'Fri', calls: 58, followups: 16, conversions: 4 },
          { day: 'Sat', calls: 42, followups: 9, conversions: 2 },
          { day: 'Sun', calls: 35, followups: 7, conversions: 1 }
        ],
        callOutcomes: [
          { name: 'Contacted', value: 45, color: '#10B981' },
          { name: 'No Answer', value: 30, color: '#F59E0B' },
          { name: 'Busy', value: 15, color: '#EF4444' },
          { name: 'Invalid', value: 10, color: '#6B7280' }
        ]
      };
    }
  };

  const getRecentActivities = () => {
    if (user?.role === 'admin') {
      return [
        { id: 1, action: 'New manager account created for XYZ Institute', time: '5 minutes ago', type: 'admin', priority: 'high' },
        { id: 2, action: 'Data request approved for ABC College (5,000 records)', time: '15 minutes ago', type: 'approval', priority: 'medium' },
        { id: 3, action: 'Bulk upload completed - 25,000 student records', time: '1 hour ago', type: 'upload', priority: 'high' },
        { id: 4, action: 'System backup completed successfully', time: '2 hours ago', type: 'system', priority: 'low' },
        { id: 5, action: 'New data sharing request from DEF Academy', time: '3 hours ago', type: 'request', priority: 'medium' }
      ];
    } else if (user?.role === 'manager') {
      return [
        { id: 1, action: 'New executive account created - Rajesh Kumar', time: '10 minutes ago', type: 'user', priority: 'medium' },
        { id: 2, action: 'Data request submitted to admin (Engineering students)', time: '30 minutes ago', type: 'request', priority: 'high' },
        { id: 3, action: 'Bulk WhatsApp sent to 1,500 students', time: '1 hour ago', type: 'message', priority: 'medium' },
        { id: 4, action: 'Weekly performance report generated', time: '2 hours ago', type: 'report', priority: 'low' },
        { id: 5, action: '45 new admissions confirmed today', time: '4 hours ago', type: 'admission', priority: 'high' }
      ];
    } else {
      return [
        { id: 1, action: 'Called Rahul Sharma - Interested in B.Tech CSE', time: '5 minutes ago', type: 'call', priority: 'high' },
        { id: 2, action: 'Follow-up scheduled for Priya Patel (Tomorrow 10 AM)', time: '20 minutes ago', type: 'followup', priority: 'medium' },
        { id: 3, action: 'Email sent to Amit Kumar with course details', time: '45 minutes ago', type: 'email', priority: 'low' },
        { id: 4, action: 'Admission confirmed for Sneha Singh - MBA', time: '1 hour ago', type: 'admission', priority: 'high' },
        { id: 5, action: 'Updated notes for Vikash Gupta', time: '2 hours ago', type: 'update', priority: 'low' }
      ];
    }
  };

  const stats = getStatsForRole();
  const chartData = getChartData();
  const recentActivities = getRecentActivities();

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'admin': return 'System Administration Dashboard';
      case 'manager': return 'Institution Management Dashboard';
      case 'executive': return 'Call Center Operations Dashboard';
      default: return 'Dashboard';
    }
  };

  const getRoleDescription = () => {
    switch (user?.role) {
      case 'admin': return 'Monitor system performance, manage users, and oversee all operations';
      case 'manager': return 'Track your institution\'s performance, manage executives, and analyze data';
      case 'executive': return 'Manage your daily tasks, track calls, and monitor your performance';
      default: return 'Welcome to your dashboard';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className={`rounded-2xl p-8 text-white relative overflow-hidden ${
          user?.role === 'admin' ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800' :
          user?.role === 'manager' ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800' :
          'bg-gradient-to-r from-green-600 via-green-700 to-green-800'
        }`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name}!
                </h2>
                <p className="text-white/90 text-lg mb-2">
                  {getRoleDescription()}
                </p>
                <div className="flex items-center text-sm text-white/80">
                  <Activity className="w-4 h-4 mr-2" />
                  Last login: Today at 9:30 AM
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">
                      {user?.role === 'admin' ? '99.9%' : user?.role === 'manager' ? '23.4%' : '89'}
                    </div>
                    <div className="text-sm text-white/80">
                      {user?.role === 'admin' ? 'System Uptime' : user?.role === 'manager' ? 'Conversion Rate' : 'Calls Today'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {user?.role === 'admin' ? 'Admission Trends' : 
                     user?.role === 'manager' ? 'Monthly Performance' : 'Weekly Activity'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {user?.role === 'admin' ? 'System-wide admission statistics' : 
                     user?.role === 'manager' ? 'Your institution performance' : 'Your daily performance metrics'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Filter className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {user?.role === 'executive' ? (
                    <BarChart data={chartData.dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Bar dataKey="calls" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="conversions" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <AreaChart data={chartData.admissionTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Area type="monotone" dataKey="admissions" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="leads" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Secondary Chart */}
            {user?.role === 'manager' && chartData.executivePerformance && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Executive Performance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.executivePerformance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#6b7280" />
                      <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Bar dataKey="calls" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="conversions" fill="#10B981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {user?.role === 'admin' && (
                  <>
                    <button 
                      onClick={() => handleQuickAction('upload')}
                      className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                    >
                      <Upload className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-blue-900">Upload Data</span>
                    </button>
                    <button 
                      onClick={() => handleQuickAction('add-manager')}
                      className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                    >
                      <UserCheck className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-green-900">Add Manager</span>
                    </button>
                    <button 
                      onClick={() => handleQuickAction('data-requests')}
                      className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                    >
                      <Inbox className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-purple-900">Data Requests</span>
                    </button>
                    <button 
                      onClick={() => handleQuickAction('bulk-ops')}
                      className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group"
                    >
                      <MessageSquare className="w-6 h-6 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-yellow-900">Bulk Ops</span>
                    </button>
                  </>
                )}
                
                {user?.role === 'manager' && (
                  <>
                    <button 
                      onClick={() => handleQuickAction('upload')}
                      className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                    >
                      <Upload className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-blue-900">Upload Data</span>
                    </button>
                    <button 
                      onClick={() => handleQuickAction('add-executive')}
                      className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                    >
                      <UserCheck className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-green-900">Add Executive</span>
                    </button>
                    <button 
                      onClick={() => handleQuickAction('bulk-ops')}
                      className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                    >
                      <MessageSquare className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-purple-900">Bulk Message</span>
                    </button>
                    <button 
                      onClick={() => handleQuickAction('reports')}
                      className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group"
                    >
                      <BarChart3 className="w-6 h-6 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-yellow-900">Reports</span>
                    </button>
                  </>
                )}
                
                {user?.role === 'executive' && (
                  <>
                    <button 
                      onClick={() => handleQuickAction('call-center')}
                      className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                    >
                      <Phone className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-blue-900">Start Calling</span>
                    </button>
                    <button 
                      onClick={() => handleQuickAction('follow-ups')}
                      className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                    >
                      <Calendar className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-green-900">Follow-ups</span>
                    </button>
                    <button 
                      onClick={() => handleQuickAction('my-students')}
                      className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                    >
                      <Users className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-purple-900">My Students</span>
                    </button>
                    <button 
                      onClick={() => handleQuickAction('my-reports')}
                      className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group"
                    >
                      <BarChart3 className="w-6 h-6 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-yellow-900">My Reports</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Pie Chart */}
            {(user?.role === 'admin' && chartData.stateDistribution) || (user?.role === 'executive' && chartData.callOutcomes) ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {user?.role === 'admin' ? 'State Distribution' : 'Call Outcomes'}
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={user?.role === 'admin' ? chartData.stateDistribution : chartData.callOutcomes}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(user?.role === 'admin' ? chartData.stateDistribution : chartData.callOutcomes)?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {(user?.role === 'admin' ? chartData.stateDistribution : chartData.callOutcomes)?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'call' ? 'bg-green-100' :
                      activity.type === 'email' ? 'bg-blue-100' :
                      activity.type === 'upload' ? 'bg-yellow-100' :
                      activity.type === 'message' ? 'bg-purple-100' :
                      activity.type === 'admission' ? 'bg-green-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'call' && <Phone className="w-4 h-4 text-green-600" />}
                      {activity.type === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'upload' && <Upload className="w-4 h-4 text-yellow-600" />}
                      {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-purple-600" />}
                      {activity.type === 'admission' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {activity.type === 'followup' && <Calendar className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'update' && <FileText className="w-4 h-4 text-gray-600" />}
                      {activity.type === 'admin' && <UserCheck className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'approval' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {activity.type === 'request' && <FileText className="w-4 h-4 text-purple-600" />}
                      {activity.type === 'system' && <Activity className="w-4 h-4 text-gray-600" />}
                      {activity.type === 'user' && <Users className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'report' && <BarChart3 className="w-4 h-4 text-yellow-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">{activity.action}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics for Executive */}
        {user?.role === 'executive' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Today's Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-1">89</p>
                <p className="text-sm text-blue-700 font-medium">Calls Made</p>
                <p className="text-xs text-blue-600 mt-1">+12 from yesterday</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-green-600 mb-1">45</p>
                <p className="text-sm text-green-700 font-medium">Connected</p>
                <p className="text-xs text-green-600 mt-1">50.6% success rate</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-yellow-600 mb-1">23</p>
                <p className="text-sm text-yellow-700 font-medium">Follow-ups Due</p>
                <p className="text-xs text-yellow-600 mt-1">5 overdue</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-purple-600 mb-1">12</p>
                <p className="text-sm text-purple-700 font-medium">Conversions</p>
                <p className="text-xs text-purple-600 mt-1">This week</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};