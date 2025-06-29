import React, { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  Filter,
  Search,
  Eye,
  Check,
  X,
  AlertCircle,
  Users,
  MapPin,
  GraduationCap,
  BookOpen,
  Plus,
  Send,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { INDIAN_STATES, DISTRICTS_BY_STATE, EXAMS, CLASSES } from '../constants/data';
import toast from 'react-hot-toast';

interface DataRequest {
  id: string;
  requestedBy: string;
  requestedByName: string;
  requestedByRole: 'manager' | 'executive';
  institutionName: string;
  requestType: 'data_access' | 'bulk_communication' | 'student_export';
  title: string;
  description: string;
  filters: {
    states?: string[];
    districts?: string[];
    cities?: string[];
    classes?: string[];
    streams?: string[];
    years?: number[];
    exams?: string[];
    admissionStatus?: string[];
    estimatedCount?: number;
  };
  justification: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  requestedData?: {
    totalStudents: number;
    expectedUsage: string;
    dataRetention: string;
  };
}

interface NewRequestForm {
  title: string;
  description: string;
  requestType: 'data_access' | 'bulk_communication' | 'student_export';
  justification: string;
  urgency: 'low' | 'medium' | 'high';
  filters: {
    states: string[];
    districts: string[];
    classes: string[];
    years: number[];
    exams: string[];
    admissionStatus: string[];
  };
  expectedUsage: string;
  dataRetention: string;
}

export const DataRequests: React.FC = () => {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  // New request form state
  const [newRequestForm, setNewRequestForm] = useState<NewRequestForm>({
    title: '',
    description: '',
    requestType: 'data_access',
    justification: '',
    urgency: 'medium',
    filters: {
      states: [],
      districts: [],
      classes: [],
      years: [],
      exams: [],
      admissionStatus: []
    },
    expectedUsage: '',
    dataRetention: '3 months'
  });

  // Mock data requests - in real app this would come from database
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([
    {
      id: '1',
      requestedBy: 'manager-1',
      requestedByName: 'Rajesh Kumar',
      requestedByRole: 'manager',
      institutionName: 'ABC Educational Institute',
      requestType: 'data_access',
      title: 'Engineering Students Data Access',
      description: 'Request access to engineering students data for admission campaign',
      filters: {
        states: ['Karnataka', 'Tamil Nadu'],
        classes: ['B.Tech', 'B.E'],
        years: [2024, 2025],
        estimatedCount: 15000
      },
      justification: 'We are launching a new engineering admission campaign and need access to potential students in Karnataka and Tamil Nadu who are interested in B.Tech/B.E programs.',
      urgency: 'high',
      status: 'pending',
      createdAt: '2024-01-20T10:30:00Z',
      requestedData: {
        totalStudents: 15000,
        expectedUsage: 'Admission campaign and follow-up calls',
        dataRetention: '6 months'
      }
    },
    {
      id: '2',
      requestedBy: 'manager-2',
      requestedByName: 'Priya Sharma',
      requestedByRole: 'manager',
      institutionName: 'XYZ Coaching Center',
      requestType: 'bulk_communication',
      title: 'NEET Aspirants Bulk Communication',
      description: 'Request permission for bulk WhatsApp campaign to NEET aspirants',
      filters: {
        states: ['Maharashtra', 'Gujarat'],
        exams: ['NEET'],
        classes: ['12th'],
        estimatedCount: 8500
      },
      justification: 'We want to inform NEET aspirants about our new crash course program starting next month.',
      urgency: 'medium',
      status: 'approved',
      approvedBy: 'admin-1',
      approvedAt: '2024-01-19T14:30:00Z',
      createdAt: '2024-01-18T09:15:00Z',
      requestedData: {
        totalStudents: 8500,
        expectedUsage: 'One-time promotional campaign',
        dataRetention: '3 months'
      }
    },
    {
      id: '3',
      requestedBy: 'manager-3',
      requestedByName: 'Amit Patel',
      requestedByRole: 'manager',
      institutionName: 'DEF Academy',
      requestType: 'student_export',
      title: 'MBA Students Data Export',
      description: 'Request to export MBA students data for analysis',
      filters: {
        states: ['Delhi', 'Punjab'],
        classes: ['MBA'],
        years: [2023, 2024],
        estimatedCount: 3200
      },
      justification: 'Need to analyze MBA admission trends and create targeted marketing strategies.',
      urgency: 'low',
      status: 'rejected',
      rejectionReason: 'Insufficient justification for data export. Please provide more specific use case.',
      createdAt: '2024-01-17T16:45:00Z',
      requestedData: {
        totalStudents: 3200,
        expectedUsage: 'Market analysis and strategy planning',
        dataRetention: '12 months'
      }
    }
  ]);

  const filteredRequests = dataRequests.filter(request => {
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.institutionName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by user role
    if (user?.role === 'manager') {
      return matchesStatus && matchesSearch && request.requestedBy === user.id;
    }
    
    return matchesStatus && matchesSearch;
  });

  const handleSubmitRequest = async () => {
    if (!newRequestForm.title.trim() || !newRequestForm.description.trim() || !newRequestForm.justification.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (newRequestForm.filters.states.length === 0 && newRequestForm.filters.classes.length === 0) {
      toast.error('Please select at least one state or class filter');
      return;
    }

    setLoading(true);

    try {
      // Estimate student count based on filters
      const estimatedCount = Math.floor(Math.random() * 10000) + 1000;

      const newRequest: DataRequest = {
        id: Date.now().toString(),
        requestedBy: user?.id || 'manager-demo',
        requestedByName: user?.name || 'Demo Manager',
        requestedByRole: 'manager',
        institutionName: user?.institutionName || 'Demo Institution',
        requestType: newRequestForm.requestType,
        title: newRequestForm.title,
        description: newRequestForm.description,
        filters: {
          ...newRequestForm.filters,
          estimatedCount
        },
        justification: newRequestForm.justification,
        urgency: newRequestForm.urgency,
        status: 'pending',
        createdAt: new Date().toISOString(),
        requestedData: {
          totalStudents: estimatedCount,
          expectedUsage: newRequestForm.expectedUsage,
          dataRetention: newRequestForm.dataRetention
        }
      };

      setDataRequests(prev => [newRequest, ...prev]);
      setShowNewRequestModal(false);
      
      // Reset form
      setNewRequestForm({
        title: '',
        description: '',
        requestType: 'data_access',
        justification: '',
        urgency: 'medium',
        filters: {
          states: [],
          districts: [],
          classes: [],
          years: [],
          exams: [],
          admissionStatus: []
        },
        expectedUsage: '',
        dataRetention: '3 months'
      });

      toast.success('Data request submitted successfully! Backend team will review your request.');
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (requestId: string) => {
    setDataRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'approved', 
            approvedBy: user?.id || 'admin',
            approvedAt: new Date().toISOString()
          }
        : req
    ));
    toast.success('Data request approved! Student data is now accessible to the manager.');
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    if (selectedRequest) {
      setDataRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              status: 'rejected',
              rejectionReason: rejectionReason
            }
          : req
      ));
      toast.success('Data request rejected');
      setSelectedRequest(null);
      setShowRejectModal(false);
      setRejectionReason('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'data_access': return <Users className="w-5 h-5" />;
      case 'bulk_communication': return <FileText className="w-5 h-5" />;
      case 'student_export': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'data_access': return 'Data Access';
      case 'bulk_communication': return 'Bulk Communication';
      case 'student_export': return 'Data Export';
      default: return type;
    }
  };

  const getPageTitle = () => {
    return user?.role === 'admin' ? 'Data Requests Management' : 'My Data Requests';
  };

  const getPageDescription = () => {
    return user?.role === 'admin' 
      ? 'Review and manage data access requests from institution managers'
      : 'Request access to student data for your institution\'s needs';
  };

  return (
    <Layout title="Data Requests">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{getPageTitle()}</h2>
              <p className="text-gray-600">
                {getPageDescription()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {user?.role === 'manager' && (
                <button
                  onClick={() => setShowNewRequestModal(true)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Request
                </button>
              )}
              {user?.role === 'admin' && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{filteredRequests.filter(r => r.status === 'pending').length} pending</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{filteredRequests.length}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {filteredRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {filteredRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {filteredRequests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
              <div className="bg-red-500 p-3 rounded-xl">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Requests</h3>
                <p className="text-gray-600 mb-6">
                  {user?.role === 'manager' 
                    ? 'You haven\'t submitted any data requests yet.'
                    : 'No data requests found matching your criteria.'
                  }
                </p>
                {user?.role === 'manager' && (
                  <button
                    onClick={() => setShowNewRequestModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Submit Your First Request
                  </button>
                )}
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {getRequestTypeIcon(request.requestType)}
                          <span className="font-medium text-gray-900">
                            {getRequestTypeLabel(request.requestType)}
                          </span>
                        </div>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency.toUpperCase()}
                        </span>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.title}</h3>
                      <p className="text-gray-600 mb-3">{request.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          <span>{request.requestedByName} • {request.institutionName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>~{request.filters.estimatedCount?.toLocaleString()} students</span>
                        </div>
                        {request.filters.states && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{request.filters.states.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {request.status === 'approved' && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-800">Request Approved!</p>
                              <p className="text-sm text-green-700">
                                Student data is now accessible in your Students page with the requested filters.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {request.status === 'rejected' && request.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                              <p className="text-sm text-red-700">{request.rejectionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      {user?.role === 'admin' && request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRejectModal(true);
                            }}
                            className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* New Request Modal */}
        {showNewRequestModal && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Submit Data Request</h3>
                  <button
                    onClick={() => setShowNewRequestModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Title *
                    </label>
                    <input
                      type="text"
                      value={newRequestForm.title}
                      onChange={(e) => setNewRequestForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Engineering Students Data Access"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Type *
                    </label>
                    <select
                      value={newRequestForm.requestType}
                      onChange={(e) => setNewRequestForm(prev => ({ ...prev, requestType: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="data_access">Data Access</option>
                      <option value="bulk_communication">Bulk Communication</option>
                      <option value="student_export">Data Export</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newRequestForm.description}
                    onChange={(e) => setNewRequestForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what you need and how you plan to use the data..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <select
                      value={newRequestForm.urgency}
                      onChange={(e) => setNewRequestForm(prev => ({ ...prev, urgency: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Retention Period
                    </label>
                    <select
                      value={newRequestForm.dataRetention}
                      onChange={(e) => setNewRequestForm(prev => ({ ...prev, dataRetention: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1 month">1 Month</option>
                      <option value="3 months">3 Months</option>
                      <option value="6 months">6 Months</option>
                      <option value="12 months">12 Months</option>
                    </select>
                  </div>
                </div>

                {/* Data Filters */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Filters</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        States
                      </label>
                      <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                        {INDIAN_STATES.slice(0, 10).map(state => (
                          <label key={state} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newRequestForm.filters.states.includes(state)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRequestForm(prev => ({
                                    ...prev,
                                    filters: {
                                      ...prev.filters,
                                      states: [...prev.filters.states, state]
                                    }
                                  }));
                                } else {
                                  setNewRequestForm(prev => ({
                                    ...prev,
                                    filters: {
                                      ...prev.filters,
                                      states: prev.filters.states.filter(s => s !== state)
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
                        Classes
                      </label>
                      <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                        {CLASSES.slice(0, 15).map(className => (
                          <label key={className} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newRequestForm.filters.classes.includes(className)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRequestForm(prev => ({
                                    ...prev,
                                    filters: {
                                      ...prev.filters,
                                      classes: [...prev.filters.classes, className]
                                    }
                                  }));
                                } else {
                                  setNewRequestForm(prev => ({
                                    ...prev,
                                    filters: {
                                      ...prev.filters,
                                      classes: prev.filters.classes.filter(c => c !== className)
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[2023, 2024, 2025, 2026].map(year => (
                          <label key={year} className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                            <input
                              type="checkbox"
                              checked={newRequestForm.filters.years.includes(year)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRequestForm(prev => ({
                                    ...prev,
                                    filters: {
                                      ...prev.filters,
                                      years: [...prev.filters.years, year]
                                    }
                                  }));
                                } else {
                                  setNewRequestForm(prev => ({
                                    ...prev,
                                    filters: {
                                      ...prev.filters,
                                      years: prev.filters.years.filter(y => y !== year)
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exams
                      </label>
                      <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                        {EXAMS.slice(0, 10).map(exam => (
                          <label key={exam} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newRequestForm.filters.exams.includes(exam)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRequestForm(prev => ({
                                    ...prev,
                                    filters: {
                                      ...prev.filters,
                                      exams: [...prev.filters.exams, exam]
                                    }
                                  }));
                                } else {
                                  setNewRequestForm(prev => ({
                                    ...prev,
                                    filters: {
                                      ...prev.filters,
                                      exams: prev.filters.exams.filter(e => e !== exam)
                                    }
                                  }));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{exam}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Usage *
                  </label>
                  <textarea
                    value={newRequestForm.expectedUsage}
                    onChange={(e) => setNewRequestForm(prev => ({ ...prev, expectedUsage: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="How will you use this data? (e.g., admission campaigns, follow-up calls, etc.)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justification *
                  </label>
                  <textarea
                    value={newRequestForm.justification}
                    onChange={(e) => setNewRequestForm(prev => ({ ...prev, justification: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Provide a detailed justification for why you need this data..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowNewRequestModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitRequest}
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Request Details</h3>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Request Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Title:</span>
                        <p className="font-medium">{selectedRequest.title}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Type:</span>
                        <p className="font-medium">{getRequestTypeLabel(selectedRequest.requestType)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRequest.status)}`}>
                          {selectedRequest.status.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Urgency:</span>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(selectedRequest.urgency)}`}>
                          {selectedRequest.urgency.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Requester Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p className="font-medium">{selectedRequest.requestedByName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Role:</span>
                        <p className="font-medium capitalize">{selectedRequest.requestedByRole}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Institution:</span>
                        <p className="font-medium">{selectedRequest.institutionName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Request Date:</span>
                        <p className="font-medium">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedRequest.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Justification</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedRequest.justification}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Data Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRequest.filters.states && (
                      <div>
                        <span className="text-sm text-gray-500">States:</span>
                        <p className="font-medium">{selectedRequest.filters.states.join(', ')}</p>
                      </div>
                    )}
                    {selectedRequest.filters.classes && (
                      <div>
                        <span className="text-sm text-gray-500">Classes:</span>
                        <p className="font-medium">{selectedRequest.filters.classes.join(', ')}</p>
                      </div>
                    )}
                    {selectedRequest.filters.years && (
                      <div>
                        <span className="text-sm text-gray-500">Years:</span>
                        <p className="font-medium">{selectedRequest.filters.years.join(', ')}</p>
                      </div>
                    )}
                    {selectedRequest.filters.exams && (
                      <div>
                        <span className="text-sm text-gray-500">Exams:</span>
                        <p className="font-medium">{selectedRequest.filters.exams.join(', ')}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-500">Estimated Count:</span>
                      <p className="font-medium">{selectedRequest.filters.estimatedCount?.toLocaleString()} students</p>
                    </div>
                  </div>
                </div>

                {selectedRequest.requestedData && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Data Usage Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Expected Usage:</span>
                        <p className="font-medium">{selectedRequest.requestedData.expectedUsage}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Data Retention:</span>
                        <p className="font-medium">{selectedRequest.requestedData.dataRetention}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Total Students:</span>
                        <p className="font-medium">{selectedRequest.requestedData.totalStudents.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === 'admin' && selectedRequest.status === 'pending' && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowRejectModal(true);
                      }}
                      className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Approve Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Request</h3>
                <p className="text-gray-600 mb-4">
                  Please provide a reason for rejecting this data request:
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter rejection reason..."
                />
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectionReason('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};