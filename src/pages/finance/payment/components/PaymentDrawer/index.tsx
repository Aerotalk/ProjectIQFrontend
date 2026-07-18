import { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { usePaymentForm } from '../../hooks/usePaymentForm';
import type { PaymentRecord } from '../../../../../types/payment.types';
import PaymentFormSection from './sections/PaymentFormSection';
import type { PaymentFormValues } from '../../validators/paymentValidation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PaymentFormValues) => void;
  mode: 'create' | 'edit' | 'view';
  initialData?: PaymentRecord;
  paymentId?: string;
  isSubmitting?: boolean;
  nextNumber?: number;
}

export default function PaymentDrawer({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData,
  paymentId,
  isSubmitting,
  nextNumber
}: Props) {
  const form = usePaymentForm();
  const { reset, handleSubmit } = form;

  useEffect(() => {
    if (isOpen) {
      if (mode === 'create') {
        reset({
          projectId: '',
          linkedInvoiceId: '',
          linkedInvoiceNumber: '',
          paymentDate: new Date().toISOString().split('T')[0],
          amountPaid: 0,
          paymentMethod: 'Bank Transfer',
          referenceId: '',
          notes: '',
          status: 'Completed',
        });
      } else if (initialData) {
        reset({
          projectId: initialData.projectId || '',
          linkedInvoiceId: initialData.linkedInvoiceId || '',
          linkedInvoiceNumber: initialData.linkedInvoiceNumber || '',
          paymentDate: initialData.paymentDate || new Date().toISOString().split('T')[0],
          amountPaid: initialData.amountPaid || 0,
          paymentMethod: initialData.paymentMethod || 'Bank Transfer',
          referenceId: initialData.referenceId || '',
          notes: initialData.notes || '',
          status: initialData.status || 'Completed',
        });
      }
    }
  }, [isOpen, mode, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Create Payment' : mode === 'edit' ? 'Edit Payment' : 'View Payment'}
            </h2>
            {paymentId && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {paymentId}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <FormProvider {...form}>
            <form id="payment-form" onSubmit={handleSubmit(onSave)}>
              <PaymentFormSection readOnly={mode === 'view'} nextNumber={nextNumber} />
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
        {mode !== 'view' && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-300 dark:border-white/10 rounded-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="payment-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#792359] hover:bg-[#52173c] rounded-sm transition-colors disabled:opacity-50"
            >
              <Check size={16} />
              {isSubmitting ? 'Saving...' : 'Save Payment'}
            </button>
          </div>
        )}
      </div>
  );
}
