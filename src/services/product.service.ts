import type { Product } from '../types/product.types';
import { api } from '../lib/api';

const getCompanyId = () => localStorage.getItem('selectedCompanyId');

export const ProductService = {
  getProducts: async (): Promise<Product[]> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.get(`/admin/sales/products?companyId=${companyId}`);
  },

  createProduct: async (data: Omit<Product, 'id'>): Promise<Product> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.post(`/admin/sales/products?companyId=${companyId}`, data);
  },

  updateProduct: async (id: string, data: Omit<Product, 'id'>): Promise<Product> => {
    return api.put(`/admin/sales/products/${id}`, data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    return api.delete(`/admin/sales/products/${id}`);
  }
};
