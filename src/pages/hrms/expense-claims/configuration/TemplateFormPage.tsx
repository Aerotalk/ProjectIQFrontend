import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, LayoutTemplate } from 'lucide-react';
import { templateSchema } from '../validators/expenseValidation';
import type { TemplateFormValues } from '../validators/expenseValidation';
import { formStyles } from '../../../../components/ui/form-styles';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

const defaultEmptyTemplate: Partial<TemplateFormValues> = {
  templateName: '',
  description: '',
  allowedCategories: [],
  active: true,
};

export default function TemplateFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  const readOnly = mode === 'view';
  
  const [categories, setCategories] = useState<any[]>([]);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema) as any,
    defaultValues: defaultEmptyTemplate as TemplateFormValues
  });

  useEffect(() => {
    fetchCategories();
    if (mode !== 'create' && id) {
      fetchData();
    }
  }, [id, mode]);

  const fetchCategories = async () => {
    try {
      const data = await api.get('/hrms/expense-claims/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error('Failed to load categories');
    }
  };

  const fetchData = async () => {
    try {
      const data = await api.get(`/hrms/expense-claims/templates/${id}`);
      form.reset({
        templateName: data.templateName,
        description: data.description,
        allowedCategories: data.allowedCategories || [],
        active: data.active ?? true
      });
    } catch (e) {
      toast.error('Failed to fetch template details');
      navigate(`${basePath}/hrms/expense-claims/configuration/templates`);
    }
  };

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      if (mode === 'create') {
        await api.post('/hrms/expense-claims/templates', data);
        toast.success('Template created');
      } else {
        await api.put(`/hrms/expense-claims/templates/${id}`, data);
        toast.success('Template updated');
      }
      navigate(`${basePath}/hrms/expense-claims/configuration/templates`);
    } catch (err: any) {
      toast.error('Error saving template');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`${basePath}/hrms/expense-claims/configuration/templates`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Create Template' : mode === 'edit' ? 'Edit Template' : 'View Template'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure expense claim template</p>
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate(`${basePath}/hrms/expense-claims/configuration/templates`)}
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
              Save Template
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <FormProvider {...form}>
            <form id="template-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LayoutTemplate className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Template Details</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className={formStyles.label}>Template Name *</label>
                    <input
                      type="text"
                      {...form.register('templateName')}
                      className={formStyles.field(!!form.formState.errors.templateName, readOnly)}
                      placeholder="e.g., General Travel"
                      disabled={readOnly}
                    />
                    {form.formState.errors.templateName && <p className="text-red-500 text-xs mt-1">{form.formState.errors.templateName.message}</p>}
                  </div>

                  <div>
                    <label className={formStyles.label}>Description</label>
                    <input
                      type="text"
                      {...form.register('description')}
                      className={formStyles.field(!!form.formState.errors.description, readOnly)}
                      placeholder="Description of the template"
                      disabled={readOnly}
                    />
                  </div>
                  
                  <div>
                    <label className={formStyles.label}>Allowed Categories *</label>
                    <Controller
                      control={form.control}
                      name="allowedCategories"
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-2">
                          {categories.map(c => (
                            <label key={c.id} className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer ${field.value?.includes(c.id) ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-white/10'} ${readOnly ? 'opacity-70 pointer-events-none' : ''}`}>
                              <input
                                type="checkbox"
                                disabled={readOnly}
                                checked={field.value?.includes(c.id) || false}
                                onChange={(e) => {
                                  const current = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([...current, c.id]);
                                  } else {
                                    field.onChange(current.filter((id: string) => id !== c.id));
                                  }
                                }}
                                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c.category}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {form.formState.errors.allowedCategories && <p className="text-red-500 text-xs mt-1">{form.formState.errors.allowedCategories.message}</p>}
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="active"
                      {...form.register('active')}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      disabled={readOnly}
                    />
                    <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active
                    </label>
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
