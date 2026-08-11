import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Clock } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import CustomTimePicker from '../../../../components/ui/CustomTimePicker';
import EmployeeSelector from '../../../../components/hrms/EmployeeSelector';
import { WorkforceService } from '../services';
import toast from 'react-hot-toast';

const regularizationSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  date: z.string().min(1, 'Date is required'),
  reason: z.string().min(1, 'Reason is required'),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
});

type RegularizationValues = z.infer<typeof regularizationSchema>;

export default function RegularizationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';

  const form = useForm<RegularizationValues>({
    resolver: zodResolver(regularizationSchema),
    defaultValues: {
      employeeId: '',
      date: '',
      reason: '',
      checkIn: '',
      checkOut: '',
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
      const data = await WorkforceService.getRegularizationById(id!);
      reset({
        employeeId: data.employeeId,
        date: data.date,
        reason: data.reason,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
      });
    } catch (e) {
      toast.error('Failed to fetch regularization details');
      navigate(`${basePath}/hrms/workforce/attendance/regularization`);
    }
  };

  const onSubmit = async (data: RegularizationValues) => {
    try {
      if (mode === 'create') {
        await WorkforceService.createRegularization(data as any);
        toast.success('Regularization requested successfully');
      } else {
        await WorkforceService.updateRegularization(id!, data);
        toast.success('Regularization updated');
      }
      navigate(`${basePath}/hrms/workforce/attendance/regularization`);
    } catch (err: any) {
      toast.error('Error saving regularization');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`${basePath}/hrms/workforce/attendance/regularization`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Request Regularization' : mode === 'edit' ? 'Edit Request' : 'View Request'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submit a request to regularize attendance</p>
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate(`${basePath}/hrms/workforce/attendance/regularization`)}
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
              Submit Request
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="w-full space-y-6">
          <FormProvider {...form}>
            <form id="reg-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="h-10 w-10 bg-orange-50 dark:bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-orange-600 dark:text-orange-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Details</h3>
                  </div>
                </div>

                <FormLayout>
                  <FormSection>
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
                          className={`w-full bg-gray-50 dark:bg-[#1f2229] border border-gray-200 dark:border-gray-800 rounded-sm px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.reason ? 'border-red-500' : ''}`} 
                          placeholder="Why do you need regularization?" 
                        />
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
