import { useState, useCallback, useEffect } from 'react';
import { ProductService } from '../services/product.service';
import type { Product } from '../types/product.types';
import toast from 'react-hot-toast';

interface UseProductsOptions {
  companyId: string | null;
}

export const useProducts = ({ companyId }: UseProductsOptions) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!companyId) return;
    setIsListLoading(true);
    setError(null);
    try {
      const data = await ProductService.getProducts(companyId);
      const sortedData = data.sort((a, b) => {
        const idA = a.itemCode || a.itemName || a.id;
        const idB = b.itemCode || b.itemName || b.id;
        return idB.localeCompare(idA);
      });
      setProducts(sortedData);
    } catch (err: any) {
      const message = err?.message || 'Failed to fetch products';
      setError(message);
      toast.error(message);
    } finally {
      setIsListLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (data: Omit<Product, 'id'>) => {
    if (!companyId) throw new Error('Company ID is missing');
    setIsSaveLoading(true);
    try {
      const newProduct = await ProductService.createProduct(companyId, data);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } finally {
      setIsSaveLoading(false);
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    setIsSaveLoading(true);
    try {
      const updatedProduct = await ProductService.updateProduct(id, data);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } finally {
      setIsSaveLoading(false);
    }
  };

  return {
    products,
    isListLoading,
    isSaveLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct
  };
};
