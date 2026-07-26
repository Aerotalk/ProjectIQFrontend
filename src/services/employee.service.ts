import { api } from '../lib/api';

export interface Employee {
  id: string;
  employeeId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  designationId?: string;
  departmentId?: string;
  employmentStatus: string;
  avatarUrl?: string;
}

export const EmployeeService = {
  getAll: async (departmentId?: string, status?: string, keyword?: string): Promise<Employee[]> => {
    const params = new URLSearchParams();
    if (departmentId) params.append('departmentId', departmentId);
    if (status) params.append('status', status);
    if (keyword) params.append('keyword', keyword);
    
    const queryString = params.toString();
    try {
      const response = await api.get(`/admin/employees${queryString ? `?${queryString}` : ''}`);
      // If the backend has employees, return them. Note: Some paginated endpoints return { data: [] }
      if (response && Array.isArray(response) && response.length > 0) {
        return response;
      } else if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (e) {
      console.warn('API fetch failed, falling back to mock employees for development');
    }
    
    // Fallback mock employees for UI testing
    return [
      { id: 'emp-1', employeeId: 'EMP001', firstName: 'John', lastName: 'Doe', email: 'john@example.com', employmentStatus: 'Active', designationId: 'Software Engineer', departmentId: 'Engineering' },
      { id: 'emp-2', employeeId: 'EMP002', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', employmentStatus: 'Active', designationId: 'HR Manager', departmentId: 'HR' },
      { id: 'emp-3', employeeId: 'EMP003', firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', employmentStatus: 'Active', designationId: 'Product Manager', departmentId: 'Product' },
    ];
  },

  getById: async (id: string): Promise<Employee> => {
    return await api.get(`/admin/employees/${id}`);
  },
};
