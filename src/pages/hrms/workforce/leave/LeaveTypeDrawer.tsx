import { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import { Input } from '../../../../components/ui/input';

const leaveTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  category: z.enum(['Paid', 'Unpaid']),
  active: z.boolean(),
});

type LeaveTypeValues = z.infer<typeof leaveTypeSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  onSave: (data: LeaveTypeValues) => Promise<void>;
}

export default function LeaveTypeDrawer({ isOpen, onClose, mode, initialData, onSave }: Props) {
  const form = useForm<LeaveTypeValues>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      category: 'Paid',
      active: true,
    }
  });

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        reset(initialData);
      } else {
        reset({
          category: 'Paid',
          active: true,
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
            {mode === 'create' ? 'Create Leave Type' : mode === 'edit' ? 'Edit Leave Type' : 'View Leave Type'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <FormProvider {...form}>
            <form id="leave-type-form" onSubmit={handleSubmit(onSave)}>
              <FormLayout>
                <FormSection title="Basic Details">
                  <FormGrid columns={1}>
                    <FormField label="Name" error={errors.name?.message} required>
                      <Input {...register('name')} disabled={readOnly} placeholder="e.g. Casual Leave" className={errors.name ? 'border-red-500' : ''} />
                    </FormField>
                    
                    <FormField label="Code" error={errors.code?.message} required>
                      <Input {...register('code')} disabled={readOnly} placeholder="e.g. CL" className={errors.code ? 'border-red-500' : ''} />
                    </FormField>
                    
                    <FormField label="Category" error={errors.category?.message} required>
                      <div className="flex items-center gap-4 mt-2">
                        {['Paid', 'Unpaid'].map((option) => (
                          <label key={option} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value={option}
                              {...register('category')}
                              disabled={readOnly}
                              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span className="text-sm font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                    </FormField>

                    <FormField label="Active" error={errors.active?.message}>
                      <div className="flex items-center gap-2 cursor-pointer mt-2">
                        <Controller
                          name="active"
                          control={control}
                          render={({ field: { value, onChange, ref } }) => (
                            <input
                              type="checkbox"
                              checked={!!value}
                              onChange={(e) => onChange(e.target.checked)}
                              ref={ref}
                              disabled={readOnly}
                              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                          )}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Active</span>
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
            <button type="submit" form="leave-type-form" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save</>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
