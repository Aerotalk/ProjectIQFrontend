import { api } from '../lib/api';

export interface Challan {
  id: string;
  vendorId?: string;
  vendorName?: string;
  projectId?: string;
  projectName?: string;
  challanNumber: string;
  challanDate: string;
  remarks?: string;
  status?: string;
  attachmentFileId?: string;
}

export const ChallanService = {
  getChallans: async (): Promise<Challan[]> => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) throw new Error('No company selected');
    return api.get(`/admin/finance/challans?companyId=${companyId}`)

  },

  getChallan: async (id: string): Promise<Challan> => {
    return api.get(`/admin/finance/challans/${id}`)

  },

  createChallan: async (data: Omit<Challan, 'id' | 'vendorName' | 'projectName'>): Promise<Challan> => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) throw new Error('No company selected');
    return api.post(`/admin/finance/challans?companyId=${companyId}`, data)

  },

  updateChallan: async (id: string, data: Partial<Challan>): Promise<Challan> => {
    return api.put(`/admin/finance/challans/${id}`, data)

  },

  deleteChallan: async (id: string): Promise<void> => {
    await api.delete(`/admin/finance/challans/${id}`);
  }
};
