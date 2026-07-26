export type ClaimStatus = 'Draft' | 'Submitted' | 'Level 1 Approved' | 'Level 2 Approved' | 'Level 3 Approved' | 'Approved' | 'Rejected' | 'Sent Back' | 'Paid';
export type AdvanceStatus = 'Pending' | 'Approved' | 'Disbursed' | 'Settled' | 'Rejected';
export type BatchStatus = 'Draft' | 'Processed' | 'Paid';

export interface ExpenseCategoryConfig {
  id: string;
  category: string;
  glCode: string;
  receiptRequired: boolean;
  minReceiptAmount: number;
  active: boolean;
}

export interface ExpenseTemplate {
  id: string;
  templateName: string;
  description: string;
  allowedCategories: string[]; // array of category IDs
  active: boolean;
}

export interface ExpensePolicy {
  id: string;
  categoryId: string;
  grade: string;
  maxClaim: number;
  limitType: 'Monthly' | 'Yearly' | 'Claim';
  periodLimit?: number;
  backdatedDays: number;
}

export interface ReviewerAssignment {
  id: string;
  employeeId: string;
  templateId: string;
  reviewer1Id?: string;
  reviewer2Id?: string;
  reviewer3Id?: string;
  autoEscalationDays: number;
}

export interface ExpenseClaim {
  id: string;
  claimNo: string;
  employeeId: string;
  departmentId?: string;
  projectId?: string;
  templateId: string;
  title: string;
  totalClaimed: number;
  approvedAmount: number;
  status: ClaimStatus;
  currentReviewerId?: string;
  submittedOn?: string;
  outstandingAdvance?: number;
  currency: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseItem {
  id: string;
  claimId: string;
  receiptUrl?: string;
  expenseDate: string;
  categoryId: string;
  merchantName: string;
  claimAmount: number;
  description: string;
  projectId?: string;
  costCenter?: string;
  billNumber?: string;
  taxAmount: number;
  currency: string;
  ocrData?: any;
}

export interface Receipt {
  id: string;
  employeeId: string;
  merchantName: string;
  ocrStatus: 'Pending' | 'Success' | 'Failed';
  amount: number;
  confidence: number;
  uploadedDate: string;
  url: string;
}

export interface ExpenseAdvance {
  id: string;
  advanceNo: string;
  employeeId: string;
  tripOrProject: string;
  amount: number;
  currency: string;
  requestedDate: string;
  requiredDate: string;
  status: AdvanceStatus;
  disbursed: boolean;
  outstandingBalance: number;
  purpose: string;
  remarks?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdvanceSettlement {
  id: string;
  advanceId: string;
  claimId: string;
  settledAmount: number;
  date: string;
}

export interface ClaimBatch {
  id: string;
  batchNo: string;
  payrollPeriod: string;
  claimsCount: number;
  totalAmount: number;
  status: BatchStatus;
  createdBy: string;
  paidOn?: string;
  paymentMethod: string;
  remarks?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  entityType: 'Claim' | 'Advance' | 'Batch';
  entityId: string;
  status: string;
  reviewerId?: string;
  action: string;
  comment?: string;
  date: string;
}
