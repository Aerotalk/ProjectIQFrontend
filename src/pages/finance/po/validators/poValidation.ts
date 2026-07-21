import { z } from 'zod';
import { zodNumeric, zodNumericOptional } from '@/utils/validation';
import { validateQuantity } from '@/utils/unit';

export const poLineItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().optional(),
  itemName: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: zodNumeric('Quantity is required', 0.01),
  unit: z.string().min(1, 'Unit is required'),
  rate: zodNumeric('Rate is required', 0),
  discount: zodNumericOptional(0).default(0),
  discountType: z.enum(['PERCENTAGE', 'FLAT']).optional().default('FLAT'),
  taxableAmount: zodNumericOptional(0),
  gstRate: zodNumericOptional(0),
  gstAmount: zodNumericOptional(0),
  totalAmount: zodNumeric('Total Amount is required', 0),
}).superRefine((data, ctx) => {
  const validationResult = validateQuantity(data.quantity, data.unit);
  if (validationResult !== true) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['quantity'],
      message: validationResult,
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
  subTotal: zodNumeric('SubTotal is required', 0),
  totalDiscount: zodNumeric('Total Discount is required', 0),
  totalTaxableAmount: zodNumeric('Total Taxable Amount is required', 0),
  totalGstAmount: zodNumeric('Total GST Amount is required', 0),
  deliveryCost: zodNumericOptional(0).nullable(),
  grandTotal: zodNumeric('Grand Total is required', 0),
  status: z.enum(['Draft', 'Pending Approval', 'Approved', 'Ordered', 'Partially Received', 'Completed', 'Cancelled']),
  internalNotes: z.string().nullable().optional(),
  // TechSpec §4.2: Optional fields
  expectedDelivery: z.string().nullable().optional(),
  attachmentName: z.string().nullable().optional(),
});

export type POFormValues = z.infer<typeof poSchema>;
