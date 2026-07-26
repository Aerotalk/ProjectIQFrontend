import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import { Controller } from 'react-hook-form';
import CustomSelect from '../../../../components/ui/CustomSelect';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import EmployeeSelector from '../../../../components/hrms/EmployeeSelector';
import LeaveTypeSelector from '../../../../components/hrms/LeaveTypeSelector';

const leaveAppSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  leaveTypeId: z.string().min(1, 'Leave Type is required'),
  fromDate: z.string().min(1, 'From Date is required'),
  fromSession: z.enum(['Session 1', 'Session 2']),
  toDate: z.string().min(1, 'To Date is required'),
  toSession: z.enum(['Session 1', 'Session 2']),
  reason: z.string().min(1, 'Reason is required'),
  approverId: z.string().optional(),
});

type LeaveAppValues = z.infer<typeof leaveAppSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  onSave: (data: LeaveAppValues) => Promise<void>;
}

export default function LeaveApplicationDrawer({ isOpen, onClose, mode, initialData, onSave }: Props) {
  const form = useForm<LeaveAppValues>({
    resolver: zodResolver(leaveAppSchema),
    defaultValues: {
      fromSession: 'Session 1',
      toSession: 'Session 2',
    }
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        reset(initialData);
      } else {
        reset({
          fromSession: 'Session 1',
          toSession: 'Session 2',
        });
      }
    }
  }, [isOpen, initialData, mode, reset]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 dark:bg-black/40 transition-opacity">
      <div className="w-full max-w-2xl bg-white dark:bg-[#181a1f] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Apply Leave' : mode === 'edit' ? 'Edit Application' : 'View Application'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <FormProvider {...form}>
            <form id="leave-app-form" onSubmit={handleSubmit(onSave)}>
              <FormLayout>
                <FormSection title="Application Details">
                  <FormGrid>
                    <FormField label="Employee" error={errors.employeeId?.message} required>
                      <Controller
                        name="employeeId"
                        control={form.control}
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
                    
                    <FormField label="Leave Type" error={errors.leaveTypeId?.message} required>
                      <Controller
                        name="leaveTypeId"
                        control={form.control}
                        render={({ field }) => (
                          <LeaveTypeSelector 
                            value={field.value} 
                            onChange={field.onChange} 
                            disabled={readOnly} 
                            className={errors.leaveTypeId ? 'border-red-500' : ''} 
                          />
                        )}
                      />
                    </FormField>
                  </FormGrid>

                  <FormGrid>
                    <FormField label="From Date" error={errors.fromDate?.message} required>
                      <CustomDatePicker 
                        name="fromDate"
                        disabled={readOnly}
                        hasError={!!errors.fromDate}
                      />
                    </FormField>

                    <FormField label="From Session" error={errors.fromSession?.message} required>
                      <Controller
                        name="fromSession"
                        control={form.control}
                        render={({ field }) => (
                          <CustomSelect
                            options={[{label: 'Session 1', value: 'Session 1'}, {label: 'Session 2', value: 'Session 2'}]}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={readOnly}
                            className={errors.fromSession ? 'border-red-500' : ''}
                          />
                        )}
                      />
                    </FormField>
                  </FormGrid>

                  <FormGrid>
                    <FormField label="To Date" error={errors.toDate?.message} required>
                      <CustomDatePicker 
                        name="toDate"
                        disabled={readOnly}
                        hasError={!!errors.toDate}
                      />
                    </FormField>

                    <FormField label="To Session" error={errors.toSession?.message} required>
                      <Controller
                        name="toSession"
                        control={form.control}
                        render={({ field }) => (
                          <CustomSelect
                            options={[{label: 'Session 1', value: 'Session 1'}, {label: 'Session 2', value: 'Session 2'}]}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={readOnly}
                            className={errors.toSession ? 'border-red-500' : ''}
                          />
                        )}
                      />
                    </FormField>
                  </FormGrid>

                  <FormField label="Reason" error={errors.reason?.message} required>
                    <textarea {...register('reason')} disabled={readOnly} rows={3} className={`w-full bg-gray-50 dark:bg-[#1f2229] border border-gray-200 dark:border-gray-800 rounded-sm px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#792359] focus:ring-1 focus:ring-[#792359] ${errors.reason ? 'border-red-500' : ''}`} placeholder="Enter reason for leave..." />
                  </FormField>
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
          
          <div className="flex gap-2">
            {!readOnly && (
              <button type="submit" form="leave-app-form" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-[#792359] hover:bg-[#52173c] disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors">
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Submit</>}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
