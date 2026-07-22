import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { kbSchema, type KBFormValues } from '../../../services/kb.service';

export const useKBForm = (defaultValues?: Partial<KBFormValues>) => {
  return useForm<KBFormValues>({
    resolver: zodResolver(kbSchema),
    defaultValues: {
      title: '',
      category: '',
      symptoms: '',
      cause: '',
      workaround: '',
      ci: '',
      errorCode: '',
      status: 'Draft',
      ...defaultValues,
    },
    mode: 'onChange',
  });
};
