import { api } from '../lib/api';
import type { Project, ProjectFormValues } from '../types/project.types';

export const ProjectService = {
  getAll: async (companyId: string): Promise<Project[]> => {
    if (!companyId) return [];
    return await api.get(`/admin/projects?companyId=${companyId}`);
  },

  getById: async (id: string): Promise<Project | undefined> => {
    return await api.get(`/admin/projects/${id}`);
  },

  create: async (companyId: string, data: ProjectFormValues): Promise<Project> => {
    return await api.post(`/admin/projects?companyId=${companyId}`, data);
  },

  update: async (id: string, data: ProjectFormValues): Promise<Project> => {
    return await api.put(`/admin/projects/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/projects/${id}`);
  },
};
