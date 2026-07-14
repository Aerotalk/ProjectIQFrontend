import { api } from '../lib/api';
import type { PurchaseOrder, Expense, Challan } from '../types/finance.types';

const getCompanyId = () => localStorage.getItem('selectedCompanyId');

export const FinanceService = {
  // --- Purchase Orders ---
  getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.get(`/admin/finance/purchase-orders?companyId=${companyId}`);
  },

  createPurchaseOrder: async (data: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.post(`/admin/finance/purchase-orders?companyId=${companyId}`, data);
  },

  updatePurchaseOrder: async (id: string, data: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> => {
    return api.put(`/admin/finance/purchase-orders/${id}`, data);
  },

  deletePurchaseOrder: async (id: string): Promise<void> => {
    return api.delete(`/admin/finance/purchase-orders/${id}`);
  },

  // --- Expenses ---
  getExpenses: async (): Promise<Expense[]> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.get(`/admin/finance/expenses?companyId=${companyId}`);
  },

  createExpense: async (data: Omit<Expense, 'id'>): Promise<Expense> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.post(`/admin/finance/expenses?companyId=${companyId}`, data);
  },

  updateExpense: async (id: string, data: Omit<Expense, 'id'>): Promise<Expense> => {
    return api.put(`/admin/finance/expenses/${id}`, data);
  },

  deleteExpense: async (id: string): Promise<void> => {
    return api.delete(`/admin/finance/expenses/${id}`);
  },

  // --- Challans ---
  getChallans: async (): Promise<Challan[]> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.get(`/admin/finance/challans?companyId=${companyId}`);
  },

  createChallan: async (data: Omit<Challan, 'id'>): Promise<Challan> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.post(`/admin/finance/challans?companyId=${companyId}`, data);
  },

  updateChallan: async (id: string, data: Omit<Challan, 'id'>): Promise<Challan> => {
    return api.put(`/admin/finance/challans/${id}`, data);
  },

  deleteChallan: async (id: string): Promise<void> => {
    return api.delete(`/admin/finance/challans/${id}`);
  },

  // --- File Upload ---
  uploadFile: async (file: File): Promise<{ id: string }> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('organizationId', companyId);
    return api.post('/admin/files/upload', formData);
  }
};
