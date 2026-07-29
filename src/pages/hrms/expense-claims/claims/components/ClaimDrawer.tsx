import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Save } from 'lucide-react';
import { claimSchema } from '../../validators/expenseValidation';
import type { ClaimFormValues } from '../../validators/expenseValidation';
import { formStyles } from '../../../../../components/ui/form-styles';
import CustomSelect from '../../../../../components/ui/CustomSelect';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClaimFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<ClaimFormValues>;
  isSubmitting?: boolean;
  templates: { id: string, templateName: string }[];
}

const defaultEmptyClaim: Partial<ClaimFormValues> = {
  template: '',
  title: '',
  currency: 'USD',
};

export default function ClaimDrawer({ isOpen, onClose, onSave, mode, initialData, isSubmitting, templates }: Props) {
  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema) as any,
    defaultValues: defaultEmptyClaim
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        ...defaultEmptyClaim,
        ...(initialData || {})
      });
    }
  }, [isOpen, initialData, form]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: ClaimFormValues) => {
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
              {mode === 'create' ? 'New Claim Envelope' : mode === 'edit' ? 'Edit Claim Envelope' : 'View Claim'}
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
            <form id="claim-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={formStyles.label}>Template *</label>
                    <CustomSelect
                      options={templates.map(t => ({ label: t.templateName, value: t.id }))}
                      value={form.watch('template')}
                      onChange={(val) => form.setValue('template', val)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.template && <p className="text-red-500 text-xs mt-1">{form.formState.errors.template.message}</p>}
                  </div>

                  <div>
                    <label className={formStyles.label}>Title / Purpose *</label>
                    <input
                      type="text"
                      {...form.register('title')}
                      className={formStyles.field(!!form.formState.errors.title, readOnly)}
                      placeholder="e.g., April Client Visit"
                      disabled={readOnly}
                    />
                    {form.formState.errors.title && <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>}
                  </div>

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
              form="claim-form"
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
                  Save & Next
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
