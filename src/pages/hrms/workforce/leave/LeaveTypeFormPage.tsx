import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, FileText } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import { Input } from '../../../../components/ui/input';
import { WorkforceService } from '../services';
import toast from 'react-hot-toast';

const leaveTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  category: z.enum(['Paid', 'Unpaid']),
  active: z.boolean(),
});

type LeaveTypeValues = z.infer<typeof leaveTypeSchema>;

export default function LeaveTypeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';

  const form = useForm<LeaveTypeValues>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      category: 'Paid',
      active: true,
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
      const data = await WorkforceService.getLeaveType(id!);
      reset({
        name: data.name,
        code: data.code,
        category: data.category,
        active: data.active ?? true,
      });
    } catch (e) {
      toast.error('Failed to fetch leave type details');
      navigate(`${basePath}/hrms/workforce/leave`);
    }
  };

  const onSubmit = async (data: LeaveTypeValues) => {
    try {
      const payload = {
        ...data,
        color: '#3b82f6',
        icon: 'FileText',
        requiresApproval: true,
        requiresAttachment: false,
        minimumDays: 0.5,
        maximumDays: 30,
        probationAllowed: true,
        noticePeriodRequired: 0,
        allowHalfDay: true,
        allowHourlyLeave: false,
        unit: 'Days'
      };

      if (mode === 'create') {
        await WorkforceService.createLeaveType(payload);
        toast.success('Leave Type created');
      } else {
        await WorkforceService.updateLeaveType(id!, payload);
        toast.success('Leave Type updated');
      }
      navigate(`${basePath}/hrms/workforce/leave`);
    } catch (err: any) {
      toast.error('Error saving leave type');
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
              {mode === 'create' ? 'Create Leave Type' : mode === 'edit' ? 'Edit Leave Type' : 'View Leave Type'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure leave type details</p>
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
              Save Leave Type
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <FormProvider {...form}>
            <form id="leave-type-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Details</h3>
                  </div>
                </div>

                <FormLayout>
                  <FormSection>
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
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
