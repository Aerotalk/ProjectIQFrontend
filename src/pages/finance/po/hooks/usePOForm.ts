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

  // Auto-calculate totals and per-row amounts when line items change
  useEffect(() => {
    let grandTotal = 0;

    lineItems.forEach((item, index) => {
      const qty = item.quantity || 0;
      const price = item.unitPrice || 0;
      const rowTotal = qty * price;

      if (item.totalAmount !== rowTotal) {
        setValue(`lineItems.${index}.totalAmount`, rowTotal, { shouldValidate: false });
      }

      grandTotal += rowTotal;
    });

    setValue('grandTotal', grandTotal, { shouldValidate: false });
  }, [lineItems, setValue]);

  return form;
};
