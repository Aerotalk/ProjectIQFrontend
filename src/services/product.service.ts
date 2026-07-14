import { api } from '../lib/api';
import type { Product } from '../types/product.types';
import { mapToProduct, mapToProductDto } from './mappers/product.mapper';
import type { ProductDto } from './mappers/product.mapper';

export const ProductService = {
  getProducts: async (companyId: string): Promise<Product[]> => {
    if (!companyId) return [];
    const response = await api.get(`/admin/sales/products?companyId=${companyId}`);
    return (response as ProductDto[]).map(mapToProduct);
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/admin/sales/products/${id}`);
    return mapToProduct(response as ProductDto);
  },

  createProduct: async (companyId: string, data: Omit<Product, 'id'>): Promise<Product> => {
    const dto = mapToProductDto(data);
    const response = await api.post(`/admin/sales/products?companyId=${companyId}`, dto);
    return mapToProduct(response as ProductDto);
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const dto = mapToProductDto(data);
    const response = await api.put(`/admin/sales/products/${id}`, dto);
    return mapToProduct(response as ProductDto);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/admin/sales/products/${id}`);
  }
};
