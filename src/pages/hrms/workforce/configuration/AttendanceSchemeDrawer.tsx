import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import { Input } from '../../../../components/ui/input';

const attendanceSchemeSchema = z.object({
  schemeName: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type AttendanceSchemeValues = z.infer<typeof attendanceSchemeSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  onSave: (data: AttendanceSchemeValues) => Promise<void>;
}

export default function AttendanceSchemeDrawer({ isOpen, onClose, mode, initialData, onSave }: Props) {
  const form = useForm<AttendanceSchemeValues>({
    resolver: zodResolver(attendanceSchemeSchema),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        reset(initialData);
      } else {
        reset({
          schemeName: '',
          description: '',
        });
      }
    }
  }, [isOpen, initialData, mode, reset]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/20 dark:bg-black/40 transition-opacity">
      <div className="w-full max-w-md bg-white dark:bg-[#181a1f] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Create Scheme' : mode === 'edit' ? 'Edit Scheme' : 'View Scheme'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <FormProvider {...form}>
            <form id="scheme-form" onSubmit={handleSubmit(onSave)}>
              <FormLayout>
                <FormSection title="Scheme Details">
                  <FormGrid columns={1}>
                    <FormField label="Scheme Name" error={errors.schemeName?.message} required>
                      <Input {...register('schemeName')} disabled={readOnly} placeholder="e.g. Standard Rules" className={errors.schemeName ? 'border-red-500' : ''} />
                    </FormField>

                    <FormField label="Description" error={errors.description?.message}>
                      <textarea 
                        {...register('description')} 
                        disabled={readOnly} 
                        rows={3} 
                        className={`w-full bg-gray-50 dark:bg-[#1f2229] border border-gray-200 dark:border-gray-800 rounded-sm px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.description ? 'border-red-500' : ''}`} 
                        placeholder="Description..." 
                      />
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
            <button type="submit" form="scheme-form" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save</>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
