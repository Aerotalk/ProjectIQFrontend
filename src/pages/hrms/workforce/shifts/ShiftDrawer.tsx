import { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import { Input } from '../../../../components/ui/input';
import CustomTimePicker from '../../../../components/ui/CustomTimePicker';

const shiftSchema = z.object({
  shiftName: z.string().min(1, 'Shift Name is required'),
  shiftCode: z.string().min(1, 'Shift Code is required'),
  startTime: z.string().min(1, 'Start Time is required'),
  endTime: z.string().min(1, 'End Time is required'),
  graceTime: z.number().min(0),
  halfDayHours: z.number().min(0),
  fullDayHours: z.number().min(0),
  nightShift: z.boolean(),
});

type ShiftValues = z.infer<typeof shiftSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  onSave: (data: ShiftValues) => Promise<void>;
}

export default function ShiftDrawer({ isOpen, onClose, mode, initialData, onSave }: Props) {
  const form = useForm<ShiftValues>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      graceTime: 15,
      halfDayHours: 4.5,
      fullDayHours: 9,
      nightShift: false,
    }
  });

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        reset(initialData);
      } else {
        reset({
          graceTime: 15,
          halfDayHours: 4.5,
          fullDayHours: 9,
          nightShift: false,
        });
      }
    }
  }, [isOpen, initialData, mode, reset]);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/20 dark:bg-black/40 transition-opacity">
      <div className="w-full max-w-xl bg-white dark:bg-[#181a1f] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Create Shift' : mode === 'edit' ? 'Edit Shift' : 'View Shift'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <FormProvider {...form}>
            <form id="shift-form" onSubmit={handleSubmit(onSave)}>
              <FormLayout>
                <FormSection title="Shift Details">
                  <FormGrid>
                    <FormField label="Shift Name" error={errors.shiftName?.message} required>
                      <Input {...register('shiftName')} disabled={readOnly} placeholder="e.g. General Shift" className={errors.shiftName ? 'border-red-500' : ''} />
                    </FormField>
                    
                    <FormField label="Shift Code" error={errors.shiftCode?.message} required>
                      <Input {...register('shiftCode')} disabled={readOnly} placeholder="e.g. GS" className={errors.shiftCode ? 'border-red-500' : ''} />
                    </FormField>
                  </FormGrid>

                  <FormGrid>
                    <FormField label="Start Time" error={errors.startTime?.message} required>
                      <Controller
                        name="startTime"
                        control={control}
                        render={({ field }) => (
                          <CustomTimePicker value={field.value} onChange={field.onChange} disabled={readOnly} className={errors.startTime ? 'border-red-500 ring-1 ring-red-500' : ''} />
                        )}
                      />
                    </FormField>

                    <FormField label="End Time" error={errors.endTime?.message} required>
                      <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => (
                          <CustomTimePicker value={field.value} onChange={field.onChange} disabled={readOnly} className={errors.endTime ? 'border-red-500 ring-1 ring-red-500' : ''} />
                        )}
                      />
                    </FormField>
                  </FormGrid>

                  <FormGrid>
                    <FormField label="Grace Time (Minutes)" error={errors.graceTime?.message}>
                      <Input type="number" {...register('graceTime', { valueAsNumber: true })} disabled={readOnly} className={errors.graceTime ? 'border-red-500' : ''} />
                    </FormField>
                  </FormGrid>

                  <FormGrid>
                    <FormField label="Half Day Hours" error={errors.halfDayHours?.message}>
                      <Input type="number" step="0.1" {...register('halfDayHours', { valueAsNumber: true })} disabled={readOnly} className={errors.halfDayHours ? 'border-red-500' : ''} />
                    </FormField>

                    <FormField label="Full Day Hours" error={errors.fullDayHours?.message}>
                      <Input type="number" step="0.1" {...register('fullDayHours', { valueAsNumber: true })} disabled={readOnly} className={errors.fullDayHours ? 'border-red-500' : ''} />
                    </FormField>
                  </FormGrid>

                  <FormGrid>
                    <FormField label="Night Shift" error={errors.nightShift?.message}>
                      <div className="flex items-center gap-2 cursor-pointer mt-2">
                        <Controller
                          name="nightShift"
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
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Night Shift</span>
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
            <button type="submit" form="shift-form" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-[#792359] hover:bg-[#52173c] disabled:opacity-70 text-white text-sm font-medium rounded-sm shadow-sm transition-colors">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save</>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
