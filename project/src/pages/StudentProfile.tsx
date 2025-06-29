import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  FileText, 
  Edit3, 
  Save, 
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  Tag,
  Users,
  BookOpen,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Since we removed mock data, show a message that student data comes from database
  return (
    <Layout title="Student Profile">
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Profile</h2>
        <p className="text-gray-600 mb-6">
          Student profiles are loaded from the database. Upload student data first to view individual profiles.
        </p>
        <div className="space-y-4 max-w-md mx-auto">
          <button
            onClick={() => navigate('/students')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back to Students
          </button>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button
              onClick={() => navigate('/upload')}
              className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Upload Student Data
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};