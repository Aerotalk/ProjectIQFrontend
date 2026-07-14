import type { Quotation } from '../types/quotation.types';
import { api } from '../lib/api';

const getCompanyId = () => localStorage.getItem('selectedCompanyId');

export const QuotationService = {
  getQuotations: async (): Promise<Quotation[]> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.get(`/admin/sales/quotations?companyId=${companyId}`);
  },

  createQuotation: async (data: Omit<Quotation, 'id'>): Promise<Quotation> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.post(`/admin/sales/quotations?companyId=${companyId}`, data);
  },

  updateQuotation: async (id: string, data: Omit<Quotation, 'id'>): Promise<Quotation> => {
    return api.put(`/admin/sales/quotations/${id}`, data);
  },

  deleteQuotation: async (id: string): Promise<void> => {
    return api.delete(`/admin/sales/quotations/${id}`);
  }
};
