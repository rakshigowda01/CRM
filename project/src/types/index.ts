export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'executive';
  institutionName?: string;
  institutionLogo?: string;
  gstNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  username?: string;
  password?: string;
  dataScope?: {
    states: string[];
    districts: string[];
    classes: string[];
    years: number[];
  };
  permissions: Permission[];
  createdBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  actions: string[];
}

export interface Student {
  id: string;
  studentname: string;
  gender: 'male' | 'female' | 'other';
  contactnumber: string;
  fathername: string;
  mothername: string;
  parentsnumber: string;
  studentmailid: string;
  address: string;
  pincode: string;
  state: string;
  class: string;
  year: number;
  collegeschool: string;
  entranceexam: string;
  stream: string;
  rank?: number;
  board: string;
  district: string;
  city: string;
  dateofbirth?: string;
  category: string;
  examspreparing: string[];
  marks10th: number;
  marks12th?: number;
  graduationmarks?: number;
  institutionname: string;
  admissionstatus: 'new' | 'contacted' | 'interested' | 'not_interested' | 'enrolled' | 'rejected';
  followupstatus: 'pending' | 'completed' | 'scheduled';
  callstatus?: 'answered' | 'not_answered' | 'busy' | 'switched_off' | 'invalid';
  calloutcome?: 'contacted' | 'left_message' | 'no_answer' | 'callback_requested';
  notes?: string;
  assignedto?: string;
  assignedexecutive?: string;
  tags: string[];
  createdat: string;
  updatedat: string;
  createdby?: string;
  lastupdatedby?: string;
}

export interface DataRequest {
  id: string;
  requestedBy: string;
  requestedByName: string;
  requestedByRole: 'manager' | 'executive';
  requestType: 'data_access' | 'bulk_communication';
  filters: {
    states?: string[];
    districts?: string[];
    cities?: string[];
    classes?: string[];
    streams?: string[];
    years?: number[];
    exams?: string[];
    admissionStatus?: string[];
  };
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  studentId: string;
  userId: string;
  userName: string;
  type: 'call' | 'email' | 'whatsapp' | 'visit';
  status: 'completed' | 'scheduled' | 'missed';
  outcome?: 'interested' | 'not_interested' | 'callback_requested' | 'enrolled' | 'no_response';
  notes: string;
  scheduledDate?: string;
  completedDate?: string;
  nextFollowUpDate?: string;
  createdAt: string;
}

export interface BulkOperation {
  id: string;
  type: 'whatsapp' | 'email';
  title: string;
  message: string;
  recipients: string[];
  filters: any;
  status: 'draft' | 'pending' | 'processing' | 'completed' | 'failed';
  createdBy: string;
  createdByName: string;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  completedAt?: string;
}

export interface LookupList {
  id: string;
  type: 'state' | 'district' | 'class' | 'exam' | 'year' | 'stream' | 'category';
  name: string;
  value: string;
  parentId?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  id: string;
  category: string;
  key: string;
  value: any;
  description: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CallLog {
  id: string;
  studentId: string;
  executiveId: string;
  executiveName: string;
  callType: 'outbound' | 'inbound';
  status: 'answered' | 'not_answered' | 'busy' | 'switched_off' | 'invalid';
  outcome?: 'contacted' | 'left_message' | 'no_answer' | 'callback_requested';
  duration?: number;
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, portal: 'admin' | 'manager' | 'executive') => Promise<void>;
  logout: () => void;
  loading: boolean;
}