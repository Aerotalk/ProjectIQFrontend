import React from 'react';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Save } from 'lucide-react';
import { templateSchema } from '../../validators/expenseValidation';
import type { TemplateFormValues } from '../../validators/expenseValidation';
import { formStyles } from '../../../../../components/ui/form-styles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TemplateFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Partial<TemplateFormValues>;
  isSubmitting?: boolean;
  categories: any[];
}

const defaultEmptyTemplate: Partial<TemplateFormValues> = {
  templateName: '',
  description: '',
  allowedCategories: [],
  active: true,
};

export default function TemplateDrawer({ isOpen, onClose, onSave, mode, initialData, isSubmitting, categories }: Props) {
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema) as any,
    defaultValues: defaultEmptyTemplate
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        ...defaultEmptyTemplate,
        ...(initialData || {})
      });
    }
  }, [isOpen, initialData, form]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      await onSave(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  // const categoryOptions = categories.map(c => ({ label: c.category, value: c.id }));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      
      <div className="relative w-[500px] bg-white dark:bg-[#181a1f] h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Create Template' : mode === 'edit' ? 'Edit Template' : 'View Template'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <FormProvider {...form}>
            <form id="template-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className={formStyles.sectionTitle}>Template Details</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={formStyles.label}>Template Name *</label>
                    <input
                      type="text"
                      {...form.register('templateName')}
                      className={formStyles.field(!!form.formState.errors.templateName, readOnly)}
                      placeholder="e.g., General Travel"
                      disabled={readOnly}
                    />
                    {form.formState.errors.templateName && <p className="text-red-500 text-xs mt-1">{form.formState.errors.templateName.message}</p>}
                  </div>

                  <div>
                    <label className={formStyles.label}>Description</label>
                    <input
                      type="text"
                      {...form.register('description')}
                      className={formStyles.field(!!form.formState.errors.description, readOnly)}
                      placeholder="Description of the template"
                      disabled={readOnly}
                    />
                  </div>
                  
                  <div>
                    <label className={formStyles.label}>Allowed Categories *</label>
                    <Controller
                      control={form.control}
                      name="allowedCategories"
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-2">
                          {categories.map(c => (
                            <label key={c.id} className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer ${field.value?.includes(c.id) ? 'border-[#792359] bg-[#792359]/5' : 'border-gray-200 dark:border-white/10'} ${readOnly ? 'opacity-70 pointer-events-none' : ''}`}>
                              <input
                                type="checkbox"
                                disabled={readOnly}
                                checked={field.value?.includes(c.id) || false}
                                onChange={(e) => {
                                  const current = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([...current, c.id]);
                                  } else {
                                    field.onChange(current.filter(id => id !== c.id));
                                  }
                                }}
                                className="w-4 h-4 text-[#792359] rounded border-gray-300 focus:ring-[#792359]"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c.category}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {form.formState.errors.allowedCategories && <p className="text-red-500 text-xs mt-1">{form.formState.errors.allowedCategories.message}</p>}
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="active"
                      {...form.register('active')}
                      className="w-4 h-4 text-[#792359] rounded border-gray-300 focus:ring-[#792359]"
                      disabled={readOnly}
                    />
                    <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>

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
              form="template-form"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#792359] hover:bg-[#52173c] disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
