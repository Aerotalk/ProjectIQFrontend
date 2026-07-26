import { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';

import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import CustomTimePicker from '../../../../components/ui/CustomTimePicker';
import EmployeeSelector from '../../../../components/hrms/EmployeeSelector';

const regularizationSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  date: z.string().min(1, 'Date is required'),
  reason: z.string().min(1, 'Reason is required'),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
});

type RegularizationValues = z.infer<typeof regularizationSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  onSave: (data: RegularizationValues) => Promise<void>;
}

export default function RegularizationDrawer({ isOpen, onClose, mode, initialData, onSave }: Props) {
  const form = useForm<RegularizationValues>({
    resolver: zodResolver(regularizationSchema),
  });

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        reset(initialData);
      } else {
        reset({
          employeeId: '',
          date: '',
          reason: '',
          checkIn: '',
          checkOut: '',
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
            {mode === 'create' ? 'Request Regularization' : mode === 'edit' ? 'Edit Request' : 'View Request'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <FormProvider {...form}>
            <form id="reg-form" onSubmit={handleSubmit(onSave)}>
              <FormLayout>
                <FormSection title="Request Details">
                  <FormGrid columns={1}>
                    <FormField label="Employee" error={errors.employeeId?.message} required>
                      <Controller
                        name="employeeId"
                        control={control}
                        render={({ field }) => (
                          <EmployeeSelector 
                            value={field.value} 
                            onChange={field.onChange} 
                            disabled={readOnly} 
                            className={errors.employeeId ? 'border-red-500' : ''} 
                          />
                        )}
                      />
                    </FormField>

                    <FormField label="Date" error={errors.date?.message} required>
                      <CustomDatePicker 
                        name="date"
                        disabled={readOnly}
                        hasError={!!errors.date}
                      />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Actual Check In (Optional)" error={errors.checkIn?.message}>
                        <Controller
                          name="checkIn"
                          control={control}
                          render={({ field }) => (
                            <CustomTimePicker value={field.value} onChange={field.onChange} disabled={readOnly} />
                          )}
                        />
                      </FormField>

                      <FormField label="Actual Check Out (Optional)" error={errors.checkOut?.message}>
                        <Controller
                          name="checkOut"
                          control={control}
                          render={({ field }) => (
                            <CustomTimePicker value={field.value} onChange={field.onChange} disabled={readOnly} />
                          )}
                        />
                      </FormField>
                    </div>

                    <FormField label="Reason" error={errors.reason?.message} required>
                      <textarea 
                        {...register('reason')} 
                        disabled={readOnly} 
                        rows={3} 
                        className={`w-full bg-gray-50 dark:bg-[#1f2229] border border-gray-200 dark:border-gray-800 rounded-sm px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#792359] focus:ring-1 focus:ring-[#792359] ${errors.reason ? 'border-red-500' : ''}`} 
                        placeholder="Why do you need regularization?" 
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
            <button type="submit" form="reg-form" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-[#792359] hover:bg-[#52173c] disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Save size={16} /> Submit</>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
