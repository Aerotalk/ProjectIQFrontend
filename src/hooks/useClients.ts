import { useState, useCallback, useEffect } from 'react';
import { ClientService } from '../services/client.service';
import type { Client } from '../types/client.types';
import toast from 'react-hot-toast';

interface UseClientsOptions {
  companyId: string | null;
}

export const useClients = ({ companyId }: UseClientsOptions) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isArchiveLoading, setIsArchiveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!companyId) return;
    setIsListLoading(true);
    setError(null);
    try {
      const data = await ClientService.getClients(companyId);
      const sortedData = data.sort((a, b) => {
        const idA = a.clientNo || a.displayName || a.id;
        const idB = b.clientNo || b.displayName || b.id;
        // Descending order so newest is on top if it's clientNo
        return idB.localeCompare(idA);
      });
      setClients(sortedData);
    } catch (err: any) {
      const message = err?.message || 'Failed to fetch clients';
      setError(message);
      toast.error(message);
    } finally {
      setIsListLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (data: Omit<Client, 'id' | 'clientNo'>) => {
    if (!companyId) throw new Error('Company ID is missing');
    setIsSaveLoading(true);
    try {
      const newClient = await ClientService.createClient(companyId, data);
      // We could push to clients array, but a refresh ensures consistency if list is sorted/paginated by backend
      // Though frontend pagination is used here, refreshing fetches the latest. 
      // For immediate response, push to local state:
      setClients(prev => [newClient, ...prev]);
      return newClient;
    } finally {
      setIsSaveLoading(false);
    }
  };

  const updateClient = async (id: string, data: Partial<Client>) => {
    setIsSaveLoading(true);
    try {
      const updatedClient = await ClientService.updateClient(id, data);
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      return updatedClient;
    } finally {
      setIsSaveLoading(false);
    }
  };

  const archiveClient = async (client: Client) => {
    setIsArchiveLoading(true);
    try {
      const archivedClient = await ClientService.archiveClient(client.id, client);
      setClients(prev => prev.map(c => c.id === client.id ? archivedClient : c));
      toast.success('Client archived successfully');
      return archivedClient;
    } catch (err: any) {
      toast.error(err?.message || 'Failed to archive client');
      throw err;
    } finally {
      setIsArchiveLoading(false);
    }
  };

  return {
    clients,
    isListLoading,
    isSaveLoading,
    isArchiveLoading,
    error,
    fetchClients,
    createClient,
    updateClient,
    archiveClient
  };
};
