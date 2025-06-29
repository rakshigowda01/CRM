import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Mail, MessageSquare, Users, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface BulkMessage {
  id: string;
  type: 'email' | 'whatsapp';
  subject?: string;
  message: string;
  recipients: number;
  status: 'draft' | 'sent' | 'scheduled';
  sentAt?: string;
  scheduledFor?: string;
}

export const BulkOperations: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipients: 'all',
    scheduleDate: '',
    scheduleTime: ''
  });

  const [recentMessages] = useState<BulkMessage[]>([
    {
      id: '1',
      type: 'email',
      subject: 'Important Exam Updates',
      message: 'Dear students, we have important updates regarding upcoming exams...',
      recipients: 1234,
      status: 'sent',
      sentAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'whatsapp',
      message: 'Reminder: Last date for exam registration is tomorrow!',
      recipients: 856,
      status: 'sent',
      sentAt: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      type: 'email',
      subject: 'Scholarship Opportunity',
      message: 'New scholarship program available for eligible students...',
      recipients: 2341,
      status: 'scheduled',
      scheduledFor: '2024-01-20T09:00:00Z'
    }
  ]);

  const handleSend = () => {
    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const isScheduled = formData.scheduleDate && formData.scheduleTime;
    
    if (isScheduled) {
      toast.success(`${activeTab === 'email' ? 'Email' : 'WhatsApp message'} scheduled successfully!`);
    } else {
      toast.success(`${activeTab === 'email' ? 'Email' : 'WhatsApp message'} sent successfully!`);
    }

    // Reset form
    setFormData({
      subject: '',
      message: '',
      recipients: 'all',
      scheduleDate: '',
      scheduleTime: ''
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'draft':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  if (user?.role === 'client') {
    return (
      <Layout title="Bulk Operations">
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">
            You don't have permission to access bulk operations. Contact your administrator for access.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Bulk Operations">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk Communication</h2>
          <p className="text-gray-600">
            Send bulk emails and WhatsApp messages to students and stakeholders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compose Message */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6 py-4">
                  <button
                    onClick={() => setActiveTab('email')}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'email'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('whatsapp')}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'whatsapp'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                </nav>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients
                  </label>
                  <select
                    value={formData.recipients}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Students (124,567)</option>
                    <option value="active">Active Students (89,456)</option>
                    <option value="12th">12th Standard (23,456)</option>
                    <option value="science">Science Stream (56,789)</option>
                    <option value="engineering">Engineering Aspirants (34,567)</option>
                    <option value="medical">Medical Aspirants (23,456)</option>
                  </select>
                </div>

                {/* Subject (Email only) */}
                {activeTab === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter email subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder={`Enter your ${activeTab} message here...`}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTab === 'whatsapp' 
                      ? `${formData.message.length}/1000 characters`
                      : 'You can use HTML formatting for emails'
                    }
                  </p>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.scheduleDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={formData.scheduleTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSend}
                    className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                      activeTab === 'email' 
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {formData.scheduleDate && formData.scheduleTime ? 'Schedule' : 'Send Now'}
                  </button>
                  <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Messages & Stats */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Emails Sent</span>
                  </div>
                  <span className="font-semibold text-gray-900">23,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">WhatsApp Sent</span>
                  </div>
                  <span className="font-semibold text-gray-900">18,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-600">Recipients</span>
                  </div>
                  <span className="font-semibold text-gray-900">45,678</span>
                </div>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {message.type === 'email' ? (
                          <Mail className="w-4 h-4 text-blue-500 mr-2" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-green-500 mr-2" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {message.type === 'email' ? message.subject : 'WhatsApp Message'}
                        </span>
                      </div>
                      {getStatusIcon(message.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {message.message}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{message.recipients.toLocaleString()} recipients</span>
                      <span>
                        {message.status === 'sent' && message.sentAt && 
                          `Sent ${new Date(message.sentAt).toLocaleDateString()}`
                        }
                        {message.status === 'scheduled' && message.scheduledFor &&
                          `Scheduled for ${new Date(message.scheduledFor).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};