import { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import { Input } from '../../../../components/ui/input';

const leaveSchemeSchema = z.object({
  schemeName: z.string().min(1, 'Name is required'),
  defaultScheme: z.boolean(),
  rulesCount: z.number().min(0),
});

type LeaveSchemeValues = z.infer<typeof leaveSchemeSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  onSave: (data: LeaveSchemeValues) => Promise<void>;
}

export default function LeaveSchemeDrawer({ isOpen, onClose, mode, initialData, onSave }: Props) {
  const form = useForm<LeaveSchemeValues>({
    resolver: zodResolver(leaveSchemeSchema),
    defaultValues: {
      defaultScheme: false,
      rulesCount: 0,
    }
  });

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        reset(initialData);
      } else {
        reset({
          defaultScheme: false,
          rulesCount: 0,
        });
      }
    }
  }, [isOpen, initialData, mode, reset]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white dark:bg-[#181a1f] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Create Leave Scheme' : mode === 'edit' ? 'Edit Leave Scheme' : 'View Leave Scheme'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <FormProvider {...form}>
            <form id="leave-scheme-form" onSubmit={handleSubmit(onSave)}>
              <FormLayout>
                <FormSection title="Scheme Details">
                  <FormGrid columns={1}>
                    <FormField label="Scheme Name" error={errors.schemeName?.message} required>
                      <Input {...register('schemeName')} disabled={readOnly} placeholder="e.g. Standard India Scheme" className={errors.schemeName ? 'border-red-500' : ''} />
                    </FormField>
                    
                    <FormField label="Rules Count" error={errors.rulesCount?.message}>
                      <Input type="number" {...register('rulesCount', { valueAsNumber: true })} disabled={readOnly} placeholder="e.g. 2" className={errors.rulesCount ? 'border-red-500' : ''} />
                    </FormField>

                    <FormField label="Default Scheme" error={errors.defaultScheme?.message}>
                      <div className="flex items-center gap-2 cursor-pointer mt-2">
                        <Controller
                          name="defaultScheme"
                          control={control}
                          render={({ field: { value, onChange, ref } }) => (
                            <input
                              type="checkbox"
                              checked={!!value}
                              onChange={(e) => onChange(e.target.checked)}
                              ref={ref}
                              disabled={readOnly}
                              className="w-4 h-4 text-[#792359] border-gray-300 rounded focus:ring-[#792359]"
                            />
                          )}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Set as Default</span>
                      </div>
                    </FormField>
                  </FormGrid>
                </FormSection>
              </FormLayout>
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-sm transition-colors">
            {readOnly ? 'Close' : 'Cancel'}
          </button>
          
          {!readOnly && (
            <button type="submit" form="leave-scheme-form" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-[#792359] hover:bg-[#52173c] disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save</>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
