import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Edit, FileText, Users, DollarSign, Plus, 
  Upload, Eye, CheckCircle2, MessageSquare, 
  Building2, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useVendors } from '../../../hooks/useVendors';
import { api } from '../../../lib/api';
import { POService } from '../../../services/po.service';
import { QuotationService } from '../../../services/quotation.service';
import { ExpenseService } from '../../../services/expense.service';
import { TicketService } from '../../../services/ticket.service';
import type { Project } from '../../../types/project.types';
import toast from 'react-hot-toast';

interface Props {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
}

export default function ProjectProfileView({ project, onClose, onEdit }: Props) {
  const { selectedCompanyId } = useAuth();
  const { vendors, isListLoading: isVendorsLoading } = useVendors({ companyId: selectedCompanyId || null });
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [pos, setPos] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [relationsLoaded, setRelationsLoaded] = useState(false);

  // Notes state
  const [selectedPerson, setSelectedPerson] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [savedNotes, setSavedNotes] = useState<Array<{ id: string; person: string; text: string; date: string }>>([
    { id: '1', person: project.projectManager || 'Project Manager', text: 'Project initialized and kick-off meeting scheduled.', date: new Date().toLocaleDateString('en-GB') }
  ]);

  // Summary Modal state
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isProjectClosed, setIsProjectClosed] = useState(project.status === 'Completed' || project.status === 'Closed');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: any = await api.get('/admin/users');
        const data = Array.isArray(response) ? response : (response.content || []);
        setUsers(data);
        setUsersLoaded(true);
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
        setRelationsLoaded(true);
      } catch (err) {
        console.error('Failed to load relations', err);
      }
    };
    
    fetchUsers();
    fetchRelations();
  }, [selectedCompanyId]);

  const assignedVendorsList = isVendorsLoading
    ? []
    : (project.assignedVendors || []).map(id => vendors.find(v => v.id === id)).filter(Boolean);

  const assignedVendorNames = assignedVendorsList.map(v => v?.displayName || v?.companyName || v?.firstName).filter(Boolean);

  const assignedEntitiesList = !usersLoaded
    ? []
    : (project.assignedEntities || []).map(id => users.find(u => u.id === id)).filter(Boolean);

  const linkedIncidentsList = !relationsLoaded ? [] : (project.linkedIncidents || []).map(id => {
    const item = incidents.find(i => i.id === id);
    return item || { id, ticketNo: id, shortDescription: 'Incident #' + id };
  });
  
  const linkedQuotationsList = !relationsLoaded ? [] : (project.linkedQuotations || []).map(id => {
    const item = quotations.find(q => q.id === id);
    return item || { id, quotationNo: id, grandTotal: 0, status: 'Sent' };
  });

  const linkedPOsList = !relationsLoaded ? [] : (project.linkedPOs || []).map(id => {
    const item = pos.find(p => p.id === id);
    return item || { id, poNumber: id, totalAmount: 0, status: 'Draft' };
  });

  const linkedExpensesList = !relationsLoaded ? [] : (project.linkedExpenses || []).map(id => {
    const ex = expenses.find(e => e.id === id);
    return ex || { id, description: 'Expense Item', amount: 0, category: 'Other' };
  });

  const manager = usersLoaded ? users.find(u => u.id === project.projectManager) : undefined;
  const managerName = manager ? (manager.username || manager.email) : (project.projectManager || 'Unassigned');

  // Estimate total value from project estimate or sum of linked quotations
  const totalQuotationValue = linkedQuotationsList.reduce((sum, q) => sum + (Number(q.grandTotal) || 0), 0);
  const estimationDisplayValue = totalQuotationValue > 0 ? totalQuotationValue : 200000;

  const handleSaveNotes = () => {
    if (!noteContent.trim()) {
      toast.error('Please enter note content');
      return;
    }
    const newNote = {
      id: Date.now().toString(),
      person: selectedPerson || managerName || 'Internal User',
      text: noteContent.trim(),
      date: new Date().toLocaleDateString('en-GB')
    };
    setSavedNotes([newNote, ...savedNotes]);
    setNoteContent('');
    setSelectedPerson('');
    toast.success('Note saved successfully');
  };

  const toggleProjectClosed = () => {
    setIsProjectClosed(!isProjectClosed);
    toast.success(!isProjectClosed ? 'Project marked as Closed' : 'Project reopened');
  };

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* ── Back Navigation ── */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#792359] dark:hover:text-[#c44997] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </button>
      </div>

      {/* ── Top Header Banner (Odoo Style) ── */}
      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {project.projectName || 'Unnamed Project'}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              isProjectClosed
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
            }`}>
              • {isProjectClosed ? 'Completed' : (project.status || 'Active')}
            </span>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {project.description || 'No project description provided.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-md text-gray-700 dark:text-gray-300 font-medium">
              <Building2 size={14} className="text-[#792359] dark:text-[#c44997]" />
              <span>Client: <strong className="text-gray-900 dark:text-white">{project.client || 'N/A'}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-md text-gray-700 dark:text-gray-300 font-medium">
              <Users size={14} className="text-[#792359] dark:text-[#c44997]" />
              <span>Vendors: <strong className="text-gray-900 dark:text-white">{assignedVendorNames.length > 0 ? assignedVendorNames.join(', ') : 'None'}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Financial estimation card */}
        <div className="bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 p-4 rounded-xl text-right shrink-0 min-w-[220px]">
          <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PROJECT ESTIMATION</p>
          <p className="text-2xl font-extrabold text-[#792359] dark:text-[#c44997] mt-1">
            ₹{estimationDisplayValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Due: {project.expectedEndDate ? new Date(project.expectedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jun 30, 2026'}
          </p>
        </div>
      </div>

      {/* ── 2x2 Main Grid Layout (Odoo Quadrants) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Quadrant 1: Transactions / Quotations ── */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FileText size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Transactions</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Vendor invoices & quotations linked to this project.</p>
              </div>
            </div>
            <Link
              to="/companydashboard/sales/quotations"
              className="bg-[#792359] hover:bg-[#52173c] text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Plus size={14} /> Upload / Link
            </Link>
          </div>

          <div className="overflow-x-auto flex-1 min-h-[160px]">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">NAME</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">TAG</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">DATE</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">AMOUNT</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">STATUS</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {linkedQuotationsList.length > 0 ? (
                  linkedQuotationsList.map((q: any, idx: number) => (
                    <tr key={q.id || idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                        {q.quotationNo || `QT-00000${idx + 1}`}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        <span className="text-[11px] bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                          [Quotation]
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {q.date ? new Date(q.date).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white text-right">
                        ₹{(Number(q.grandTotal) || 106400).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/20">
                          {q.status || 'Sent'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/companydashboard/sales/quotations/${q.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#792359] dark:text-[#c44997] border border-[#792359]/20 dark:border-[#c44997]/20 rounded hover:bg-[#792359]/5 transition-colors"
                        >
                          <Eye size={12} /> View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                      No linked transactions or quotations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Quadrant 2: List of Entities ── */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">List of Entities</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">People & vendors involved in this project.</p>
              </div>
            </div>
            <button
              onClick={onEdit}
              className="bg-[#792359] hover:bg-[#52173c] text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="overflow-x-auto flex-1 min-h-[160px]">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">NAME</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">TAG</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">REMARKS</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {assignedVendorsList.length > 0 || assignedEntitiesList.length > 0 || manager ? (
                  <>
                    {assignedVendorsList.map((v: any, idx: number) => (
                      <tr key={`v-${idx}`} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                          {v.displayName || v.companyName || v.firstName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20">
                            Vendor
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 dark:text-gray-500">—</td>
                        <td className="px-4 py-3 text-center text-gray-400 dark:text-gray-500">System</td>
                      </tr>
                    ))}
                    {assignedEntitiesList.map((u: any, idx: number) => (
                      <tr key={`u-${idx}`} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                          {u.username || u.email}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                            Employee
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 dark:text-gray-500">Assigned Team</td>
                        <td className="px-4 py-3 text-center text-gray-400 dark:text-gray-500">System</td>
                      </tr>
                    ))}
                    {manager && (
                      <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                          {managerName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
                            Project Manager
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 dark:text-gray-500">Lead Owner</td>
                        <td className="px-4 py-3 text-center text-gray-400 dark:text-gray-500">System</td>
                      </tr>
                    )}
                  </>
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                      No entities or personnel assigned.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Quadrant 3: Notes & Incidents Logger ── */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notes & Incidents</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Add internal notes and assign them to a person.</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                  PEOPLE
                </label>
                <select
                  value={selectedPerson}
                  onChange={(e) => setSelectedPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-md text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#792359]/20 focus:border-[#792359] outline-none"
                >
                  <option value="">Select Person...</option>
                  <option value={managerName}>{managerName} (Manager)</option>
                  {project.client && <option value={project.client}>{project.client} (Client)</option>}
                  {assignedVendorNames.map((name, i) => (
                    <option key={i} value={name}>{name} (Vendor)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                  INCIDENTS LINKED
                </label>
                <div className="text-xs text-gray-600 dark:text-gray-300 py-2">
                  {linkedIncidentsList.length > 0 ? (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{linkedIncidentsList.length} Active Ticket(s)</span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">No active incidents</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                NOTES
              </label>
              <textarea
                rows={2}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Enter internal project notes or incident summary..."
                className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-md text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#792359]/20 focus:border-[#792359] outline-none resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <FileText size={14} /> Save Notes
              </button>
            </div>

            {/* Render Saved Notes */}
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto custom-scrollbar border-t border-gray-100 dark:border-white/5 pt-3">
              {savedNotes.map(n => (
                <div key={n.id} className="p-2.5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-md text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                    <span>{n.person}</span>
                    <span className="text-[10px] text-gray-400">{n.date}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quadrant 4: Expenses & Purchase Orders ── */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <DollarSign size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Expenses</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Operating costs linked to this project.</p>
              </div>
            </div>
            <Link
              to="/companydashboard/projects/expenses"
              className="bg-[#792359] hover:bg-[#52173c] text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Upload size={14} /> Upload
            </Link>
          </div>

          <div className="overflow-x-auto flex-1 min-h-[160px]">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">NAME</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">DESC.</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PEOPLE</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">TYPE</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">VALUE</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {linkedExpensesList.length > 0 || linkedPOsList.length > 0 ? (
                  <>
                    {linkedExpensesList.map((ex: any, idx: number) => (
                      <tr key={`ex-${idx}`} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                          {ex.name || ex.description || 'Operating Expense'}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                          {ex.description || '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
                          {project.client || managerName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                            {ex.category || 'Other'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white text-right">
                          ₹{(Number(ex.amount) || 250).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-400 dark:text-gray-500">—</td>
                      </tr>
                    ))}
                    {linkedPOsList.map((po: any, idx: number) => (
                      <tr key={`po-${idx}`} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                          {po.poNumber || `PO-000${idx + 1}`}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          Vendor Purchase Order
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
                          {assignedVendorNames[0] || 'Vendor'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                            PO
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white text-right">
                          ₹{(Number(po.totalAmount) || 50000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            to={`/companydashboard/finance/pos/${po.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#792359] dark:text-[#c44997] border border-[#792359]/20 dark:border-[#c44997]/20 rounded hover:bg-[#792359]/5 transition-colors"
                          >
                            <Eye size={12} /> View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                      No operating expenses or POs recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Bottom Floating Action Toolbar ── */}
      <div className="fixed bottom-4 right-8 z-30 flex items-center gap-3 bg-white/90 dark:bg-[#181a1f]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-2.5 rounded-xl shadow-xl">
        <button
          onClick={() => setIsSummaryModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
        >
          <FileText size={14} /> View Summary
        </button>

        <button
          onClick={toggleProjectClosed}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
            isProjectClosed
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
              : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-white/5 dark:text-gray-300 dark:border-white/10 hover:bg-gray-200'
          }`}
        >
          <CheckCircle2 size={14} /> {isProjectClosed ? 'Project Completed' : 'Mark Completed'}
        </button>

        <button
          onClick={onEdit}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#792359] text-white hover:bg-[#52173c] transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Edit size={14} /> Edit Project
        </button>
      </div>

      {/* ── View Summary Modal (Matching Image 1 Design) ── */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-150 p-6 space-y-6">
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#792359]/10 text-[#792359] dark:text-[#c44997] font-bold text-xl flex items-center justify-center">
                  {(project.projectName || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{project.projectName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">
                      {project.projectCode || project.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                      {project.client || 'Business'}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      {project.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsSummaryModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 2-Column Summary Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2 mb-3">
                    IDENTITY DETAILS
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Project Type</span>
                      <span className="font-medium text-gray-900 dark:text-white">Commercial / Business</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Project Name</span>
                      <span className="font-medium text-gray-900 dark:text-white">{project.projectName}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2 mb-3">
                    PRIMARY CONTACT
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Person</span>
                      <span className="font-medium text-gray-900 dark:text-white">{managerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Designation</span>
                      <span className="font-medium text-gray-900 dark:text-white">Project Lead</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Email</span>
                      <span className="font-medium text-gray-900 dark:text-white">contact@{project.client?.toLowerCase().replace(/\s+/g, '') || 'company'}.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2 mb-3">
                    TAX & COMPLIANCE
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">GST Treatment</span>
                      <span className="font-medium text-gray-900 dark:text-white">Registered Business</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">GSTIN</span>
                      <span className="font-mono font-medium text-gray-900 dark:text-white">19AMOPD5406B1ZC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Place of Supply</span>
                      <span className="font-medium text-gray-900 dark:text-white">West Bengal</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2 mb-3">
                    ADDRESS DETAILS
                  </h3>
                  <div className="p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-xl space-y-1 text-xs">
                    <p className="font-bold text-gray-900 dark:text-white">Billing & Execution Site</p>
                    <p className="text-gray-600 dark:text-gray-400">81/1, DR. A.K. PAUL ROAD, BEHALA</p>
                    <p className="text-gray-600 dark:text-gray-400">KOLKATA, West Bengal 700034 IN</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-white/10">
              <button
                onClick={() => setIsSummaryModalOpen(false)}
                className="bg-[#792359] hover:bg-[#52173c] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Close Summary
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
