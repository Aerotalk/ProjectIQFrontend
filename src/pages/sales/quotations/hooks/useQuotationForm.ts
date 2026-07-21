import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quotationSchema, type QuotationFormValues } from '../validators/quotationValidation';

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
    let subTotal = 0;
    
    // First pass: calculate subtotal
    lineItems.forEach((item: any) => {
      const qty = item.quantity || 0;
      const rate = item.rate || 0;
      subTotal += (qty * rate);
    });

    let totalDiscount = 0;
    let totalTaxableAmount = 0;
    let totalGstAmount = 0;
    let grandTotal = 0;

    // Second pass: apply proportional order discount and calculate taxes
    lineItems.forEach((item: any, index: number) => {
      const qty = item.quantity || 0;
      const rate = item.rate || 0;
      const discountValue = item.discount || 0;
      const discountType = item.discountType || 'FLAT';
      const gstRate = item.gstRate || 0;

      const rowSubTotal = qty * rate;
      const itemDiscountAmount = discountType === 'PERCENTAGE' ? (rowSubTotal * discountValue / 100) : discountValue;
      
      const rowTotalDiscount = itemDiscountAmount;
      const rowTaxableAmount = Math.max(0, rowSubTotal - rowTotalDiscount);
      const rowGstAmount = rowTaxableAmount * (gstRate / 100);
      const rowTotalAmount = rowTaxableAmount + rowGstAmount;

      // Update row level calculated fields silently if they changed
      if (item.taxableAmount !== rowTaxableAmount) setValue(`lineItems.${index}.taxableAmount`, rowTaxableAmount, { shouldValidate: false });
      if (item.gstAmount !== rowGstAmount) setValue(`lineItems.${index}.gstAmount`, rowGstAmount, { shouldValidate: false });
      if (item.totalAmount !== rowTotalAmount) setValue(`lineItems.${index}.totalAmount`, rowTotalAmount, { shouldValidate: false });

      totalDiscount += itemDiscountAmount;
      totalTaxableAmount += rowTaxableAmount;
      totalGstAmount += rowGstAmount;
      grandTotal += rowTotalAmount;
    });

    grandTotal += Number(deliveryCost) || 0;

    setValue('subTotal', subTotal, { shouldValidate: false });
    setValue('totalDiscount', totalDiscount, { shouldValidate: false });
    setValue('totalTaxableAmount', totalTaxableAmount, { shouldValidate: false });
    setValue('totalGstAmount', totalGstAmount, { shouldValidate: false });
    setValue('grandTotal', grandTotal, { shouldValidate: false });

  }, [lineItems, deliveryCost, setValue]);

  return form;
};
