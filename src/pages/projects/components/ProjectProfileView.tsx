import { useState, useEffect, useRef } from 'react';
import {
  Edit, FileText, Users, DollarSign, Plus,
  CheckCircle2, MessageSquare,
  Building2, X, ShoppingBag, Download, Upload,
  TrendingUp, TrendingDown, PieChart, ShieldAlert, Paperclip, Trash2,
  FileImage, FileSpreadsheet, File, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import CustomSelect from '@/components/ui/CustomSelect';
import { useVendors } from '../../../hooks/useVendors';
import { useClients } from '../../../hooks/useClients';
import { api } from '../../../lib/api';

import { POService } from '../../../services/po.service';
import { QuotationService } from '../../../services/quotation.service';
import { ExpenseService } from '../../../services/expense.service';
import { TicketService } from '../../../services/ticket.service';
import { ProjectService } from '../../../services/project.service';
import { FileService } from '../../../services/file.service';
import type { Project } from '../../../types/project.types';
import toast from 'react-hot-toast';
import { formStyles } from '@/components/ui/form-styles';

interface Props {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
}

interface ParsedEntity {
  id?: string;
  name: string;
  tag: string;
  remarks?: string;
  actionSource?: string;
}

interface ParsedNote {
  id: string;
  person: string;
  text: string;
  date: string;
}

interface ParsedDocument {
  id: string;
  name: string;
  date: string;
  size: string;
  type: string;
  mimeType?: string;
  originalId?: string;
  amount?: string;
}

const getFileIcon = (mimeType?: string, fileName?: string) => {
  const mt = mimeType?.toLowerCase() || '';
  const name = fileName?.toLowerCase() || '';

  if (mt.startsWith('image/') || name.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg|tif|tiff|ico|heic|heif|avif)$/)) return <FileImage size={13} className="text-[#792359] dark:text-[#c44997]" />;
  if (mt.includes('pdf') || name.endsWith('.pdf')) return <FileText size={13} className="text-[#792359] dark:text-[#c44997]" />;
  if (mt.includes('word') || name.match(/\.(doc|docx)$/)) return <FileText size={13} className="text-[#792359] dark:text-[#c44997]" />;
  if (mt.includes('excel') || mt.includes('spreadsheet') || name.match(/\.(xls|xlsx)$/)) return <FileSpreadsheet size={13} className="text-[#792359] dark:text-[#c44997]" />;
  return <File size={13} className="text-[#792359] dark:text-[#c44997]" />;
};

export default function ProjectProfileView({ project: initialProject, onClose, onEdit }: Props) {
  const { selectedCompanyId } = useAuth();
  const { vendors, isListLoading: isVendorsLoading } = useVendors({ companyId: selectedCompanyId || null });
  const { clients } = useClients({ companyId: selectedCompanyId || null });

  const [currentProject, setCurrentProject] = useState<Project>(initialProject);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [pos, setPos] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // New Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'incidents' | 'comments'>('overview');

  const clientObj = clients.find(c => c.id === currentProject.client);
  const clientName = clientObj ? (clientObj.displayName || clientObj.companyName || currentProject.client) : currentProject.client;

  // Add Entity Modal State
  const [isAddEntityModalOpen, setIsAddEntityModalOpen] = useState(false);
  const [entityName, setEntityName] = useState('');
  const [entityTag, setEntityTag] = useState('');
  const [entityRemarks, setEntityRemarks] = useState('');

  // File Upload Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<'Quotation' | 'Purchase Order'>('Quotation');
  const [uploadAmount, setUploadAmount] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  const openUploadModal = (type: 'Quotation' | 'Purchase Order') => {
    setUploadDocType(type);
    setUploadAmount('');
    setUploadFile(null);
    setIsUploadModalOpen(true);
  };

  // Link Existing Quotation Modal State
  const [isLinkQuotationModalOpen, setIsLinkQuotationModalOpen] = useState(false);
  const [availableQuotations, setAvailableQuotations] = useState<any[]>([]);
  const [quotationSearch, setQuotationSearch] = useState('');
  const [isLinkingQuotation, setIsLinkingQuotation] = useState(false);

  // Link Existing PO Modal State
  const [isLinkPOModalOpen, setIsLinkPOModalOpen] = useState(false);
  const [availablePOs, setAvailablePOs] = useState<any[]>([]);
  const [poSearch, setPoSearch] = useState('');
  const [isLinkingPO, setIsLinkingPO] = useState(false);

  // Project Notes Form State
  const [selectedPerson, setSelectedPerson] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [deletedNoteIds, setDeletedNoteIds] = useState<string[]>([]);

  // Financial BI Dashboard Modal & Status State
  const [isBiModalOpen, setIsBiModalOpen] = useState(false);
  const [isProjectClosed, setIsProjectClosed] = useState(currentProject.status === 'Completed' || currentProject.status === 'Closed');

  // ── Link Existing Quotation Handlers ─────────────────────────────────────
  const openLinkQuotationModal = async () => {
    setQuotationSearch('');
    setIsLinkQuotationModalOpen(true);
    try {
      const data = await ProjectService.getAvailableQuotations(selectedCompanyId || '');
      setAvailableQuotations(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load quotations');
    }
  };

  const handleLinkQuotation = async (quotationId: string) => {
    if (isLinkingQuotation) return;
    setIsLinkingQuotation(true);
    try {
      const updated = await ProjectService.linkQuotation(currentProject.id, quotationId);
      setCurrentProject(updated as any);
      toast.success('Quotation linked successfully');
      setIsLinkQuotationModalOpen(false);
    } catch {
      toast.error('Failed to link quotation');
    } finally {
      setIsLinkingQuotation(false);
    }
  };

  const handleUnlinkQuotation = async (quotationId: string) => {
    try {
      const updated = await ProjectService.unlinkQuotation(currentProject.id, quotationId);
      setCurrentProject(updated as any);
      toast.success('Quotation unlinked');
    } catch {
      toast.error('Failed to unlink quotation');
    }
  };

  // ── Link Existing PO Handlers ─────────────────────────────────────────────
  const openLinkPOModal = async () => {
    setPoSearch('');
    setIsLinkPOModalOpen(true);
    try {
      const data = await ProjectService.getAvailablePOs(selectedCompanyId || '');
      setAvailablePOs(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load purchase orders');
    }
  };

  const handleLinkPO = async (poId: string) => {
    if (isLinkingPO) return;
    setIsLinkingPO(true);
    try {
      const updated = await ProjectService.linkPO(currentProject.id, poId);
      setCurrentProject(updated as any);
      toast.success('Purchase Order linked successfully');
      setIsLinkPOModalOpen(false);
    } catch {
      toast.error('Failed to link Purchase Order');
    } finally {
      setIsLinkingPO(false);
    }
  };

  const handleUnlinkPO = async (poId: string) => {
    try {
      const updated = await ProjectService.unlinkPO(currentProject.id, poId);
      setCurrentProject(updated as any);
      toast.success('Purchase Order unlinked');
    } catch {
      toast.error('Failed to unlink Purchase Order');
    }
  };

  useEffect(() => {
    setCurrentProject(initialProject);
    setIsProjectClosed(initialProject.status === 'Completed' || initialProject.status === 'Closed');
  }, [initialProject]);

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

  // Filter dynamic entities & items by projectId or linked IDs strictly from backend data
  const projectQuotations = quotations.filter((q: any) =>
    q.projectId === currentProject.id || (currentProject.linkedQuotations && currentProject.linkedQuotations.includes(q.id))
  );

  const projectPOs = pos.filter((p: any) =>
    p.projectId === currentProject.id || (currentProject.linkedPOs && currentProject.linkedPOs.includes(p.id))
  );

  const projectIncidents = incidents.filter((t: any) =>
    t.projectId === currentProject.id || (currentProject.linkedIncidents && currentProject.linkedIncidents.includes(t.id)) ||
    (t.subject && currentProject.projectName && t.subject.toLowerCase().includes(currentProject.projectName.toLowerCase()))
  );

  const projectExpenses = expenses.filter((e: any) =>
    e.projectId === currentProject.id || (currentProject.linkedExpenses && currentProject.linkedExpenses.includes(e.id))
  );

  const assignedVendorsList = isVendorsLoading
    ? []
    : (currentProject.assignedVendors || []).map(id => vendors.find(v => v.id === id)).filter(Boolean);

  const assignedVendorNames = assignedVendorsList.map(v => v?.displayName || v?.companyName || v?.firstName).filter(Boolean);

  const manager = usersLoaded ? users.find(u => u.id === currentProject.projectManager) : undefined;
  const managerName = manager ? (manager.username || manager.email) : (currentProject.projectManager || 'Project Manager');

  // Parse structured entities from currentProject.assignedEntities
  const parsedEntities: ParsedEntity[] = (currentProject.assignedEntities || []).map((rawStr, index) => {
    try {
      if (rawStr.startsWith('{') && rawStr.endsWith('}')) {
        return JSON.parse(rawStr);
      }
    } catch (e) {
      // Fallback if rawStr is user ID or vendor name
    }
    const matchedUser = usersLoaded ? users.find(u => u.id === rawStr) : null;
    const matchedVendor = isVendorsLoading ? null : vendors.find(v => v.id === rawStr);

    if (matchedUser) {
      return { id: rawStr, name: matchedUser.username || matchedUser.email, tag: 'Employee', actionSource: 'System' };
    }
    if (matchedVendor) {
      return { id: rawStr, name: matchedVendor.displayName || matchedVendor.companyName, tag: 'Vendor', actionSource: 'System' };
    }
    return { id: `raw-${index}`, name: rawStr, tag: 'Other', actionSource: 'Manual' };
  });

  // Parse project notes from currentProject.projectNotes
  const parsedNotes: ParsedNote[] = (currentProject.projectNotes || []).map((rawStr, index) => {
    try {
      if (rawStr.startsWith('{') && rawStr.endsWith('}')) {
        return JSON.parse(rawStr);
      }
    } catch (e) {
      // Fallback string
    }
    return { id: `note-${index}`, person: managerName, text: rawStr, date: new Date().toLocaleDateString('en-GB') };
  });

  // Parse project documents from currentProject.projectDocuments
  const parsedDocuments: ParsedDocument[] = (currentProject.projectDocuments || []).map((rawStr, index) => {
    try {
      if (rawStr.startsWith('{') && rawStr.endsWith('}')) {
        return JSON.parse(rawStr);
      }
    } catch (e) {
      // Fallback
    }
    return { id: `doc-${index}`, name: rawStr, date: new Date().toLocaleDateString('en-GB'), size: 'N/A', type: 'Invoice' };
  });

  // Financial BI Metrics derived strictly from backend data
  const totalInflows = projectQuotations.reduce((sum, q) => sum + (Number(q.grandTotal) || 0), 0);
  const totalPoOutflows = projectPOs.reduce((sum, p) => sum + (Number(p.grandTotal) || 0), 0);
  const totalExpenseOutflows = projectExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalOutflows = totalPoOutflows + totalExpenseOutflows;
  const netMargin = totalInflows - totalOutflows;
  const marginPercentage = totalInflows > 0 ? ((netMargin / totalInflows) * 100).toFixed(1) : '0.0';
  const estimationDisplayValue = currentProject.budget || currentProject.expectedRevenue || totalInflows;

  // Combined lists for tables
  const combinedQuotations = [
    ...projectQuotations,
    ...parsedDocuments.filter(d => d.type === 'Quotation').map(d => ({
      id: d.id,
      isDocument: true,
      quotationNo: d.name,
      date: d.date,
      grandTotal: Number(d.amount) || 0,
      status: 'Uploaded',
      doc: d
    }))
  ];

  const combinedPOs = [
    ...projectPOs,
    ...parsedDocuments.filter(d => d.type === 'Purchase Order').map(d => ({
      id: d.id,
      isDocument: true,
      poNumber: d.name,
      vendorName: 'Uploaded Document',
      grandTotal: Number(d.amount) || 0,
      status: 'Uploaded',
      doc: d
    }))
  ];

  // Add Entity Submit Handler
  const handleAddEntitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityName.trim()) {
      toast.error('Please enter Entity Name');
      return;
    }
    if (!entityTag) {
      toast.error('Please select Entity Tag');
      return;
    }

    setIsSaving(true);
    try {
      const newEntityObj: ParsedEntity = {
        id: Date.now().toString(),
        name: entityName.trim(),
        tag: entityTag,
        remarks: entityRemarks.trim() || '—',
        actionSource: 'Manual'
      };

      const updatedEntities = [...(currentProject.assignedEntities || []), JSON.stringify(newEntityObj)];
      const updatedProject = await ProjectService.update(currentProject.id, {
        ...currentProject,
        assignedEntities: updatedEntities
      });

      setCurrentProject(updatedProject);
      setIsAddEntityModalOpen(false);
      setEntityName('');
      setEntityTag('');
      setEntityRemarks('');
      toast.success('Entity added and saved to backend');
    } catch (err) {
      toast.error('Failed to add entity to project');
    } finally {
      setIsSaving(false);
    }
  };

  // Remove Entity Handler
  const handleRemoveEntity = async (indexToRemove: number) => {
    setIsSaving(true);
    try {
      const updatedEntities = (currentProject.assignedEntities || []).filter((_, idx) => idx !== indexToRemove);
      const updatedProject = await ProjectService.update(currentProject.id, {
        ...currentProject,
        assignedEntities: updatedEntities
      });
      setCurrentProject(updatedProject);
      toast.success('Entity removed');
    } catch (err) {
      toast.error('Failed to remove entity');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Project Notes Handler
  const handleSaveNotes = async () => {
    if (!noteContent.trim()) {
      toast.error('Please enter note text');
      return;
    }

    setIsSaving(true);
    try {
      const newNoteObj: ParsedNote = {
        id: Date.now().toString(),
        person: selectedPerson || managerName || 'Internal User',
        text: noteContent.trim(),
        date: new Date().toLocaleDateString('en-GB')
      };

      const updatedNotes = [JSON.stringify(newNoteObj), ...(currentProject.projectNotes || [])];
      const updatedProject = await ProjectService.update(currentProject.id, {
        ...currentProject,
        projectNotes: updatedNotes
      });

      setCurrentProject(updatedProject);
      setNoteContent('');
      setSelectedPerson('');
      toast.success('Project note saved to database');
    } catch (err) {
      toast.error('Failed to save project note');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Note Handler
  const handleDeleteNote = (noteId: string) => {
    setDeletedNoteIds(prev => [...prev, noteId]);
  };

  // Upload Document Handler (Generic)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tif', '.tiff', '.ico', '.heic', '.heif', '.avif', '.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      toast.error('Unsupported file type. Please upload an Image, PDF, Word document or Excel spreadsheet.');
      e.target.value = '';
      return;
    }

    setIsSaving(true);
    try {
      const uploadResult = await FileService.uploadFile(file, 'project_document');

      const determinedType = file.name.toLowerCase().includes('po') ? 'PO Invoice' : 'Vendor Invoice';

      const newDocObj: ParsedDocument = {
        id: Date.now().toString(),
        originalId: uploadResult.id,
        name: file.name,
        date: new Date().toLocaleDateString('en-GB'),
        size: (file.size / 1024).toFixed(0) + ' KB',
        type: determinedType,
        mimeType: uploadResult.mimeType
      };

      const updatedDocs = [JSON.stringify(newDocObj), ...(currentProject.projectDocuments || [])];
      const updatedProject = await ProjectService.update(currentProject.id, {
        ...currentProject,
        projectDocuments: updatedDocs
      });

      setCurrentProject(updatedProject);
      toast.success('Document uploaded successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload document');
    } finally {
      setIsSaving(false);
      e.target.value = '';
    }
  };

  const handleModalUploadSubmit = async () => {
    if (!uploadFile) {
      toast.error('Please select a file to upload');
      return;
    }
    if (!uploadAmount) {
      toast.error('Please enter the amount');
      return;
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tif', '.tiff', '.ico', '.heic', '.heif', '.avif', '.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const fileExt = uploadFile.name.slice(uploadFile.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      toast.error('Unsupported file type. Please upload an Image, PDF, Word document or Excel spreadsheet.');
      return;
    }

    setIsSaving(true);
    try {
      const uploadResult = await FileService.uploadFile(uploadFile, 'project_document');

      const newDocObj: ParsedDocument = {
        id: Date.now().toString(),
        originalId: uploadResult.id,
        name: uploadFile.name,
        date: new Date().toLocaleDateString('en-GB'),
        size: (uploadFile.size / 1024).toFixed(0) + ' KB',
        type: uploadDocType,
        mimeType: uploadResult.mimeType,
        amount: uploadAmount
      };

      const updatedDocs = [JSON.stringify(newDocObj), ...(currentProject.projectDocuments || [])];
      const updatedProject = await ProjectService.update(currentProject.id, {
        ...currentProject,
        projectDocuments: updatedDocs
      });

      setCurrentProject(updatedProject);
      toast.success(`${uploadDocType} uploaded successfully`);
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadAmount('');
    } catch (err: any) {
      toast.error(err?.message || `Failed to upload ${uploadDocType}`);
    } finally {
      setIsSaving(false);
      if (uploadFileInputRef.current) uploadFileInputRef.current.value = '';
    }
  };

  const handleDownload = async (doc: ParsedDocument) => {
    if (!doc.originalId) {
      toast.error('Legacy document: File cannot be downloaded');
      return;
    }
    try {
      await FileService.downloadFile(doc.originalId, doc.name);
      toast.success('Document downloaded successfully');
    } catch (err) {
      toast.error('Failed to download document');
    }
  };

  const toggleProjectClosed = async () => {
    const newStatus = isProjectClosed ? 'Active' : 'Completed';
    try {
      const updatedProject = await ProjectService.update(currentProject.id, {
        ...currentProject,
        status: newStatus
      });
      setCurrentProject(updatedProject);
      setIsProjectClosed(!isProjectClosed);
      toast.success(newStatus === 'Completed' ? 'Project marked as Completed' : 'Project reopened');
    } catch (err) {
      toast.error('Failed to update project status');
    }
  };

  const exportToFinancialExcel = () => {
    const rows = [
      ['PROJECT FINANCIAL REPORT & BI SUMMARY'],
      ['Project Name', currentProject.projectName || 'Unnamed Project'],
      ['Project Code', currentProject.projectCode || currentProject.id],
      ['Client Name', currentProject.client || 'N/A'],
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

    if (projectQuotations.length > 0) {
      projectQuotations.forEach((q: any) => {
        rows.push(['Inflow', q.quotationNo || 'Draft/Unassigned', 'Quotation Proposal', (Number(q.grandTotal) || 0).toFixed(2), q.status || 'Sent', q.date || '']);
      });
    }

    if (projectPOs.length > 0) {
      projectPOs.forEach((p: any) => {
        rows.push(['Outflow', p.poNumber || 'Draft/Unassigned', 'Purchase Order', (Number(p.totalAmount) || 0).toFixed(2), p.status || 'Issued', p.createdOn || '']);
      });
    }

    if (projectExpenses.length > 0) {
      projectExpenses.forEach((e: any) => {
        rows.push(['Outflow', e.description || 'Expense', 'Operating Cost', (Number(e.amount) || 0).toFixed(2), 'Paid', e.date || '']);
      });
    }

    if (projectQuotations.length === 0 && projectPOs.length === 0 && projectExpenses.length === 0) {
      rows.push(['N/A', 'No recorded transactions', 'N/A', '0.00', 'N/A', 'N/A']);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.map(val => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Financial_Report_${(currentProject.projectCode || 'PROJECT').replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Financial Excel Sheet downloaded successfully!');
  };

  return (
    <>
    <div className="w-full bg-gray-50 dark:bg-[#0a0a0a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col min-h-[calc(100vh-8rem)] overflow-hidden transition-colors duration-300">

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.tif,.tiff,.ico,.heic,.heif,.avif,.pdf,.doc,.docx,.xls,.xlsx"
      />

      {/* ── 1. Header Section ── */}
      <div className="px-6 py-5 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#792359] text-white flex items-center justify-center rounded-lg text-2xl font-bold shrink-0 shadow-sm">
            {(currentProject.projectName || 'P').charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {currentProject.projectName || 'Unnamed Project'}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {currentProject.projectCode || currentProject.id || 'No Code'}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${isProjectClosed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50'
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isProjectClosed ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                {isProjectClosed ? 'Completed' : (currentProject.status || 'Active')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBiModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
          >
            <PieChart size={16} className="text-[#792359] dark:text-[#c44997]" />
            <span>BI Dashboard</span>
          </button>
          <button
            onClick={toggleProjectClosed}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
          >
            <CheckCircle2 size={16} className={isProjectClosed ? 'text-emerald-500' : 'text-gray-500'} />
            <span>{isProjectClosed ? 'Project Completed' : 'Mark Completed'}</span>
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Edit size={16} className="text-gray-500" />
            <span>Edit Project</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── 2. Navigation Tabs ── */}
      <div className="px-6 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 flex items-center gap-8">
        {[
          { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
          { id: 'transactions', label: 'Transactions & Docs', icon: <FileText size={16} /> },
          { id: 'incidents', label: 'Incidents & Entities', icon: <Users size={16} /> },
          { id: 'comments', label: 'Comments Timeline', icon: <MessageSquare size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-[#792359] text-[#792359] dark:text-[#e6a8d0] dark:border-[#e6a8d0]'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 3. Profile Content Workspace ── */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* ── TABS CORE CONTENT: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT PROFILE COLUMN */}
            <div className="lg:col-span-1 flex flex-col gap-6">

              {/* Primary Details Box */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Project Details</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Description</span>
                    <span className="text-sm text-gray-900 dark:text-gray-200">{currentProject.description || 'No description provided.'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Client</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{clientName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Project Manager</span>
                    <span className="text-sm text-gray-800 dark:text-gray-300">{managerName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Assigned Vendors</span>
                    <span className="text-sm text-gray-800 dark:text-gray-300">
                      {assignedVendorNames.length > 0 ? assignedVendorNames.join(', ') : 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Due Date</span>
                    <span className="text-sm text-gray-800 dark:text-gray-300">
                      {currentProject.expectedEndDate ? new Date(currentProject.expectedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Actions Callout */}
              <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Create Document</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Quickly generate a new Quotation or PO for this project.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link to="/companydashboard/sales/quotations/new" state={{ returnTo: '/companydashboard/projects', openProjectId: currentProject.id, openProjectName: currentProject.projectName || currentProject.projectCode || '', openClientId: currentProject.client, openClientName: clientName }} className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium transition-colors shadow-sm">
                    New Quotation
                  </Link>
                  <Link to="/companydashboard/finance/pos/new" state={{ returnTo: '/companydashboard/projects', openProjectId: currentProject.id, openProjectName: currentProject.projectName || currentProject.projectCode || '', openVendorId: assignedVendorsList[0]?.id || '' }} className="px-4 py-1.5 bg-[#792359] hover:bg-[#52173c] text-white rounded-md text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5">
                    <Plus size={14} /> New PO
                  </Link>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Financial Summary</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Total Cash Inflows</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{totalInflows.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Total Cash Outflows</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{totalOutflows.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 block mb-1">Net Margin ({marginPercentage}%)</span>
                    <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">₹{netMargin.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Project Estimation: <span className="font-semibold text-gray-900 dark:text-gray-200">₹{estimationDisplayValue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── TABS CORE CONTENT: TRANSACTIONS & DOCS ── */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">

            {/* Quotations Table */}
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#121212]">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" />
                  Quotations
                </h4>
                <div className="flex items-center gap-4">
                  <button onClick={openLinkQuotationModal} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    <Plus size={13} /> Link Existing
                  </button>
                  <button onClick={() => openUploadModal('Quotation')} className="text-xs font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1">
                    <Upload size={14} /> Upload
                  </button>
                  <Link to="/companydashboard/sales/quotations/new" state={{ returnTo: '/companydashboard/projects', openProjectId: currentProject.id }} className="text-xs font-medium text-[#792359] hover:underline">
                    + Create Quotation
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Number</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Amount (₹)</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {combinedQuotations.map((q: any) => (
                      <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                          {q.isDocument ? (
                            <button onClick={() => handleDownload(q.doc)} className="hover:underline flex items-center gap-2 text-left">
                              {getFileIcon(q.doc.mimeType, q.doc.name)} {q.quotationNo}
                            </button>
                          ) : (
                            <Link to={`/companydashboard/sales/quotations/${q.id}`} state={{ returnTo: '/companydashboard/projects', openProjectId: currentProject.id }}>{q.quotationNo || 'Unassigned'}</Link>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                          {q.isDocument ? q.date : (q.date ? new Date(q.date).toLocaleDateString('en-GB') : '—')}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                          {(Number(q.grandTotal) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${q.isDocument ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50' : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50'}`}>
                            {q.status || 'Sent'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {!q.isDocument && currentProject.linkedQuotations?.includes(q.id) && (
                            <button
                              onClick={() => handleUnlinkQuotation(q.id)}
                              title="Unlink quotation"
                              className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {combinedQuotations.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No quotations created.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Purchase Orders Table */}
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#121212]">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <ShoppingBag size={16} className="text-gray-500" />
                  Purchase Orders
                </h4>
                <div className="flex items-center gap-4">
                  <button onClick={openLinkPOModal} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    <Plus size={13} /> Link Existing
                  </button>
                  <button onClick={() => openUploadModal('Purchase Order')} className="text-xs font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1">
                    <Upload size={14} /> Upload
                  </button>
                  <Link to="/companydashboard/finance/pos/new" state={{ returnTo: '/companydashboard/projects', openProjectId: currentProject.id }} className="text-xs font-medium text-[#792359] hover:underline">
                    + Create PO
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">PO Number</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Amount (₹)</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {combinedPOs.map((po: any) => (
                      <tr key={po.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                          {po.isDocument ? (
                            <button onClick={() => handleDownload(po.doc)} className="hover:underline flex items-center gap-2 text-left">
                              {getFileIcon(po.doc.mimeType, po.doc.name)} {po.poNumber}
                            </button>
                          ) : (
                            <Link to={`/companydashboard/finance/pos/${po.id}`} state={{ returnTo: '/companydashboard/projects', openProjectId: currentProject.id }}>{po.poNumber || 'Unassigned'}</Link>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{po.vendorName || 'Vendor'}</td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                          {(Number(po.grandTotal) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${po.isDocument ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50'}`}>
                            {po.status || 'Issued'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {!po.isDocument && currentProject.linkedPOs?.includes(po.id) && (
                            <button
                              onClick={() => handleUnlinkPO(po.id)}
                              title="Unlink PO"
                              className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {combinedPOs.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No purchase orders issued.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Documents Table */}
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#121212]">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Paperclip size={16} className="text-gray-500" />
                  Uploaded Documents
                </h4>
                <button onClick={() => fileInputRef.current?.click()} className="text-xs font-medium text-[#792359] hover:underline">
                  + Upload Document
                </button>
              </div>
              <div className="overflow-x-auto flex-1 min-h-[160px]">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Document Name</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {parsedDocuments.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          {getFileIcon(inv.mimeType, inv.name)}
                          <span>{inv.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                            {inv.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{inv.date}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{inv.size}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDownload(inv)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <Download size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {parsedDocuments.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No documents uploaded.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ── TABS CORE CONTENT: INCIDENTS & ENTITIES ── */}
        {activeTab === 'incidents' && (
          <div className="space-y-6">

            {/* Live Incidents Section */}
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#121212]">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-gray-500" />
                  Live Incidents
                </h4>
                <Link to="/companydashboard/tickets/create" state={{ returnTo: '/companydashboard/projects', openProjectId: currentProject.id }} className="text-xs font-medium text-[#792359] hover:underline">
                  + Raise Incident
                </Link>
              </div>
              <div className="overflow-x-auto flex-1 min-h-[160px]">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ticket No</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {projectIncidents.map((t: any, idx: number) => (
                      <tr key={t.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                          <Link to={`/companydashboard/tickets/${t.id}`} state={{ returnTo: '/companydashboard/projects', openProjectId: currentProject.id }}>{t.ticketNo || `INC-2026-00${idx + 1}`}</Link>
                        </td>
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100 truncate max-w-[200px]">{t.shortDescription || t.subject || 'Incident'}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium border bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50">
                            {t.priority || 'Medium'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50">
                            {t.status || 'Open'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {projectIncidents.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No incidents raised.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* List of Entities Section */}
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#121212]">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Users size={16} className="text-gray-500" />
                  List of Entities
                </h4>
                <button onClick={() => setIsAddEntityModalOpen(true)} className="text-xs font-medium text-[#792359] hover:underline">
                  + Add Entity
                </button>
              </div>
              <div className="overflow-x-auto flex-1 min-h-[160px]">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tag</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remarks</th>
                      <th className="px-6 py-3 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {parsedEntities.map((ent, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{ent.name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium border bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50">
                            {ent.tag || 'Vendor'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{ent.remarks || '—'}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleRemoveEntity(idx)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {parsedEntities.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No entities assigned.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ── TABS CORE CONTENT: COMMENTS ── */}
        {activeTab === 'comments' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-gray-500" />
                Notes & Comments Timeline
              </h4>

              <div className="space-y-4">
                <div>
                  <CustomSelect
                    value={selectedPerson}
                    onChange={setSelectedPerson}
                    options={[
                      { label: 'Select Person to Assign Note...', value: '' },
                      { label: `${managerName} (Manager)`, value: managerName },
                      ...(currentProject.client ? [{ label: `${currentProject.client} (Client)`, value: currentProject.client }] : []),
                      ...assignedVendorNames.map(name => ({ label: `${name} (Vendor)`, value: name })),
                      ...parsedEntities.map(ent => ({ label: `${ent.name} (${ent.tag})`, value: ent.name }))
                    ]}
                  />
                </div>
                <textarea
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Type a new internal project note..."
                  rows={3}
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-[#121212] border border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#792359]/20 focus:border-[#792359] transition-all resize-y"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSaving || !noteContent.trim()}
                    className="px-4 py-2 bg-[#792359] hover:bg-[#611b47] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                  >
                    Post Note
                  </button>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {parsedNotes.length > 0 ? parsedNotes.map(n => {
                  const isDeleted = deletedNoteIds.includes(n.id);
                  return (
                    <div key={n.id} className={`flex gap-4 p-4 rounded-lg border transition-all ${isDeleted ? 'bg-gray-50 dark:bg-[#121212] border-transparent opacity-50 grayscale' : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800 shadow-sm'}`}>
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-semibold text-xs shrink-0">
                        {n.person.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex justify-between items-center">
                          <span className={`font-semibold text-gray-900 dark:text-gray-100 ${isDeleted ? 'line-through text-gray-400' : ''}`}>{n.person}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{n.date}</span>
                            {!isDeleted && (
                              <button onClick={() => handleDeleteNote(n.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete Note">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className={`text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${isDeleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>{n.text}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-center text-gray-500 py-4">No project notes recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Interactive Add Entity Modal ── */}
      {isAddEntityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Users className="text-[#792359] dark:text-[#c44997]" size={20} />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Add Entity to Project</h3>
              </div>
              <button
                onClick={() => setIsAddEntityModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEntitySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Entity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe / Acme Services"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className={formStyles.field()}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Tag / Type <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  value={entityTag}
                  onChange={setEntityTag}
                  options={[
                    { label: 'Select type', value: '' },
                    { label: 'Site Engineer', value: 'Site Engineer' },
                    { label: 'Vendor', value: 'Vendor' },
                    { label: 'Contractor', value: 'Contractor' },
                    { label: 'Manager', value: 'Manager' },
                    { label: 'Consultant', value: 'Consultant' },
                    { label: 'Supervisor', value: 'Supervisor' },
                    { label: 'Labour', value: 'Labour' },
                    { label: 'Other', value: 'Other' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Remarks / Notes
                </label>
                <input
                  type="text"
                  placeholder="Optional notes or responsibility"
                  value={entityRemarks}
                  onChange={(e) => setEntityRemarks(e.target.value)}
                  className={formStyles.field()}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddEntityModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-md border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold rounded-md bg-[#792359] text-white hover:bg-[#52173c] disabled:opacity-50"
                >
                  Save Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Document Upload Modal ── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'transparent', pointerEvents: 'auto' }}>
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-gray-800 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] max-w-md w-full animate-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Upload className="text-[#792359] dark:text-[#c44997]" size={20} />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Upload {uploadDocType}</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {uploadDocType} Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={uploadAmount}
                  onChange={(e) => setUploadAmount(e.target.value)}
                  className={formStyles.field()}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Document <span className="text-red-500">*</span>
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-[#1f2128] transition-colors cursor-pointer"
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setUploadFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => uploadFileInputRef.current?.click()}
                >
                  <Upload className="text-gray-400 mb-2" size={24} />
                  {uploadFile ? (
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Drag and drop file here</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">or</p>
                      <button type="button" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-medium border border-gray-200 dark:border-gray-700">
                        Browse Local Storage
                      </button>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={uploadFileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.tif,.tiff,.ico,.heic,.heif,.avif,.pdf,.doc,.docx,.xls,.xlsx"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalUploadSubmit}
                disabled={isSaving || !uploadFile || !uploadAmount}
                className="px-4 py-2 bg-[#792359] hover:bg-[#611b47] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {isSaving ? 'Uploading...' : 'Upload & Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Financial BI Dashboard & Excel Export Modal ── */}
      {isBiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-150 p-6 space-y-6">

            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#792359]/10 text-[#792359] dark:text-[#c44997] font-bold text-xl flex items-center justify-center">
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
              <div className="bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">CASH INFLOWS</span>
                  <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-2">
                  ₹{totalInflows.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">Quotations & Client Invoices</p>
              </div>

              <div className="bg-red-50/50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-red-800 dark:text-red-300 uppercase tracking-wider">CASH OUTFLOWS</span>
                  <TrendingDown size={16} className="text-red-600 dark:text-red-400" />
                </div>
                <p className="text-xl font-extrabold text-red-900 dark:text-red-200 mt-2">
                  ₹{totalOutflows.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-red-700 dark:text-red-400 mt-1">POs Issued + Site Expenses</p>
              </div>

              <div className="bg-[#792359]/5 dark:bg-[#792359]/20 border border-[#792359]/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#792359] dark:text-[#c44997] uppercase tracking-wider">NET PROFIT / MARGIN</span>
                  <DollarSign size={16} className="text-[#792359] dark:text-[#c44997]" />
                </div>
                <p className="text-xl font-extrabold text-[#792359] dark:text-[#e6a8d0] mt-2">
                  ₹{netMargin.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-[#792359] dark:text-[#e6a8d0] mt-1">Net Margin Contribution</p>
              </div>

              <div className="bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">MARGIN %</span>
                  <PieChart size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xl font-extrabold text-blue-900 dark:text-blue-200 mt-2">
                  {marginPercentage}%
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-1">Profitability Percentage</p>
              </div>
            </div>

            {/* Financial Ledger Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ITEMIZED FINANCIAL CASHFLOW LEDGER
              </h3>

              <div className="border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
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
                    {projectQuotations.map((q: any, idx: number) => (
                      <tr key={`in-${idx}`} className="bg-emerald-50/20 dark:bg-emerald-500/[0.02]">
                        <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400">Inflow</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{q.quotationNo || 'Unassigned'}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Sales Quotation</td>
                        <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400 text-right">
                          + ₹{(Number(q.grandTotal) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">{q.status || 'Sent'}</span></td>
                      </tr>
                    ))}
                    {/* Outflows */}
                    {projectPOs.map((po: any, idx: number) => (
                      <tr key={`po-${idx}`} className="bg-red-50/20 dark:bg-red-500/[0.02]">
                        <td className="px-4 py-3 font-bold text-red-700 dark:text-red-400">Outflow</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{po.poNumber || 'Unassigned'}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Purchase Order</td>
                        <td className="px-4 py-3 font-bold text-red-700 dark:text-red-400 text-right">
                          - ₹{(Number(po.grandTotal) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">{po.status || 'Issued'}</span></td>
                      </tr>
                    ))}
                    {projectExpenses.map((ex: any, idx: number) => (
                      <tr key={`ex-${idx}`} className="bg-red-50/20 dark:bg-red-500/[0.02]">
                        <td className="px-4 py-3 font-bold text-red-700 dark:text-red-400">Outflow</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{ex.description || 'Expense'}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Operating Expense</td>
                        <td className="px-4 py-3 font-bold text-red-700 dark:text-red-400 text-right">
                          - ₹{(Number(ex.amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">Paid</span></td>
                      </tr>
                    ))}
                    {projectQuotations.length === 0 && projectPOs.length === 0 && projectExpenses.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-400">
                          No financial transactions recorded for this project yet.
                        </td>
                      </tr>
                    )}
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

      {/* ── Link Existing Quotation Modal ── */}
      {isLinkQuotationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg mx-4 flex flex-col max-h-[80vh]">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Link Existing Quotation</h3>
              <button onClick={() => setIsLinkQuotationModalOpen(false)} className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
              <input
                type="text"
                placeholder="Search by quotation number or client..."
                value={quotationSearch}
                onChange={e => setQuotationSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#792359]/40"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {availableQuotations.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-500">Loading quotations…</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-[#121212] sticky top-0">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quotation No.</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Client</th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      <th className="px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {availableQuotations
                      .filter(q => {
                        const s = quotationSearch.toLowerCase();
                        return !s || (q.quotationNo || '').toLowerCase().includes(s) || (q.clientName || '').toLowerCase().includes(s);
                      })
                      .map((q: any) => {
                        const isLinked = currentProject.linkedQuotations?.includes(q.id);
                        return (
                          <tr key={q.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isLinked ? 'bg-emerald-50/40 dark:bg-emerald-900/10' : ''}`}>
                            <td className="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">{q.quotationNo || '—'}</td>
                            <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{q.clientName || '—'}</td>
                            <td className="px-5 py-3 text-right text-gray-700 dark:text-gray-300">
                              ₹{(Number(q.grandTotal) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50">
                                {q.status || 'Draft'}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              {isLinked ? (
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Linked</span>
                              ) : (
                                <button
                                  onClick={() => handleLinkQuotation(q.id)}
                                  disabled={isLinkingQuotation}
                                  className="px-3 py-1 text-xs font-medium bg-[#792359] hover:bg-[#52173c] text-white rounded-md transition-colors disabled:opacity-60"
                                >
                                  Link
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Link Existing PO Modal ── */}
      {isLinkPOModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg mx-4 flex flex-col max-h-[80vh]">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Link Existing Purchase Order</h3>
              <button onClick={() => setIsLinkPOModalOpen(false)} className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
              <input
                type="text"
                placeholder="Search by PO number or vendor..."
                value={poSearch}
                onChange={e => setPoSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#792359]/40"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {availablePOs.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-500">Loading purchase orders…</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-[#121212] sticky top-0">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">PO Number</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Vendor</th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      <th className="px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {availablePOs
                      .filter(po => {
                        const s = poSearch.toLowerCase();
                        return !s || (po.poNumber || '').toLowerCase().includes(s) || (po.vendorName || '').toLowerCase().includes(s);
                      })
                      .map((po: any) => {
                        const isLinked = currentProject.linkedPOs?.includes(po.id);
                        return (
                          <tr key={po.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isLinked ? 'bg-emerald-50/40 dark:bg-emerald-900/10' : ''}`}>
                            <td className="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">{po.poNumber || '—'}</td>
                            <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{po.vendorName || '—'}</td>
                            <td className="px-5 py-3 text-right text-gray-700 dark:text-gray-300">
                              ₹{(Number(po.grandTotal) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50">
                                {po.status || 'Draft'}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              {isLinked ? (
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Linked</span>
                              ) : (
                                <button
                                  onClick={() => handleLinkPO(po.id)}
                                  disabled={isLinkingPO}
                                  className="px-3 py-1 text-xs font-medium bg-[#792359] hover:bg-[#52173c] text-white rounded-md transition-colors disabled:opacity-60"
                                >
                                  Link
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
