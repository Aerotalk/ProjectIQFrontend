import { api } from '../lib/api';

export interface Project {
  id: string;
  projectCode: string;
  projectName: string;
  description?: string;
  status?: string;
}

export const ProjectService = {
  getProjects: async (): Promise<Project[]> => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) throw new Error('No company selected');
    return api.get(`/admin/projects?companyId=${companyId}`)

  },

  getProject: async (id: string): Promise<Project> => {
    return api.get(`/admin/projects/${id}`)

  },

  createProject: async (data: Omit<Project, 'id'>): Promise<Project> => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) throw new Error('No company selected');
    return api.post(`/admin/projects?companyId=${companyId}`, data)

  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    return api.put(`/admin/projects/${id}`, data)

  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/admin/projects/${id}`);
  }
};
