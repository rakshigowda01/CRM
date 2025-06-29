import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Clock, 
  User, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Mic,
  MicOff,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface CallSession {
  id: string;
  studentId: string;
  startTime: string;
  duration: number;
  status: 'active' | 'completed' | 'missed';
  outcome?: 'contacted' | 'left_message' | 'no_answer' | 'callback_requested';
}

export const CallCenter: React.FC = () => {
  const { user } = useAuth();
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [callQueue, setCallQueue] = useState<any[]>([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [isDialing, setIsDialing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [callOutcome, setCallOutcome] = useState<string>('');
  const [showNotes, setShowNotes] = useState(false);

  const currentStudent = callQueue[currentStudentIndex];

  const startCall = () => {
    if (!currentStudent) return;
    
    setIsDialing(true);
    
    // Simulate dialing
    setTimeout(() => {
      setIsDialing(false);
      const newCall: CallSession = {
        id: `call-${Date.now()}`,
        studentId: currentStudent.id,
        startTime: new Date().toISOString(),
        duration: 0,
        status: 'active'
      };
      setCurrentCall(newCall);
      toast.success(`Calling ${currentStudent.studentname}...`);
    }, 2000);
  };

  const endCall = () => {
    if (!currentCall) return;
    
    setCurrentCall(null);
    setShowNotes(true);
    toast.info('Call ended. Please update call outcome.');
  };

  const saveCallOutcome = () => {
    if (!callOutcome) {
      toast.error('Please select a call outcome');
      return;
    }

    // Update student record
    const updatedQueue = [...callQueue];
    updatedQueue[currentStudentIndex] = {
      ...currentStudent,
      callstatus: callOutcome as any,
      notes: callNotes,
      last_contact_date: new Date().toISOString(),
      next_follow_up_date: followUpDate || undefined,
      lastupdatedby: user?.id
    };
    setCallQueue(updatedQueue);

    // Reset form
    setCallNotes('');
    setFollowUpDate('');
    setCallOutcome('');
    setShowNotes(false);

    // Move to next student
    if (currentStudentIndex < callQueue.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
    }

    toast.success('Call outcome saved successfully!');
  };

  const skipStudent = () => {
    if (currentStudentIndex < callQueue.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
      toast.info('Moved to next student');
    }
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'text-green-600 bg-green-100';
      case 'not_answered': return 'text-yellow-600 bg-yellow-100';
      case 'busy': return 'text-red-600 bg-red-100';
      case 'switched_off': return 'text-gray-600 bg-gray-100';
      case 'invalid': return 'text-purple-600 bg-purple-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  if (user?.role !== 'executive') {
    return (
      <Layout title="Call Center">
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">
            Call Center is only available for Executive users. Contact your manager for access.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Call Center">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Center Dashboard</h2>
              <p className="text-gray-600">
                Manage your daily calls, track outcomes, and schedule follow-ups
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{currentStudentIndex + 1}</div>
                <div className="text-sm text-gray-500">of {callQueue.length}</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-500">Calls Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* No Students Message */}
        {callQueue.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Students Assigned</h3>
            <p className="text-gray-600 mb-6">
              No students have been assigned to you for calling. Contact your manager to get student assignments.
            </p>
            <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto">
              <h4 className="font-semibold text-blue-900 mb-2">How to get started:</h4>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Contact your manager for student assignments</li>
                <li>• Students will appear in your call queue</li>
                <li>• Start making calls and track outcomes</li>
                <li>• Schedule follow-ups as needed</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Call Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Student Info */}
                {currentStudent && (
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-xl">
                            {currentStudent.studentname.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{currentStudent.studentname}</h3>
                          <p className="text-gray-600">{currentStudent.class} • {currentStudent.year}</p>
                          <p className="text-sm text-gray-500">{currentStudent.city}, {currentStudent.state}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{currentStudent.contactnumber}</div>
                        <div className="text-sm text-gray-500">Primary</div>
                        {currentStudent.parentsnumber && (
                          <div className="mt-1">
                            <div className="text-sm text-gray-700">{currentStudent.parentsnumber}</div>
                            <div className="text-xs text-gray-500">Parent</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Exams:</span>
                        <div className="font-medium text-gray-900">
                          {currentStudent.examspreparing?.join(', ') || 'Not specified'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          currentStudent.admissionstatus === 'new' ? 'bg-blue-100 text-blue-800' :
                          currentStudent.admissionstatus === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          currentStudent.admissionstatus === 'interested' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {currentStudent.admissionstatus?.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Contact:</span>
                        <div className="font-medium text-gray-900">
                          {currentStudent.last_contact_date 
                            ? new Date(currentStudent.last_contact_date).toLocaleDateString()
                            : 'Never'
                          }
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Follow-up:</span>
                        <div className="font-medium text-gray-900">
                          {currentStudent.next_follow_up_date 
                            ? new Date(currentStudent.next_follow_up_date).toLocaleDateString()
                            : 'Not scheduled'
                          }
                        </div>
                      </div>
                    </div>

                    {currentStudent.notes && (
                      <div className="mt-4 p-3 bg-white rounded-lg border">
                        <span className="text-sm text-gray-500">Previous Notes:</span>
                        <p className="text-sm text-gray-700 mt-1">{currentStudent.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Call Controls */}
                <div className="p-6">
                  {!currentCall && !isDialing && (
                    <div className="text-center">
                      <button
                        onClick={startCall}
                        className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Phone className="w-6 h-6 mr-3" />
                        Start Call
                      </button>
                      <div className="flex justify-center space-x-4 mt-6">
                        <button
                          onClick={skipStudent}
                          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <SkipForward className="w-4 h-4 mr-2" />
                          Skip Student
                        </button>
                      </div>
                    </div>
                  )}

                  {isDialing && (
                    <div className="text-center">
                      <div className="inline-flex items-center px-8 py-4 bg-yellow-100 text-yellow-800 rounded-2xl text-lg font-semibold mb-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mr-3"></div>
                        Dialing...
                      </div>
                      <p className="text-gray-600">Connecting to {currentStudent?.studentname}</p>
                    </div>
                  )}

                  {currentCall && (
                    <div className="text-center">
                      <div className="inline-flex items-center px-8 py-4 bg-green-100 text-green-800 rounded-2xl text-lg font-semibold mb-6">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                        Call Active
                      </div>
                      
                      <div className="flex justify-center space-x-4 mb-6">
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className={`p-4 rounded-full transition-colors ${
                            isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                        <button className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                          <Volume2 className="w-6 h-6" />
                        </button>
                      </div>

                      <button
                        onClick={endCall}
                        className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl"
                      >
                        <PhoneOff className="w-6 h-6 mr-3" />
                        End Call
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Call Outcome Modal */}
              {showNotes && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Call Outcome</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Call Outcome *
                        </label>
                        <select
                          value={callOutcome}
                          onChange={(e) => setCallOutcome(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select outcome</option>
                          <option value="answered">Contacted</option>
                          <option value="not_answered">Left Message</option>
                          <option value="busy">No Answer</option>
                          <option value="switched_off">Callback Requested</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Call Notes
                        </label>
                        <textarea
                          value={callNotes}
                          onChange={(e) => setCallNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add notes about the call..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Follow-up Date
                        </label>
                        <input
                          type="date"
                          value={followUpDate}
                          onChange={(e) => setFollowUpDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={() => setShowNotes(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveCallOutcome}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save & Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Call Queue & Stats */}
            <div className="space-y-6">
              {/* Today's Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Calls Made</span>
                    <span className="font-semibold text-gray-900">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Connected</span>
                    <span className="font-semibold text-green-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Follow-ups</span>
                    <span className="font-semibold text-yellow-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversions</span>
                    <span className="font-semibold text-purple-600">0</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-medium">Success Rate</span>
                      <span className="font-bold text-blue-600">0%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call Queue */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Queue</h3>
                <div className="text-center py-8">
                  <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No students in queue</p>
                  <p className="text-gray-400 text-xs mt-1">Contact your manager for assignments</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center px-4 py-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                    <Calendar className="w-4 h-4 mr-3" />
                    View Follow-ups
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                    <MessageSquare className="w-4 h-4 mr-3" />
                    Send WhatsApp
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                    <User className="w-4 h-4 mr-3" />
                    Student Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics for Executive */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Today's Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-1">0</p>
              <p className="text-sm text-blue-700 font-medium">Calls Made</p>
              <p className="text-xs text-blue-600 mt-1">Start calling to see progress</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-1">0</p>
              <p className="text-sm text-green-700 font-medium">Connected</p>
              <p className="text-xs text-green-600 mt-1">0% success rate</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-yellow-600 mb-1">0</p>
              <p className="text-sm text-yellow-700 font-medium">Follow-ups Due</p>
              <p className="text-xs text-yellow-600 mt-1">No pending follow-ups</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-1">0</p>
              <p className="text-sm text-purple-700 font-medium">Conversions</p>
              <p className="text-xs text-purple-600 mt-1">This week</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};