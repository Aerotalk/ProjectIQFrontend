import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, CalendarHeart } from 'lucide-react';
import { FormLayout, FormSection, FormGrid, FormField } from '../../../../components/ui/FormLayout';
import { Input } from '../../../../components/ui/input';
import { WorkforceService } from '../services';
import toast from 'react-hot-toast';

const holidaySchema = z.object({
  name: z.string().min(1, 'List Name is required'),
  year: z.number().min(2000, 'Year is required'),
});

type HolidayValues = z.infer<typeof holidaySchema>;

export default function HolidayFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';

  const form = useForm<HolidayValues>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      year: new Date().getFullYear(),
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
      const data = await WorkforceService.getHolidayListById(id!);
      reset({
        name: data.name,
        year: data.year,
      });
    } catch (e) {
      toast.error('Failed to fetch holiday list details');
      navigate(`${basePath}/hrms/workforce/configuration`);
    }
  };

  const onSubmit = async (data: HolidayValues) => {
    try {
      if (mode === 'create') {
        await WorkforceService.createHolidayList(data);
        toast.success('Holiday List created');
      } else {
        await WorkforceService.updateHolidayList(id!, data);
        toast.success('Holiday List updated');
      }
      navigate(`${basePath}/hrms/workforce/configuration`);
    } catch (err: any) {
      toast.error('Error saving holiday list');
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
              {mode === 'create' ? 'Create Holiday List' : mode === 'edit' ? 'Edit Holiday List' : 'View Holiday List'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure company holidays</p>
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
              Save Holiday List
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="w-full space-y-6">
          <FormProvider {...form}>
            <form id="hol-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CalendarHeart className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">List Details</h3>
                  </div>
                </div>

                <FormLayout>
                  <FormSection>
                    <FormGrid columns={1}>
                      <FormField label="List Name" error={errors.name?.message} required>
                        <Input {...register('name')} disabled={readOnly} placeholder="e.g. Standard 2026 Holidays" className={errors.name ? 'border-red-500' : ''} />
                      </FormField>

                      <FormField label="Year" error={errors.year?.message} required>
                        <Input type="number" {...register('year', { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })} disabled={readOnly} className={errors.year ? 'border-red-500' : ''} />
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
