import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { challanSchema, type ChallanFormValues } from '../validators/challanValidation';

export const useChallanForm = (defaultValues?: Partial<ChallanFormValues>) => {
  const form = useForm<ChallanFormValues>({
    resolver: zodResolver(challanSchema),
    defaultValues: {
      challanNumber: '',
      projectId: '',
      vendorId: '',
      challanDate: new Date().toISOString().split('T')[0],
      description: '',
      linkedVendorPoId: '',
      linkedVendorPoNumber: '',
      attachmentName: '',
      ewayBillNo: '',
      remarks: '',
      ...defaultValues,
    },
    mode: 'onTouched',
  });

  return form;
};
