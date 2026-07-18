import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, MoreVertical, Banknote,
  ChevronLeft, ChevronRight, Loader2, CheckCircle2,
  Clock, XCircle, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PaymentService } from '../../services/payment.service';
import type { PaymentRecord } from '../../types/payment.types';
import PaymentDrawer from './payment/components/PaymentDrawer';
import type { PaymentFormValues } from './payment/validators/paymentValidation';
import { useProjects } from '../../hooks/useProjects';
import CustomSelect from '@/components/ui/CustomSelect';
import { useAuth } from '../../contexts/AuthContext';

const STATUS_STYLES: Record<PaymentRecord['status'], string> = {
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  Failed: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  Refunded: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20',
};

const STATUS_ICONS: Record<PaymentRecord['status'], React.ReactNode> = {
  Completed: <CheckCircle2 size={11} />,
  Pending: <Clock size={11} />,
  Failed: <XCircle size={11} />,
  Refunded: <FileText size={11} />,
};

export default function PaymentManagement() {
  const { selectedCompanyId } = useAuth();
  const { projects } = useProjects();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Dropdown
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    fetchData();
  }, [selectedCompanyId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (selectedCompanyId) {
        const data = await PaymentService.getAll(selectedCompanyId);
        setPayments(data);
      }
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openDrawer = (mode: 'create' | 'edit' | 'view', payment?: PaymentRecord) => {
    setDrawerMode(mode);
    setSelectedPayment(payment || null);
    setIsDrawerOpen(true);
    setOpenDropdownId(null);
  };

  const handleSave = async (data: PaymentFormValues) => {
    setIsSubmitting(true);
    try {
      if (!selectedCompanyId) throw new Error('No company ID');
      const project = projects.find(p => p.id === data.projectId);
      const payload = {
        ...data,
        projectName: project?.projectName || '',
      };

      if (drawerMode === 'create') {
        await PaymentService.create(selectedCompanyId, payload as any);
        toast.success('Payment recorded successfully');
      } else if (selectedPayment) {
        await PaymentService.update(selectedPayment.id, payload as any);
        toast.success('Payment updated successfully');
      }
      setIsDrawerOpen(false);
      setCurrentPage(1);
      fetchData();
    } catch {
      toast.error('Failed to save payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (payment: PaymentRecord) => {
    setOpenDropdownId(null);
    if (!window.confirm(`Delete payment ${payment.paymentId}? This cannot be undone.`)) return;
    try {
      await PaymentService.delete(payment.id);
      toast.success(`Payment deleted`);
      fetchData();
    } catch {
      toast.error('Failed to delete payment');
    }
  };

  const filtered = payments.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      p.paymentId.toLowerCase().includes(term) ||
      (p.projectName || '').toLowerCase().includes(term) ||
      (p.referenceId || '').toLowerCase().includes(term);

    const matchProject = !filterProject || p.projectId === filterProject;
    const matchStatus = !filterStatus || p.status === filterStatus;

    return matchSearch && matchProject && matchStatus;
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

  if (isDrawerOpen) {
    return (
      <div className="max-w-[1400px] mx-auto pb-12">
        <PaymentDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSave}
          mode={drawerMode}
          initialData={selectedPayment || undefined}
          paymentId={selectedPayment?.paymentId}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-1">
            <span>Finance</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-gray-200">Payments</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Payments
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Track inward and outward payment records
          </p>
        </div>
        <button
          onClick={() => openDrawer('create')}
          className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm"
        >
          <Plus size={16} />
          Record Payment
        </button>
      </div>

      <div className="bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex flex-wrap gap-2">
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
            <div className="w-40 shrink-0">
              <CustomSelect
                value={filterStatus}
                onChange={val => { setFilterStatus(val); resetPage(); }}
                options={[
                  { label: 'All Statuses', value: '' },
                  ...Object.keys(STATUS_STYLES).map(s => ({ label: s, value: s }))
                ]}
              />
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search ID, Ref..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); resetPage(); }}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm focus:outline-none focus:border-[#792359] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[320px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-24">
              <Loader2 className="w-8 h-8 animate-spin text-[#792359]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Banknote size={48} className="mb-4 opacity-20" />
              <p className="text-base font-medium text-gray-900 dark:text-white">No Payments found</p>
            </div>
          ) : (
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Payment ID</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Project</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Method & Ref</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase text-right">Amount (₹)</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {currentItems.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors text-sm">
                    <td className="px-6 py-4">
                      <button onClick={() => openDrawer('view', p)} className="font-semibold text-[#792359] dark:text-[#c44997] hover:underline">
                        {p.paymentId}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {p.projectId ? (
                        <>
                          <span className="font-medium text-gray-900 dark:text-white">{p.projectId}</span>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{p.projectName}</p>
                        </>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">{p.paymentMethod}</span>
                      {p.referenceId && <p className="text-xs text-gray-400 dark:text-gray-500">{p.referenceId}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(p.paymentDate)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">
                      {formatAmount(p.amountPaid)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-semibold border ${STATUS_STYLES[p.status]}`}>
                        {STATUS_ICONS[p.status]}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center relative" ref={openDropdownId === p.id ? dropdownRef : undefined}>
                      <button onClick={() => setOpenDropdownId(openDropdownId === p.id ? null : p.id)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                        <MoreVertical size={16} />
                      </button>
                      {openDropdownId === p.id && (
                        <div className="absolute right-8 top-10 w-36 bg-white border border-gray-200 rounded-sm shadow-lg z-20 py-1 text-left">
                          <button onClick={() => openDrawer('view', p)} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">View</button>
                          <button onClick={() => openDrawer('edit', p)} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">Edit</button>
                          <div className="border-t border-gray-100 my-1" />
                          <button onClick={() => handleDelete(p)} className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">Delete</button>
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
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm font-medium transition-colors ${currentPage === page ? 'bg-[#792359] text-white shadow-sm' : 'border border-gray-300 dark:border-white/10 text-gray-600 hover:bg-gray-50'}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
