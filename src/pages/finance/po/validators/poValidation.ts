import { z } from 'zod';

export const poLineItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().optional(),
  itemName: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number({ message: 'Quantity must be a number' }).min(0.01, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  rate: z.number({ message: 'Rate must be a number' }).min(0, 'Rate cannot be negative'),
  discount: z.coerce.number().min(0, 'Discount cannot be negative').optional().default(0),
  discountType: z.enum(['PERCENTAGE', 'FLAT']).optional().default('FLAT'),
  taxableAmount: z.number().min(0).optional(),
  gstRate: z.number().min(0).optional(),
  gstAmount: z.number().min(0).optional(),
  totalAmount: z.number().min(0),
}).superRefine((data, ctx) => {
  const isWholeNumberUnit = ['boxes', 'pieces', 'carton', 'packet', 'pair', 'set', 'roll', 'bundle', 'bag', 'bottle', 'can', 'unit', 'nos'].includes((data.unit || '').toLowerCase());
  if (isWholeNumberUnit && !Number.isInteger(data.quantity)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['quantity'],
      message: `Quantity must be a whole number for ${data.unit}`,
    });
  }
});

export const poSchema = z.object({
  poNumber: z.string().min(1, 'PO Number is required'),
  projectId: z.string().min(1, 'Project is required'),
  projectName: z.string().nullable().optional(),
  vendorId: z.string().min(1, 'Vendor is required'),
  vendorName: z.string().nullable().optional(),
  poDate: z.string().min(1, 'PO Date is required'),
  // TechSpec §4.2: Description is Required ("What is being procured. Clear description required.")
  description: z.string().min(1, 'Description is required — specify what is being procured'),
  lineItems: z.array(poLineItemSchema).min(1, 'At least one line item is required'),
  subTotal: z.number().min(0),
  totalDiscount: z.number().min(0),
  totalTaxableAmount: z.number().min(0),
  totalGstAmount: z.number().min(0),
  deliveryCost: z.number().min(0).nullable().optional(),
  grandTotal: z.number().min(0),
  status: z.enum(['Draft', 'Pending Approval', 'Approved', 'Ordered', 'Partially Received', 'Completed', 'Cancelled']),
  internalNotes: z.string().nullable().optional(),
  // TechSpec §4.2: Optional fields
  expectedDelivery: z.string().nullable().optional(),
  attachmentName: z.string().nullable().optional(),
});

export type POFormValues = z.infer<typeof poSchema>;
