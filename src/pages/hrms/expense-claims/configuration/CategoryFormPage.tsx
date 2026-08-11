import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, ListTree } from 'lucide-react';
import { categorySchema } from '../../validators/expenseValidation';
import type { CategoryFormValues } from '../../validators/expenseValidation';
import { formStyles } from '../../../../components/ui/form-styles';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

const defaultEmptyCategory: Partial<CategoryFormValues> = {
  name: '',
  glCode: '',
  receiptRequired: false,
  minReceiptAmount: 0,
  active: true,
};

export default function CategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: defaultEmptyCategory as CategoryFormValues
  });

  const receiptRequired = form.watch('receiptRequired');

  useEffect(() => {
    if (mode !== 'create' && id) {
      fetchData();
    }
  }, [id, mode]);

  const fetchData = async () => {
    try {
      const data = await api.get(`/hrms/expense-claims/categories/${id}`);
      form.reset({
        name: data.category,
        glCode: data.glCode,
        receiptRequired: data.receiptRequired ?? false,
        minReceiptAmount: data.minReceiptAmount ?? 0,
        active: data.active ?? true
      });
    } catch (e) {
      toast.error('Failed to fetch category details');
      navigate(`${basePath}/hrms/expense-claims/configuration/categories`);
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (mode === 'create') {
        await api.post('/hrms/expense-claims/categories', {
          category: data.name,
          glCode: data.glCode,
          receiptRequired: data.receiptRequired,
          minReceiptAmount: data.minReceiptAmount,
          active: data.active
        });
        toast.success('Category created');
      } else {
        await api.put(`/hrms/expense-claims/categories/${id}`, {
          category: data.name,
          glCode: data.glCode,
          receiptRequired: data.receiptRequired,
          minReceiptAmount: data.minReceiptAmount,
          active: data.active
        });
        toast.success('Category updated');
      }
      navigate(`${basePath}/hrms/expense-claims/configuration/categories`);
    } catch (err: any) {
      toast.error('Error saving category');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`${basePath}/hrms/expense-claims/configuration/categories`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Add Category' : mode === 'edit' ? 'Edit Category' : 'View Category'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure expense category settings</p>
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate(`${basePath}/hrms/expense-claims/configuration/categories`)}
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
              Save Category
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <FormProvider {...form}>
            <form id="category-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ListTree className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category Details</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className={formStyles.label}>Category Name *</label>
                    <input
                      type="text"
                      {...form.register('name')}
                      className={formStyles.field(!!form.formState.errors.name, readOnly)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
                  </div>

                  <div>
                    <label className={formStyles.label}>GL Code *</label>
                    <input
                      type="text"
                      {...form.register('glCode')}
                      className={formStyles.field(!!form.formState.errors.glCode, readOnly)}
                      disabled={readOnly}
                    />
                    {form.formState.errors.glCode && <p className="text-red-500 text-xs mt-1">{form.formState.errors.glCode.message}</p>}
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      {...form.register('receiptRequired')}
                      id="receiptRequired"
                      disabled={readOnly}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="receiptRequired" className="text-sm text-gray-700 dark:text-gray-300 font-medium">Receipt Required</label>
                  </div>

                  {receiptRequired && (
                    <div>
                      <label className={formStyles.label}>Minimum Receipt Amount</label>
                      <input
                        type="number"
                        {...form.register('minReceiptAmount', { valueAsNumber: true })}
                        className={formStyles.field(!!form.formState.errors.minReceiptAmount, readOnly)}
                        disabled={readOnly}
                      />
                      {form.formState.errors.minReceiptAmount && <p className="text-red-500 text-xs mt-1">{form.formState.errors.minReceiptAmount.message}</p>}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-white/5 mt-4">
                    <input
                      type="checkbox"
                      {...form.register('active')}
                      id="active"
                      disabled={readOnly}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300 font-medium">Active</label>
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
