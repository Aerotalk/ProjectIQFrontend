import { useState, useCallback, useEffect } from 'react';
import { VendorService } from '../services/vendor.service';
import type { Vendor } from '../types/vendor.types';
import toast from 'react-hot-toast';

const vendorCache: Record<string, Vendor[]> = {};
const vendorPromises: Record<string, Promise<Vendor[]>> = {};

export const invalidateVendorsCache = (companyId: string) => {
  delete vendorCache[companyId];
};

interface UseVendorsOptions {
  companyId: string | null;
}

export const useVendors = ({ companyId }: UseVendorsOptions) => {
  const [vendors, setVendors] = useState<Vendor[]>(() => 
    companyId && vendorCache[companyId] ? vendorCache[companyId] : []
  );
  
  const [isListLoading, setIsListLoading] = useState(() => 
    companyId ? !vendorCache[companyId] : false
  );
  
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async (force = false) => {
    if (!companyId) return;

    if (!force && vendorCache[companyId]) {
      setVendors(vendorCache[companyId]);
      setIsListLoading(false);
      return;
    }

    setIsListLoading(true);
    setError(null);
    try {
      if (!vendorPromises[companyId]) {
        vendorPromises[companyId] = VendorService.getVendors(companyId).then(data => {
          const sortedData = data.sort((a, b) => {
            const idA = a.displayName || a.id;
            const idB = b.displayName || b.id;
            return idB.localeCompare(idA);
          });
          vendorCache[companyId] = sortedData;
          return sortedData;
        }).finally(() => {
          delete vendorPromises[companyId];
        });
      }

      const sortedData = await vendorPromises[companyId];
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
    fetchVendors().then(() => {
      // Intentionally left blank, fetchVendors handles its own state updates safely
    });
  }, [fetchVendors]);

  const createVendor = async (data: Omit<Vendor, 'id' | 'vendorNo'>) => {
    if (!companyId) throw new Error('Company ID is missing');
    setIsSaveLoading(true);
    try {
      const newVendor = await VendorService.createVendor(companyId, data);
      if (vendorCache[companyId]) {
        vendorCache[companyId] = [newVendor, ...vendorCache[companyId]];
      }
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
      if (companyId && vendorCache[companyId]) {
        vendorCache[companyId] = vendorCache[companyId].map((v: Vendor) => v.id === id ? updatedVendor : v);
      }
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
