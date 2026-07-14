import type { Expense } from '../types/expense.types';

let mockExpenses: Expense[] = [
  {
    id: 'EXP-0001',
    projectId: 'PRJ-001',
    projectName: 'Analytics Dashboard',
    expenseDate: '2026-07-10',
    category: 'Travel',
    description: 'Flights and cab fare to client site for kickoff.',
    amount: 15400.50,
    paidBy: 'John Doe',
    isGstApplicable: true,
    gstAmount: 770.03,
    isInputCreditClaimable: true,
    receiptName: 'flights_invoice.pdf',
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-10T10:00:00Z',
  },
  {
    id: 'EXP-0002',
    projectId: 'PRJ-002',
    projectName: 'Mobile App Relaunch',
    expenseDate: '2026-07-12',
    category: 'Petty Cash',
    description: 'Office supplies for team brainstorming session.',
    amount: 1200.00,
    paidBy: 'Company Card',
    isGstApplicable: false,
    createdAt: '2026-07-12T14:30:00Z',
    updatedAt: '2026-07-12T14:30:00Z',
  },
  {
    id: 'EXP-0003',
    projectId: 'PRJ-003',
    projectName: 'ERP Integration',
    expenseDate: '2026-07-13',
    category: 'Communication',
    description: 'Monthly broadband bill for remote server site.',
    amount: 3500.00,
    paidBy: 'Company Card',
    isGstApplicable: true,
    gstAmount: 630.00,
    isInputCreditClaimable: true,
    receiptName: 'broadband_jul26.pdf',
    createdAt: '2026-07-13T09:15:00Z',
    updatedAt: '2026-07-13T09:15:00Z',
  }
];

let nextId = 4;

export const ExpenseService = {
  getAll: async (): Promise<Expense[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockExpenses];
  },

  getById: async (id: string): Promise<Expense | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockExpenses.find(e => e.id === id);
  },

  create: async (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const now = new Date().toISOString();
    const newExpense: Expense = {
      ...data,
      id: `EXP-${String(nextId++).padStart(4, '0')}`,
      createdAt: now,
      updatedAt: now,
    };
    mockExpenses = [newExpense, ...mockExpenses];
    return newExpense;
  },

  update: async (id: string, data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockExpenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    const existing = mockExpenses[index];
    const updated: Expense = {
      ...existing,
      ...data,
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    mockExpenses[index] = updated;
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockExpenses = mockExpenses.filter(e => e.id !== id);
  },
};
