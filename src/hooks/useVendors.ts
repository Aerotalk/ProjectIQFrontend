import { useState, useCallback, useEffect } from 'react';
import { VendorService } from '../services/vendor.service';
import type { Vendor } from '../types/vendor.types';
import toast from 'react-hot-toast';

interface UseVendorsOptions {
  companyId: string | null;
}

export const useVendors = ({ companyId }: UseVendorsOptions) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    if (!companyId) return;
    setIsListLoading(true);
    setError(null);
    try {
      const data = await VendorService.getVendors(companyId);
      const sortedData = data.sort((a, b) => {
        const idA = a.displayName || a.id;
        const idB = b.displayName || b.id;
        return idB.localeCompare(idA);
      });
      setVendors(sortedData);
    } catch (err: any) {
      const message = err?.message || 'Failed to fetch vendors';
      setError(message);
      toast.error(message);
    } finally {
      setIsListLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const createVendor = async (data: Omit<Vendor, 'id' | 'vendorNo'>) => {
    if (!companyId) throw new Error('Company ID is missing');
    setIsSaveLoading(true);
    try {
      const newVendor = await VendorService.createVendor(companyId, data);
      setVendors(prev => [newVendor, ...prev]);
      return newVendor;
    } finally {
      setIsSaveLoading(false);
    }
  };

  const updateVendor = async (id: string, data: Partial<Vendor>) => {
    setIsSaveLoading(true);
    try {
      const updatedVendor = await VendorService.updateVendor(id, data);
      setVendors(prev => prev.map(v => v.id === id ? updatedVendor : v));
      return updatedVendor;
    } finally {
      setIsSaveLoading(false);
    }
  };

  return {
    vendors,
    isListLoading,
    isSaveLoading,
    error,
    fetchVendors,
    createVendor,
    updateVendor
  };
};
