import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let ignore = false;
    
    if (!companyId) {
      setVendors([]);
      return;
    }

    setIsListLoading(true);
    setError(null);

    VendorService.getVendors(companyId)
      .then(data => {
        if (!ignore) {
          const sortedData = data.sort((a, b) => {
            const idA = a.displayName || a.companyName || a.firstName || a.id;
            const idB = b.displayName || b.companyName || b.firstName || b.id;
            return idB.localeCompare(idA);
          });
          setVendors(sortedData);
        }
      })
      .catch((err: any) => {
        if (!ignore) {
          const message = err?.message || 'Failed to fetch vendors';
          setError(message);
          toast.error(message);
        }
      })
      .finally(() => {
        if (!ignore) setIsListLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [companyId]);

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

  // We expose fetchVendors as a no-op or re-trigger if needed, but since useEffect handles it based on companyId, we just return a function that does nothing for backwards compatibility if it's called explicitly.
  const fetchVendors = async () => {};

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
