import { api } from '../lib/api';
import type { Quotation } from '../types/quotation.types';
import { mapToQuotation, mapToQuotationDto } from './mappers/quotation.mapper';
import type { QuotationDto } from './mappers/quotation.mapper';

export const QuotationService = {
  getQuotations: async (companyId: string): Promise<Quotation[]> => {
    if (!companyId) return [];
    const response = await api.get(`/admin/sales/quotations?companyId=${companyId}`);
    return (response as QuotationDto[]).map(mapToQuotation);
  },

  getQuotation: async (id: string): Promise<Quotation> => {
    const response = await api.get(`/admin/sales/quotations/${id}`);
    return mapToQuotation(response as QuotationDto);
  },

  createQuotation: async (companyId: string, data: Omit<Quotation, 'id'>): Promise<Quotation> => {
    const dto = mapToQuotationDto(data);
    const response = await api.post(`/admin/sales/quotations?companyId=${companyId}`, dto);
    return mapToQuotation(response as QuotationDto);
  },

  updateQuotation: async (id: string, data: Partial<Quotation>): Promise<Quotation> => {
    const dto = mapToQuotationDto(data);
    const response = await api.put(`/admin/sales/quotations/${id}`, dto);
    return mapToQuotation(response as QuotationDto);
  },

  updateQuotationStatus: async (id: string, status: string, approvedBy?: string): Promise<Quotation> => {
    let url = `/admin/sales/quotations/${id}/status?status=${encodeURIComponent(status)}`;
    if (approvedBy) {
      url += `&approvedBy=${encodeURIComponent(approvedBy)}`;
    }
    const response = await api.put(url, {});
    return mapToQuotation(response as QuotationDto);
  },

  deleteQuotation: async (id: string): Promise<void> => {
    await api.delete(`/admin/sales/quotations/${id}`);
  }
};
