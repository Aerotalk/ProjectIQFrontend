export interface ChallanLineItem {
  id?: string;
  itemName?: string;
  name?: string;
  hsnSac?: string;
  itemHsn?: string;
  hsn?: string;
  description?: string;
  dispatchedQuantity?: number;
  qty?: number;
  quantity?: number;
  unit?: string;
}

export interface DeliveryChallan {
  id: string;                 // System generated, e.g., DC-0001
  challanNumber: string;      // As printed on the physical document
  projectId: string;          // Selected project
  projectName?: string;       // Hydrated for display
  vendorId: string;           // Selected vendor (filtered by project)
  vendorName?: string;        // Hydrated for display
  challanDate: string;        // ISO date string
  description: string;        // What was delivered / milestone completed
  linkedVendorPoId?: string;  // Optional trace to Vendor PO
  linkedVendorPoNumber?: string; // Hydrated for display
  attachmentName?: string;    // Optional uploaded file name
  ewayBillNo?: string;        // Optional E-way bill number
  remarks?: string;           // Optional internal remarks
  status?: 'Draft' | 'Issued' | 'Dispatched' | 'Delivered';

  transportMode?: string;
  deliveryLocation?: string;
  placeOfSupply?: string;
  contactName?: string;
  contactEmail?: string;
  contactMobile?: string;
  poNumber?: string;
  poDate?: string;

  lineItems?: ChallanLineItem[];
  
  createdAt?: string;
  updatedAt?: string;
}
