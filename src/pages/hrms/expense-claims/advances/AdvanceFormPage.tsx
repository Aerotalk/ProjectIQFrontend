import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, DollarSign } from 'lucide-react';
import { advanceSchema } from '../validators/expenseValidation';
import type { AdvanceFormValues } from '../validators/expenseValidation';
import { formStyles } from '../../../../components/ui/form-styles';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import CustomSelect from '../../../../components/ui/CustomSelect';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

const defaultEmptyAdvance: Partial<AdvanceFormValues> = {
  employee: '',
  tripOrProject: '',
  purpose: '',
  currency: 'USD',
  amount: 0,
};

export default function AdvanceFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';
  
  const form = useForm<AdvanceFormValues>({
    resolver: zodResolver(advanceSchema) as any,
    defaultValues: defaultEmptyAdvance as AdvanceFormValues
  });

  useEffect(() => {
    if (mode !== 'create' && id) {
      fetchData();
    }
  }, [id, mode]);

  const fetchData = async () => {
    try {
      const data = await api.get(`/hrms/expense-claims/advances/${id}`);
      form.reset({
        employee: data.employeeId || 'EMP-001',
        tripOrProject: data.tripOrProject,
        purpose: data.purpose,
        currency: data.currency,
        amount: data.amount,
        requiredDate: data.requiredDate,
        date: data.requestedDate || data.createdAt
      });
    } catch (e) {
      toast.error('Failed to fetch advance details');
      navigate(`${basePath}/hrms/expense-claims/advances`);
    }
  };

  const onSubmit = async (data: AdvanceFormValues) => {
    try {
      if (mode === 'create') {
        await api.post('/hrms/expense-claims/advances', {
          tripOrProject: data.tripOrProject,
          purpose: data.purpose,
          currency: data.currency,
          amount: data.amount,
          requestedDate: data.date,
          requiredDate: data.requiredDate,
          status: 'Pending',
          disbursed: false,
          outstandingBalance: data.amount
        });
        toast.success('Advance request submitted');
      } else {
        await api.put(`/hrms/expense-claims/advances/${id}`, data);
        toast.success('Advance updated');
      }
      navigate(`${basePath}/hrms/expense-claims/advances`);
    } catch (err: any) {
      toast.error('Error saving advance');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`${basePath}/hrms/expense-claims/advances`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Request Advance' : mode === 'edit' ? 'Edit Advance' : 'View Advance'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submit a request for cash advance</p>
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate(`${basePath}/hrms/expense-claims/advances`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 shadow-sm transition-colors disabled:opacity-70"
            >
              {form.formState.isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {mode === 'create' ? 'Submit Request' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <FormProvider {...form}>
            <form id="advance-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advance Details</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={formStyles.label}>Employee *</label>
                    <CustomSelect
                      options={[{label: 'John Doe', value: 'EMP-001'}, {label: 'Jane Smith', value: 'EMP-002'}]}
                      value={form.watch('employee')}
                      onChange={(val) => form.setValue('employee', val as any)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.employee && <p className="text-red-500 text-xs mt-1">{form.formState.errors.employee.message}</p>}
                  </div>
                  
                  <div>
                    <label className={formStyles.label}>Date *</label>
                    <CustomDatePicker 
                      value={form.watch('date')}
                      onChange={(val) => form.setValue('date', val)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.date && <p className="text-red-500 text-xs mt-1">{form.formState.errors.date.message}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className={formStyles.label}>Trip / Project *</label>
                    <input
                      type="text"
                      {...form.register('tripOrProject')}
                      className={formStyles.field(!!form.formState.errors.tripOrProject, readOnly)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.tripOrProject && <p className="text-red-500 text-xs mt-1">{form.formState.errors.tripOrProject.message}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className={formStyles.label}>Purpose *</label>
                    <textarea
                      {...form.register('purpose')}
                      className={formStyles.textarea(!!form.formState.errors.purpose, readOnly)}
                      rows={3}
                      disabled={readOnly}
                    />
                    {form.formState.errors.purpose && <p className="text-red-500 text-xs mt-1">{form.formState.errors.purpose.message}</p>}
                  </div>

                  <div>
                    <label className={formStyles.label}>Currency *</label>
                    <CustomSelect
                      options={[{label: 'USD', value: 'USD'}, {label: 'INR', value: 'INR'}, {label: 'EUR', value: 'EUR'}]}
                      value={form.watch('currency')}
                      onChange={(val) => form.setValue('currency', val as any)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.currency && <p className="text-red-500 text-xs mt-1">{form.formState.errors.currency.message}</p>}
                  </div>
                  <div>
                    <label className={formStyles.label}>Amount *</label>
                    <input
                      type="number"
                      {...form.register('amount', { valueAsNumber: true })}
                      className={formStyles.field(!!form.formState.errors.amount, readOnly)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.amount && <p className="text-red-500 text-xs mt-1">{form.formState.errors.amount.message}</p>}
                  </div>

                  <div>
                    <label className={formStyles.label}>Required Date *</label>
                    <CustomDatePicker 
                      value={form.watch('requiredDate')}
                      onChange={(val) => form.setValue('requiredDate', val)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.requiredDate && <p className="text-red-500 text-xs mt-1">{form.formState.errors.requiredDate.message}</p>}
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
