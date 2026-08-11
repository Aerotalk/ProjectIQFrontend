import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Clock } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import { Input } from '../../../../components/ui/input';
import CustomTimePicker from '../../../../components/ui/CustomTimePicker';
import { WorkforceService } from '../services';
import toast from 'react-hot-toast';

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

export default function ShiftFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';

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
    if (mode !== 'create' && id) {
      fetchData();
    }
  }, [id, mode]);

  const fetchData = async () => {
    try {
      const data = await WorkforceService.getShift(id!);
      reset({
        shiftName: data.shiftName,
        shiftCode: data.shiftCode,
        startTime: data.startTime,
        endTime: data.endTime,
        graceTime: data.graceTime ?? 15,
        halfDayHours: data.halfDayHours ?? 4.5,
        fullDayHours: data.fullDayHours ?? 9,
        nightShift: data.nightShift ?? false,
      });
    } catch (e) {
      toast.error('Failed to fetch shift details');
      navigate(`${basePath}/hrms/workforce/shifts`);
    }
  };

  const onSubmit = async (data: ShiftValues) => {
    try {
      if (mode === 'create') {
        await WorkforceService.createShift(data);
        toast.success('Shift created');
      } else {
        await WorkforceService.updateShift(id!, data);
        toast.success('Shift updated');
      }
      navigate(`${basePath}/hrms/workforce/shifts`);
    } catch (err: any) {
      toast.error('Error saving shift');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`${basePath}/hrms/workforce/shifts`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Create Shift' : mode === 'edit' ? 'Edit Shift' : 'View Shift'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure standard working hours</p>
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate(`${basePath}/hrms/workforce/shifts`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 shadow-sm transition-colors disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Shift
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <FormProvider {...form}>
            <form id="shift-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shift Details</h3>
                  </div>
                </div>

                <FormLayout>
                  <FormSection>
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
                        <Input type="number" {...register('graceTime', { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })} disabled={readOnly} className={errors.graceTime ? 'border-red-500' : ''} />
                      </FormField>
                    </FormGrid>

                    <FormGrid columns={2}>
                      <FormField label="Half Day Hours" error={errors.halfDayHours?.message} required>
                        <Input type="number" step="0.1" {...register('halfDayHours', { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })} disabled={readOnly} className={errors.halfDayHours ? 'border-red-500' : ''} />
                      </FormField>
                      
                      <FormField label="Full Day Hours" error={errors.fullDayHours?.message} required>
                        <Input type="number" step="0.1" {...register('fullDayHours', { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })} disabled={readOnly} className={errors.fullDayHours ? 'border-red-500' : ''} />
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
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                            )}
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Night Shift</span>
                        </div>
                      </FormField>
                    </FormGrid>
                  </FormSection>
                </FormLayout>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
