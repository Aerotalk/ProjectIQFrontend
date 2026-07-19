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
  remarks?: string;           // Optional internal remarks
  status?: 'Draft' | 'Issued' | 'Dispatched' | 'Delivered';
  lineItems?: any[];
  
  createdAt?: string;
  updatedAt?: string;
}
