import type { Client } from '../types/client.types';
import { api } from '../lib/api';

const getCompanyId = () => localStorage.getItem('selectedCompanyId');

export const ClientService = {
  getClients: async (): Promise<Client[]> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.get(`/admin/sales/clients?companyId=${companyId}`);
  },

  createClient: async (data: Omit<Client, 'id'>): Promise<Client> => {
    const companyId = getCompanyId();
    if (!companyId) throw new Error('Company ID not found');
    return api.post(`/admin/sales/clients?companyId=${companyId}`, data);
  },

  updateClient: async (id: string, data: Omit<Client, 'id'>): Promise<Client> => {
    return api.put(`/admin/sales/clients/${id}`, data);
  },

  deleteClient: async (id: string): Promise<void> => {
    return api.delete(`/admin/sales/clients/${id}`);
  }
};
