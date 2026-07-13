import type { Quotation } from '../types/quotation.types';

// Mock data initialization
let mockQuotations: Quotation[] = [
  {
    id: 'QUOT-0001',
    quotationNo: 'QT-2627-001',
    clientId: 'CUST-0001',
    clientName: 'TechNova Pvt Ltd',
    date: '2026-07-10',
    validUntil: '2026-07-25',
    subject: 'Server Infrastructure Setup',
    lineItems: [
      {
        id: 'li-1',
        productId: 'PROD-0003',
        itemName: 'Server Hardware Type A',
        quantity: 2,
        unit: 'Pieces',
        rate: 150000,
        discount: 10000,
        gstRate: 18,
        taxableAmount: 290000,
        gstAmount: 52200,
        totalAmount: 342200
      }
    ],
    subTotal: 300000,
    totalDiscount: 10000,
    totalTaxableAmount: 290000,
    totalGstAmount: 52200,
    grandTotal: 342200,
    status: 'Sent to Client'
  },
  {
    id: 'QUOT-0002',
    quotationNo: 'QT-2627-002',
    clientId: 'CUST-0002',
    clientName: 'Glober Corporation',
    date: '2026-07-12',
    validUntil: '2026-07-27',
    subject: 'Annual Maintenance Contract',
    lineItems: [
      {
        id: 'li-2',
        productId: 'PROD-0001',
        itemName: 'Premium SaaS Subscription',
        quantity: 12,
        unit: 'Months',
        rate: 50000,
        discount: 0,
        gstRate: 18,
        taxableAmount: 600000,
        gstAmount: 108000,
        totalAmount: 708000
      }
    ],
    subTotal: 600000,
    totalDiscount: 0,
    totalTaxableAmount: 600000,
    totalGstAmount: 108000,
    grandTotal: 708000,
    status: 'Pending Approval'
  }
];

let nextId = 3;

export const QuotationService = {
  getQuotations: async (): Promise<Quotation[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockQuotations];
  },

  createQuotation: async (data: Omit<Quotation, 'id'>): Promise<Quotation> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newQuotation: Quotation = {
      ...data,
      id: `QUOT-${String(nextId++).padStart(4, '0')}`
    };
    mockQuotations = [newQuotation, ...mockQuotations];
    return newQuotation;
  },

  updateQuotation: async (id: string, data: Omit<Quotation, 'id'>): Promise<Quotation> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockQuotations.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quotation not found');
    
    const updatedQuotation = { ...data, id };
    mockQuotations[index] = updatedQuotation;
    return updatedQuotation;
  },

  deleteQuotation: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockQuotations = mockQuotations.filter(q => q.id !== id);
  }
};
