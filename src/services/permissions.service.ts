import { api } from '../lib/api';

export interface Permission {
  id: string;
  permissionName: string;
  description: string;
}

export type PermissionMatrix = Record<string, Permission[]>;

export const permissionsService = {
  getPermissionMatrix: async (): Promise<PermissionMatrix> => {
    return api.get('/admin/permissions/matrix');
  },

  getRolePermissionIds: async (roleId: string): Promise<string[]> => {
    return api.get(`/admin/permissions/roles/${roleId}`);
  },

  updateRolePermissions: async (roleId: string, permissionIds: string[]): Promise<void> => {
    return api.put(`/admin/permissions/roles/${roleId}`, permissionIds);
  },

  getUserEffectivePermissions: async (userId: string): Promise<string[]> => {
    return api.get(`/admin/permissions/users/${userId}/effective`);
  }
};
