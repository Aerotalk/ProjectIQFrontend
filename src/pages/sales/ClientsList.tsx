import { useState, useEffect } from 'react';
import { Search, MoreVertical, Plus, ChevronLeft, ChevronRight, Eye, Edit, Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useClients } from '../../hooks/useClients';
import { api } from '../../lib/api';
import type { Client } from '../../types/client.types';
import ClientDrawer from './clients/components/ClientDrawer';
import ClientProfileView from './clients/components/ClientProfileView';
import type { ClientFormValues } from './clients/validators/clientValidation';
import { Input } from '@/components/ui/input';

export default function ClientsList() {
  const { user } = useAuth();
  const isCompanyScopedUser = !!user?.companyId;

  const [companies, setCompanies] = useState<any[]>([]);
  const [localCompanyId, setLocalCompanyId] = useState<string>(user?.companyId || '');

  useEffect(() => {
    if (user?.companyId && !localCompanyId) {
      setLocalCompanyId(user.companyId);
    }
  }, [user?.companyId, localCompanyId]);

  const { clients, isListLoading: isLoading, isSaveLoading, createClient, updateClient, archiveClient } = useClients({ companyId: localCompanyId });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    if (!isCompanyScopedUser) {
      api.get('/org/companies')
        .then((res: any[]) => {
          setCompanies(res);
          if (res.length > 0 && !localCompanyId) {
            setLocalCompanyId(res[0].id);
          }
        })
        .catch(console.error);
    }
  }, [isCompanyScopedUser]);

  const handleSaveClient = async (data: ClientFormValues) => {
    try {
      if (drawerMode === 'create') {
        await createClient(data as unknown as Omit<Client, 'id' | 'clientNo'>);
        toast.success('Client added successfully');
      } else if (drawerMode === 'edit' && selectedClient) {
        await updateClient(selectedClient.id, data as unknown as Partial<Client>);
        toast.success('Client updated successfully');
      }
      setIsDrawerOpen(false);
    } catch (err: any) {
      // Pass the error to the drawer to map validation errors
      throw err;
    }
  };

  const handleArchiveClient = async (client: Client) => {
    if (window.confirm(`Are you sure you want to archive client ${client.displayName}?`)) {
      await archiveClient(client);
    }
    setOpenDropdownId(null);
  };

  const handleOpenDrawer = (mode: 'create' | 'edit' | 'view', client?: Client) => {
    setDrawerMode(mode);
    setSelectedClient(client || null);
    setIsDrawerOpen(true);
    setOpenDropdownId(null);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredClients = clients.filter(c => 
    c.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  if (isDrawerOpen) {
    return (
      <div className="max-w-[1400px] mx-auto">
        {drawerMode === 'view' ? (
          <ClientProfileView 
            client={selectedClient!} 
            onClose={() => setIsDrawerOpen(false)}
            onEdit={() => setDrawerMode('edit')}
          />
        ) : (
          <ClientDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)}
            mode={drawerMode}
            initialData={selectedClient as Partial<ClientFormValues>}
            clientId={selectedClient?.clientNo || selectedClient?.id}
            onSave={handleSaveClient}
            isSubmitting={isSaveLoading}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-1">
            <span>Sales</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-gray-200">Clients</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Clients</h1>
        </div>
        <button 
          onClick={() => handleOpenDrawer('create')}
          className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
        >
          <Plus size={16} />
          Add Client
        </button>
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row gap-4 items-center max-w-2xl">
            {!isCompanyScopedUser && (
              <select
                value={localCompanyId}
                onChange={(e) => setLocalCompanyId(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors"
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </select>
            )}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                type="text" 
                placeholder="Search clients..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Client ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Contact Person</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">GST Treatment</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">Loading clients...</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">No clients found.</td>
                </tr>
              ) : (
                currentItems.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">{client.clientNo || client.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#792359] dark:text-[#e6a8d0]">{client.displayName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{client.primaryContactPerson}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{client.billingCity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {client.gstTreatment === 'business_gst' ? 'Registered' : 
                       client.gstTreatment === 'business_none' ? 'Unregistered' : 
                       client.gstTreatment === 'consumer' ? 'Consumer' : 
                       client.gstTreatment === 'sez' ? 'SEZ' : 'Overseas'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium border
                        ${client.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                          : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-center ${openDropdownId === client.id ? 'relative z-50' : 'relative z-10'}`}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === client.id ? null : client.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors inline-flex"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdownId === client.id && (
                        <div className="absolute right-8 top-10 w-36 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-lg z-10 py-1 text-left">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDrawer('view', client);
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDrawer('edit', client);
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          {client.status !== 'Inactive' && (
                            <button 
                              onClick={() => handleArchiveClient(client)}
                              className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                            >
                              <Archive size={14} /> Archive
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredClients.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredClients.length)} of {filteredClients.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm font-medium transition-colors ${
                  currentPage === page 
                    ? 'bg-[#792359] text-white shadow-sm' 
                    : 'border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
