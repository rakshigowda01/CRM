import React, { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { DataTable } from '../components/common/DataTable';
import { Student } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { StudentService } from '../services/studentService';
import { DataRequestService } from '../services/dataRequestService';
import toast from 'react-hot-toast';
import { RefreshCw, Database, Users, TrendingUp, Wifi, WifiOff, AlertCircle, FileText } from 'lucide-react';

const columns = [
  { key: 'studentname', label: 'Student Name', sortable: true, filterable: true },
  { key: 'gender', label: 'Gender', sortable: true, filterable: true },
  { key: 'contactnumber', label: 'Contact Number', sortable: true, filterable: true },
  { key: 'fathername', label: 'Father Name', sortable: true, filterable: true },
  { key: 'mothername', label: 'Mother Name', sortable: true, filterable: true },
  { key: 'parentsnumber', label: 'Parents Number', sortable: true, filterable: true },
  { key: 'studentmailid', label: 'Student Email', sortable: true, filterable: true },
  { key: 'address', label: 'Address', sortable: true, filterable: true },
  { key: 'pincode', label: 'Pincode', sortable: true, filterable: true },
  { key: 'state', label: 'State', sortable: true, filterable: true },
  { key: 'class', label: 'Class', sortable: true, filterable: true },
  { key: 'year', label: 'Year', sortable: true, filterable: true },
  { key: 'collegeschool', label: 'College/School', sortable: true, filterable: true },
  { key: 'entranceexam', label: 'Entrance Exam', sortable: true, filterable: true },
  { key: 'stream', label: 'Stream', sortable: true, filterable: true },
  { key: 'rank', label: 'Rank', sortable: true, filterable: true },
  { key: 'board', label: 'Board', sortable: true, filterable: true },
  { key: 'district', label: 'District', sortable: true, filterable: true },
  { key: 'city', label: 'City', sortable: true, filterable: true },
  { key: 'admissionstatus', label: 'Status', sortable: true, filterable: true },
];

export const Students: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const [approvedRequests, setApprovedRequests] = useState<any[]>([]);
  const [dataAccessInfo, setDataAccessInfo] = useState<string>('');

  useEffect(() => {
    loadStudents();
    testConnection();
    if (user?.role === 'manager') {
      loadApprovedRequests();
    }
  }, [user]);

  const testConnection = async () => {
    try {
      const connected = await StudentService.testConnection();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const loadApprovedRequests = async () => {
    if (user?.role === 'manager') {
      try {
        const requests = await DataRequestService.getApprovedRequestsForUser(user.id);
        setApprovedRequests(requests);
        
        if (requests.length > 0) {
          const totalStudents = requests.reduce((sum, req) => sum + (req.filters.estimatedCount || 0), 0);
          setDataAccessInfo(`You have access to ${totalStudents.toLocaleString()} students from ${requests.length} approved request(s)`);
        } else {
          setDataAccessInfo('No approved data requests. Submit a data request to access student data.');
        }
      } catch (error) {
        console.error('Error loading approved requests:', error);
      }
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      console.log('Loading students from Supabase database...');
      
      let data: Student[] = [];

      if (user?.role === 'executive') {
        // Load only assigned students for executives
        data = await StudentService.getStudentsWithFilters({
          assignedTo: user.id,
          limit: 500
        });
      } else if (user?.role === 'manager') {
        // For managers, load students based on approved data requests
        const approvedRequests = await DataRequestService.getApprovedRequestsForUser(user.id);
        
        if (approvedRequests.length > 0) {
          // Combine filters from all approved requests
          const combinedFilters = {
            states: [...new Set(approvedRequests.flatMap(req => req.filters.states || []))],
            classes: [...new Set(approvedRequests.flatMap(req => req.filters.classes || []))],
            years: [...new Set(approvedRequests.flatMap(req => req.filters.years || []))],
            districts: [...new Set(approvedRequests.flatMap(req => req.filters.districts || []))],
            exams: [...new Set(approvedRequests.flatMap(req => req.filters.exams || []))],
            admissionStatus: [...new Set(approvedRequests.flatMap(req => req.filters.admissionStatus || []))]
          };

          data = await StudentService.getStudentsWithFilters(combinedFilters);
        } else {
          // No approved requests, show empty data
          data = [];
        }
      } else {
        // Load all students for admin
        data = await StudentService.getAllStudents();
      }
      
      console.log(`Loaded ${data.length} students from Supabase database`);
      console.log('Sample student:', data[0]); // Debug log
      
      setStudents(data);
      setLastRefresh(new Date());
      setIsConnected(true);
      
      if (data.length === 0 && user?.role === 'manager') {
        toast('No student data available. Submit a data request to access student information!', {
          icon: '📊',
          duration: 4000
        });
      } else if (data.length === 0) {
        toast('No student data found in database. Upload some data first!', {
          icon: '📊',
          duration: 4000
        });
      } else {
        toast.success(`Loaded ${data.length} students from database`);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setIsConnected(false);
      toast.error('Failed to load students from database');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadStudents();
    if (user?.role === 'manager') {
      loadApprovedRequests();
    }
  };

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    if (action === 'email') {
      toast.success(`Email sent to ${selectedIds.length} students`);
    } else if (action === 'whatsapp') {
      toast.success(`WhatsApp messages sent to ${selectedIds.length} students`);
    }
  };

  const handleStudentAction = (action: string, studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    switch (action) {
      case 'call':
        toast.success(`Calling ${student.studentname}...`);
        break;
      case 'email':
        toast.success(`Email sent to ${student.studentname}`);
        break;
      case 'schedule':
        toast.success(`Follow-up scheduled for ${student.studentname}`);
        break;
      case 'view':
        navigate(`/student/${studentId}`);
        break;
    }
  };

  const canUseBulkActions = user?.role === 'admin' || user?.role === 'manager';
  const canUseStudentActions = user?.role === 'executive';

  const getStatusCounts = () => {
    const counts = {
      new: 0,
      contacted: 0,
      interested: 0,
      enrolled: 0
    };
    
    students.forEach(student => {
      if (student.admissionstatus in counts) {
        counts[student.admissionstatus as keyof typeof counts]++;
      }
    });
    
    return counts;
  };

  const getClassCounts = () => {
    const counts: Record<string, number> = {};
    students.forEach(student => {
      counts[student.class] = (counts[student.class] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4);
  };

  const getStateCounts = () => {
    const counts: Record<string, number> = {};
    students.forEach(student => {
      counts[student.state] = (counts[student.state] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4);
  };

  const statusCounts = getStatusCounts();
  const classCounts = getClassCounts();
  const stateCounts = getStateCounts();

  if (loading) {
    return (
      <Layout title="Students Management">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading student data from Supabase...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Students Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Student Database</h2>
              <p className="text-gray-600 mt-1">
                {user?.role === 'admin' 
                  ? 'Manage and analyze student information across all institutions'
                  : user?.role === 'manager'
                  ? 'View students based on your approved data requests'
                  : 'Handle your assigned students for admission process'
                }
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Database className="w-4 h-4 mr-1" />
                Last updated: {lastRefresh.toLocaleTimeString()}
                <span className="mx-2">•</span>
                {isConnected ? (
                  <span className="flex items-center text-green-600">
                    <Wifi className="w-4 h-4 mr-1" />
                    Supabase Connected
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <WifiOff className="w-4 h-4 mr-1" />
                    Database Offline
                  </span>
                )}
              </div>
              {user?.role === 'manager' && dataAccessInfo && (
                <div className="mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                  <FileText className="w-4 h-4 inline mr-1" />
                  {dataAccessInfo}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <span className={`px-3 py-1 rounded-full font-medium ${
                user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                user?.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {students.length.toLocaleString()} {user?.role === 'executive' ? 'Assigned' : 'Available'} Students
              </span>
            </div>
          </div>
        </div>

        {/* Manager Data Request Info */}
        {user?.role === 'manager' && students.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Student Data Available</h3>
              <p className="text-gray-600 mb-6">
                You need to submit and get approval for data requests to access student information.
              </p>
              <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto mb-6">
                <h4 className="font-semibold text-blue-900 mb-3">How to get student data:</h4>
                <ol className="text-sm text-blue-800 space-y-2 text-left">
                  <li>1. Go to Data Requests page</li>
                  <li>2. Submit a request with specific filters (state, class, year, etc.)</li>
                  <li>3. Wait for backend team approval</li>
                  <li>4. Once approved, student data will appear here</li>
                </ol>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/data-requests')}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Submit Data Request
                </button>
                {approvedRequests.length > 0 && (
                  <button
                    onClick={handleRefresh}
                    className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Check for New Data
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State for Admin/Executive */}
        {students.length === 0 && user?.role !== 'manager' && (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Student Data Found</h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'admin' || user?.role === 'manager' 
                ? 'Upload student data to get started with your CRM system.'
                : 'No students have been assigned to you yet. Contact your manager.'
              }
            </p>
            {!isConnected && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  <WifiOff className="w-4 h-4 inline mr-2" />
                  Database connection failed. Please check your internet connection and try again.
                </p>
              </div>
            )}
            {(user?.role === 'admin' || user?.role === 'manager') && isConnected && (
              <button
                onClick={() => navigate('/upload')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Database className="w-5 h-5 mr-2" />
                Upload Student Data
              </button>
            )}
          </div>
        )}

        {/* Data Table and Summary Cards */}
        {students.length > 0 && (
          <>
            {/* Data Table */}
            <DataTable
              data={students}
              columns={columns}
              onBulkAction={handleBulkAction}
              onStudentAction={handleStudentAction}
              showBulkActions={canUseBulkActions}
              showStudentActions={canUseStudentActions}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">By Status</h3>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New</span>
                    <span className="font-medium text-blue-600">{statusCounts.new.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Contacted</span>
                    <span className="font-medium text-yellow-600">{statusCounts.contacted.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Interested</span>
                    <span className="font-medium text-green-600">{statusCounts.interested.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Enrolled</span>
                    <span className="font-medium text-purple-600">{statusCounts.enrolled.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">By Class</h3>
                <div className="space-y-3 text-sm">
                  {classCounts.length > 0 ? classCounts.map(([className, count]) => (
                    <div key={className} className="flex justify-between items-center">
                      <span className="text-gray-600">{className}</span>
                      <span className="font-medium">{count.toLocaleString()}</span>
                    </div>
                  )) : (
                    <div className="text-gray-500 text-center py-4">No data available</div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top States</h3>
                <div className="space-y-3 text-sm">
                  {stateCounts.length > 0 ? stateCounts.map(([state, count]) => (
                    <div key={state} className="flex justify-between items-center">
                      <span className="text-gray-600">{state}</span>
                      <span className="font-medium">{count.toLocaleString()}</span>
                    </div>
                  )) : (
                    <div className="text-gray-500 text-center py-4">No data available</div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-ups</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Due Today</span>
                    <span className="font-medium text-red-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">This Week</span>
                    <span className="font-medium text-yellow-600">
                      {students.filter(s => s.followupstatus === 'scheduled').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-medium text-green-600">
                      {students.filter(s => s.followupstatus === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-medium text-gray-500">
                      {students.filter(s => s.followupstatus === 'pending').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};