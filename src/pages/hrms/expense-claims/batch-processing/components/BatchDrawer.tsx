import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Save } from 'lucide-react';
import { batchSchema } from '../../validators/expenseValidation';
import type { BatchFormValues } from '../../validators/expenseValidation';
import { formStyles } from '../../../../../components/ui/form-styles';
import CustomDatePicker from '../../../../../components/ui/CustomDatePicker';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BatchFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<BatchFormValues>;
  isSubmitting?: boolean;
}

const defaultEmptyBatch: Partial<BatchFormValues> = {
  paymentMethod: '',
};

export default function BatchDrawer({ isOpen, onClose, onSave, mode, initialData, isSubmitting }: Props) {
  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema) as any,
    defaultValues: defaultEmptyBatch
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        ...defaultEmptyBatch,
        ...(initialData || {})
      });
    }
  }, [isOpen, initialData, form]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: BatchFormValues) => {
    try {
      await onSave(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      
      <div className="relative w-[500px] bg-white dark:bg-[#181a1f] h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Create Payment Batch' : mode === 'edit' ? 'Edit Payment Batch' : 'View Batch'}
            </h2>
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
            <form id="batch-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={formStyles.label}>Payroll Period *</label>
                    <CustomDatePicker 
                      value={form.watch('payrollPeriod')}
                      onChange={(val) => form.setValue('payrollPeriod', val)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.payrollPeriod && <p className="text-red-500 text-xs mt-1">{form.formState.errors.payrollPeriod.message}</p>}
                  </div>

                  <div>
                    <label className={formStyles.label}>Payment Method *</label>
                    <input
                      type="text"
                      {...form.register('paymentMethod')}
                      className={formStyles.field(!!form.formState.errors.paymentMethod, readOnly)}
                      placeholder="e.g., Bank Transfer"
                      disabled={readOnly}
                    />
                    {form.formState.errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{form.formState.errors.paymentMethod.message}</p>}
                  </div>
                  
                  {mode === 'create' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-6">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        This will group <strong>5 approved claims</strong> totaling <strong>$1,250.00</strong> into a new payment batch.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3">
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
              form="batch-form"
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
                  Create Batch
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
