import { api } from '../lib/api';

export interface Project {
  id: string;
  projectName: string;
  projectCode: string;
  status: string;
}

const getCompanyId = () => localStorage.getItem('selectedCompanyId');

export const ProjectService = {
  getProjects: async (): Promise<Project[]> => {
    const companyId = getCompanyId();
    if (!companyId) return [];
    return api.get(`/admin/projects?companyId=${companyId}`);
  }
};
