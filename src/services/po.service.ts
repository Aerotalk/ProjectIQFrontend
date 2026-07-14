import type { PurchaseOrder } from '../types/po.types';

// Mock projects list (shared across the app)
export const MOCK_PROJECTS = [
  { id: 'PRJ-001', name: 'Analytics Dashboard' },
  { id: 'PRJ-002', name: 'Mobile App Relaunch' },
  { id: 'PRJ-003', name: 'ERP Integration' },
  { id: 'PRJ-004', name: 'Cloud Migration' },
  { id: 'PRJ-005', name: 'Data Warehouse Setup' },
  { id: 'PRJ-006', name: 'CRM Implementation' },
];

/**
 * Returns the Indian financial year code for a given date.
 * FY starts April 1. e.g. Jul 2026 → FY 2026-27 → "2627"
 */
function getFinancialYearCode(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-based
  const fyStart = month >= 4 ? year : year - 1;
  const fyEnd = fyStart + 1;
  return `${String(fyStart).slice(2)}${String(fyEnd).slice(2)}`;
}

// Mock data initialization
let mockPOs: PurchaseOrder[] = [
  {
    id: 'PORD-0001',
    poNumber: 'VPO-2627-0001',
    projectId: 'PRJ-001',
    projectName: 'Analytics Dashboard',
    vendorId: 'VEND-0001',
    vendorName: 'CloudServe Pvt Ltd',
    poDate: '2026-07-10',
    description: 'Cloud infrastructure services for Q3',
    lineItems: [
      {
        id: 'li-1',
        description: 'Cloud Hosting (Annual)',
        quantity: 1,
        unit: 'Year',
        unitPrice: 120000,
        totalAmount: 120000,
      },
      {
        id: 'li-2',
        description: 'SSL Certificate Setup',
        quantity: 3,
        unit: 'Domains',
        unitPrice: 5000,
        totalAmount: 15000,
      },
    ],
    grandTotal: 135000,
    status: 'Approved',
    internalNotes: 'Approved by finance head on 12 Jul 2026.',
    createdAt: '2026-07-10T09:00:00Z',
    updatedAt: '2026-07-12T14:30:00Z',
  },
  {
    id: 'PORD-0002',
    poNumber: 'VPO-2627-0002',
    projectId: 'PRJ-002',
    projectName: 'Mobile App Relaunch',
    vendorId: 'VEND-0002',
    vendorName: 'SMSProvider Ltd',
    poDate: '2026-07-11',
    description: 'Bulk SMS gateway subscription',
    lineItems: [
      {
        id: 'li-3',
        description: 'SMS Credits (50,000 units)',
        quantity: 50000,
        unit: 'SMS',
        unitPrice: 1,
        totalAmount: 50000,
      },
    ],
    grandTotal: 50000,
    status: 'Pending Approval',
    createdAt: '2026-07-11T11:00:00Z',
    updatedAt: '2026-07-11T11:00:00Z',
  },
  {
    id: 'PORD-0003',
    poNumber: 'VPO-2627-0003',
    projectId: 'PRJ-003',
    projectName: 'ERP Integration',
    vendorId: 'VEND-0001',
    vendorName: 'CloudServe Pvt Ltd',
    poDate: '2026-07-08',
    description: 'Database server licensing and setup',
    lineItems: [
      {
        id: 'li-4',
        description: 'Enterprise DB License',
        quantity: 2,
        unit: 'Licenses',
        unitPrice: 85000,
        totalAmount: 170000,
      },
      {
        id: 'li-5',
        description: 'Installation & Configuration',
        quantity: 1,
        unit: 'Service',
        unitPrice: 30000,
        totalAmount: 30000,
      },
    ],
    grandTotal: 200000,
    status: 'Completed',
    internalNotes: 'All items delivered and verified.',
    createdAt: '2026-07-08T09:00:00Z',
    updatedAt: '2026-07-13T16:00:00Z',
  },
  {
    id: 'PORD-0004',
    poNumber: 'VPO-2627-0004',
    projectId: 'PRJ-004',
    projectName: 'Cloud Migration',
    vendorId: 'VEND-0002',
    vendorName: 'SMSProvider Ltd',
    poDate: '2026-07-06',
    description: 'Notification services for migration alerts',
    lineItems: [
      {
        id: 'li-6',
        description: 'Alert SMS Pack',
        quantity: 10000,
        unit: 'SMS',
        unitPrice: 1.5,
        totalAmount: 15000,
      },
    ],
    grandTotal: 15000,
    status: 'Cancelled',
    internalNotes: 'Cancelled – vendor changed.',
    createdAt: '2026-07-06T09:00:00Z',
    updatedAt: '2026-07-09T10:00:00Z',
  },
  {
    id: 'PORD-0005',
    poNumber: 'VPO-2627-0005',
    projectId: 'PRJ-005',
    projectName: 'Data Warehouse Setup',
    vendorId: 'VEND-0001',
    vendorName: 'CloudServe Pvt Ltd',
    poDate: '2026-07-13',
    description: 'Storage and compute resources for data warehouse',
    lineItems: [
      {
        id: 'li-7',
        description: 'Object Storage (1TB)',
        quantity: 1,
        unit: 'TB/Month',
        unitPrice: 8000,
        totalAmount: 8000,
      },
      {
        id: 'li-8',
        description: 'Compute Instances (4 vCPU)',
        quantity: 2,
        unit: 'Instances',
        unitPrice: 12000,
        totalAmount: 24000,
      },
    ],
    grandTotal: 32000,
    status: 'Draft',
    createdAt: '2026-07-13T09:00:00Z',
    updatedAt: '2026-07-13T09:00:00Z',
  },
  {
    id: 'PORD-0006',
    poNumber: 'VPO-2627-0006',
    projectId: 'PRJ-006',
    projectName: 'CRM Implementation',
    vendorId: 'VEND-0002',
    vendorName: 'SMSProvider Ltd',
    poDate: '2026-07-12',
    description: 'Transactional SMS for CRM workflows',
    lineItems: [
      {
        id: 'li-9',
        description: 'Transactional SMS Bundle',
        quantity: 25000,
        unit: 'SMS',
        unitPrice: 1.2,
        totalAmount: 30000,
      },
    ],
    grandTotal: 30000,
    status: 'Ordered',
    createdAt: '2026-07-12T13:00:00Z',
    updatedAt: '2026-07-12T13:00:00Z',
  },
];

let nextId = 7;
let nextPoSeq = 7;

function generatePoNumber(): string {
  const fyCode = getFinancialYearCode();
  return `VPO-${fyCode}-${String(nextPoSeq++).padStart(4, '0')}`;
}

export const POService = {
  getAll: async (): Promise<PurchaseOrder[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockPOs];
  },

  getById: async (id: string): Promise<PurchaseOrder | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPOs.find(p => p.id === id);
  },

  create: async (data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt' | 'updatedAt'>): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const now = new Date().toISOString();
    const newPO: PurchaseOrder = {
      ...data,
      id: `PORD-${String(nextId++).padStart(4, '0')}`,
      poNumber: generatePoNumber(),
      createdAt: now,
      updatedAt: now,
    };
    mockPOs = [newPO, ...mockPOs];
    return newPO;
  },

  update: async (id: string, data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockPOs.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Purchase Order not found');
    const existing = mockPOs[index];
    const updated: PurchaseOrder = {
      ...existing,
      ...data,
      id,
      poNumber: existing.poNumber,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    mockPOs[index] = updated;
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockPOs = mockPOs.filter(p => p.id !== id);
  },
};
