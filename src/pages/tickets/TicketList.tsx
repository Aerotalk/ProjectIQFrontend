import { Search, Filter, Plus, Download, ChevronRight, Calendar, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '@/components/ui/CustomSelect';
import { TicketService, type TicketFormValues } from '../../services/ticket.service';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../hooks/useProjects';

export default function TicketList() {
  const navigate = useNavigate();
  const { selectedCompanyId: companyId } = useAuth();
  const { projects } = useProjects();
  const [tickets, setTickets] = useState<TicketFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      if (companyId) {
        const data = await TicketService.getAll(companyId);
        // Sort descending by ID or creation time
        const sortedData = data.sort((a, b) => (b.ticketNo || b.id || '').localeCompare(a.ticketNo || a.id || ''));
        setTickets(sortedData);
      }
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [companyId]);

  const filteredTickets = tickets.filter(t => {
    const searchTarget = (t.shortDescription || '') + (t.ticketNo || t.id || '') + (t.customerCompany || '');
    const matchesSearch = searchTarget.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || t.state === filterStatus;
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleExport = () => {
    const headers = ['Incident Number', 'Subject', 'Client', 'Priority', 'Status', 'Assigned To', 'Updated At'];
    const csvContent = [
      headers.join(','),
      ...filteredTickets.map(t => `"${t.ticketNo || 'Unknown Ticket'}","${t.shortDescription}","${t.customerCompany}","${t.priority}","${t.state}","${t.assignedTo}","${t.updatedAt}"`)
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
    toast.success('Incidents exported successfully');
  };

  const getStatusBadge = (status?: string | null) => {
    switch (status) {
      case 'New':
        return <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-sm text-blue-700 bg-blue-50 border border-blue-200">New</span>;
      case 'Assigned':
        return <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-sm text-indigo-700 bg-indigo-50 border border-indigo-200">Assigned</span>;
      case 'In Progress':
        return <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-sm text-purple-700 bg-purple-50 border border-purple-200">In Progress</span>;
      case 'Waiting for Client':
        return <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-sm text-yellow-700 bg-yellow-50 border border-yellow-200">Waiting for Client</span>;
      case 'Resolved':
        return <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-sm text-emerald-700 bg-emerald-50 border border-emerald-200">Resolved</span>;
      case 'Closed':
        return <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-sm text-gray-700 bg-gray-100 border border-gray-300">Closed</span>;
      case 'Cancelled':
        return <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-sm text-red-700 bg-red-50 border border-red-200">Cancelled</span>;
      default:
        return <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-sm text-gray-700 bg-gray-50 border border-gray-200">{status || 'Unknown'}</span>;
    }
  };

  const getPriorityBadge = (priority?: string | null) => {
    switch (priority?.toUpperCase()) {
      case 'P1':
      case 'CRITICAL':
      case '1 - HIGH': 
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">P1</span>;
      case 'P2':
      case 'HIGH':
      case '2 - MEDIUM': 
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400">P2</span>;
      case 'P3':
      case 'MEDIUM': 
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400">P3</span>;
      case 'P4':
      case 'LOW':
      case '3 - LOW': 
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400">P4</span>;
      default: 
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400">{priority || 'N/A'}</span>;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 mb-1">
            <span>Support</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">All Tickets</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Incidents</h1>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button 
            onClick={handleExport} 
            className="shrink-0 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-sm text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download size={14} /> Export
          </button>
          <button 
            onClick={() => navigate('create')}
            className="shrink-0 px-4 py-2 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={14} /> New Incident
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col sm:flex-row items-center gap-4 p-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input 
            type="text" 
            placeholder="Search incident number, subject, or client..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#792359] focus:bg-white text-gray-900 transition-colors" 
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-44">
            <CustomSelect
              value={filterPriority}
              onChange={setFilterPriority}
              options={[
                { label: 'All Priorities', value: 'All' },
                { label: 'P1 - Critical', value: 'P1' },
                { label: 'P2 - High', value: 'P2' },
                { label: 'P3 - Medium', value: 'P3' },
                { label: 'P4 - Low', value: 'P4' }
              ]}
            />
          </div>
          <div className="w-48">
            <CustomSelect
              value={filterStatus}
              onChange={setFilterStatus}
              icon={<Filter size={14} />}
              options={[
                { label: 'All Statuses', value: 'All' },
                { label: 'New', value: 'New' },
                { label: 'Assigned', value: 'Assigned' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Waiting for Client', value: 'Waiting for Client' },
                { label: 'Resolved', value: 'Resolved' },
                { label: 'Closed', value: 'Closed' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#792359]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8F9FC] border-b border-gray-200 text-gray-600 font-semibold text-[12px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 cursor-pointer hover:text-gray-900">Incident Number</th>
                  <th className="px-6 py-3 cursor-pointer hover:text-gray-900">Subject</th>
                  <th className="px-6 py-3 cursor-pointer hover:text-gray-900">Project / Client</th>
                  <th className="px-6 py-3 cursor-pointer hover:text-gray-900">Priority</th>
                  <th className="px-6 py-3 cursor-pointer hover:text-gray-900">Status</th>
                  <th className="px-6 py-3 cursor-pointer hover:text-gray-900">Assigned To</th>
                  <th className="px-6 py-3 cursor-pointer hover:text-gray-900">Updated</th>
                  <th className="px-6 py-3 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-gray-500">
                      No incidents found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr 
                      key={t.ticketNo || 'Unknown Ticket'} 
                      onClick={() => navigate(t.id || '')}
                      className="hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-3.5 text-sm font-semibold text-[#792359] dark:text-[#c43890] group-hover:underline">
                        {t.ticketNo || t.id?.substring(0,10).toUpperCase()}
                      </td>
                      <td className="px-6 py-3.5 text-gray-900 font-medium truncate max-w-[200px]">
                        {t.shortDescription || 'No description provided'}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="text-gray-900 font-medium truncate max-w-[150px]">
                          {t.projectId 
                            ? (projects.find(p => p.id === t.projectId)?.projectName || t.projectId.substring(0, 8))
                            : 'Unknown Project'}
                        </div>
                        <div className="text-gray-500 text-[11px] mt-0.5 truncate max-w-[150px]">{t.customerCompany || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-3.5">
                        {getPriorityBadge(t.priority)}
                      </td>
                      <td className="px-6 py-3.5">
                        {getStatusBadge(t.state)}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                            {t.assignedTo ? t.assignedTo.substring(0, 1).toUpperCase() : <UserIcon size={12} />}
                          </div>
                          <span className="text-gray-600 text-[13px]">{t.assignedTo || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 text-[13px] flex items-center gap-1.5 mt-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'Just now'}
                      </td>
                      <td className="px-6 py-3.5 text-right text-gray-400 group-hover:text-[#792359]">
                        <ChevronRight size={16} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-[#F8F9FC] flex items-center justify-between text-[13px] text-gray-600">
          <span>Showing {filteredTickets.length > 0 ? 1 : 0} to {filteredTickets.length} of {filteredTickets.length} incidents</span>
          <div className="flex gap-1">
            <button className="px-2.5 py-1 rounded-sm bg-[#792359] text-white font-medium shadow-sm">1</button>
          </div>
        </div>
      </div>
    </div>
  );
}
