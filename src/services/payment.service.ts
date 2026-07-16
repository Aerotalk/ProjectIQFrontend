import type { PaymentRecord } from '../types/payment.types';
import { api } from '../lib/api';

export const PaymentService = {
  getAll: async (companyId: string): Promise<PaymentRecord[]> => {
    if (!companyId) return [];
    return await api.get(`/admin/finance/payments?companyId=${companyId}`);
  },

  getById: async (id: string): Promise<PaymentRecord | undefined> => {
    return await api.get(`/admin/finance/payments/${id}`);
  },

  create: async (companyId: string, data: Omit<PaymentRecord, 'id' | 'paymentId' | 'createdAt' | 'updatedAt'>): Promise<PaymentRecord> => {
    return await api.post(`/admin/finance/payments?companyId=${companyId}`, data);
  },

  update: async (id: string, data: Omit<PaymentRecord, 'id' | 'paymentId' | 'createdAt'>): Promise<PaymentRecord> => {
    return await api.put(`/admin/finance/payments/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/finance/payments/${id}`);
  },
};
