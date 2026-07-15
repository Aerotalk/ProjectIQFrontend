import { z } from 'zod';

export const quotationLineItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, 'Product is required'),
  itemName: z.string().min(1, 'Item Name is required'),
  description: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  rate: z.number().min(0, 'Rate must be positive'),
  discount: z.number().min(0, 'Discount cannot be negative'),
  gstRate: z.number().min(0, 'GST Rate must be positive'),
  taxableAmount: z.number().min(0),
  gstAmount: z.number().min(0),
  totalAmount: z.number().min(0)
});

export const quotationSchema = z.object({
  id: z.string().optional(),
  quotationNo: z.string().optional(),
  clientId: z.string().min(1, 'Client is required'),
  clientName: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  validUntil: z.string().min(1, 'Valid Until is required'),
  subject: z.string().optional(),
  reference: z.string().optional(),

  lineItems: z.array(quotationLineItemSchema).min(1, 'At least one line item is required'),

  subTotal: z.number().min(0),
  totalDiscount: z.number().min(0),
  totalTaxableAmount: z.number().min(0),
  totalGstAmount: z.number().min(0),
  deliveryCost: z.number().min(0).optional(),
  grandTotal: z.number().min(0),

  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),

  status: z.enum(['Draft', 'Pending Approval', 'Approved', 'Sent to Client', 'Confirmed Lead']),

  approvedBy: z.string().optional(),
  approvalDate: z.string().optional(),
  woPoDocumentUrl: z.string().optional()
});

export type QuotationFormValues = z.infer<typeof quotationSchema>;
