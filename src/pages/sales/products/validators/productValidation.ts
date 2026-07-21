import { z } from 'zod';
import { zodNumeric } from '@/utils/validation';

export const productSchema = z.object({
  id: z.string().nullable().optional(),
  itemCode: z.string().nullable().optional(),
  itemName: z.string().min(1, 'Item Name is required'),
  description: z.string().nullable().optional(),
  type: z.enum(['Product', 'Service']),
  unit: z.string().min(1, 'Unit is required'),
  standardRate: zodNumeric('Standard Rate is required', 0),
  hsnSac: z.string().nullable().optional(),
  hsnDescription: z.string().nullable().optional(),
  gstRate: z.string().min(1, 'GST Rate is required'),
  status: z.enum(['Active', 'Inactive'])
});

export type ProductFormValues = z.infer<typeof productSchema>;
