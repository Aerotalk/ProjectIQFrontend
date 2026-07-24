import { z } from 'zod';
import { zodNumericOptional } from '@/utils/validation';

export const productSchema = z.object({
  id: z.string().nullable().optional(),
  itemCode: z.string().nullable().optional(),
  itemName: z.string().optional(),
  description: z.string().nullable().optional(),
  type: z.enum(['Product', 'Service']).optional(),
  unit: z.string().optional(),
  standardRate: zodNumericOptional(0),
  hsnSac: z.string().nullable().optional(),
  hsnDescription: z.string().nullable().optional(),
  gstRate: z.string().optional(),
  status: z.enum(['Active', 'Inactive']).optional()
});

export type ProductFormValues = z.infer<typeof productSchema>;
