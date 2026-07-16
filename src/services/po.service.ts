import { api } from '../lib/api';
import type { PurchaseOrder } from '../types/po.types';

// Removed unused getFinancialYearCode

export const POService = {
  getAll: async (companyId: string): Promise<PurchaseOrder[]> => {
    if (!companyId) return [];
    return await api.get(`/admin/finance/purchase-orders?companyId=${companyId}`);
  },

  getById: async (id: string): Promise<PurchaseOrder | undefined> => {
    return await api.get(`/admin/finance/purchase-orders/${id}`);
  },

  create: async (companyId: string, data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt' | 'updatedAt'>): Promise<PurchaseOrder> => {
    return await api.post(`/admin/finance/purchase-orders?companyId=${companyId}`, data);
  },

  update: async (id: string, data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>): Promise<PurchaseOrder> => {
    return await api.put(`/admin/finance/purchase-orders/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/finance/purchase-orders/${id}`);
  },
};
