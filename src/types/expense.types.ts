export type ExpenseCategory =
  | 'Travel'
  | 'Accommodation'
  | 'Petty Cash'
  | 'Material'
  | 'Labour (non-vendor)'
  | 'Communication'
  | 'Miscellaneous';

export interface Expense {
  id: string;                     // Auto-generated UUID from backend
  expenseNo?: string;             // Human-readable number e.g. EXP/2026/001
  projectId: string;              // Project linked to expense
  projectName?: string;           // Hydrated display name
  expenseDate: string;            // ISO date string
  category: ExpenseCategory;      // Selected category
  description: string;            // Detailed description of expense
  amount: number;                 // Total expense amount
  paidBy: string;                 // Company or Employee name
  receiptName?: string;           // Uploaded file name
  isGstApplicable: boolean;       // Toggle for GST
  gstAmount?: number;             // GST amount if applicable
  isInputCreditClaimable?: boolean; // Toggle for Input Credit

  createdAt?: string;
  updatedAt?: string;
}
