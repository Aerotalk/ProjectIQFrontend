import { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, MoreVertical, CreditCard,
  ChevronLeft, ChevronRight, Loader2, IndianRupee,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ExpenseService } from '../../services/expense.service';
import type { Expense } from '../../types/expense.types';
import ExpenseDrawer from './expense/components/ExpenseDrawer';
import type { ExpenseFormValues } from './expense/validators/expenseValidation';
import { MOCK_PROJECTS } from '../../services/po.service';

const EXPENSE_CATEGORIES = [
  'Travel',
  'Accommodation',
  'Petty Cash',
  'Material',
  'Labour (non-vendor)',
  'Communication',
  'Miscellaneous'
];

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Dropdown
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const companyId = localStorage.getItem('selectedCompanyId') || '';
      const data = await ExpenseService.getAll(companyId);
      setExpenses(data);
    } catch {
      toast.error('Failed to load expenses');
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

  const openDrawer = (mode: 'create' | 'edit' | 'view', expense?: Expense) => {
    setDrawerMode(mode);
    setSelectedExpense(expense || null);
    setIsDrawerOpen(true);
    setOpenDropdownId(null);
  };

  const handleSaveExpense = async (data: ExpenseFormValues) => {
    setIsSubmitting(true);
    try {
      const companyId = localStorage.getItem('selectedCompanyId') || '';
      const project = MOCK_PROJECTS.find(p => p.id === data.projectId);

      const payload = {
        ...data,
        projectName: project?.name || data.projectName || '',
      };

      if (drawerMode === 'create') {
        await ExpenseService.create(companyId, payload as Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Expense created successfully');
      } else if (selectedExpense) {
        await ExpenseService.update(selectedExpense.id, payload as Omit<Expense, 'id' | 'createdAt'>);
        toast.success('Expense updated successfully');
      }
      setIsDrawerOpen(false);
      setCurrentPage(1);
      fetchData();
    } catch {
      toast.error('Failed to save Expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (expense: Expense) => {
    setOpenDropdownId(null);
    if (!window.confirm(`Delete Expense ${expense.id}? This cannot be undone.`)) return;
    try {
      await ExpenseService.delete(expense.id);
      toast.success(`Expense ${expense.id} deleted`);
      fetchData();
    } catch {
      toast.error('Failed to delete Expense');
    }
  };

  const filtered = expenses.filter(ex => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      ex.id.toLowerCase().includes(term) ||
      (ex.description || '').toLowerCase().includes(term) ||
      (ex.projectName || '').toLowerCase().includes(term) ||
      (ex.paidBy || '').toLowerCase().includes(term);

    const matchProject = !filterProject || ex.projectId === filterProject;
    const matchCategory = !filterCategory || ex.category === filterCategory;

    return matchSearch && matchProject && matchCategory;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const selectClass =
    'px-3 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#792359] transition-colors';

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-1">
            <span>Projects</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-gray-200">Expenses</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Expenses
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Log and track all project-related expenses.
          </p>
        </div>
        <button
          onClick={() => openDrawer('create')}
          className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
        
        {/* Filters row */}
        <div className="p-4 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex flex-wrap gap-2">
            {/* Project filter */}
            <select
              value={filterProject}
              onChange={e => { setFilterProject(e.target.value); resetPage(); }}
              className={selectClass}
            >
              <option value="">All Projects</option>
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.id}</option>
              ))}
            </select>

            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={e => { setFilterCategory(e.target.value); resetPage(); }}
              className={selectClass}
            >
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search expenses..."
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
              <CreditCard size={48} className="mb-4 opacity-20" />
              <p className="text-base font-medium text-gray-900 dark:text-white">No Expenses found</p>
              <p className="text-sm mt-1">
                {searchTerm || filterProject || filterCategory
                  ? 'Try adjusting your filters or search term.'
                  : 'Add your first expense by clicking "Add Expense".'}
              </p>
              {(searchTerm || filterProject || filterCategory) && (
                <button
                  onClick={() => { setSearchTerm(''); setFilterProject(''); setFilterCategory(''); }}
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
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Expense ID</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-right">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {currentItems.map(ex => (
                  <tr
                    key={ex.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors text-sm group"
                  >
                    {/* Expense ID */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDrawer('view', ex)}
                        className="font-semibold text-[#792359] dark:text-[#c44997] hover:underline"
                      >
                        {ex.id}
                      </button>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 max-w-[150px] truncate" title={ex.description}>
                        {ex.description}
                      </p>
                    </td>

                    {/* Project */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">{ex.projectId}</span>
                      {ex.projectName && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">{ex.projectName}</p>
                      )}
                    </td>

                    {/* Category & Paid By */}
                    <td className="px-6 py-4">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{ex.category}</span>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">By {ex.paidBy}</p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(ex.expenseDate)}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                      {formatCurrency(ex.amount)}
                      {ex.isGstApplicable && ex.gstAmount && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-0.5">
                          incl. GST {formatCurrency(ex.gstAmount)}
                        </p>
                      )}
                    </td>

                    {/* Actions dropdown */}
                    <td className="px-6 py-4 text-center relative" ref={openDropdownId === ex.id ? dropdownRef : undefined}>
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === ex.id ? null : ex.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors inline-flex"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdownId === ex.id && (
                        <div className="absolute right-8 top-10 w-36 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-lg z-20 py-1 text-left">
                          <button
                            onClick={() => openDrawer('view', ex)}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openDrawer('edit', ex)}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                          >
                            Edit
                          </button>
                          <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                          <button
                            onClick={() => handleDelete(ex)}
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
      {!isLoading && expenses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 bg-[#792359]/5 dark:bg-[#792359]/10">
              <IndianRupee size={18} className="text-[#792359] dark:text-[#c44997]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Expenses Logged</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(expenses.reduce((sum, ex) => sum + ex.amount, 0))}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-500/10">
              <CreditCard size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">GST Claimable (Total)</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(expenses.reduce((sum, ex) => sum + (ex.isInputCreditClaimable && ex.gstAmount ? ex.gstAmount : 0), 0))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Expense Drawer ── */}
      <ExpenseDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveExpense}
        mode={drawerMode}
        initialData={selectedExpense || undefined}
        expenseId={selectedExpense?.id}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
