import { api } from '../lib/api';

export interface PurchaseOrder {
  id: string;
  vendorId?: string;
  vendorName?: string;
  projectId?: string;
  projectName?: string;
  poNumber: string;
  poDate: string;
  amount: number;
  remarks?: string;
  status?: string;
  attachmentFileId?: string;
}

export const PurchaseOrderService = {
  getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) throw new Error('No company selected');
    return api.get(`/admin/finance/purchase-orders?companyId=${companyId}`)

  },

  getPurchaseOrder: async (id: string): Promise<PurchaseOrder> => {
    return api.get(`/admin/finance/purchase-orders/${id}`)

  },

  createPurchaseOrder: async (data: Omit<PurchaseOrder, 'id' | 'vendorName' | 'projectName'>): Promise<PurchaseOrder> => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) throw new Error('No company selected');
    return api.post(`/admin/finance/purchase-orders?companyId=${companyId}`, data)

  },

  updatePurchaseOrder: async (id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
    return api.put(`/admin/finance/purchase-orders/${id}`, data)

  },

  deletePurchaseOrder: async (id: string): Promise<void> => {
    await api.delete(`/admin/finance/purchase-orders/${id}`);
  }
};
