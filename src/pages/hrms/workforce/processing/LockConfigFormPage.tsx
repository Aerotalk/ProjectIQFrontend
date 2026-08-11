import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Lock } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import { Input } from '../../../../components/ui/input';
import { WorkforceService } from '../services';
import toast from 'react-hot-toast';

const lockConfigSchema = z.object({
  feature: z.string().min(1, 'Feature is required'),
  lockDays: z.number().min(0, 'Lock days cannot be negative'),
  active: z.boolean(),
});

type LockConfigValues = z.infer<typeof lockConfigSchema>;

export default function LockConfigFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';

  const form = useForm<LockConfigValues>({
    resolver: zodResolver(lockConfigSchema),
    defaultValues: {
      active: true,
      lockDays: 0,
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
      const data = await WorkforceService.getLockConfigById(id!);
      reset({
        feature: data.feature,
        lockDays: data.lockDays,
        active: data.active,
      });
    } catch (e) {
      toast.error('Failed to fetch lock configuration details');
      navigate(`${basePath}/hrms/workforce/processing?tab=lock`);
    }
  };

  const onSubmit = async (data: LockConfigValues) => {
    try {
      if (mode === 'create') {
        await WorkforceService.createLockConfig(data);
        toast.success('Lock configuration created');
      } else {
        await WorkforceService.updateLockConfig(id!, data);
        toast.success('Lock configuration updated');
      }
      navigate(`${basePath}/hrms/workforce/processing?tab=lock`);
    } catch (err: any) {
      toast.error('Error saving lock configuration');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`${basePath}/hrms/workforce/processing?tab=lock`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Add Lock Config' : mode === 'edit' ? 'Edit Lock Config' : 'View Lock Config'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure cutoff days for retrospective actions</p>
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate(`${basePath}/hrms/workforce/processing?tab=lock`)}
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
              Save Config
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="w-full space-y-6">
          <FormProvider {...form}>
            <form id="lock-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="h-10 w-10 bg-orange-50 dark:bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="text-orange-600 dark:text-orange-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuration Details</h3>
                  </div>
                </div>

                <FormLayout>
                  <FormSection>
                    <FormGrid columns={1}>
                      <FormField label="Feature Name" error={errors.feature?.message} required>
                        <Input {...register('feature')} disabled={readOnly} placeholder="e.g. Leave Application" className={errors.feature ? 'border-red-500' : ''} />
                      </FormField>

                      <FormField label="Lock Days" error={errors.lockDays?.message} required>
                        <Input type="number" {...register('lockDays', { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })} disabled={readOnly} placeholder="e.g. 5" className={errors.lockDays ? 'border-red-500' : ''} />
                      </FormField>

                      <FormField label="Status" error={errors.active?.message}>
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
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
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
