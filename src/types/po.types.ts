export type POStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Ordered' | 'Partially Received' | 'Completed' | 'Cancelled';

export interface POLineItem {
  id?: string;
  productId?: string;
  itemName?: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  discount?: number;
  discountType?: 'FLAT' | 'PERCENTAGE';
  taxableAmount?: number;
  gstRate?: number;
  gstAmount?: number;
  totalAmount: number; // calculated total
}

export interface PurchaseOrder {
  id: string;             // system-generated, e.g., PORD-0001
  poNumber: string;       // human-readable, e.g., PO-2627-001
  projectId: string;
  projectName?: string;
  vendorId: string;
  vendorName?: string;
  poDate: string;         // ISO date string
  description?: string;   // brief purpose of the PO

  lineItems: POLineItem[];

  // Totals
  subTotal?: number;
  totalDiscount?: number;
  totalTaxableAmount?: number;
  totalGstAmount?: number;
  deliveryCost?: number;
  grandTotal: number;     // sum of all line item totals after discount

  status: POStatus;
  internalNotes?: string;
  expectedDelivery?: string; // ISO date – optional, TechSpec §4.2
  attachmentName?: string;   // display name of the uploaded file

  createdAt?: string;
  updatedAt?: string;
}
