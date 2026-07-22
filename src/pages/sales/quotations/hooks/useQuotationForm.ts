import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quotationSchema, type QuotationFormValues } from '../validators/quotationValidation';
import { calculateQuotationTotals } from '@/utils/quotationCalculations';

export const useQuotationForm = (defaultValues?: Partial<QuotationFormValues>) => {
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema as any),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
      status: 'Draft',
      lineItems: [],
      subTotal: 0,
      totalDiscount: 0,
      totalTaxableAmount: 0,
      totalGstAmount: 0,
      deliveryCost: 0,
      grandTotal: 0,
      taxType: 'CGST_SGST',
      ...defaultValues
    },
    mode: 'onTouched'
  });

  const { control, setValue } = form;

  const lineItems = useWatch({ control, name: 'lineItems', defaultValue: [] });
  const deliveryCost = useWatch({ control, name: 'deliveryCost', defaultValue: 0 });

  // Calculate totals whenever lineItems, deliveryCost, or order discount changes
  useEffect(() => {
    const totals = calculateQuotationTotals(lineItems as any, 0, Number(deliveryCost) || 0);

    // Update row level calculated fields silently if they changed
    totals.calculatedLines.forEach((calculatedLine, index) => {
      const item = lineItems[index] as any;
      if (item.taxableAmount !== calculatedLine.rowTaxableAmount) {
        setValue(`lineItems.${index}.taxableAmount`, calculatedLine.rowTaxableAmount, { shouldValidate: false });
      }
      if (item.gstAmount !== calculatedLine.rowGstAmount) {
        setValue(`lineItems.${index}.gstAmount`, calculatedLine.rowGstAmount, { shouldValidate: false });
      }
      if (item.totalAmount !== calculatedLine.rowTotalAmount) {
        setValue(`lineItems.${index}.totalAmount`, calculatedLine.rowTotalAmount, { shouldValidate: false });
      }
    });

    setValue('subTotal', totals.subTotal, { shouldValidate: false });
    setValue('totalDiscount', totals.totalDiscount, { shouldValidate: false });
    setValue('totalTaxableAmount', totals.totalTaxableAmount, { shouldValidate: false });
    setValue('totalGstAmount', totals.totalGstAmount, { shouldValidate: false });
    setValue('grandTotal', totals.grandTotal, { shouldValidate: false });

  }, [lineItems, deliveryCost, setValue]);

  return form;
};
