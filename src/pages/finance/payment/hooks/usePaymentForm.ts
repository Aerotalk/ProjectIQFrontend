import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, type PaymentFormValues } from '../validators/paymentValidation';

export const usePaymentForm = (defaultValues?: Partial<PaymentFormValues>) => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      projectId: '',
      linkedInvoiceId: '',
      paymentDate: new Date().toISOString().split('T')[0],
      amountPaid: 0,
      paymentMethod: 'Bank Transfer',
      referenceId: '',
      notes: '',
      status: 'Completed',
      ...defaultValues,
    },
    mode: 'onChange',
  });

  return form;
};
