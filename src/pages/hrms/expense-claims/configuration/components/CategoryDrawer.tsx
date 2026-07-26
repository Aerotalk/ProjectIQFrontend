import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Save } from 'lucide-react';
import { categorySchema } from '../../validators/expenseValidation';
import type { CategoryFormValues } from '../../validators/expenseValidation';
import { formStyles } from '../../../../../components/ui/form-styles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<CategoryFormValues>;
  isSubmitting?: boolean;
}

const defaultEmptyCategory: Partial<CategoryFormValues> = {
  name: '',
  glCode: '',
  receiptRequired: false,
  minReceiptAmount: 0,
  active: true,
};

export default function CategoryDrawer({ isOpen, onClose, onSave, mode, initialData, isSubmitting }: Props) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: defaultEmptyCategory
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        ...defaultEmptyCategory,
        ...(initialData || {})
      });
    }
  }, [isOpen, initialData, form]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';
  const receiptRequired = form.watch('receiptRequired');

  const onSubmit = async (data: CategoryFormValues) => {
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
              {mode === 'create' ? 'Add Category' : mode === 'edit' ? 'Edit Category' : 'View Category'}
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
            <form id="category-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={formStyles.label}>Category Name *</label>
                    <input
                      type="text"
                      {...form.register('name')}
                      className={formStyles.field(!!form.formState.errors.name, readOnly)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
                  </div>

                  <div>
                    <label className={formStyles.label}>GL Code *</label>
                    <input
                      type="text"
                      {...form.register('glCode')}
                      className={formStyles.field(!!form.formState.errors.glCode, readOnly)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.glCode && <p className="text-red-500 text-xs mt-1">{form.formState.errors.glCode.message}</p>}
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      {...form.register('receiptRequired')}
                      id="receiptRequired"
                      disabled={readOnly}
                      className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]"
                    />
                    <label htmlFor="receiptRequired" className="text-sm text-gray-700 dark:text-gray-300 font-medium">Receipt Required</label>
                  </div>

                  {receiptRequired && (
                    <div>
                      <label className={formStyles.label}>Minimum Receipt Amount</label>
                      <input
                        type="number"
                        {...form.register('minReceiptAmount')}
                        className={formStyles.field(!!form.formState.errors.minReceiptAmount, readOnly)}
                        disabled={readOnly}
                      />
                      {form.formState.errors.minReceiptAmount && <p className="text-red-500 text-xs mt-1">{form.formState.errors.minReceiptAmount.message}</p>}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-white/5 mt-4">
                    <input
                      type="checkbox"
                      {...form.register('active')}
                      id="active"
                      disabled={readOnly}
                      className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]"
                    />
                    <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300 font-medium">Active</label>
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
              form="category-form"
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
                  Save Category
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
