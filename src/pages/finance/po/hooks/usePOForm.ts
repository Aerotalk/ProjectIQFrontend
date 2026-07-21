import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { poSchema, type POFormValues } from '../validators/poValidation';

export const usePOForm = (defaultValues?: Partial<POFormValues>) => {
  const form = useForm<POFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(poSchema) as any,
    defaultValues: {
      poDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
      lineItems: [],
      subTotal: 0,
      totalDiscount: 0,
      totalTaxableAmount: 0,
      totalGstAmount: 0,
      deliveryCost: 0,
      grandTotal: 0,
      description: '',
      expectedDelivery: '',
      attachmentName: '',
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const { control, setValue } = form;

  const lineItems = useWatch({
    control,
    name: 'lineItems',
    defaultValue: [],
  });

  const deliveryCost = useWatch({
    control,
    name: 'deliveryCost',
    defaultValue: 0,
  });

  // Calculate totals whenever lineItems or deliveryCost changes
  useEffect(() => {
    let subTotal = 0;
    
    // First pass: calculate subtotal
    lineItems.forEach(item => {
      const qty = item.quantity || 0;
      const rate = item.rate || 0;
      subTotal += (qty * rate);
    });

    let totalDiscount = 0;
    let totalTaxableAmount = 0;
    let totalGstAmount = 0;
    let grandTotal = 0;

    // Second pass: apply proportional order discount and calculate taxes
    lineItems.forEach((item, index) => {
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

