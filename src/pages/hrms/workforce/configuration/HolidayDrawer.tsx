import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import { Input } from '../../../../components/ui/input';

const holidaySchema = z.object({
  name: z.string().min(1, 'List Name is required'),
  year: z.number().min(2000, 'Year is required'),
});

type HolidayValues = z.infer<typeof holidaySchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  onSave: (data: HolidayValues) => Promise<void>;
}

export default function HolidayDrawer({ isOpen, onClose, mode, initialData, onSave }: Props) {
  const form = useForm<HolidayValues>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      year: new Date().getFullYear(),
    }
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        reset(initialData);
      } else {
        reset({
          name: '',
          year: new Date().getFullYear(),
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
            {mode === 'create' ? 'Create Holiday List' : mode === 'edit' ? 'Edit Holiday List' : 'View Holiday List'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <FormProvider {...form}>
            <form id="hol-form" onSubmit={handleSubmit(onSave)}>
              <FormLayout>
                <FormSection title="List Details">
                  <FormGrid columns={1}>
                    <FormField label="List Name" error={errors.name?.message} required>
                      <Input {...register('name')} disabled={readOnly} placeholder="e.g. Standard 2026 Holidays" className={errors.name ? 'border-red-500' : ''} />
                    </FormField>

                    <FormField label="Year" error={errors.year?.message} required>
                      <Input type="number" {...register('year', { valueAsNumber: true })} disabled={readOnly} className={errors.year ? 'border-red-500' : ''} />
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
            <button type="submit" form="hol-form" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-[#792359] hover:bg-[#52173c] disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save</>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
