import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { challanSchema, type ChallanFormValues } from '../validators/challanValidation';

export const useChallanForm = (defaultValues?: Partial<ChallanFormValues>) => {
  const form = useForm<ChallanFormValues>({
    resolver: zodResolver(challanSchema),
    defaultValues: {
      challanNumber: '',
      projectId: '',
      projectName: '',
      clientId: '',
      clientName: '',
      challanDate: new Date().toISOString().split('T')[0],
      description: '',
      attachmentName: '',
      ewayBillNo: '',
      remarks: '',
      transportMode: '',
      deliveryLocation: '',
      placeOfSupply: '',
      poNumber: '',
      poDate: '',
      contactName: '',
      contactEmail: '',
      contactMobile: '',
      billingAddress: '',
      shippingAddress: '',
      lineItems: [],
      ...defaultValues,
    },
    mode: 'onChange',
  });

  return form;
};
