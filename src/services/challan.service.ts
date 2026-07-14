import type { DeliveryChallan } from '../types/challan.types';

// Mock data initialization
let mockChallans: DeliveryChallan[] = [
  {
    id: 'DC-0001',
    challanNumber: 'CHAL/2026/001',
    projectId: 'PRJ-001',
    projectName: 'Analytics Dashboard',
    vendorId: 'VEND-0001',
    vendorName: 'CloudServe Pvt Ltd',
    challanDate: '2026-07-12',
    description: 'Delivery of preliminary cloud server documentation and architecture diagrams.',
    linkedVendorPoId: 'PORD-0001',
    linkedVendorPoNumber: 'VPO-2627-0001',
    remarks: 'Received in good condition.',
    createdAt: '2026-07-12T10:00:00Z',
    updatedAt: '2026-07-12T10:00:00Z',
  },
  {
    id: 'DC-0002',
    challanNumber: 'DC-2026-089',
    projectId: 'PRJ-002',
    projectName: 'Mobile App Relaunch',
    vendorId: 'VEND-0002',
    vendorName: 'SMSProvider Ltd',
    challanDate: '2026-07-13',
    description: 'First batch of 10,000 SMS credits provisioned.',
    linkedVendorPoId: 'PORD-0002',
    linkedVendorPoNumber: 'VPO-2627-0002',
    createdAt: '2026-07-13T14:30:00Z',
    updatedAt: '2026-07-13T14:30:00Z',
  },
  {
    id: 'DC-0003',
    challanNumber: 'INV-CHAL-443',
    projectId: 'PRJ-003',
    projectName: 'ERP Integration',
    vendorId: 'VEND-0001',
    vendorName: 'CloudServe Pvt Ltd',
    challanDate: '2026-07-14',
    description: 'Database licensing keys and installation media.',
    linkedVendorPoId: 'PORD-0003',
    linkedVendorPoNumber: 'VPO-2627-0003',
    attachmentName: 'delivery_proof_443.pdf',
    createdAt: '2026-07-14T09:15:00Z',
    updatedAt: '2026-07-14T09:15:00Z',
  }
];

let nextId = 4;

export const ChallanService = {
  getAll: async (): Promise<DeliveryChallan[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockChallans];
  },

  getById: async (id: string): Promise<DeliveryChallan | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockChallans.find(c => c.id === id);
  },

  create: async (data: Omit<DeliveryChallan, 'id' | 'createdAt' | 'updatedAt'>): Promise<DeliveryChallan> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const now = new Date().toISOString();
    const newChallan: DeliveryChallan = {
      ...data,
      id: `DC-${String(nextId++).padStart(4, '0')}`,
      createdAt: now,
      updatedAt: now,
    };
    mockChallans = [newChallan, ...mockChallans];
    return newChallan;
  },

  update: async (id: string, data: Omit<DeliveryChallan, 'id' | 'createdAt'>): Promise<DeliveryChallan> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockChallans.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Delivery Challan not found');
    const existing = mockChallans[index];
    const updated: DeliveryChallan = {
      ...existing,
      ...data,
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    mockChallans[index] = updated;
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockChallans = mockChallans.filter(c => c.id !== id);
  },
};
