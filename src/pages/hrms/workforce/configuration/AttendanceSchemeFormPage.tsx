import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Network } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import { Input } from '../../../../components/ui/input';
import { WorkforceService } from '../services';
import toast from 'react-hot-toast';

const attendanceSchemeSchema = z.object({
  schemeName: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type AttendanceSchemeValues = z.infer<typeof attendanceSchemeSchema>;

export default function AttendanceSchemeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';

  const form = useForm<AttendanceSchemeValues>({
    resolver: zodResolver(attendanceSchemeSchema),
    defaultValues: {
      schemeName: '',
      description: '',
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
      const data = await WorkforceService.getAttendanceSchemeById(id!);
      reset({
        schemeName: data.schemeName,
        description: data.description,
      });
    } catch (e) {
      toast.error('Failed to fetch attendance scheme details');
      navigate(`${basePath}/hrms/workforce/configuration`);
    }
  };

  const onSubmit = async (data: AttendanceSchemeValues) => {
    try {
      if (mode === 'create') {
        await WorkforceService.createAttendanceScheme(data);
        toast.success('Attendance Scheme created');
      } else {
        await WorkforceService.updateAttendanceScheme(id!, data);
        toast.success('Attendance Scheme updated');
      }
      navigate(`${basePath}/hrms/workforce/configuration`);
    } catch (err: any) {
      toast.error('Error saving attendance scheme');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`${basePath}/hrms/workforce/configuration`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Create Attendance Scheme' : mode === 'edit' ? 'Edit Attendance Scheme' : 'View Attendance Scheme'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure attendance rules and policies</p>
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate(`${basePath}/hrms/workforce/configuration`)}
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
              Save Scheme
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="w-full space-y-6">
          <FormProvider {...form}>
            <form id="scheme-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Network className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scheme Details</h3>
                  </div>
                </div>

                <FormLayout>
                  <FormSection>
                    <FormGrid columns={1}>
                      <FormField label="Scheme Name" error={errors.schemeName?.message} required>
                        <Input {...register('schemeName')} disabled={readOnly} placeholder="e.g. Standard Rules" className={errors.schemeName ? 'border-red-500' : ''} />
                      </FormField>

                      <FormField label="Description" error={errors.description?.message}>
                        <textarea 
                          {...register('description')} 
                          disabled={readOnly} 
                          rows={3} 
                          className={`w-full bg-gray-50 dark:bg-[#1f2229] border border-gray-200 dark:border-gray-800 rounded-sm px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.description ? 'border-red-500' : ''}`} 
                          placeholder="Description..." 
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
