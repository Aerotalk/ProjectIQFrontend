import { z } from 'zod';
import { zodNumeric, zodNumericOptional } from '@/utils/validation';
import { validateQuantity } from '@/utils/unit';

export const quotationLineItemSchema = z.object({
  id: z.string().nullable().optional(),
  productId: z.string().min(1, 'Product is required'),
  itemName: z.string().min(1, 'Item Name is required'),
  hsnSac: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  quantity: zodNumeric('Quantity is required', 1),
  unit: z.string().min(1, 'Unit is required'),
  rate: zodNumeric('Rate is required', 0),
  discount: zodNumericOptional(0).default(0),
  discountType: z.enum(['PERCENTAGE', 'FLAT']).optional().default('FLAT'),
  gstRate: zodNumeric('GST Rate is required', 0),
  taxableAmount: zodNumeric('Taxable Amount is required', 0),
  gstAmount: zodNumeric('GST Amount is required', 0),
  totalAmount: zodNumeric('Total Amount is required', 0)
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

export const quotationSchema = z.object({
  id: z.string().nullable().optional(),
  quotationNo: z.string().nullable().optional(),
  clientId: z.string().min(1, 'Client is required'),
  clientName: z.string().nullable().optional(),
  date: z.string().min(1, 'Date is required'),
  validUntil: z.string().min(1, 'Valid Until is required'),
  subject: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
  salesperson: z.string().nullable().optional(),
  billingAddress: z.string().nullable().optional(),
  shippingAddress: z.string().nullable().optional(),
  templateName: z.string().min(1, 'Template is required'),

  lineItems: z.array(quotationLineItemSchema).min(1, 'At least one line item is required'),

  subTotal: zodNumeric('SubTotal is required', 0),
  totalDiscount: zodNumeric('Total Discount is required', 0),
  totalTaxableAmount: zodNumeric('Total Taxable Amount is required', 0),
  totalGstAmount: zodNumeric('Total GST Amount is required', 0),
  deliveryCost: zodNumericOptional(0).nullable(),
  grandTotal: zodNumeric('Grand Total is required', 0),

  notes: z.string().nullable().optional(),
  termsAndConditions: z.string().nullable().optional(),

  status: z.enum(['Draft', 'Pending Approval', 'Approved', 'Sent to Client', 'Confirmed Lead']),

  taxType: z.enum(['CGST_SGST', 'IGST']).optional(),

  approvedBy: z.string().nullable().optional(),
  approvalDate: z.string().nullable().optional(),
  woPoDocumentUrl: z.string().nullable().optional()
});

export type QuotationFormValues = z.infer<typeof quotationSchema>;
