import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, Layers } from 'lucide-react';
import { batchSchema } from '../validators/expenseValidation';
import type { BatchFormValues } from '../validators/expenseValidation';
import { formStyles } from '../../../../components/ui/form-styles';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

const defaultEmptyBatch: Partial<BatchFormValues> = {
  paymentMethod: '',
};

export default function BatchFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';
  
  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema) as any,
    defaultValues: defaultEmptyBatch as BatchFormValues
  });

  useEffect(() => {
    if (mode !== 'create' && id) {
      fetchData();
    }
  }, [id, mode]);

  const fetchData = async () => {
    try {
      const data = await api.get(`/hrms/expense-claims/batches/${id}`);
      form.reset({
        payrollPeriod: data.payrollPeriod || data.createdAt,
        paymentMethod: data.paymentMethod || 'Bank Transfer'
      });
    } catch (e) {
      toast.error('Failed to fetch batch details');
      navigate(`${basePath}/hrms/expense-claims/batch-processing`);
    }
  };

  const onSubmit = async (data: BatchFormValues) => {
    try {
      if (mode === 'create') {
        await api.post('/hrms/expense-claims/batches', {
          payrollPeriod: data.payrollPeriod,
          paymentMethod: data.paymentMethod,
          status: 'Processed'
        });
        toast.success('Batch created');
      } else {
        await api.put(`/hrms/expense-claims/batches/${id}`, data);
        toast.success('Batch updated');
      }
      navigate(`${basePath}/hrms/expense-claims/batch-processing`);
    } catch (err: any) {
      toast.error('Error saving batch');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`${basePath}/hrms/expense-claims/batch-processing`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Create Payment Batch' : mode === 'edit' ? 'Edit Payment Batch' : 'View Batch'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Group approved claims for payroll</p>
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate(`${basePath}/hrms/expense-claims/batch-processing`)}
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
              {mode === 'create' ? 'Create Batch' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <FormProvider {...form}>
            <form id="batch-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Layers className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Batch Details</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className={formStyles.label}>Payroll Period *</label>
                    <CustomDatePicker 
                      value={form.watch('payrollPeriod')}
                      onChange={(val) => form.setValue('payrollPeriod', val)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.payrollPeriod && <p className="text-red-500 text-xs mt-1">{form.formState.errors.payrollPeriod.message}</p>}
                  </div>

                  <div>
                    <label className={formStyles.label}>Payment Method *</label>
                    <input
                      type="text"
                      {...form.register('paymentMethod')}
                      className={formStyles.field(!!form.formState.errors.paymentMethod, readOnly)}
                      placeholder="e.g., Bank Transfer"
                      disabled={readOnly}
                    />
                    {form.formState.errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{form.formState.errors.paymentMethod.message}</p>}
                  </div>
                  
                  {mode === 'create' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-6">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        This will group <strong>5 approved claims</strong> totaling <strong>$1,250.00</strong> into a new payment batch.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
