import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { claimSchema } from '../validators/expenseValidation';
import type { ClaimFormValues } from '../validators/expenseValidation';
import { formStyles } from '../../../../components/ui/form-styles';
import CustomSelect from '../../../../components/ui/CustomSelect';
import EmployeeSelector from '../../../../components/hrms/EmployeeSelector';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';
import ExpenseItemsList from './ExpenseItemsList';

export default function ExpenseClaimPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id && id !== 'new';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [templates, setTemplates] = useState<{ id: string, templateName: string }[]>([]);
  const [localItems, setLocalItems] = useState<any[]>([]);

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema) as any,
    defaultValues: {
      employee: '',
      template: '',
      title: '',
      currency: 'USD',
    }
  });

  useEffect(() => {
    fetchTemplates();
    if (isEdit) {
      fetchClaimDetails();
    }
  }, [id]);

  const fetchTemplates = async () => {
    try {
      const res = await api.get('/hrms/expense-claims/templates');
      setTemplates(res || []);
    } catch (err) {
      console.error('Failed to load templates');
    }
  };

  const fetchClaimDetails = async () => {
    setIsLoading(true);
    try {
      const data = await api.get(`/hrms/expense-claims/claims/${id}`);
      form.reset({
        employee: data.employee?.id || data.employeeId || '',
        template: data.template?.id || data.templateId || '',
        title: data.title || '',
        currency: data.currency || 'USD',
      });
    } catch (err) {
      toast.error('Failed to load claim details');
      navigate('/companydashboard/hrms/expense-claims/claims');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ClaimFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        currency: data.currency,
        template: { id: data.template },
        employee: { id: data.employee }
      };
      if (isEdit) {
        await api.put(`/hrms/expense-claims/claims/${id}`, payload);
        toast.success('Claim updated successfully!');
        navigate('/companydashboard/hrms/expense-claims/claims');
      } else {
        const res = await api.post('/hrms/expense-claims/claims', payload);
        if (res && res.id && localItems.length > 0) {
          // Save local items to the newly created claim
          for (const item of localItems) {
            await api.post(`/hrms/expense-claims/claims/${res.id}/items`, {
              ...item,
              currency: data.currency
            });
          }
        }
        toast.success('Claim saved successfully!');
        navigate('/companydashboard/hrms/expense-claims/claims');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
      
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02] rounded-t-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isEdit ? 'Edit Expense Claim' : 'New Expense Claim'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Submit your expenses with receipts for reimbursement.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col pb-[84px]">
        <FormProvider {...form}>
          <form id="expense-form" onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            
            {/* Form Content */}
            <div className="w-full p-8 flex justify-center">
              <div className="w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Claim Details</h3>
              
              <div className="space-y-6 max-w-md">
              <div>
                <label className={formStyles.label}>Employee *</label>
                <EmployeeSelector 
                  value={form.watch('employee')}
                  onChange={(val) => form.setValue('employee', val)}
                />
                {form.formState.errors.employee && <p className="text-red-500 text-xs mt-1">{form.formState.errors.employee.message}</p>}
              </div>

              <div>
                <label className={formStyles.label}>Template *</label>
                <CustomSelect
                  options={templates.map(t => ({ label: t.templateName, value: t.id }))}
                  value={form.watch('template')}
                  onChange={(val) => form.setValue('template', val)}
                />
                {form.formState.errors.template && <p className="text-red-500 text-xs mt-1">{form.formState.errors.template.message}</p>}
              </div>

              <div>
                <label className={formStyles.label}>Title / Purpose *</label>
                <input
                  type="text"
                  {...form.register('title')}
                  className={formStyles.field(!!form.formState.errors.title, false)}
                  placeholder="e.g., Client Visit Lunch"
                />
                {form.formState.errors.title && <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>}
              </div>

              <div>
                <label className={formStyles.label}>Currency *</label>
                <CustomSelect
                  options={[{label: 'USD', value: 'USD'}, {label: 'INR', value: 'INR'}, {label: 'EUR', value: 'EUR'}]}
                  value={form.watch('currency')}
                  onChange={(val) => form.setValue('currency', val)}
                />
                {form.formState.errors.currency && <p className="text-red-500 text-xs mt-1">{form.formState.errors.currency.message}</p>}
              </div>
            </div>
              </div>
            </div>
          </form>
        </FormProvider>
        

        {(isEdit || !!form.watch('template')) && (
          <div className="border-t border-gray-200 dark:border-white/10 bg-gray-50/20 dark:bg-black/20">
            <ExpenseItemsList 
              claimId={id || 'new'} 
              currency={form.watch('currency')} 
              localItems={localItems}
              setLocalItems={setLocalItems}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 left-0 right-0 px-8 py-5 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#181a1f] flex items-center justify-between rounded-b-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          form="expense-form"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isEdit ? 'Update Claim' : 'Submit Claim'}
        </button>
      </div>
    </div>
  );
}
