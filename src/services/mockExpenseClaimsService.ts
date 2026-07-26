import type {
  ExpenseCategoryConfig,
  ExpenseTemplate,
  ExpenseClaim,
  ExpenseItem,
  ExpenseAdvance,
  ClaimBatch,
  AuditLog
} from '../types/expense-claims.types';

// Utility for fake delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

class MockExpenseClaimsService {
  private categories: ExpenseCategoryConfig[] = [
    { id: 'cat1', category: 'Travel', glCode: 'GL-TRV-100', receiptRequired: true, minReceiptAmount: 10, active: true },
    { id: 'cat2', category: 'Meals', glCode: 'GL-MEA-200', receiptRequired: true, minReceiptAmount: 15, active: true },
    { id: 'cat3', category: 'Office Supplies', glCode: 'GL-OFF-300', receiptRequired: false, minReceiptAmount: 50, active: true },
  ];
  private templates: ExpenseTemplate[] = [
    { id: 'tpl1', templateName: 'Standard Travel', description: 'For standard travel expenses', allowedCategories: ['cat1', 'cat2'], active: true }
  ];
  private claims: ExpenseClaim[] = [
    {
      id: 'clm1',
      claimNo: 'CLM-1001',
      employeeId: 'EMP-001',
      departmentId: 'dept1',
      templateId: 'tpl1',
      title: 'April Client Visit',
      totalClaimed: 250.50,
      approvedAmount: 0,
      status: 'Submitted',
      currentReviewerId: 'REV-001',
      submittedOn: new Date().toISOString(),
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  private items: ExpenseItem[] = [
    {
      id: 'item1',
      claimId: 'clm1',
      expenseDate: new Date().toISOString(),
      categoryId: 'cat1',
      merchantName: 'Delta Airlines',
      claimAmount: 200,
      description: 'Flight ticket',
      taxAmount: 20,
      currency: 'USD'
    },
    {
      id: 'item2',
      claimId: 'clm1',
      expenseDate: new Date().toISOString(),
      categoryId: 'cat2',
      merchantName: 'Starbucks',
      claimAmount: 50.50,
      description: 'Coffee for team',
      taxAmount: 5,
      currency: 'USD'
    }
  ];
  private advances: ExpenseAdvance[] = [];
  private batches: ClaimBatch[] = [];
  private auditLogs: AuditLog[] = [];

  // CATEGORIES
  async getCategories() { await delay(); return [...this.categories]; }
  async createCategory(data: Partial<ExpenseCategoryConfig>) {
    await delay();
    const newDoc = { ...data, id: `cat${Date.now()}` } as ExpenseCategoryConfig;
    this.categories.push(newDoc);
    return newDoc;
  }
  async updateCategory(id: string, data: Partial<ExpenseCategoryConfig>) {
    await delay();
    const idx = this.categories.findIndex(x => x.id === id);
    if (idx !== -1) {
      this.categories[idx] = { ...this.categories[idx], ...data };
      return this.categories[idx];
    }
    throw new Error('Not found');
  }
  async deleteCategory(id: string) {
    await delay();
    this.categories = this.categories.filter(x => x.id !== id);
  }

  // TEMPLATES
  async getTemplates() { await delay(); return [...this.templates]; }
  async createTemplate(data: Partial<ExpenseTemplate>) {
    await delay();
    const newDoc = { ...data, id: `tpl${Date.now()}` } as ExpenseTemplate;
    this.templates.push(newDoc);
    return newDoc;
  }
  async updateTemplate(id: string, data: Partial<ExpenseTemplate>) {
    await delay();
    const idx = this.templates.findIndex(x => x.id === id);
    if (idx !== -1) {
      this.templates[idx] = { ...this.templates[idx], ...data };
      return this.templates[idx];
    }
    throw new Error('Not found');
  }

  // CLAIMS
  async getClaims() { await delay(); return [...this.claims]; }
  async getClaimById(id: string) {
    await delay();
    return this.claims.find(x => x.id === id);
  }
  async createClaim(data: Partial<ExpenseClaim>) {
    await delay();
    const newDoc = { 
      ...data, 
      id: `clm${Date.now()}`, 
      claimNo: `CLM-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as ExpenseClaim;
    this.claims.push(newDoc);
    return newDoc;
  }
  async updateClaim(id: string, data: Partial<ExpenseClaim>) {
    await delay();
    const idx = this.claims.findIndex(x => x.id === id);
    if (idx !== -1) {
      this.claims[idx] = { ...this.claims[idx], ...data, updatedAt: new Date().toISOString() };
      return this.claims[idx];
    }
    throw new Error('Not found');
  }
  async deleteClaim(id: string) {
    await delay();
    this.claims = this.claims.filter(x => x.id !== id);
    this.items = this.items.filter(x => x.claimId !== id);
  }
  async getClaimItems(claimId: string) {
    await delay();
    return this.items.filter(x => x.claimId === claimId);
  }
  async saveClaimItem(data: Partial<ExpenseItem>) {
    await delay();
    if (data.id) {
      const idx = this.items.findIndex(x => x.id === data.id);
      if (idx !== -1) {
        this.items[idx] = { ...this.items[idx], ...data } as ExpenseItem;
        this.recalculateClaimTotal(data.claimId!);
        return this.items[idx];
      }
    }
    const newDoc = { ...data, id: `item${Date.now()}` } as ExpenseItem;
    this.items.push(newDoc);
    this.recalculateClaimTotal(newDoc.claimId);
    return newDoc;
  }
  private recalculateClaimTotal(claimId: string) {
    const total = this.items.filter(x => x.claimId === claimId).reduce((sum, item) => sum + item.claimAmount, 0);
    const claimIdx = this.claims.findIndex(x => x.id === claimId);
    if (claimIdx !== -1) {
      this.claims[claimIdx].totalClaimed = total;
    }
  }

  // ADVANCES
  async getAdvances() { await delay(); return [...this.advances]; }
  async createAdvance(data: Partial<ExpenseAdvance>) {
    await delay();
    const newDoc = {
      ...data,
      id: `adv${Date.now()}`,
      advanceNo: `ADV-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as ExpenseAdvance;
    this.advances.push(newDoc);
    return newDoc;
  }

  // ACTIONS
  async approveClaim(id: string, amount: number, reviewerId: string, comment?: string) {
    await delay();
    const claim = this.claims.find(x => x.id === id);
    if (claim) {
      claim.status = 'Approved';
      claim.approvedAmount = amount;
      claim.updatedAt = new Date().toISOString();
      this.auditLogs.push({
        id: `log${Date.now()}`,
        entityType: 'Claim',
        entityId: id,
        status: 'Approved',
        reviewerId,
        action: 'Approve',
        comment,
        date: new Date().toISOString()
      });
      return claim;
    }
    throw new Error('Claim not found');
  }
  async rejectClaim(id: string, reviewerId: string, comment: string) {
    await delay();
    const claim = this.claims.find(x => x.id === id);
    if (claim) {
      claim.status = 'Rejected';
      claim.updatedAt = new Date().toISOString();
      this.auditLogs.push({
        id: `log${Date.now()}`,
        entityType: 'Claim',
        entityId: id,
        status: 'Rejected',
        reviewerId,
        action: 'Reject',
        comment,
        date: new Date().toISOString()
      });
      return claim;
    }
    throw new Error('Claim not found');
  }

  // BATCHES
  async getBatches() { await delay(); return [...this.batches]; }
  async createBatch(data: Partial<ClaimBatch>) {
    await delay();
    const newDoc = {
      ...data,
      id: `bat${Date.now()}`,
      batchNo: `BAT-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString()
    } as ClaimBatch;
    this.batches.push(newDoc);
    return newDoc;
  }

  async getAuditLogs(entityType: 'Claim'|'Advance'|'Batch', entityId: string) {
    await delay();
    return this.auditLogs.filter(x => x.entityType === entityType && x.entityId === entityId);
  }
}

export const mockExpenseClaimsService = new MockExpenseClaimsService();
