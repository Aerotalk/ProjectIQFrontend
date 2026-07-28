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

  // ── Transactions & Docs: Quotation linking ────────────────────────────────
  getAvailableQuotations: async (companyId: string): Promise<any[]> => {
    if (!companyId) return [];
    return await api.get(`/admin/projects/available-quotations?companyId=${companyId}`);
  },

  linkQuotation: async (projectId: string, quotationId: string): Promise<Project> => {
    return await api.post(`/admin/projects/${projectId}/quotations/${quotationId}`, {});
  },

  unlinkQuotation: async (projectId: string, quotationId: string): Promise<Project> => {
    return await api.delete(`/admin/projects/${projectId}/quotations/${quotationId}`);
  },

  // ── Transactions & Docs: Purchase Order linking ───────────────────────────
  getAvailablePOs: async (companyId: string): Promise<any[]> => {
    if (!companyId) return [];
    return await api.get(`/admin/projects/available-pos?companyId=${companyId}`);
  },

  linkPO: async (projectId: string, poId: string): Promise<Project> => {
    return await api.post(`/admin/projects/${projectId}/pos/${poId}`, {});
  },

  unlinkPO: async (projectId: string, poId: string): Promise<Project> => {
    return await api.delete(`/admin/projects/${projectId}/pos/${poId}`);
  },
};

