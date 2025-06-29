import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WelcomePage } from './pages/WelcomePage';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Upload } from './pages/Upload';
import { UserManagement } from './pages/UserManagement';
import { Settings } from './pages/Settings';
import { BulkOperations } from './pages/BulkOperations';
import { Reports } from './pages/Reports';
import { CallCenter } from './pages/CallCenter';
import { StudentProfile } from './pages/StudentProfile';
import { DataRequests } from './pages/DataRequests';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading EduCRM Pro...</p>
        </div>
      </div>
    );
  }

  if (showWelcome && !user) {
    return <WelcomePage onGetStarted={() => setShowWelcome(false)} />;
  }

  if (!user) {
    return <LoginForm onBackToWelcome={() => setShowWelcome(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/student/:id" element={<StudentProfile />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/bulk-operations" element={<BulkOperations />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/call-center" element={<CallCenter />} />
        <Route path="/data-requests" element={<DataRequests />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
};

export default App;