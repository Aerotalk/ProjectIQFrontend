import type { Vendor } from '../types/vendor.types';
import { api } from '../lib/api';

const getCompanyId = () => localStorage.getItem('selectedCompanyId');

export const VendorService = {
  getVendors: async (): Promise<Vendor[]> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.get(`/admin/sales/vendors?companyId=${companyId}`);
  },

  createVendor: async (data: Omit<Vendor, 'id'>): Promise<Vendor> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.post(`/admin/sales/vendors?companyId=${companyId}`, data);
  },

  updateVendor: async (id: string, data: Omit<Vendor, 'id'>): Promise<Vendor> => {
    return api.put(`/admin/sales/vendors/${id}`, data);
  },

  deleteVendor: async (id: string): Promise<void> => {
    return api.delete(`/admin/sales/vendors/${id}`);
  }
};
