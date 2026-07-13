import { useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quotationSchema, type QuotationFormValues } from '../validators/quotationValidation';

export const useQuotationForm = (defaultValues?: Partial<QuotationFormValues>) => {
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
      status: 'Draft',
      lineItems: [],
      subTotal: 0,
      totalDiscount: 0,
      totalTaxableAmount: 0,
      totalGstAmount: 0,
      grandTotal: 0,
      ...defaultValues
    },
    mode: 'onChange'
  });

  const { control, setValue } = form;

  const lineItems = useWatch({
    control,
    name: 'lineItems',
    defaultValue: []
  });

  // Calculate totals whenever lineItems change
  useEffect(() => {
    let subTotal = 0;
    let totalDiscount = 0;
    let totalTaxableAmount = 0;
    let totalGstAmount = 0;
    let grandTotal = 0;

    lineItems.forEach((item, index) => {
      const qty = item.quantity || 0;
      const rate = item.rate || 0;
      const discount = item.discount || 0;
      const gstRate = item.gstRate || 0;

      const rowSubTotal = qty * rate;
      const rowTaxableAmount = Math.max(0, rowSubTotal - discount);
      const rowGstAmount = rowTaxableAmount * (gstRate / 100);
      const rowTotalAmount = rowTaxableAmount + rowGstAmount;

      // Update row level calculated fields silently if they changed
      if (item.taxableAmount !== rowTaxableAmount) setValue(`lineItems.${index}.taxableAmount`, rowTaxableAmount, { shouldValidate: false });
      if (item.gstAmount !== rowGstAmount) setValue(`lineItems.${index}.gstAmount`, rowGstAmount, { shouldValidate: false });
      if (item.totalAmount !== rowTotalAmount) setValue(`lineItems.${index}.totalAmount`, rowTotalAmount, { shouldValidate: false });

      subTotal += rowSubTotal;
      totalDiscount += discount;
      totalTaxableAmount += rowTaxableAmount;
      totalGstAmount += rowGstAmount;
      grandTotal += rowTotalAmount;
    });

    setValue('subTotal', subTotal, { shouldValidate: false });
    setValue('totalDiscount', totalDiscount, { shouldValidate: false });
    setValue('totalTaxableAmount', totalTaxableAmount, { shouldValidate: false });
    setValue('totalGstAmount', totalGstAmount, { shouldValidate: false });
    setValue('grandTotal', grandTotal, { shouldValidate: false });

  }, [lineItems, setValue]);

  return form;
};
