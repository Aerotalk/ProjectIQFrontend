import { useState, useCallback, useEffect } from 'react';
import { QuotationService } from '../services/quotation.service';
import type { Quotation } from '../types/quotation.types';
import toast from 'react-hot-toast';

interface UseQuotationsOptions {
  companyId: string | null;
}

export const useQuotations = ({ companyId }: UseQuotationsOptions) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotations = useCallback(async () => {
    if (!companyId) return;
    setIsListLoading(true);
    setError(null);
    try {
      const data = await QuotationService.getQuotations(companyId);
      const sortedData = data.sort((a, b) => {
        const idA = a.quotationNo || a.id;
        const idB = b.quotationNo || b.id;
        return idB.localeCompare(idA); // Descending
      });
      setQuotations(sortedData);
    } catch (err: any) {
      const message = err?.message || 'Failed to fetch quotations';
      setError(message);
      toast.error(message);
    } finally {
      setIsListLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const createQuotation = async (data: Omit<Quotation, 'id'>) => {
    if (!companyId) throw new Error('Company ID is missing');
    setIsSaveLoading(true);
    try {
      // Auto-generate quotationNo if missing
      if (!data.quotationNo) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const fyStart = month >= 4 ? year : year - 1;
        const fyEnd = fyStart + 1;
        const fyCode = `${String(fyStart).slice(2)}${String(fyEnd).slice(2)}`;
        const randomStr = Math.floor(1000 + Math.random() * 9000);
        data.quotationNo = `QT-${fyCode}-${randomStr}`;
      }

      const newQuotation = await QuotationService.createQuotation(companyId, data);
      setQuotations(prev => [newQuotation, ...prev]);
      return newQuotation;
    } finally {
      setIsSaveLoading(false);
    }
  };

  const updateQuotation = async (id: string, data: Partial<Quotation>) => {
    setIsSaveLoading(true);
    try {
      const updatedQuotation = await QuotationService.updateQuotation(id, data);
      setQuotations(prev => prev.map(q => q.id === id ? updatedQuotation : q));
      return updatedQuotation;
    } finally {
      setIsSaveLoading(false);
    }
  };

  return {
    quotations,
    isListLoading,
    isSaveLoading,
    error,
    fetchQuotations,
    createQuotation,
    updateQuotation
  };
};
