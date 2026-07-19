import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, MoreVertical, ShoppingCart,
  ChevronLeft, ChevronRight, Loader2, FileText,
  CheckCircle2, Clock, XCircle, Truck, Package, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { POService } from '../../services/po.service';
import { useProjects } from '../../hooks/useProjects';
import type { PurchaseOrder, POStatus } from '../../types/po.types';
import { getNextSequenceNumber } from '@/utils/sequence';
import PODrawer from './po/components/PODrawer';
import type { POFormValues } from './po/validators/poValidation';

import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
import { VendorService } from '../../services/vendor.service';
import type { Vendor } from '../../types/vendor.types';
import CustomSelect from '@/components/ui/CustomSelect';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// ---------- Status helpers ----------

const STATUS_STYLES: Record<POStatus, string> = {
  Draft: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-500/20',
  'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  Ordered: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  'Partially Received': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
  Completed: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20',
  Cancelled: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
};

const STATUS_ICONS: Record<POStatus, React.ReactNode> = {
  Draft: <FileText size={11} />,
  'Pending Approval': <Clock size={11} />,
  Approved: <CheckCircle2 size={11} />,
  Ordered: <Truck size={11} />,
  'Partially Received': <Package size={11} />,
  Completed: <CheckCircle2 size={11} />,
  Cancelled: <XCircle size={11} />,
};

const ALL_STATUSES: POStatus[] = [
  'Draft', 'Pending Approval', 'Approved', 'Ordered',
  'Partially Received', 'Completed', 'Cancelled',
];

// ---------- Component ----------

export default function POManagement() {
  const navigate = useNavigate();
  const { selectedCompanyId } = useAuth();
  const { projects } = useProjects();
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useBreadcrumbs([
    { label: 'Finance', path: '/companydashboard/finance' },
    { label: 'Purchase Orders' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Dropdown
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLTableCellElement>(null);

  // ---------- Data fetching ----------

  useEffect(() => {
    fetchData();
  }, [selectedCompanyId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!selectedCompanyId) return;
      const [poData, vendorData] = await Promise.all([
        POService.getAll(selectedCompanyId),
        VendorService.getVendors(selectedCompanyId),
      ]);
      setPos(poData);
      setVendors(vendorData);
    } catch {
      toast.error('Failed to load purchase orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSavePO = async (data: POFormValues) => {
    setIsSubmitting(true);
    try {
      const vendor = vendors.find(v => v.id === data.vendorId);
      const project = projects.find(p => p.id === data.projectId);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { discountPercentage, ...restData } = data;
      const payload = {
        ...restData,
        vendorName: vendor?.displayName || data.vendorName || '',
        projectName: project?.projectName || '',
      };

      if (drawerMode === 'create') {
        if (!selectedCompanyId) throw new Error('No company ID');
        await POService.create(selectedCompanyId, payload as Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Purchase Order created successfully');
      } else if (selectedPO) {
        await POService.update(selectedPO.id, payload as Omit<PurchaseOrder, 'id' | 'createdAt'>);
        toast.success('Purchase Order updated successfully');
      }
      setIsDrawerOpen(false);
      setCurrentPage(1);
      fetchData();
    } catch {
      toast.error('Failed to save Purchase Order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (po: PurchaseOrder) => {
    setOpenDropdownId(null);
    if (!window.confirm(`Cancel/delete PO ${po.poNumber}? This cannot be undone.`)) return;
    try {
      await POService.delete(po.id);
      toast.success(`PO ${po.poNumber} deleted`);
      fetchData();
    } catch {
      toast.error('Failed to delete Purchase Order');
    }
  };


  // ---------- Filtering & pagination ----------

  const filtered = pos.filter(po => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      po.poNumber.toLowerCase().includes(term) ||
      (po.vendorName || '').toLowerCase().includes(term) ||
      (po.projectName || '').toLowerCase().includes(term) ||
      (po.description || '').toLowerCase().includes(term);

    const matchProject = !filterProject || po.projectId === filterProject;
    const matchVendor = !filterVendor || po.vendorId === filterVendor;
    const matchStatus = !filterStatus || po.status === filterStatus;

    return matchSearch && matchProject && matchVendor && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const idxLast = currentPage * itemsPerPage;
  const idxFirst = idxLast - itemsPerPage;
  const currentItems = filtered.slice(idxFirst, idxLast);

  const resetPage = () => setCurrentPage(1);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const formatAmount = (n: number) =>
    n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ---------- Render ----------

  if (isDrawerOpen) {
    return (
      <div className="max-w-[1400px] mx-auto pb-12">
        <PODrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSavePO}
          mode={drawerMode}
          initialData={selectedPO || undefined}
          poNumber={selectedPO?.poNumber}
          isSubmitting={isSubmitting}
          nextNumber={getNextSequenceNumber(pos, 'poNumber')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Purchase Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage vendor POs, track delivery status and approvals.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setSelectedPO(null); setDrawerMode('create'); setIsDrawerOpen(true); }}
            className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
          >
            <Plus size={16} />
            Create PO
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">

        {/* Filters row */}
        <div className="p-4 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex flex-wrap gap-2">
            {/* Project filter */}
            <div className="w-40 shrink-0">
              <CustomSelect
                value={filterProject}
                onChange={val => { setFilterProject(val); resetPage(); }}
                options={[
                  { label: 'All Projects', value: '' },
                  ...projects.map(p => ({ label: p.projectName, value: p.id }))
                ]}
              />
            </div>

            {/* Vendor filter */}
            <div className="w-48 shrink-0">
              <CustomSelect
                value={filterVendor}
                onChange={val => { setFilterVendor(val); resetPage(); }}
                options={[
                  { label: 'All Vendors', value: '' },
                  ...vendors.map(v => ({ label: v.displayName || v.id, value: v.id }))
                ]}
              />
            </div>

            {/* Status filter */}
            <div className="w-48 shrink-0">
              <CustomSelect
                value={filterStatus}
                onChange={val => { setFilterStatus(val); resetPage(); }}
                options={[
                  { label: 'All Statuses', value: '' },
                  ...ALL_STATUSES.map(s => ({ label: s, value: s }))
                ]}
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search PO no., vendor, project…"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); resetPage(); }}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#792359] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[320px] pb-32">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-24">
              <Loader2 className="w-8 h-8 animate-spin text-[#792359]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-500">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p className="text-base font-medium text-gray-900 dark:text-white">No Purchase Orders found</p>
              <p className="text-sm mt-1">
                {searchTerm || filterProject || filterVendor || filterStatus
                  ? 'Try adjusting your filters or search term.'
                  : 'Create your first PO by clicking "Create PO".'}
              </p>
              {(searchTerm || filterProject || filterVendor || filterStatus) && (
                <button
                  onClick={() => { setSearchTerm(''); setFilterProject(''); setFilterVendor(''); setFilterStatus(''); }}
                  className="mt-3 text-sm text-[#792359] dark:text-[#c44997] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">PO Number</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">PO Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-right">Amount (₹)</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {currentItems.map(po => (
                  <tr
                    key={po.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors text-sm group"
                  >
                    {/* PO Number */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/companydashboard/finance/pos/${po.id || po.poNumber}`)}
                        className="font-semibold text-[#792359] dark:text-[#c44997] hover:underline"
                      >
                        {po.poNumber || '—'}
                      </button>
                      {po.description && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-[160px]" title={po.description}>
                          {po.description}
                        </p>
                      )}
                    </td>

                    {/* Vendor */}
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {po.vendorName || 'Unknown Vendor'}
                    </td>

                    {/* Project */}
                    <td className="px-6 py-4">
                      
                      {po.projectName && (
                        <p className="text-sm text-black dark:text-white">{po.projectName}</p>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(po.poDate)}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">
                      {formatAmount(po.grandTotal)}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-semibold border ${STATUS_STYLES[po.status]}`}>
                        {STATUS_ICONS[po.status]}
                        {po.status}
                      </span>
                    </td>

                    {/* Actions dropdown */}
                    <td className="px-6 py-4 text-center relative" ref={openDropdownId === po.id ? dropdownRef : undefined}>
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === po.id ? null : po.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors inline-flex"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdownId === po.id && (
                        <div className="absolute right-8 top-10 w-36 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-lg z-20 py-1 text-left">
                          <button
                            onClick={() => navigate(`/companydashboard/finance/pos/${po.id || po.poNumber}`)}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => { setSelectedPO(po); setDrawerMode('edit'); setIsDrawerOpen(true); }}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                          >
                            Edit
                          </button>
                          <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                          <button
                            onClick={() => handleDelete(po)}
                            className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filtered.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {idxFirst + 1}–{Math.min(idxLast, filtered.length)} of {filtered.length} entries
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
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
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Statistics row ── */}
      {!isLoading && pos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total POs',
              value: pos.length,
              icon: <ShoppingCart size={18} className="text-[#792359] dark:text-[#c44997]" />,
              bg: 'bg-[#792359]/5 dark:bg-[#792359]/10',
            },
            {
              label: 'Pending Approval',
              value: pos.filter(p => p.status === 'Pending Approval').length,
              icon: <AlertCircle size={18} className="text-amber-500" />,
              bg: 'bg-amber-50 dark:bg-amber-500/10',
            },
            {
              label: 'Approved / Ordered',
              value: pos.filter(p => p.status === 'Approved' || p.status === 'Ordered').length,
              icon: <CheckCircle2 size={18} className="text-emerald-500" />,
              bg: 'bg-emerald-50 dark:bg-emerald-500/10',
            },
            {
              label: 'Total Value (₹)',
              value: `${pos.reduce((s, p) => s + p.grandTotal, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
              icon: <Package size={18} className="text-blue-500" />,
              bg: 'bg-blue-50 dark:bg-blue-500/10',
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm p-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
