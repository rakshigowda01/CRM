import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Mail, MessageSquare, ChevronLeft, ChevronRight, Phone, Calendar, User, Eye, ChevronDown } from 'lucide-react';
import { Student } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { INDIAN_STATES, EXAMS } from '../../constants/data';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

interface DataTableProps {
  data: Student[];
  columns: Column[];
  onBulkAction?: (action: string, selectedIds: string[]) => void;
  onStudentAction?: (action: string, studentId: string) => void;
  showBulkActions?: boolean;
  showStudentActions?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  columns, 
  onBulkAction, 
  onStudentAction,
  showBulkActions = false,
  showStudentActions = false
}) => {
  const { user } = useAuth();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('');

  // Generate years from 2015 to 2025
  const years = Array.from({ length: 11 }, (_, i) => 2015 + i);

  const filteredAndSortedData = useMemo(() => {
    let filteredData = data.filter(item => {
      // Search term filter
      const matchesSearch = Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Year filter
      const matchesYear = !selectedYear || item.year.toString() === selectedYear;

      // State filter
      const matchesState = !selectedState || item.state === selectedState;

      // Exam filter - handle both array formats
      const examArray = Array.isArray(item.examspreparing) ? item.examspreparing : [];
      const matchesExam = !selectedExam || examArray.includes(selectedExam);

      // Column filters
      const matchesColumnFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return item[key as keyof Student]?.toString().toLowerCase().includes(value.toLowerCase());
      });

      return matchesSearch && matchesYear && matchesState && matchesExam && matchesColumnFilters;
    });

    // Apply sorting
    if (sortConfig) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Student];
        const bValue = b[sortConfig.key as keyof Student];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [data, searchTerm, sortConfig, filters, selectedYear, selectedState, selectedExam]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(item => item.id));
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows(current =>
      current.includes(id)
        ? current.filter(rowId => rowId !== id)
        : [...current, id]
    );
  };

  const handleBulkAction = (action: string) => {
    if (onBulkAction && selectedRows.length > 0) {
      onBulkAction(action, selectedRows);
      setSelectedRows([]);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedYear('');
    setSelectedState('');
    setSelectedExam('');
    setFilters({});
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'interested': return 'bg-green-100 text-green-800';
      case 'not_interested': return 'bg-red-100 text-red-800';
      case 'enrolled': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (value: any, key: string) => {
    if (key === 'admissionstatus') {
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(value)}`}>
          {value?.replace('_', ' ').toUpperCase()}
        </span>
      );
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (key.includes('Date') && value) {
      return new Date(value).toLocaleDateString();
    }
    
    return String(value || '-');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header Controls */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          {/* Top Row - Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={clearAllFilters}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
              <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>

            {showBulkActions && selectedRows.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('email')}
                  className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email ({selectedRows.length})
                </button>
                <button
                  onClick={() => handleBulkAction('whatsapp')}
                  className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp ({selectedRows.length})
                </button>
              </div>
            )}
          </div>

          {/* Dropdown Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Year Filter */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* State Filter */}
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8"
              >
                <option value="">All States</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Exam Filter */}
            <div className="relative">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8"
              >
                <option value="">All Exams</option>
                {EXAMS.slice(0, 20).map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Column Filters */}
            {columns.filter(col => col.filterable).slice(0, 3).map(column => (
              <input
                key={column.key}
                type="text"
                placeholder={`Filter by ${column.label.toLowerCase()}`}
                value={filters[column.key] || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, [column.key]: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
          </div>

          {/* Active Filters Display */}
          {(selectedYear || selectedState || selectedExam || Object.values(filters).some(f => f)) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
              {selectedYear && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Year: {selectedYear}
                  <button
                    onClick={() => setSelectedYear('')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedState && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  State: {selectedState}
                  <button
                    onClick={() => setSelectedState('')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedExam && (
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Exam: {selectedExam}
                  <button
                    onClick={() => setSelectedExam('')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {Object.entries(filters).map(([key, value]) => 
                value && (
                  <span key={key} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    {key}: {value}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                      className="ml-1 text-gray-600 hover:text-gray-800"
                    >
                      ×
                    </button>
                  </span>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {showBulkActions && (
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {showStudentActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {showBulkActions && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleRowSelect(item.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map(column => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatValue(item[column.key as keyof Student], column.key)}
                  </td>
                ))}
                {showStudentActions && user?.role === 'executive' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onStudentAction?.('call', item.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Call Student"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onStudentAction?.('email', item.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onStudentAction?.('schedule', item.id)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Schedule Follow-up"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onStudentAction?.('view', item.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results Summary */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {paginatedData.length} of {filteredAndSortedData.length} results
          {filteredAndSortedData.length !== data.length && (
            <span className="text-blue-600"> (filtered from {data.length} total)</span>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="mx-2 border border-gray-300 rounded px-2 py-1"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>per page</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};