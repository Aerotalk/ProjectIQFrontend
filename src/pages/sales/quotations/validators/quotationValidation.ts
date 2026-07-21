import { z } from 'zod';

export const quotationLineItemSchema = z.object({
  id: z.string().nullable().optional(),
  productId: z.string().min(1, 'Product is required'),
  itemName: z.string().min(1, 'Item Name is required'),
  hsnSac: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  rate: z.number().min(0, 'Rate must be positive'),
  discount: z.coerce.number().min(0, 'Discount cannot be negative').optional().default(0),
  discountType: z.enum(['PERCENTAGE', 'FLAT']).optional().default('FLAT'),
  gstRate: z.number().min(0, 'GST Rate must be positive'),
  taxableAmount: z.number().min(0),
  gstAmount: z.number().min(0),
  totalAmount: z.number().min(0)
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

  subTotal: z.number().min(0),
  totalDiscount: z.number().min(0),
  totalTaxableAmount: z.number().min(0),
  totalGstAmount: z.number().min(0),
  deliveryCost: z.number().min(0).nullable().optional(),
  grandTotal: z.number().min(0),

  notes: z.string().nullable().optional(),
  termsAndConditions: z.string().nullable().optional(),

  status: z.enum(['Draft', 'Pending Approval', 'Approved', 'Sent to Client', 'Confirmed Lead']),

  taxType: z.enum(['CGST_SGST', 'IGST']).optional(),

  approvedBy: z.string().nullable().optional(),
  approvalDate: z.string().nullable().optional(),
  woPoDocumentUrl: z.string().nullable().optional()
});

export type QuotationFormValues = z.infer<typeof quotationSchema>;
