import { api } from '../lib/api';

export interface Role {
  id: string;
  roleName: string;
  description: string;
  systemRole: boolean;
  userCount?: number;
}

export const rolesService = {
  getAllRoles: async (): Promise<Role[]> => {
    return api.get('/admin/roles');
  },

  getAvailableRoles: async (): Promise<Role[]> => {
    return api.get('/admin/roles/available');
  },

  getRoleById: async (id: string): Promise<Role> => {
    return api.get(`/admin/roles/${id}`);
  },

  createRole: async (data: { roleName: string; description: string; cloneFromRoleId?: string }): Promise<Role> => {
    return api.post('/admin/roles/custom', data);
  },

  updateRole: async (id: string, data: { roleName: string; description: string }): Promise<Role> => {
    return api.put(`/admin/roles/${id}`, data);
  },

  deleteRole: async (id: string): Promise<void> => {
    return api.delete(`/admin/roles/${id}`);
  },

  assignRolesToEmployee: async (employeeId: string, roleIds: string[]): Promise<void> => {
    return api.put(`/admin/roles/employees/${employeeId}/assign`, roleIds);
  },

  assignRoleToUser: async (roleId: string, targetUserId: string): Promise<void> => {
    return api.post(`/admin/roles/${roleId}/assign?targetUserId=${targetUserId}`);
  }
};
