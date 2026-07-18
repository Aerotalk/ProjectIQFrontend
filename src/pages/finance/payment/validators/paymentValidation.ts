import { z } from 'zod';

export const paymentSchema = z.object({
  paymentNo: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  projectName: z.string().nullable().optional(),
  linkedInvoiceId: z.string().nullable().optional(),
  linkedInvoiceNumber: z.string().nullable().optional(),
  paymentDate: z.string().min(1, 'Payment Date is required'),
  amountPaid: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['Bank Transfer', 'Credit Card', 'Cash', 'Cheque', 'UPI']),
  referenceId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.enum(['Completed', 'Pending', 'Failed', 'Refunded']),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
