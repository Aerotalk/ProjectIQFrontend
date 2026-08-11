import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import { claimSchema } from '../validators/expenseValidation';
import type { ClaimFormValues } from '../validators/expenseValidation';
import { formStyles } from '../../../../components/ui/form-styles';
import CustomSelect from '../../../../components/ui/CustomSelect';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function ExpenseClaimPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id && id !== 'new';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [templates, setTemplates] = useState<{ id: string, templateName: string }[]>([]);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema) as any,
    defaultValues: {
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
        template: data.templateId || '',
        title: data.title || '',
        currency: data.currency || 'USD',
      });
      // Mocking receipt fetch if any
      setReceiptPreview(null);
    } catch (err) {
      toast.error('Failed to load claim details');
      navigate('/companydashboard/hrms/expense-claims/claims');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local object URL for preview
      setReceiptPreview(URL.createObjectURL(file));
      // In a real scenario, you'd upload this file to S3 or similar
    }
  };

  const onSubmit = async (data: ClaimFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/hrms/expense-claims/claims/${id}`, data);
        toast.success('Claim updated successfully!');
      } else {
        await api.post('/hrms/expense-claims/claims', data);
        toast.success('Claim submitted successfully!');
      }
      navigate('/companydashboard/hrms/expense-claims/claims');
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isEdit ? 'Edit Expense Claim' : 'New Expense Claim'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Submit your expenses with receipts for reimbursement.</p>
          </div>
        </div>
      </div>

      <FormProvider {...form}>
        <form id="expense-form" onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Panel: Receipt Uploader */}
          <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10 bg-gray-50/30 dark:bg-[#121212]/50 flex flex-col overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Receipt Details</h3>
            
            <div className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-6 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors relative group">
              {receiptPreview ? (
                <div className="absolute inset-0 p-4">
                  <div className="w-full h-full relative rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 bg-white">
                    <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-contain" />
                    <label className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer hover:bg-primary-dark transition-colors">
                      Change Receipt
                      <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={28} />
                  </div>
                  <span className="text-base font-medium text-gray-900 dark:text-white">Click to upload receipt</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">SVG, PNG, JPG or PDF (max. 5MB)</span>
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="w-full md:w-1/2 p-8 overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Claim Details</h3>
            
            <div className="space-y-6 max-w-md">
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
        </form>
      </FormProvider>

      {/* Footer */}
      <div className="px-8 py-5 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#181a1f] flex items-center justify-between shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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
