import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().nullable().optional(),
  itemCode: z.string().nullable().optional(),
  itemName: z.string().min(1, 'Item Name is required'),
  description: z.string().nullable().optional(),
  type: z.enum(['Product', 'Service']),
  unit: z.string().min(1, 'Unit is required'),
  standardRate: z.number().min(0, 'Standard Rate must be a positive number'),
  hsnSac: z.string().nullable().optional(),
  gstRate: z.string().min(1, 'GST Rate is required'),
  status: z.enum(['Active', 'Inactive'])
});

export type ProductFormValues = z.infer<typeof productSchema>;
