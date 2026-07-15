import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, type ExpenseFormValues } from '../validators/expenseValidation';
import { useEffect } from 'react';

export const useExpenseForm = (defaultValues?: Partial<ExpenseFormValues>) => {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      projectId: '',
      expenseDate: new Date().toISOString().split('T')[0],
      category: 'Travel',
      description: '',
      amount: undefined,
      paidBy: '',
      receiptName: '',
      isGstApplicable: false,
      gstAmount: undefined,
      isInputCreditClaimable: false,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  // Watch GST toggle to clear fields if disabled
  const isGstApplicable = form.watch('isGstApplicable');

  useEffect(() => {
    if (!isGstApplicable) {
      form.setValue('gstAmount', 0, { shouldValidate: true });
      form.setValue('isInputCreditClaimable', false, { shouldValidate: true });
    }
  }, [isGstApplicable, form]);

  return form;
};
