import { useState, useEffect } from 'react';
import { 
  X, Edit, Receipt, DollarSign, 
  Paperclip, Info, Activity
} from 'lucide-react';
import type { Expense } from '../../../../types/expense.types';
import { ExpenseService } from '../../../../services/expense.service';

interface Props {
  expense: Expense;
  onClose: () => void;
  onEdit: () => void;
}

export default function ExpenseProfileView({ expense: initialExpense, onClose, onEdit }: Props) {
  const [expense, setExpense] = useState<Expense>(initialExpense);
  const [activeTab, setActiveTab] = useState<'overview'>('overview');

  useEffect(() => {
    if (initialExpense.id) {
      ExpenseService.getById(initialExpense.id)
        .then(data => {
          if (data) setExpense(data);
        })
        .catch(console.error);
    }
  }, [initialExpense.id]);

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

  return (
    <div className="w-full bg-gray-50 dark:bg-[#0a0a0a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col min-h-[calc(100vh-8rem)] overflow-hidden transition-colors duration-300">
      
      {/* ── 1. Header Section ── */}
      <div className="px-6 py-5 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#792359] text-white flex items-center justify-center rounded-lg text-2xl font-bold shrink-0 shadow-sm">
            <Receipt size={24} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {expense.expenseNo || 'Expense Details'}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {expense.category}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50">
                Paid by: {expense.paidBy}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#792359] hover:bg-[#52173c] text-white rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <Edit size={16} /> 
            <span>Edit Expense</span>
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
          { id: 'overview', label: 'Overview', icon: <Activity size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT PROFILE COLUMN */}
            <div className="space-y-6">
              
              {/* Expense Details Box */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Expense Details</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Date</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{formatDate(expense.expenseDate)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Project</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{expense.projectName || expense.projectId || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Description</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{expense.description || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Attachment</span>
                    <div className="text-sm text-gray-900 dark:text-gray-200">
                      {expense.receiptName ? (
                        <div className="flex items-center gap-1.5 text-sm text-[#792359] dark:text-[#e6a8d0]">
                          <Paperclip size={14} />
                          <span className="truncate max-w-[200px]" title={expense.receiptName}>{expense.receiptName}</span>
                  </div>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              
              {/* Financials Box */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Financials</h4>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Total Amount</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">GST Applicable</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{expense.isGstApplicable ? 'Yes' : 'No'}</span>
                  </div>
                  
                  {expense.isGstApplicable && (
                    <>
                      <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">GST Amount</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{expense.gstAmount ? formatCurrency(expense.gstAmount) : '-'}</span>
                  </div>
                      <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Input Credit Claimable</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{expense.isInputCreditClaimable ? 'Yes' : 'No'}</span>
                  </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
