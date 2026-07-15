import { api } from '../lib/api';
import type { PurchaseOrder } from '../types/po.types';

// Mock projects list (shared across the app)
export const MOCK_PROJECTS = [
  { id: 'PRJ-001', name: 'Analytics Dashboard' },
  { id: 'PRJ-002', name: 'Mobile App Relaunch' },
  { id: 'PRJ-003', name: 'ERP Integration' },
  { id: 'PRJ-004', name: 'Cloud Migration' },
  { id: 'PRJ-005', name: 'Data Warehouse Setup' },
  { id: 'PRJ-006', name: 'CRM Implementation' },
];

// Removed unused getFinancialYearCode

export const POService = {
  getAll: async (companyId: string): Promise<PurchaseOrder[]> => {
    if (!companyId) return [];
    return await api.get(`/admin/finance/pos?companyId=${companyId}`);
  },

  getById: async (id: string): Promise<PurchaseOrder | undefined> => {
    return await api.get(`/admin/finance/pos/${id}`);
  },

  create: async (companyId: string, data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt' | 'updatedAt'>): Promise<PurchaseOrder> => {
    return await api.post(`/admin/finance/pos?companyId=${companyId}`, data);
  },

  update: async (id: string, data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>): Promise<PurchaseOrder> => {
    return await api.put(`/admin/finance/pos/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/finance/pos/${id}`);
  },
};
