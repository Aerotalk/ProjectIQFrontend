import { api } from '../lib/api';

export interface Expense {
  id: string;
  projectId?: string;
  projectName?: string;
  expenseType: string;
  expenseDate: string;
  amount: number;
  remarks?: string;
  status?: string;
  attachmentFileId?: string;
}

export const ExpenseService = {
  getExpenses: async (): Promise<Expense[]> => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) throw new Error('No company selected');
    return api.get(`/admin/finance/expenses?companyId=${companyId}`)

  },

  getExpense: async (id: string): Promise<Expense> => {
    return api.get(`/admin/finance/expenses/${id}`)

  },

  createExpense: async (data: Omit<Expense, 'id' | 'projectName'>): Promise<Expense> => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) throw new Error('No company selected');
    return api.post(`/admin/finance/expenses?companyId=${companyId}`, data)

  },

  updateExpense: async (id: string, data: Partial<Expense>): Promise<Expense> => {
    return api.put(`/admin/finance/expenses/${id}`, data)

  },

  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/admin/finance/expenses/${id}`);
  }
};
