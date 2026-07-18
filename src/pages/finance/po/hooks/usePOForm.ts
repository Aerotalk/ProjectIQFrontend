import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { poSchema, type POFormValues } from '../validators/poValidation';

export const usePOForm = (defaultValues?: Partial<POFormValues>) => {
  const form = useForm<POFormValues>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      poDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
      lineItems: [],
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

  const discountPercentage = useWatch({
    control,
    name: 'discountPercentage',
    defaultValue: 0,
  });

  // Auto-calculate totals and per-row amounts when line items change
  useEffect(() => {
    let subTotal = 0;

    lineItems.forEach((item, index) => {
      const qty = item.quantity || 0;
      const price = item.unitPrice || 0;
      const gstRate = item.gstRate || 0;

      const baseTotal = qty * price;
      const gstAmount = baseTotal * (gstRate / 100);
      const rowTotal = baseTotal + gstAmount;

      if (item.gstAmount !== gstAmount) {
        setValue(`lineItems.${index}.gstAmount`, gstAmount, { shouldValidate: false });
      }
      if (item.totalAmount !== rowTotal) {
        setValue(`lineItems.${index}.totalAmount`, rowTotal, { shouldValidate: false });
      }

      subTotal += rowTotal;
    });

    const discountAmount = subTotal * ((discountPercentage || 0) / 100);
    const grandTotal = subTotal - discountAmount;

    setValue('grandTotal', grandTotal, { shouldValidate: false });
  }, [lineItems, discountPercentage, setValue]);

  return form;
};
