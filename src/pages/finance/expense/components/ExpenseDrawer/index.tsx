import React from 'react';
import { FormProvider } from 'react-hook-form';
import { X, Loader2, Save } from 'lucide-react';
import { useExpenseForm } from '../../hooks/useExpenseForm';
import type { ExpenseFormValues } from '../../validators/expenseValidation';
import ExpenseFormSection from './sections/ExpenseFormSection';
import type { Expense, ExpenseCategory } from '@/types/expense.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExpenseFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<Expense>;
  expenseId?: string;
  isSubmitting?: boolean;
}

export default function ExpenseDrawer({ isOpen, onClose, onSave, mode, initialData, expenseId, isSubmitting }: Props) {
  const form = useExpenseForm();

  React.useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        form.reset({
          projectId: initialData.projectId || '',
          expenseDate: initialData.expenseDate || new Date().toISOString().split('T')[0],
          category: (initialData.category as ExpenseCategory) || 'Travel',
          description: initialData.description || '',
          amount: initialData.amount || undefined,
          paidBy: initialData.paidBy || '',
          receiptName: initialData.receiptName || '',
          isGstApplicable: initialData.isGstApplicable || false,
          gstAmount: initialData.gstAmount || undefined,
          isInputCreditClaimable: initialData.isInputCreditClaimable || false,
        });
      } else {
        form.reset({
          projectId: '',
          expenseDate: new Date().toISOString().split('T')[0],
          category: 'Travel',
          description: '',
          amount: undefined,
          paidBy: '',
          receiptName: '',
          isGstApplicable: false,
          gstAmount: undefined,
          isInputCreditClaimable: false,
        });
      }
    }
  }, [isOpen, initialData, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: ExpenseFormValues) => {
    await onSave(data);
  };

  const drawerTitle = mode === 'create'
    ? 'Add Expense'
    : mode === 'edit'
      ? 'Edit Expense'
      : 'View Expense';

  const drawerSubtitle = mode === 'create'
    ? 'Record a new project expense.'
    : `Expense ID: ${expenseId || initialData?.id || '—'}`;

  return (
    <div
      className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-[#181a1f] shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-white/10 transition-transform duration-300 ease-in-out"
      style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
    >
      {/* Drawer Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02] shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {drawerTitle}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {drawerSubtitle}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <FormProvider {...form}>
          <form id="expense-drawer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ExpenseFormSection readOnly={readOnly} />
          </form>
        </FormProvider>
      </div>

      {/* Drawer Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors"
        >
          {mode === 'view' ? 'Close' : 'Cancel'}
        </button>

        {!readOnly && (
          <button
            type="submit"
            form="expense-drawer-form"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#792359] hover:bg-[#52173c] disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors flex items-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {mode === 'create' ? 'Save Expense' : 'Update Expense'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
