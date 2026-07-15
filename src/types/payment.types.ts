export type PaymentMethod = 'Bank Transfer' | 'Credit Card' | 'Cash' | 'Cheque' | 'UPI';

export interface PaymentRecord {
  id: string;
  paymentId: string; // Auto-generated (PAY-YYMM-XXXX)
  projectId?: string;
  projectName?: string;
  linkedInvoiceId?: string;
  linkedInvoiceNumber?: string;
  paymentDate: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  referenceId?: string; // Reference / Transaction ID
  notes?: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  createdAt: string;
  updatedAt: string;
}
