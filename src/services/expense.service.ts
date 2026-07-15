import { api } from '../lib/api';
import type { Expense } from '../types/expense.types';

export const ExpenseService = {
  getAll: async (companyId: string): Promise<Expense[]> => {
    if (!companyId) return [];
    return await api.get(`/admin/projects/expenses?companyId=${companyId}`);
  },

  getById: async (id: string): Promise<Expense | undefined> => {
    return await api.get(`/admin/projects/expenses/${id}`);
  },

  create: async (companyId: string, data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
    return await api.post(`/admin/projects/expenses?companyId=${companyId}`, data);
  },

  update: async (id: string, data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
    return await api.put(`/admin/projects/expenses/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/projects/expenses/${id}`);
  },
};
