export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  projectId: string;
  projectName: string;
  poNumber: string;
  poDate: string;
  amount: number;
  remarks?: string;
  status: string;
  attachmentFileId?: string;
}

export interface Expense {
  id: string;
  projectId: string;
  projectName: string;
  expenseType: string;
  expenseDate: string;
  amount: number;
  remarks?: string;
  status: string;
  attachmentFileId?: string;
}

export interface Challan {
  id: string;
  vendorId: string;
  vendorName: string;
  projectId: string;
  projectName: string;
  challanNumber: string;
  challanDate: string;
  remarks?: string;
  status: string;
  attachmentFileId?: string;
}
