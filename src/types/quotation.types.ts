export type QuotationStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Sent to Client' | 'Confirmed Lead' | 'Rejected' | 'Changes Requested' | 'Accepted' | 'Converted' | 'Sent for Approval' | 'Under Negotiation';

export interface QuotationLineItem {
  id?: string;
  productId: string;
  itemName: string;
  description?: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  gstRate: number; // e.g., 18 for 18%
  
  // Calculated fields (often useful to keep for quick access, or calculated on the fly)
  taxableAmount: number; // (qty * rate) - discount
  gstAmount: number;     // taxableAmount * (gstRate/100)
  totalAmount: number;   // taxableAmount + gstAmount
}

export interface Quotation {
  id: string; // generated, e.g., QUOT-0001
  quotationNo: string;
  clientId: string; // Reference to Client
  clientName?: string; // For display
  date: string; // ISO date string
  validUntil: string;
  subject?: string;
  reference?: string;
  salesperson?: string;

  lineItems: QuotationLineItem[];

  // Totals
  subTotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalGstAmount: number;
  deliveryCost?: number;
  grandTotal: number;

  notes?: string;
  termsAndConditions?: string;

  status: QuotationStatus;

  // Workflow specifics
  approvedBy?: string;
  approvalDate?: string;
  woPoDocumentUrl?: string;
}
