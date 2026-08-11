import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { formStyles } from '../../../../components/ui/form-styles';
import CustomSelect from '../../../../components/ui/CustomSelect';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

const policySchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  grade: z.string().min(1, 'Grade is required'),
  maxClaim: z.number().min(0, 'Max claim must be 0 or greater'),
  limitType: z.enum(['Monthly', 'Yearly', 'Claim']),
  periodLimit: z.number().optional(),
  backdatedDays: z.number().min(0, 'Cannot be negative'),
});

type PolicyFormValues = z.infer<typeof policySchema>;

export default function PolicyFormPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string, category: string }[]>([]);

  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema) as any,
    defaultValues: {
      categoryId: '',
      grade: '',
      maxClaim: 0,
      limitType: 'Monthly',
      backdatedDays: 30,
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.get('/hrms/expense-claims/categories');
      setCategories(data || []);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const onSubmit = async (data: PolicyFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post('/hrms/expense-claims/policies', data);
      toast.success('Policy saved successfully!');
      navigate('/companydashboard/hrms/expense-claims/configuration/policies');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save policy');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">New Expense Policy</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Configure limits and rules for an expense category.</p>
          </div>
        </div>
      </div>

      <FormProvider {...form}>
        <form id="policy-form" onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-2xl space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={formStyles.label}>Expense Category *</label>
                <CustomSelect
                  options={categories.map(c => ({ label: c.category, value: c.id }))}
                  value={form.watch('categoryId')}
                  onChange={(val) => form.setValue('categoryId', val)}
                />
                {form.formState.errors.categoryId && <p className="text-red-500 text-xs mt-1">{form.formState.errors.categoryId.message}</p>}
              </div>

              <div>
                <label className={formStyles.label}>Employee Grade *</label>
                <input
                  type="text"
                  {...form.register('grade')}
                  className={formStyles.field(!!form.formState.errors.grade, false)}
                  placeholder="e.g., L1, Manager, All"
                />
                {form.formState.errors.grade && <p className="text-red-500 text-xs mt-1">{form.formState.errors.grade.message}</p>}
              </div>

              <div>
                <label className={formStyles.label}>Limit Type *</label>
                <CustomSelect
                  options={[
                    { label: 'Per Claim', value: 'Claim' },
                    { label: 'Monthly', value: 'Monthly' },
                    { label: 'Yearly', value: 'Yearly' }
                  ]}
                  value={form.watch('limitType')}
                  onChange={(val) => form.setValue('limitType', val as any)}
                />
                {form.formState.errors.limitType && <p className="text-red-500 text-xs mt-1">{form.formState.errors.limitType.message}</p>}
              </div>

              <div>
                <label className={formStyles.label}>Max Claim Limit *</label>
                <input
                  type="number"
                  step="0.01"
                  {...form.register('maxClaim', { valueAsNumber: true })}
                  className={formStyles.field(!!form.formState.errors.maxClaim, false)}
                />
                {form.formState.errors.maxClaim && <p className="text-red-500 text-xs mt-1">{form.formState.errors.maxClaim.message}</p>}
              </div>

              {form.watch('limitType') !== 'Claim' && (
                <div>
                  <label className={formStyles.label}>Period Limit Amount (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...form.register('periodLimit', { valueAsNumber: true })}
                    className={formStyles.field(!!form.formState.errors.periodLimit, false)}
                    placeholder="e.g., 5000"
                  />
                  {form.formState.errors.periodLimit && <p className="text-red-500 text-xs mt-1">{form.formState.errors.periodLimit.message}</p>}
                </div>
              )}

              <div>
                <label className={formStyles.label}>Backdated Days Allowed *</label>
                <input
                  type="number"
                  {...form.register('backdatedDays', { valueAsNumber: true })}
                  className={formStyles.field(!!form.formState.errors.backdatedDays, false)}
                />
                {form.formState.errors.backdatedDays && <p className="text-red-500 text-xs mt-1">{form.formState.errors.backdatedDays.message}</p>}
                <p className="text-xs text-gray-500 mt-1">How many days in the past can an expense be claimed?</p>
              </div>
            </div>

          </div>
        </form>
      </FormProvider>

      {/* Footer */}
      <div className="px-8 py-5 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#181a1f] flex items-center justify-end shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          form="policy-form"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Policy
        </button>
      </div>
    </div>
  );
}
