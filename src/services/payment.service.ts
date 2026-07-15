import type { PaymentRecord } from '../types/payment.types';
// Removed unused import

function getFinancialYearCode(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-based
  const fyStart = month >= 4 ? year : year - 1;
  const fyEnd = fyStart + 1;
  return `${String(fyStart).slice(2)}${String(fyEnd).slice(2)}`;
}

let mockPayments: PaymentRecord[] = [
  {
    id: 'PAY-001',
    paymentId: 'PAY-2627-0001',
    projectId: 'PRJ-001',
    projectName: 'Analytics Dashboard',
    paymentDate: '2026-07-10',
    amountPaid: 50000,
    paymentMethod: 'Bank Transfer',
    referenceId: 'TXN987654321',
    notes: 'Advance payment for project kick-off',
    status: 'Completed',
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-10T10:00:00Z'
  },
  {
    id: 'PAY-002',
    paymentId: 'PAY-2627-0002',
    projectId: 'PRJ-002',
    projectName: 'Mobile App Relaunch',
    paymentDate: '2026-07-12',
    amountPaid: 25000,
    paymentMethod: 'UPI',
    referenceId: 'UPI123456789',
    notes: 'Milestone 1 payment',
    status: 'Completed',
    createdAt: '2026-07-12T14:30:00Z',
    updatedAt: '2026-07-12T14:30:00Z'
  }
];

let nextId = 3;
let nextSeq = 3;

function generatePaymentId(): string {
  const fyCode = getFinancialYearCode();
  return `PAY-${fyCode}-${String(nextSeq++).padStart(4, '0')}`;
}

export const PaymentService = {
  getAll: async (): Promise<PaymentRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockPayments];
  },

  getById: async (id: string): Promise<PaymentRecord | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPayments.find(p => p.id === id);
  },

  create: async (data: Omit<PaymentRecord, 'id' | 'paymentId' | 'createdAt' | 'updatedAt'>): Promise<PaymentRecord> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const now = new Date().toISOString();
    const newPayment: PaymentRecord = {
      ...data,
      id: `PAY-${String(nextId++).padStart(3, '0')}`,
      paymentId: generatePaymentId(),
      createdAt: now,
      updatedAt: now,
    };
    mockPayments = [newPayment, ...mockPayments];
    return newPayment;
  },

  update: async (id: string, data: Omit<PaymentRecord, 'id' | 'paymentId' | 'createdAt'>): Promise<PaymentRecord> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockPayments.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Payment not found');
    const existing = mockPayments[index];
    const updated: PaymentRecord = {
      ...existing,
      ...data,
      id,
      paymentId: existing.paymentId,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    mockPayments[index] = updated;
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockPayments = mockPayments.filter(p => p.id !== id);
  },
};
