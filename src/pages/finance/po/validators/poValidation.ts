import { z } from 'zod';

export const poLineItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number({ message: 'Quantity must be a number' }).min(0.01, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  unitPrice: z.number({ message: 'Unit price must be a number' }).min(0, 'Unit price cannot be negative'),
  gstRate: z.number().min(0).optional(),
  gstAmount: z.number().min(0).optional(),
  totalAmount: z.number().min(0),
});

export const poSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  projectName: z.string().optional(),
  vendorId: z.string().min(1, 'Vendor is required'),
  vendorName: z.string().optional(),
  poDate: z.string().min(1, 'PO Date is required'),
  // TechSpec §4.2: Description is Required ("What is being procured. Clear description required.")
  description: z.string().min(1, 'Description is required — specify what is being procured'),
  lineItems: z.array(poLineItemSchema).min(1, 'At least one line item is required'),
  discountPercentage: z.number().min(0).max(100).optional(),
  grandTotal: z.number().min(0),
  status: z.enum(['Draft', 'Pending Approval', 'Approved', 'Ordered', 'Partially Received', 'Completed', 'Cancelled']),
  internalNotes: z.string().optional(),
  // TechSpec §4.2: Optional fields
  expectedDelivery: z.string().optional(),
  attachmentName: z.string().optional(),
});

export type POFormValues = z.infer<typeof poSchema>;
