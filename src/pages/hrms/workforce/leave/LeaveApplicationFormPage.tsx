import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Calendar } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import CustomSelect from '../../../../components/ui/CustomSelect';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import EmployeeSelector from '../../../../components/hrms/EmployeeSelector';
import LeaveTypeSelector from '../../../../components/hrms/LeaveTypeSelector';
import { WorkforceService } from '../services';
import toast from 'react-hot-toast';

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

export default function LeaveApplicationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';
  const isEditing = mode === 'edit';

  const form = useForm<LeaveAppValues>({
    resolver: zodResolver(leaveAppSchema),
    defaultValues: {
      fromSession: 'Session 1',
      toSession: 'Session 2',
    }
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (mode !== 'create' && id) {
      fetchData();
    }
  }, [id, mode]);

  const fetchData = async () => {
    try {
      const data = await WorkforceService.getLeaveApplicationById(id!);
      reset({
        employeeId: data.employeeId,
        leaveTypeId: data.leaveTypeId,
        fromDate: data.fromDate,
        fromSession: data.fromSession || 'Session 1',
        toDate: data.toDate,
        toSession: data.toSession || 'Session 2',
        reason: data.reason,
        approverId: data.approverId,
      });
    } catch (e) {
      toast.error('Failed to fetch application details');
      navigate(`${basePath}/hrms/workforce/leave`);
    }
  };

  const onSubmit = async (formData: LeaveAppValues) => {
    try {
      if (isEditing) {
        await WorkforceService.updateLeaveApplication(id!, formData);
        toast.success('Leave application updated successfully');
      } else {
        await WorkforceService.createLeaveApplication(formData as any);
        toast.success('Leave application submitted successfully');
      }
      navigate(`${basePath}/hrms/workforce/leave`);
    } catch (err: any) {
      toast.error('Error saving application');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`${basePath}/hrms/workforce/leave`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Apply Leave' : mode === 'edit' ? 'Edit Application' : 'View Application'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submit a leave request for an employee</p>
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate(`${basePath}/hrms/workforce/leave`)}
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
              Submit Application
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="w-full space-y-6">
          <FormProvider {...form}>
            <form id="leave-app-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application Details</h3>
                  </div>
                </div>

                <FormLayout>
                  <FormSection>
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

                    <FormGrid columns={1}>
                      <FormField label="Reason" error={errors.reason?.message} required>
                        <textarea {...register('reason')} disabled={readOnly} rows={3} className={`w-full bg-gray-50 dark:bg-[#1f2229] border border-gray-200 dark:border-gray-800 rounded-sm px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.reason ? 'border-red-500' : ''}`} placeholder="Enter reason for leave..." />
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
