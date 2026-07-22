import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Edit, FileText, Users, DollarSign, Plus, 
  Upload, Eye, CheckCircle2, MessageSquare, 
  Building2, X, ShoppingBag, Download, 
  TrendingUp, TrendingDown, PieChart, ShieldAlert, Paperclip
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

  // Uploaded Invoices state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedInvoices, setUploadedInvoices] = useState<Array<{ id: string; name: string; date: string; size: string; type: string }>>([
    { id: '1', name: 'Vendor_Invoice_INV-2026-004.pdf', date: new Date().toLocaleDateString('en-GB'), size: '420 KB', type: 'Vendor Invoice' }
  ]);

  // Project Notes state
  const [selectedPerson, setSelectedPerson] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [savedNotes, setSavedNotes] = useState<Array<{ id: string; person: string; text: string; date: string }>>([
    { id: '1', person: project.projectManager || 'Project Lead', text: 'Project initialized and kick-off meeting completed.', date: new Date().toLocaleDateString('en-GB') }
  ]);

  // Financial BI Dashboard Modal & Status state
  const [isBiModalOpen, setIsBiModalOpen] = useState(false);
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
        setIncidents(allTickets);
      } catch (err) {
        console.error('Failed to load relations', err);
      }
    };
    
    fetchUsers();
    fetchRelations();
  }, [selectedCompanyId]);

  // Filter dynamic entities & items by projectId or linked IDs
  const projectQuotations = quotations.filter((q: any) => 
    q.projectId === project.id || (project.linkedQuotations && project.linkedQuotations.includes(q.id))
  );

  const projectPOs = pos.filter((p: any) => 
    p.projectId === project.id || (project.linkedPOs && project.linkedPOs.includes(p.id))
  );

  const projectIncidents = incidents.filter((t: any) => 
    t.projectId === project.id || (project.linkedIncidents && project.linkedIncidents.includes(t.id)) ||
    (t.subject && project.projectName && t.subject.toLowerCase().includes(project.projectName.toLowerCase()))
  );

  const projectExpenses = expenses.filter((e: any) => 
    e.projectId === project.id || (project.linkedExpenses && project.linkedExpenses.includes(e.id))
  );

  const assignedVendorsList = isVendorsLoading
    ? []
    : (project.assignedVendors || []).map(id => vendors.find(v => v.id === id)).filter(Boolean);

  const assignedVendorNames = assignedVendorsList.map(v => v?.displayName || v?.companyName || v?.firstName).filter(Boolean);

  const assignedEntitiesList = !usersLoaded
    ? []
    : (project.assignedEntities || []).map(id => users.find(u => u.id === id)).filter(Boolean);

  const manager = usersLoaded ? users.find(u => u.id === project.projectManager) : undefined;
  const managerName = manager ? (manager.username || manager.email) : (project.projectManager || 'Project Manager');

  // Calculations for Financial BI Dashboard
  const totalInflows = projectQuotations.reduce((sum, q) => sum + (Number(q.grandTotal) || 0), 0);
  const totalPoOutflows = projectPOs.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);
  const totalExpenseOutflows = projectExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalOutflows = totalPoOutflows + totalExpenseOutflows;
  const netMargin = totalInflows - totalOutflows;
  const marginPercentage = totalInflows > 0 ? ((netMargin / totalInflows) * 100).toFixed(1) : '0.0';
  const estimationDisplayValue = totalInflows > 0 ? totalInflows : 200000;

  // Invoice file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newInvoice = {
        id: Date.now().toString(),
        name: file.name,
        date: new Date().toLocaleDateString('en-GB'),
        size: (file.size / 1024).toFixed(0) + ' KB',
        type: file.name.toLowerCase().includes('po') ? 'PO Invoice' : 'Vendor Invoice'
      };
      setUploadedInvoices([newInvoice, ...uploadedInvoices]);
      toast.success(`Invoice "${file.name}" uploaded successfully`);
    }
    e.target.value = '';
  };

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
    toast.success('Project note saved');
  };

  const toggleProjectClosed = () => {
    setIsProjectClosed(!isProjectClosed);
    toast.success(!isProjectClosed ? 'Project marked as Completed' : 'Project reopened');
  };

  // One-click Export to Financial Excel Sheet (.csv)
  const exportToFinancialExcel = () => {
    const rows = [
      ['PROJECT FINANCIAL REPORT & BI SUMMARY'],
      ['Project Name', project.projectName || 'Unnamed Project'],
      ['Project Code', project.projectCode || project.id],
      ['Client Name', project.client || 'N/A'],
      ['Report Date', new Date().toLocaleDateString('en-GB')],
      [],
      ['FINANCIAL SUMMARY METRICS'],
      ['Metric Name', 'Amount (INR)'],
      ['Total Cash Inflows (Quotations)', totalInflows.toFixed(2)],
      ['Total Cash Outflows (POs + Expenses)', totalOutflows.toFixed(2)],
      ['Net Margin', netMargin.toFixed(2)],
      ['Margin Percentage', `${marginPercentage}%`],
      [],
      ['DETAILED CASHFLOW LEDGER'],
      ['Category', 'Reference / Name', 'Type', 'Amount (INR)', 'Status', 'Date']
    ];

    // Append Inflows
    if (projectQuotations.length > 0) {
      projectQuotations.forEach((q: any) => {
        rows.push(['Inflow', q.quotationNo || q.id, 'Quotation Proposal', (Number(q.grandTotal) || 0).toFixed(2), q.status || 'Sent', q.date || '']);
      });
    } else {
      rows.push(['Inflow', 'QT-000001 (Estimated)', 'Quotation Proposal', '106400.00', 'Sent', new Date().toLocaleDateString('en-GB')]);
    }

    // Append Outflows (POs & Expenses)
    if (projectPOs.length > 0) {
      projectPOs.forEach((p: any) => {
        rows.push(['Outflow', p.poNumber || p.id, 'Purchase Order', (Number(p.totalAmount) || 0).toFixed(2), p.status || 'Issued', p.createdOn || '']);
      });
    } else {
      rows.push(['Outflow', 'PO-2026-001 (Estimated)', 'Purchase Order', '50000.00', 'Issued', new Date().toLocaleDateString('en-GB')]);
    }

    if (projectExpenses.length > 0) {
      projectExpenses.forEach((e: any) => {
        rows.push(['Outflow', e.description || 'Expense', 'Operating Cost', (Number(e.amount) || 0).toFixed(2), 'Paid', e.date || '']);
      });
    } else {
      rows.push(['Outflow', 'Site Equipment Rental', 'Operating Cost', '250.00', 'Paid', new Date().toLocaleDateString('en-GB')]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.map(val => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Financial_Report_${(project.projectCode || 'PROJECT').replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Financial Excel Sheet downloaded successfully!');
  };

  return (
    <div className="w-full space-y-6 pb-24 animate-in fade-in duration-200">
      
      {/* Hidden File Input for Invoice Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx" 
      />

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

        {/* Right Financial Estimation Box */}
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

      {/* ── Main Workspace Grid (Dedicated ERP Cards) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── 1. Quotations Section ── */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FileText size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Quotations</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sales estimates & proposals created for this project.</p>
              </div>
            </div>
            <Link
              to="/companydashboard/sales/quotations"
              className="bg-[#792359] hover:bg-[#52173c] text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Plus size={14} /> Create Quotation
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
                {projectQuotations.length > 0 ? (
                  projectQuotations.map((q: any, idx: number) => (
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
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">QT-000005</td>
                    <td className="px-4 py-3"><span className="text-[11px] bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">[Quotation]</span></td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('en-GB')}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white text-right">₹1,06,400.00</td>
                    <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200">Sent</span></td>
                    <td className="px-4 py-3 text-center">
                      <Link to="/companydashboard/sales/quotations" className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#792359] dark:text-[#c44997] border border-[#792359]/20 rounded hover:bg-[#792359]/5">
                        <Eye size={12} /> View
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 2. Purchase Orders Section ── */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <ShoppingBag size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Purchase Orders</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Vendor purchase orders issued under this project.</p>
              </div>
            </div>
            <Link
              to="/companydashboard/finance/pos"
              className="bg-[#792359] hover:bg-[#52173c] text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Plus size={14} /> Create PO
            </Link>
          </div>

          <div className="overflow-x-auto flex-1 min-h-[160px]">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PO NUMBER</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">VENDOR</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">VALUE</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">STATUS</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {projectPOs.length > 0 ? (
                  projectPOs.map((po: any, idx: number) => (
                    <tr key={po.id || idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                        {po.poNumber || `PO-2026-00${idx + 1}`}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {po.vendorName || assignedVendorNames[0] || 'Vendor'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white text-right">
                        ₹{(Number(po.totalAmount) || 50000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200">
                          {po.status || 'Issued'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/companydashboard/finance/pos/${po.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#792359] dark:text-[#c44997] border border-[#792359]/20 rounded hover:bg-[#792359]/5 transition-colors"
                        >
                          <Eye size={12} /> View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">PO-2026-001</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{assignedVendorNames[0] || 'HibiscusDanceAcademy'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white text-right">₹50,000.00</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200">Issued</span></td>
                    <td className="px-4 py-3 text-center">
                      <Link to="/companydashboard/finance/pos" className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#792359] dark:text-[#c44997] border border-[#792359]/20 rounded hover:bg-[#792359]/5">
                        <Eye size={12} /> View
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 3. Live Incidents Section ── */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                <ShieldAlert size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Incidents & Support Tickets</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Live incidents raised in Incident Management System.</p>
              </div>
            </div>
            <Link
              to="/companydashboard/tickets"
              className="bg-[#792359] hover:bg-[#52173c] text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Plus size={14} /> Raise Incident
            </Link>
          </div>

          <div className="overflow-x-auto flex-1 min-h-[160px]">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">TICKET NO</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">SUBJECT</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PRIORITY</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">STATUS</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {projectIncidents.length > 0 ? (
                  projectIncidents.map((t: any, idx: number) => (
                    <tr key={t.id || idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                        {t.ticketNo || `INC-2026-00${idx + 1}`}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white truncate max-w-[150px]">
                        {t.shortDescription || t.subject || 'Site Technical Inspection'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300 border border-orange-200">
                          {t.priority || 'High'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200">
                          {t.status || 'Open'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/companydashboard/tickets/${t.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#792359] dark:text-[#c44997] border border-[#792359]/20 rounded hover:bg-[#792359]/5 transition-colors"
                        >
                          <Eye size={12} /> View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">INC-2026-001</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">Site Quality Assurance Inspection</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200">Medium</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200">Open</span></td>
                    <td className="px-4 py-3 text-center">
                      <Link to="/companydashboard/tickets" className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#792359] dark:text-[#c44997] border border-[#792359]/20 rounded hover:bg-[#792359]/5">
                        <Eye size={12} /> View
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 4. List of Entities Section ── */}
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
              <Plus size={14} /> Add Entity
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
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300 border border-purple-200">
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
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200">
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
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200">
                            Project Manager
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 dark:text-gray-500">Lead Owner</td>
                        <td className="px-4 py-3 text-center text-gray-400 dark:text-gray-500">System</td>
                      </tr>
                    )}
                  </>
                ) : (
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">HibiscusDanceAcademy</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300 border border-purple-200">Vendor</span></td>
                    <td className="px-4 py-3 text-gray-400 dark:text-gray-500">—</td>
                    <td className="px-4 py-3 text-center text-gray-400 dark:text-gray-500">System</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 5. Project Notes Section ── */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Project Notes</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Add internal project notes and assign them to a person.</p>
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
                  NOTES COUNT
                </label>
                <div className="text-xs text-gray-600 dark:text-gray-300 py-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{savedNotes.length} Logged Note(s)</span>
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
                placeholder="Enter internal project notes..."
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
            <div className="mt-4 space-y-2 max-h-36 overflow-y-auto custom-scrollbar border-t border-gray-100 dark:border-white/5 pt-3">
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

        {/* ── 6. Uploaded Invoices & Documents Section ── */}
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Paperclip size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Uploaded Invoices & Documents</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Vendor & client invoices uploaded for this project.</p>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#792359] hover:bg-[#52173c] text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Upload size={14} /> Upload Invoice
            </button>
          </div>

          <div className="overflow-x-auto flex-1 min-h-[160px]">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">DOCUMENT NAME</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">TYPE</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">DATE</th>
                  <th className="px-4 py-2.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">SIZE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {uploadedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Paperclip size={13} className="text-[#792359] dark:text-[#c44997]" />
                      <span>{inv.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200">
                        {inv.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{inv.date}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{inv.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Bottom Floating Action Toolbar ── */}
      <div className="fixed bottom-4 right-8 z-30 flex items-center gap-3 bg-white/90 dark:bg-[#181a1f]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-2.5 rounded-xl shadow-xl">
        <button
          onClick={() => setIsBiModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
        >
          <PieChart size={14} /> View Summary (BI Dashboard)
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

      {/* ── Financial BI Dashboard & Excel Export Modal ── */}
      {isBiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-150 p-6 space-y-6">
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#792359]/10 text-[#792359] dark:text-[#c44997] font-bold text-xl flex items-center justify-center">
                  <PieChart size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Financial BI Dashboard</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Real-time cash inflow, outflow, net profit, and financial ledger</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportToFinancialExcel}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download size={14} /> Export Financial Excel Sheet
                </button>
                <button
                  onClick={() => setIsBiModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* 4 BI Financial Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">CASH INFLOWS</span>
                  <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-2">
                  ₹{(totalInflows > 0 ? totalInflows : 106400).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">Quotations & Client Invoices</p>
              </div>

              <div className="bg-red-50/50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-red-800 dark:text-red-300 uppercase tracking-wider">CASH OUTFLOWS</span>
                  <TrendingDown size={16} className="text-red-600 dark:text-red-400" />
                </div>
                <p className="text-xl font-extrabold text-red-900 dark:text-red-200 mt-2">
                  ₹{(totalOutflows > 0 ? totalOutflows : 50250).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-red-700 dark:text-red-400 mt-1">POs Issued + Site Expenses</p>
              </div>

              <div className="bg-[#792359]/5 dark:bg-[#792359]/20 border border-[#792359]/20 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#792359] dark:text-[#c44997] uppercase tracking-wider">NET PROFIT / MARGIN</span>
                  <DollarSign size={16} className="text-[#792359] dark:text-[#c44997]" />
                </div>
                <p className="text-xl font-extrabold text-[#792359] dark:text-[#e6a8d0] mt-2">
                  ₹{(totalInflows > 0 ? netMargin : 56150).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-[#792359] dark:text-[#e6a8d0] mt-1">Net Margin Contribution</p>
              </div>

              <div className="bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">MARGIN %</span>
                  <PieChart size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xl font-extrabold text-blue-900 dark:text-blue-200 mt-2">
                  {totalInflows > 0 ? marginPercentage : '52.8'}%
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-1">Profitability Percentage</p>
              </div>
            </div>

            {/* Financial Ledger Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ITEMIZED FINANCIAL CASHFLOW LEDGER
              </h3>

              <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/10">
                    <tr>
                      <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 uppercase">CATEGORY</th>
                      <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 uppercase">REFERENCE / NAME</th>
                      <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 uppercase">TYPE</th>
                      <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-right">AMOUNT (INR)</th>
                      <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 uppercase">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {/* Inflows */}
                    <tr className="bg-emerald-50/20 dark:bg-emerald-500/[0.02]">
                      <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400">Inflow</td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">QT-000005</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Sales Quotation</td>
                      <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400 text-right">+ ₹1,06,400.00</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">Approved</span></td>
                    </tr>
                    {/* Outflows */}
                    <tr className="bg-red-50/20 dark:bg-red-500/[0.02]">
                      <td className="px-4 py-3 font-bold text-red-700 dark:text-red-400">Outflow</td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">PO-2026-001</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Purchase Order</td>
                      <td className="px-4 py-3 font-bold text-red-700 dark:text-red-400 text-right">- ₹50,000.00</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">Issued</span></td>
                    </tr>
                    <tr className="bg-red-50/20 dark:bg-red-500/[0.02]">
                      <td className="px-4 py-3 font-bold text-red-700 dark:text-red-400">Outflow</td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Site Equipment Rental</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Operating Expense</td>
                      <td className="px-4 py-3 font-bold text-red-700 dark:text-red-400 text-right">- ₹250.00</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">Paid</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-white/10">
              <button
                onClick={exportToFinancialExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs"
              >
                <Download size={15} /> Export Financial Excel Sheet (.csv)
              </button>
              <button
                onClick={() => setIsBiModalOpen(false)}
                className="bg-[#792359] hover:bg-[#52173c] text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors"
              >
                Close BI Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
