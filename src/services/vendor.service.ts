import { api } from '../lib/api';
import type { Vendor } from '../types/vendor.types';

export const VendorService = {
  getVendors: async (): Promise<Vendor[]> => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) throw new Error('No company selected');
    return api.get(`/admin/sales/vendors?companyId=${companyId}`);
  },

  createVendor: async (data: Omit<Vendor, 'id'>): Promise<Vendor> => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) throw new Error('No company selected');
    return api.post(`/admin/sales/vendors?companyId=${companyId}`, data);
  },

  updateVendor: async (id: string, data: Omit<Vendor, 'id'>): Promise<Vendor> => {
    return api.put(`/admin/sales/vendors/${id}`, data);
  },

  deleteVendor: async (id: string): Promise<void> => {
    return api.delete(`/admin/sales/vendors/${id}`);
  }
};
