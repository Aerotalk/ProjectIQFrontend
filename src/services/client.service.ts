import { api } from '../lib/api';
import type { Client } from '../types/client.types';
import { mapToClient, mapToClientDto } from './mappers/client.mapper';
import type { ClientDto } from './mappers/client.mapper';

export const ClientService = {
  getClients: async (companyId: string): Promise<Client[]> => {
    if (!companyId) return [];
    const response = await api.get(`/admin/sales/clients?companyId=${companyId}`);
    return (response as ClientDto[]).map(mapToClient);
  },

  getClient: async (id: string): Promise<Client> => {
    const response = await api.get(`/admin/sales/clients/${id}`);
    return mapToClient(response as ClientDto);
  },

  createClient: async (companyId: string, data: Omit<Client, 'id' | 'clientNo'>): Promise<Client> => {
    const dto = mapToClientDto(data);
    const response = await api.post(`/admin/sales/clients?companyId=${companyId}`, dto);
    return mapToClient(response as ClientDto);
  },

  updateClient: async (id: string, data: Partial<Client>): Promise<Client> => {
    const dto = mapToClientDto(data);
    const response = await api.put(`/admin/sales/clients/${id}`, dto);
    return mapToClient(response as ClientDto);
  },

  archiveClient: async (id: string, data: Partial<Client>): Promise<Client> => {
    // Backend doesn't support soft delete, so we use update to set status to 'Inactive'
    const dto = mapToClientDto({ ...data, status: 'Inactive' });
    const response = await api.put(`/admin/sales/clients/${id}`, dto);
    return mapToClient(response as ClientDto);
  },
  
  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/admin/sales/clients/${id}`);
  }
};
