import { useState, useEffect } from 'react';
import { X, Edit, Paperclip } from 'lucide-react';
import type { Expense } from '../../../../types/expense.types';
import { ExpenseService } from '../../../../services/expense.service';

interface Props {
  expense: Expense;
  onClose: () => void;
  onEdit: () => void;
}

export default function ExpenseProfileView({ expense: initialExpense, onClose, onEdit }: Props) {
  const [expense, setExpense] = useState<Expense>(initialExpense);

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
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] flex items-center justify-center rounded-sm border border-[#792359]/10 dark:border-[#e6a8d0]/10 text-3xl font-bold">
            E
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {expense.id ? `EXP-${expense.id.substring(0, 6).toUpperCase()}` : 'Expense Details'}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-white border border-gray-200 text-gray-800 dark:bg-transparent dark:text-gray-300 dark:border-white/20 shadow-sm">
                {expense.category}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] border border-[#792359]/20 dark:border-[#e6a8d0]/20 shadow-sm">
                Paid by: {expense.paidBy}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 dark:bg-transparent dark:border-white/20 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm"
          >
            <Edit size={16} className="text-[#792359] dark:text-[#e6a8d0]" /> Edit Expense
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
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Expense Details Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Expense Details</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-gray-500 dark:text-gray-400">Date</div>
                <div className="text-gray-900 dark:text-gray-100 font-medium">{formatDate(expense.expenseDate)}</div>

                <div className="text-gray-500 dark:text-gray-400">Project</div>
                <div className="text-gray-900 dark:text-gray-100 font-medium">{expense.projectName || expense.projectId || '-'}</div>

                <div className="text-gray-500 dark:text-gray-400">Description</div>
                <div className="text-gray-900 dark:text-gray-100">{expense.description || '-'}</div>

                <div className="text-gray-500 dark:text-gray-400">Attachment</div>
                <div className="text-gray-900 dark:text-gray-100">
                  {expense.receiptName ? (
                    <div className="flex items-center gap-1.5 text-sm text-[#792359] dark:text-[#e6a8d0]">
                      <Paperclip size={14} />
                      <span className="truncate max-w-[150px]" title={expense.receiptName}>{expense.receiptName}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Financials Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Financials</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-gray-500 dark:text-gray-400">Total Amount</div>
                <div className="text-gray-900 dark:text-gray-100 font-bold">{formatCurrency(expense.amount)}</div>

                <div className="text-gray-500 dark:text-gray-400">GST Applicable</div>
                <div className="text-gray-900 dark:text-gray-100">{expense.isGstApplicable ? 'Yes' : 'No'}</div>

                {expense.isGstApplicable && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">GST Amount</div>
                    <div className="text-gray-900 dark:text-gray-100 font-medium">{expense.gstAmount ? formatCurrency(expense.gstAmount) : '-'}</div>

                    <div className="text-gray-500 dark:text-gray-400">Input Credit Claimable</div>
                    <div className="text-gray-900 dark:text-gray-100">{expense.isInputCreditClaimable ? 'Yes' : 'No'}</div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
