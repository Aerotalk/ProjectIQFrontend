import { api } from '../lib/api';
import type { DeliveryChallan } from '../types/challan.types';

export const ChallanService = {
  getAll: async (companyId: string): Promise<DeliveryChallan[]> => {
    if (!companyId) return [];
    return await api.get(`/admin/finance/challans?companyId=${companyId}`);
  },

  getById: async (id: string): Promise<DeliveryChallan | undefined> => {
    return await api.get(`/admin/finance/challans/${id}`);
  },

  create: async (companyId: string, data: Omit<DeliveryChallan, 'id' | 'createdAt' | 'updatedAt'>): Promise<DeliveryChallan> => {
    return await api.post(`/admin/finance/challans?companyId=${companyId}`, data);
  },

  update: async (id: string, data: Omit<DeliveryChallan, 'id' | 'createdAt'>): Promise<DeliveryChallan> => {
    return await api.put(`/admin/finance/challans/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/finance/challans/${id}`);
  },
};
