import { supabase } from '../lib/supabase';

export interface DataRequestFilters {
  states?: string[];
  districts?: string[];
  classes?: string[];
  years?: number[];
  exams?: string[];
  admissionStatus?: string[];
}

export interface DataRequest {
  id: string;
  requestedBy: string;
  requestedByName: string;
  requestedByRole: 'manager' | 'executive';
  institutionName: string;
  requestType: 'data_access' | 'bulk_communication' | 'student_export';
  title: string;
  description: string;
  filters: DataRequestFilters & { estimatedCount?: number };
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

export class DataRequestService {
  // Create a new data request
  static async createDataRequest(requestData: Omit<DataRequest, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; request?: DataRequest; error?: string }> {
    try {
      const newRequest = {
        ...requestData,
        id: crypto.randomUUID(),
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      // In a real implementation, this would be stored in a database
      // For now, we'll use localStorage for demo purposes
      const existingRequests = this.getStoredRequests();
      const updatedRequests = [newRequest, ...existingRequests];
      localStorage.setItem('dataRequests', JSON.stringify(updatedRequests));

      return { success: true, request: newRequest };
    } catch (error) {
      console.error('Error creating data request:', error);
      return { success: false, error: 'Failed to create data request' };
    }
  }

  // Get all data requests
  static async getAllDataRequests(): Promise<DataRequest[]> {
    try {
      return this.getStoredRequests();
    } catch (error) {
      console.error('Error fetching data requests:', error);
      return [];
    }
  }

  // Get data requests for a specific user
  static async getDataRequestsForUser(userId: string): Promise<DataRequest[]> {
    try {
      const allRequests = this.getStoredRequests();
      return allRequests.filter(request => request.requestedBy === userId);
    } catch (error) {
      console.error('Error fetching user data requests:', error);
      return [];
    }
  }

  // Approve a data request
  static async approveDataRequest(requestId: string, approvedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      const requests = this.getStoredRequests();
      const updatedRequests = requests.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'approved' as const,
              approvedBy,
              approvedAt: new Date().toISOString()
            }
          : request
      );

      localStorage.setItem('dataRequests', JSON.stringify(updatedRequests));
      return { success: true };
    } catch (error) {
      console.error('Error approving data request:', error);
      return { success: false, error: 'Failed to approve data request' };
    }
  }

  // Reject a data request
  static async rejectDataRequest(requestId: string, rejectionReason: string): Promise<{ success: boolean; error?: string }> {
    try {
      const requests = this.getStoredRequests();
      const updatedRequests = requests.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'rejected' as const,
              rejectionReason
            }
          : request
      );

      localStorage.setItem('dataRequests', JSON.stringify(updatedRequests));
      return { success: true };
    } catch (error) {
      console.error('Error rejecting data request:', error);
      return { success: false, error: 'Failed to reject data request' };
    }
  }

  // Get approved data requests for a user (to determine what data they can access)
  static async getApprovedRequestsForUser(userId: string): Promise<DataRequest[]> {
    try {
      const allRequests = this.getStoredRequests();
      return allRequests.filter(request => 
        request.requestedBy === userId && request.status === 'approved'
      );
    } catch (error) {
      console.error('Error fetching approved requests:', error);
      return [];
    }
  }

  // Helper method to get stored requests from localStorage
  private static getStoredRequests(): DataRequest[] {
    try {
      const stored = localStorage.getItem('dataRequests');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing stored requests:', error);
      return [];
    }
  }

  // Check if user has access to specific data based on approved requests
  static async checkDataAccess(userId: string, filters: DataRequestFilters): Promise<boolean> {
    try {
      const approvedRequests = await this.getApprovedRequestsForUser(userId);
      
      // Check if any approved request covers the requested filters
      return approvedRequests.some(request => {
        const requestFilters = request.filters;
        
        // Check if the requested filters are within the approved scope
        const statesMatch = !filters.states || !requestFilters.states || 
          filters.states.every(state => requestFilters.states!.includes(state));
        
        const classesMatch = !filters.classes || !requestFilters.classes ||
          filters.classes.every(cls => requestFilters.classes!.includes(cls));
        
        const yearsMatch = !filters.years || !requestFilters.years ||
          filters.years.every(year => requestFilters.years!.includes(year));
        
        return statesMatch && classesMatch && yearsMatch;
      });
    } catch (error) {
      console.error('Error checking data access:', error);
      return false;
    }
  }
}