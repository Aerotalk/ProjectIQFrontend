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
    return await api.get(`/admin/employees${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string): Promise<Employee> => {
    return await api.get(`/admin/employees/${id}`);
  },
};
