import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  Users, 
  TrendingUp, 
  Phone, 
  Mail,
  FileText,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const Reports: React.FC = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');

  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'admissions', label: 'Admissions', icon: Users },
    { id: 'calls', label: 'Call Analytics', icon: Phone },
    { id: 'performance', label: 'Performance', icon: TrendingUp }
  ];

  const overviewData = [
    { month: 'Jan', students: 1200, admissions: 240, calls: 3600 },
    { month: 'Feb', students: 1400, admissions: 280, calls: 4200 },
    { month: 'Mar', students: 1600, admissions: 320, calls: 4800 },
    { month: 'Apr', students: 1800, admissions: 360, calls: 5400 },
    { month: 'May', students: 2000, admissions: 400, calls: 6000 },
    { month: 'Jun', students: 2200, admissions: 440, calls: 6600 }
  ];

  const conversionData = [
    { name: 'Contacted', value: 45, color: '#3B82F6' },
    { name: 'Interested', value: 30, color: '#10B981' },
    { name: 'Enrolled', value: 15, color: '#F59E0B' },
    { name: 'Not Interested', value: 10, color: '#EF4444' }
  ];

  return (
    <Layout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
              <p className="text-gray-600">
                Comprehensive insights and performance metrics for your institution
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
                <option value="lastyear">Last Year</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Report Types Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h3>
              <nav className="space-y-2">
                {reportTypes.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      selectedReport === report.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <report.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{report.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Report Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600">+12.5%</span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">12,456</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-500 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600">+8.3%</span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Admissions</p>
                <p className="text-3xl font-bold text-gray-900">2,489</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-500 p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600">+15.7%</span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Calls</p>
                <p className="text-3xl font-bold text-gray-900">34,567</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-500 p-3 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600">+2.1%</span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">23.4%</p>
              </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Performance Overview</h3>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Filter className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overviewData}>
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
                    <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="admissions" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conversionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {conversionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {conversionData.map((item, index) => (
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

              {/* Recent Reports */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Reports</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Monthly Admission Report', date: '2024-01-20', type: 'PDF' },
                    { name: 'Call Center Performance', date: '2024-01-19', type: 'Excel' },
                    { name: 'Student Database Export', date: '2024-01-18', type: 'CSV' },
                    { name: 'Executive Performance', date: '2024-01-17', type: 'PDF' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{report.name}</p>
                          <p className="text-xs text-gray-500">{report.date} • {report.type}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};