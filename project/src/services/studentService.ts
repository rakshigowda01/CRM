import { supabase } from '../lib/supabase';
import { Student } from '../types';

export class StudentService {
  // Insert students into Supabase database
  static async insertStudents(students: Partial<Student>[]): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let successCount = 0;

    try {
      // Insert students in batches to avoid timeout
      const batchSize = 100;
      for (let i = 0; i < students.length; i += batchSize) {
        const batch = students.slice(i, i + batchSize);
        
        const { data, error } = await supabase
          .from('students')
          .insert(batch)
          .select();

        if (error) {
          console.error('Batch insert error:', error);
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        } else {
          successCount += data?.length || 0;
          console.log(`Successfully inserted batch ${Math.floor(i / batchSize) + 1}: ${data?.length} records`);
        }
      }

      return { success: successCount, errors };
    } catch (error) {
      console.error('Database insert error:', error);
      return { 
        success: 0, 
        errors: [error instanceof Error ? error.message : 'Unknown database error'] 
      };
    }
  }

  // Get all students from Supabase database
  static async getAllStudents(): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('createdat', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
        throw new Error(`Failed to fetch students: ${error.message}`);
      }

      console.log(`Retrieved ${data?.length || 0} students from database`);
      return data || [];
    } catch (error) {
      console.error('Database fetch error:', error);
      throw error;
    }
  }

  // Get students with filters (for role-based access and data requests)
  static async getStudentsWithFilters(filters: {
    states?: string[];
    classes?: string[];
    years?: number[];
    assignedTo?: string;
    limit?: number;
    // Data request specific filters
    districts?: string[];
    exams?: string[];
    admissionStatus?: string[];
    requestId?: string; // To track which request approved this data
  }): Promise<Student[]> {
    try {
      let query = supabase
        .from('students')
        .select('*');

      // Apply filters
      if (filters.states && filters.states.length > 0) {
        query = query.in('state', filters.states);
      }

      if (filters.classes && filters.classes.length > 0) {
        query = query.in('class', filters.classes);
      }

      if (filters.years && filters.years.length > 0) {
        query = query.in('year', filters.years);
      }

      if (filters.districts && filters.districts.length > 0) {
        query = query.in('district', filters.districts);
      }

      if (filters.admissionStatus && filters.admissionStatus.length > 0) {
        query = query.in('admissionstatus', filters.admissionStatus);
      }

      if (filters.assignedTo) {
        query = query.eq('assignedto', filters.assignedTo);
      }

      // Handle exams filter (array field)
      if (filters.exams && filters.exams.length > 0) {
        // For array fields, we need to use overlaps operator
        query = query.overlaps('examspreparing', filters.exams);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      query = query.order('createdat', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching filtered students:', error);
        throw new Error(`Failed to fetch students: ${error.message}`);
      }

      console.log(`Retrieved ${data?.length || 0} filtered students from database`);
      return data || [];
    } catch (error) {
      console.error('Database fetch error:', error);
      throw error;
    }
  }

  // Get students based on approved data request
  static async getStudentsForApprovedRequest(requestFilters: any): Promise<Student[]> {
    try {
      const filters = {
        states: requestFilters.states,
        classes: requestFilters.classes,
        years: requestFilters.years,
        districts: requestFilters.districts,
        exams: requestFilters.exams,
        admissionStatus: requestFilters.admissionStatus
      };

      return await this.getStudentsWithFilters(filters);
    } catch (error) {
      console.error('Error fetching students for approved request:', error);
      throw error;
    }
  }

  // Get database statistics
  static async getDatabaseStats(): Promise<{
    totalStudents: number;
    byState: Record<string, number>;
    byClass: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    try {
      // Get total count
      const { count: totalStudents, error: countError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error getting student count:', countError);
        throw new Error(`Failed to get student count: ${countError.message}`);
      }

      // Get all students for aggregation (in production, this should be done with SQL aggregation)
      const { data: students, error: dataError } = await supabase
        .from('students')
        .select('state, class, admissionstatus');

      if (dataError) {
        console.error('Error getting students for stats:', dataError);
        throw new Error(`Failed to get students for stats: ${dataError.message}`);
      }

      // Aggregate data
      const byState: Record<string, number> = {};
      const byClass: Record<string, number> = {};
      const byStatus: Record<string, number> = {};

      students?.forEach(student => {
        // Count by state
        byState[student.state] = (byState[student.state] || 0) + 1;
        
        // Count by class
        byClass[student.class] = (byClass[student.class] || 0) + 1;
        
        // Count by status
        byStatus[student.admissionstatus] = (byStatus[student.admissionstatus] || 0) + 1;
      });

      return {
        totalStudents: totalStudents || 0,
        byState,
        byClass,
        byStatus
      };
    } catch (error) {
      console.error('Database stats error:', error);
      throw error;
    }
  }

  // Test database connection
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Database connection test failed:', error);
        return false;
      }

      console.log('Database connection test successful');
      return true;
    } catch (error) {
      console.error('Database connection test error:', error);
      return false;
    }
  }
}