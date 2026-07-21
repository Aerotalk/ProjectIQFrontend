import { useState, useEffect } from 'react';
import { X, Edit, FolderKanban } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useVendors } from '../../../hooks/useVendors';
import { api } from '../../../lib/api';
import { POService } from '../../../services/po.service';
import { QuotationService } from '../../../services/quotation.service';
import { ExpenseService } from '../../../services/expense.service';
import { TicketService } from '../../../services/ticket.service';
import type { Project } from '../../../types/project.types';

interface Props {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
}

export default function ProjectProfileView({ project, onClose, onEdit }: Props) {
  const { selectedCompanyId } = useAuth();
  const { vendors } = useVendors({ companyId: selectedCompanyId || null });
  const [users, setUsers] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [pos, setPos] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: any = await api.get('/admin/users');
        const data = Array.isArray(response) ? response : (response.content || []);
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };
    const fetchRelations = async () => {
      if (!selectedCompanyId) return;
      try {
        const [allPos, allQuotations, allExpenses, allTickets] = await Promise.all([
          POService.getAll(selectedCompanyId).catch(() => []),
          QuotationService.getQuotations(selectedCompanyId).catch(() => []),
          ExpenseService.getAll(selectedCompanyId).catch(() => []),
          TicketService.getAll(selectedCompanyId).catch(() => [])
        ]);
        setPos(allPos);
        setQuotations(allQuotations);
        setExpenses(allExpenses);
        setIncidents(allTickets.filter((t: any) => t.type?.toLowerCase() === 'incident' || !t.type));
      } catch (err) {
        console.error('Failed to load relations', err);
      }
    };
    
    fetchUsers();
    fetchRelations();
  }, [selectedCompanyId]);

  const assignedVendorNames = project.assignedVendors?.map(id => vendors.find(v => v.id === id)?.displayName || id) || [];
  const assignedEntityNames = project.assignedEntities?.map(id => {
    const u = users.find(u => u.id === id);
    return u ? `${u.firstName} ${u.lastName}` : id;
  }) || [];
  const linkedIncidentNames = project.linkedIncidents?.map(id => incidents.find(i => i.id === id)?.ticketNumber || incidents.find(i => i.id === id)?.subject || id) || [];
  const linkedQuotationNames = project.linkedQuotations?.map(id => quotations.find(q => q.id === id)?.quotationNo || id) || [];
  const linkedPONames = project.linkedPOs?.map(id => pos.find(p => p.id === id)?.poNumber || 'Draft PO') || [];
  const linkedExpenseNames = project.linkedExpenses?.map(id => {
    const ex = expenses.find(e => e.id === id);
    return ex ? `${ex.description} (₹${ex.amount})` : id;
  }) || [];

  const manager = users.find(u => u.id === project.projectManager);
  const managerName = manager ? `${manager.firstName} ${manager.lastName}` : project.projectManager;

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] flex items-center justify-center rounded-sm border border-[#792359]/10 dark:border-[#e6a8d0]/10 text-3xl font-bold">
            <FolderKanban size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {project.projectName || 'Unnamed Project'}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-white border border-gray-200 text-gray-800 dark:bg-transparent dark:text-gray-300 dark:border-white/20 shadow-sm">
                {project.projectCode}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium border shadow-sm ${
                 project.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
                 project.status === 'In Progress' || project.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
              }`}>
                {project.status || 'Draft'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 dark:bg-transparent dark:border-white/20 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm"
          >
            <Edit size={16} className="text-[#792359] dark:text-[#e6a8d0]" /> Edit Project
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
            
            {/* Left Column */}
            <div className="space-y-12">
              {/* Project Details */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 border-b border-gray-200 dark:border-white/10 pb-3">
                  Project Details
                </h3>
                <div className="grid grid-cols-[1fr_2fr] gap-y-5 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Client</div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">{project.client || '-'}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Project Manager</div>
                  <div className="text-gray-900 dark:text-gray-100">{managerName || '-'}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Start Date</div>
                  <div className="text-gray-900 dark:text-gray-100">{project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Expected End Date</div>
                  <div className="text-gray-900 dark:text-gray-100">{project.expectedEndDate ? new Date(project.expectedEndDate).toLocaleDateString() : '-'}</div>

                  <div className="text-gray-500 dark:text-gray-400">Linked Quotation</div>
                  <div className="text-gray-900 dark:text-gray-100">{project.linkedQuotation || '-'}</div>
                </div>
              </div>

              {/* Description */}
              {project.description && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 border-b border-gray-200 dark:border-white/10 pb-3">
                    Description
                  </h3>
                  <div className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-sm border border-gray-200 dark:border-white/10 whitespace-pre-wrap">
                    {project.description}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Assignments */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 border-b border-gray-200 dark:border-white/10 pb-3">
                  Assignments
                </h3>
                <div className="grid grid-cols-[1fr_2fr] gap-y-5 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Vendors</div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {assignedVendorNames.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {assignedVendorNames.map((name, i) => <li key={i}>{name}</li>)}
                      </ul>
                    ) : '-'}
                  </div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Entities (Employees)</div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {assignedEntityNames.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {assignedEntityNames.map((name, i) => <li key={i}>{name}</li>)}
                      </ul>
                    ) : '-'}
                  </div>
                </div>
              </div>

              {/* Linked Items */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 border-b border-gray-200 dark:border-white/10 pb-3">
                  Linked Items
                </h3>
                <div className="grid grid-cols-[1fr_2fr] gap-y-5 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Incidents</div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {linkedIncidentNames.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {linkedIncidentNames.map((name, i) => <li key={i}>{name}</li>)}
                      </ul>
                    ) : '-'}
                  </div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Quotations</div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {linkedQuotationNames.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {linkedQuotationNames.map((name, i) => <li key={i}>{name}</li>)}
                      </ul>
                    ) : '-'}
                  </div>

                  <div className="text-gray-500 dark:text-gray-400">Purchase Orders</div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {linkedPONames.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {linkedPONames.map((name, i) => <li key={i}>{name}</li>)}
                      </ul>
                    ) : '-'}
                  </div>

                  <div className="text-gray-500 dark:text-gray-400">Expenses</div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {linkedExpenseNames.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {linkedExpenseNames.map((name, i) => <li key={i}>{name}</li>)}
                      </ul>
                    ) : '-'}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
