import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Save } from 'lucide-react';
import { advanceSchema } from '../../validators/expenseValidation';
import type { AdvanceFormValues } from '../../validators/expenseValidation';
import { formStyles } from '../../../../../components/ui/form-styles';
import CustomDatePicker from '../../../../../components/ui/CustomDatePicker';
import CustomSelect from '../../../../../components/ui/CustomSelect';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AdvanceFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<AdvanceFormValues>;
  isSubmitting?: boolean;
}

const defaultEmptyAdvance: Partial<AdvanceFormValues> = {
  employee: '',
  tripOrProject: '',
  purpose: '',
  currency: 'USD',
  amount: 0,
};

export default function AdvanceDrawer({ isOpen, onClose, onSave, mode, initialData, isSubmitting }: Props) {
  const form = useForm<AdvanceFormValues>({
    resolver: zodResolver(advanceSchema) as any,
    defaultValues: defaultEmptyAdvance
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        ...defaultEmptyAdvance,
        ...(initialData || {})
      });
    }
  }, [isOpen, initialData, form]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: AdvanceFormValues) => {
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
              {mode === 'create' ? 'Request Advance' : mode === 'edit' ? 'Edit Advance' : 'View Advance'}
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
            <form id="advance-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={formStyles.label}>Employee *</label>
                    <CustomSelect
                      options={[{label: 'John Doe', value: 'EMP-001'}, {label: 'Jane Smith', value: 'EMP-002'}]}
                      value={form.watch('employee')}
                      onChange={(val) => form.setValue('employee', val)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.employee && <p className="text-red-500 text-xs mt-1">{form.formState.errors.employee.message}</p>}
                  </div>
                  
                  <div>
                    <label className={formStyles.label}>Date *</label>
                    <CustomDatePicker 
                      value={form.watch('date')}
                      onChange={(val) => form.setValue('date', val)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.date && <p className="text-red-500 text-xs mt-1">{form.formState.errors.date.message}</p>}
                  </div>

                  <div>
                    <label className={formStyles.label}>Trip / Project *</label>
                    <input
                      type="text"
                      {...form.register('tripOrProject')}
                      className={formStyles.field(!!form.formState.errors.tripOrProject, readOnly)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.tripOrProject && <p className="text-red-500 text-xs mt-1">{form.formState.errors.tripOrProject.message}</p>}
                  </div>

                  <div>
                    <label className={formStyles.label}>Purpose *</label>
                    <textarea
                      {...form.register('purpose')}
                      className={formStyles.textarea(!!form.formState.errors.purpose, readOnly)}
                      rows={3}
                      disabled={readOnly}
                    />
                    {form.formState.errors.purpose && <p className="text-red-500 text-xs mt-1">{form.formState.errors.purpose.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={formStyles.label}>Currency *</label>
                      <CustomSelect
                        options={[{label: 'USD', value: 'USD'}, {label: 'INR', value: 'INR'}, {label: 'EUR', value: 'EUR'}]}
                        value={form.watch('currency')}
                        onChange={(val) => form.setValue('currency', val)}
                        disabled={readOnly}
                      />
                      {form.formState.errors.currency && <p className="text-red-500 text-xs mt-1">{form.formState.errors.currency.message}</p>}
                    </div>
                    <div>
                      <label className={formStyles.label}>Amount *</label>
                      <input
                        type="number"
                        {...form.register('amount')}
                        className={formStyles.field(!!form.formState.errors.amount, readOnly)}
                        disabled={readOnly}
                      />
                      {form.formState.errors.amount && <p className="text-red-500 text-xs mt-1">{form.formState.errors.amount.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={formStyles.label}>Required Date *</label>
                    <CustomDatePicker 
                      value={form.watch('requiredDate')}
                      onChange={(val) => form.setValue('requiredDate', val)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.requiredDate && <p className="text-red-500 text-xs mt-1">{form.formState.errors.requiredDate.message}</p>}
                  </div>
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
              form="advance-form"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors flex items-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-[#181a1f]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Submit Request
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
