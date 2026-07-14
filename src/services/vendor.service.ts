import { api } from '../lib/api';
import type { Vendor } from '../types/vendor.types';
import { mapToVendor, mapToVendorDto } from './mappers/vendor.mapper';
import type { VendorDto } from './mappers/vendor.mapper';

export const VendorService = {
  getVendors: async (companyId: string): Promise<Vendor[]> => {
    if (!companyId) return [];
    const response = await api.get(`/admin/sales/vendors?companyId=${companyId}`);
    return (response as VendorDto[]).map(mapToVendor);
  },

  getVendor: async (id: string): Promise<Vendor> => {
    const response = await api.get(`/admin/sales/vendors/${id}`);
    return mapToVendor(response as VendorDto);
  },

  createVendor: async (companyId: string, data: Omit<Vendor, 'id' | 'vendorNo'>): Promise<Vendor> => {
    const dto = mapToVendorDto(data);
    const response = await api.post(`/admin/sales/vendors?companyId=${companyId}`, dto);
    return mapToVendor(response as VendorDto);
  },

  updateVendor: async (id: string, data: Partial<Vendor>): Promise<Vendor> => {
    const dto = mapToVendorDto(data);
    const response = await api.put(`/admin/sales/vendors/${id}`, dto);
    return mapToVendor(response as VendorDto);
  },

  deleteVendor: async (id: string): Promise<void> => {
    await api.delete(`/admin/sales/vendors/${id}`);
  }
};
