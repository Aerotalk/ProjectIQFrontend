import { z } from 'zod';

export const paymentSchema = z.object({
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  linkedInvoiceId: z.string().optional(),
  linkedInvoiceNumber: z.string().optional(),
  paymentDate: z.string().min(1, 'Payment Date is required'),
  amountPaid: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['Bank Transfer', 'Credit Card', 'Cash', 'Cheque', 'UPI']),
  referenceId: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['Completed', 'Pending', 'Failed', 'Refunded']),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
