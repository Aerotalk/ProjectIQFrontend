import { Search, Filter, Plus, Download, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import CustomSelect from '@/components/ui/CustomSelect';
import TicketDrawer from './components/TicketDrawer';
import { TicketService, type TicketFormValues } from '../../services/ticket.service';
import toast from 'react-hot-toast';

export default function TicketList() {
  const [tickets, setTickets] = useState<TicketFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Click outside to close action menu
  if (typeof window !== 'undefined') {
    window.onclick = (e: any) => {
      if (!e.target.closest('.action-menu-btn') && !e.target.closest('.action-menu-dropdown')) {
        setOpenActionId(null);
      }
    };
  }

  // Fetch tickets from backend
  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const companyId = localStorage.getItem('selectedCompanyId');
      if (companyId) {
        const data = await TicketService.getAll(companyId);
        setTickets(data);
      }
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const handleStorageChange = () => fetchTickets();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const markAsClosed = async (id: string) => {
    try {
      await TicketService.update(id, { state: 'Closed' } as any); // Minimal update
      setTickets(tickets.map(t => t.id === id ? { ...t, state: 'Closed' } : t));
      toast.success('Ticket marked as closed');
    } catch (err) {
      toast.error('Failed to close ticket');
    }
  };

  const reopenTicket = async (id: string) => {
    try {
      await TicketService.update(id, { state: 'Open' } as any);
      setTickets(tickets.map(t => t.id === id ? { ...t, state: 'Open' } : t));
      toast.success('Ticket reopened');
    } catch (err) {
      toast.error('Failed to reopen ticket');
    }
  };

  const handleCreate = () => {
    setDrawerMode('create');
    setSelectedTicket(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (ticket: any) => {
    setDrawerMode('edit');
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
  };

  const handleView = (ticket: any) => {
    setDrawerMode('view');
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
  };

  const handleSaveTicket = async (data: TicketFormValues) => {
    try {
      const companyId = localStorage.getItem('selectedCompanyId') || '';
      
      if (drawerMode === 'create') {
        const newTicket = await TicketService.create(companyId, data);
        setTickets([newTicket, ...tickets]);
        toast.success('Ticket created successfully');
      } else {
        const updated = await TicketService.update(selectedTicket.id, data);
        setTickets(tickets.map(t => t.id === selectedTicket.id ? updated : t));
        toast.success('Ticket updated successfully');
      }
      setIsDrawerOpen(false);
    } catch (err) {
      toast.error('Failed to save ticket');
    }
  };

  const filteredTickets = tickets.filter(t => {
    const searchTarget = (t.shortDescription || '') + (t.id || '') + (t.customerCompany || '');
    const matchesSearch = searchTarget.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || t.state === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    const headers = ['Ticket ID', 'Short Description', 'Client', 'Priority', 'State', 'Assigned To', 'Updated At'];
    const csvContent = [
      headers.join(','),
      ...filteredTickets.map(t => `"${t.id}","${t.shortDescription}","${t.customerCompany}","${t.priority}","${t.state}","${t.assignedTo}","${t.updatedAt}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'incidents_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Tickets exported successfully');
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Tickets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track all customer support tickets.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-56 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white" 
            />
          </div>
          <div className="relative shrink-0 w-40">
            <CustomSelect
              value={filterStatus}
              onChange={setFilterStatus}
              icon={<Filter size={16} />}
              options={[
                { label: 'All States', value: 'All' },
                { label: 'Open', value: 'Open' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Closed', value: 'Closed' }
              ]}
            />
          </div>
          <button onClick={handleExport} className="shrink-0 px-3 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={handleCreate}
            className="shrink-0 px-3 py-2 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Create Incident
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#792359]"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:text-gray-700">Ticket ID</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Short Description</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:text-gray-700">Client</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:text-gray-700">Priority</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:text-gray-700">State</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Assigned To</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:text-gray-700">Updated At</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td onClick={() => handleView(t)} className="px-6 py-4 font-medium text-[#792359] dark:text-[#e6a8d0] cursor-pointer hover:underline">{t.ticketNo || t.id?.substring(0,8)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{t.shortDescription || 'No description'}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{t.customerCompany || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                      t.priority === 'Critical' ? 'text-red-700 bg-red-50 dark:bg-red-500/10' :
                      t.priority === 'High' ? 'text-orange-700 bg-orange-50 dark:bg-orange-500/10' :
                      t.priority === 'Medium' ? 'text-yellow-700 bg-yellow-50 dark:bg-yellow-500/10' :
                      'text-green-700 bg-green-50 dark:bg-green-500/10'
                    }`}>
                      {t.priority || 'Low'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                      t.state === 'Open' ? 'text-blue-700 bg-blue-50 dark:bg-blue-500/10' :
                      t.state === 'In Progress' ? 'text-purple-700 bg-purple-50 dark:bg-purple-500/10' :
                      'text-green-700 bg-green-50 dark:bg-green-500/10'
                    }`}>
                      {t.state || 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                      {t.assignedTo ? t.assignedTo.split(' ').map((n: string) => n[0]).join('') : 'U'}
                    </div>
                    {t.assignedTo || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'Just now'}</td>
                  <td className="px-6 py-4 text-center relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (t.id) setOpenActionId(openActionId === t.id ? null : t.id); }}
                      className="action-menu-btn text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/10 rounded-sm transition-colors p-1"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openActionId === t.id && (
                      <div className="action-menu-dropdown absolute right-12 top-10 w-40 bg-white dark:bg-[#1f2229] border border-gray-100 dark:border-white/10 shadow-xl py-1 z-50 rounded-sm">
                        <button onClick={(e) => { e.stopPropagation(); handleView(t); setOpenActionId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#792359] dark:text-[#e6a8d0] font-medium hover:bg-gray-50 dark:hover:bg-white/5">
                          View Details
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(t); setOpenActionId(null); }} className="w-full text-left px-4 py-2 text-sm text-[#792359] dark:text-[#e6a8d0] font-medium hover:bg-gray-50 dark:hover:bg-white/5">
                          Edit Ticket
                        </button>
                        {t.state !== 'Closed' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); if (t.id) markAsClosed(t.id); setOpenActionId(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-[#792359] dark:text-[#e6a8d0] font-medium hover:bg-gray-50 dark:hover:bg-white/5"
                          >
                            Mark as Closed
                          </button>
                        )}
                        {t.state === 'Closed' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); if (t.id) reopenTicket(t.id); setOpenActionId(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-[#792359] dark:text-[#e6a8d0] font-medium hover:bg-gray-50 dark:hover:bg-white/5"
                          >
                            Reopen Incident
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTickets.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No tickets found matching your search.
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-sm text-gray-500">
          <span>Showing 1 to {filteredTickets.length} of {filteredTickets.length} tickets</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md bg-[#792359] text-white font-medium">1</button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5">2</button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5">3</button>
            <span className="px-2 py-1">...</span>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5">10</button>
          </div>
        </div>
      </div>
      )}

      <TicketDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveTicket}
        mode={drawerMode}
        initialData={selectedTicket}
      />
    </div>
  );
}
