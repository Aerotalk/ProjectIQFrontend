import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { formStyles } from '../../../../components/ui/form-styles';
import CustomSelect from '../../../../components/ui/CustomSelect';
import EmployeeSelector from '../../../../components/hrms/EmployeeSelector';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

const assignmentSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  templateId: z.string().min(1, 'Template is required'),
  reviewer1Id: z.string().optional(),
  reviewer2Id: z.string().optional(),
  reviewer3Id: z.string().optional(),
  autoEscalationDays: z.number().min(1, 'Must be at least 1 day'),
}).refine(data => data.reviewer1Id || data.reviewer2Id || data.reviewer3Id, {
  message: "At least one reviewer must be assigned",
  path: ["reviewer1Id"]
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export default function ReviewerAssignmentFormPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templates, setTemplates] = useState<{ id: string, templateName: string }[]>([]);

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema) as any,
    defaultValues: {
      employeeId: '',
      templateId: '',
      reviewer1Id: '',
      reviewer2Id: '',
      reviewer3Id: '',
      autoEscalationDays: 3,
    }
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await api.get('/hrms/expense-claims/templates');
      setTemplates(data || []);
    } catch (err) {
      toast.error('Failed to load templates');
    }
  };

  const onSubmit = async (data: AssignmentFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post('/hrms/expense-claims/reviewer-assignments', data);
      toast.success('Reviewer assignment saved successfully!');
      navigate('/companydashboard/hrms/expense-claims/configuration/reviewer-assignment');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save assignment');
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Assign Reviewers</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Map an employee to their approvers for a specific expense template.</p>
          </div>
        </div>
      </div>

      <FormProvider {...form}>
        <form id="assignment-form" onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-2xl space-y-8">
            
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">Target mapping</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={formStyles.label}>Employee *</label>
                  <EmployeeSelector 
                    value={form.watch('employeeId')}
                    onChange={(val) => form.setValue('employeeId', val)}
                  />
                  {form.formState.errors.employeeId && <p className="text-red-500 text-xs mt-1">{form.formState.errors.employeeId.message}</p>}
                </div>

                <div>
                  <label className={formStyles.label}>Expense Template *</label>
                  <CustomSelect
                    options={templates.map(t => ({ label: t.templateName, value: t.id }))}
                    value={form.watch('templateId')}
                    onChange={(val) => form.setValue('templateId', val)}
                  />
                  {form.formState.errors.templateId && <p className="text-red-500 text-xs mt-1">{form.formState.errors.templateId.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">Approval Workflow</h3>
              <p className="text-xs text-gray-500 mb-4">Assign up to 3 levels of approvers. At least one must be provided.</p>

              <div className="space-y-4">
                <div>
                  <label className={formStyles.label}>Level 1 Approver</label>
                  <EmployeeSelector 
                    value={form.watch('reviewer1Id') || ''}
                    onChange={(val) => form.setValue('reviewer1Id', val)}
                  />
                  {form.formState.errors.reviewer1Id && <p className="text-red-500 text-xs mt-1">{form.formState.errors.reviewer1Id.message}</p>}
                </div>

                <div>
                  <label className={formStyles.label}>Level 2 Approver (Optional)</label>
                  <EmployeeSelector 
                    value={form.watch('reviewer2Id') || ''}
                    onChange={(val) => form.setValue('reviewer2Id', val)}
                  />
                </div>

                <div>
                  <label className={formStyles.label}>Level 3 Approver (Optional)</label>
                  <EmployeeSelector 
                    value={form.watch('reviewer3Id') || ''}
                    onChange={(val) => form.setValue('reviewer3Id', val)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">Settings</h3>
              
              <div className="max-w-xs">
                <label className={formStyles.label}>Auto Escalation (Days) *</label>
                <input
                  type="number"
                  {...form.register('autoEscalationDays', { valueAsNumber: true })}
                  className={formStyles.field(!!form.formState.errors.autoEscalationDays, false)}
                />
                {form.formState.errors.autoEscalationDays && <p className="text-red-500 text-xs mt-1">{form.formState.errors.autoEscalationDays.message}</p>}
                <p className="text-xs text-gray-500 mt-1">Days before automatic escalation to the next level.</p>
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
          form="assignment-form"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Assignment
        </button>
      </div>
    </div>
  );
}
