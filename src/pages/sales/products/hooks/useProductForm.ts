import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormValues } from '../validators/productValidation';

export const useProductForm = (defaultValues?: Partial<ProductFormValues>) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      type: 'Product',
      status: 'Active',
      standardRate: 0,
      unit: 'Pieces',
      gstRate: '18%',
      ...defaultValues
    },
    mode: 'onChange'
  });

  return form;
};
