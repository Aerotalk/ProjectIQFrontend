import CustomDatePicker from '@/components/ui/CustomDatePicker';
"use no memo";
import { useEffect, useRef, useMemo } from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { Paperclip, X as XIcon } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import { useProjects } from '@/hooks/useProjects';
import { AutoNumberInput } from '@/components/shared/AutoNumberSettings';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { cn } from '@/lib/utils';

interface Props {
  readOnly?: boolean;
  nextNumber?: number;
}

const EXPENSE_CATEGORIES = [
  'Travel',
  'Accommodation',
  'Petty Cash',
  'Material',
  'Labour (non-vendor)',
  'Communication',
  'Miscellaneous'
];

export default function ExpenseFormSection({ readOnly, nextNumber }: Props) {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { projects } = useProjects();

  // Watch for dependent fields
  const selectedProjectId = useWatch({ control, name: 'projectId' });
  const isGstApplicable = useWatch({ control, name: 'isGstApplicable' });
  const receiptName = useWatch({ control, name: 'receiptName' });

  // Sync display names
  useEffect(() => {
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) setValue('projectName', project.projectName, { shouldValidate: false });
  }, [selectedProjectId, setValue, projects]);

  // File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('receiptName', file.name, { shouldValidate: false });
    }
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    setValue('receiptName', '', { shouldValidate: false });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    if (!isGstApplicable && !readOnly) {
      setValue('gstAmount', undefined, { shouldValidate: true });
      setValue('isInputCreditClaimable', false, { shouldValidate: true });
    }
  }, [isGstApplicable, setValue, readOnly]);

  const PROJECT_OPTIONS = useMemo(() => {
    return projects.map(p => ({ label: `${p.projectCode} – ${p.projectName}`, value: p.id }));
  }, [projects]);

  return (
    <div className="space-y-6">
      
      {/* ── Basic Details ── */}
      <FormSection title="Basic Details" className="pt-0 border-t-0">
        <FormGrid>
          
          {/* Expense Number */}
          <FormRow>
            <label className={formStyles.label}>
              Expense Number <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <AutoNumberInput
              name="expenseNo"
              disabled={readOnly}
              placeholder="e.g. EXP/2026/001"
              defaultPrefix="EXP/2026/"
              nextNumber={nextNumber}
              className={formStyles.field(!!errors.expenseNo, readOnly)}
            />
            {errors.expenseNo && (
              <p className="text-red-500 text-xs mt-1">{errors.expenseNo.message as string}</p>
            )}
          </FormRow>

          {/* Project */}
          <FormRow>
            <label className={formStyles.label}>
              Project <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={PROJECT_OPTIONS}
                  />
                )}
              />
            </div>
            {errors.projectId && (
              <p className="text-red-500 text-xs mt-1">{errors.projectId.message as string}</p>
            )}
          </FormRow>

          {/* Expense Date */}
          <FormRow>
            <label className={formStyles.label}>
              Expense Date <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <div className="relative">
              <CustomDatePicker name="expenseDate" disabled={readOnly} />
            </div>
            {errors.expenseDate && (
              <p className="text-red-500 text-xs mt-1">{errors.expenseDate.message as string}</p>
            )}
          </FormRow>
          
          {/* Category */}
          <FormRow>
            <label className={formStyles.label}>
              Category <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={EXPENSE_CATEGORIES}
                  />
                )}
              />
            </div>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category.message as string}</p>
            )}
          </FormRow>

          {/* Paid By */}
          <FormRow>
            <label className={formStyles.label}>
              Paid By <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <input
              type="text"
              {...register('paidBy')}
              disabled={readOnly}
              placeholder="e.g. John Doe, Company Card"
              className={formStyles.field(!!errors.paidBy, readOnly)}
            />
            {errors.paidBy && (
              <p className="text-red-500 text-xs mt-1">{errors.paidBy.message as string}</p>
            )}
          </FormRow>
          
        </FormGrid>
      </FormSection>

      {/* ── Financial Details ── */}
      <FormSection title="Financials">
        <FormGrid>
          
          {/* Amount */}
          <FormRow>
            <label className={formStyles.label}>
              Amount (₹) <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              disabled={readOnly}
              placeholder="0.00"
              className={cn(formStyles.field(!!errors.amount, readOnly), "hide-arrows")}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount.message as string}</p>
            )}
          </FormRow>

          <FormRow>
            <label className={formStyles.label}>&nbsp;</label>
            <div className="flex flex-col gap-4 px-3 py-2 border border-gray-200 dark:border-white/10 rounded-sm bg-gray-50/50 dark:bg-white/[0.02]">
              {/* GST Applicable Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  {...register('isGstApplicable')}
                  disabled={readOnly}
                  className="sr-only peer"
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${
                  isGstApplicable 
                    ? 'bg-[#792359] dark:bg-[#c44997]' 
                    : 'bg-gray-200 dark:bg-white/10 peer-hover:bg-gray-300 dark:peer-hover:bg-white/20'
                  } ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                ></div>
                <div className={`absolute left-[2px] top-[2px] bg-white w-4 h-4 rounded-full transition-transform ${
                  isGstApplicable ? 'translate-x-full' : ''
                }`}></div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GST Applicable</span>
            </label>

            {/* Conditional GST Fields */}
            {isGstApplicable && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 pt-2 border-t border-gray-200 dark:border-white/10">
                <FormRow>
                  <label className={formStyles.label}>
                    GST Amount (₹) <span className="text-red-500 normal-case font-normal">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('gstAmount', { valueAsNumber: true })}
                    disabled={readOnly}
                    placeholder="0.00"
                    className={cn(formStyles.field(!!errors.gstAmount, readOnly), "hide-arrows")}
                  />
                  {errors.gstAmount && (
                    <p className="text-red-500 text-xs mt-1">{errors.gstAmount.message as string}</p>
                  )}
                </FormRow>

                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    {...register('isInputCreditClaimable')}
                    disabled={readOnly}
                    className="w-4 h-4 text-[#792359] focus:ring-[#792359] border-gray-300 rounded-sm"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Input Credit Claimable</span>
                </label>
              </div>
            )}
            </div>
          </FormRow>

        </FormGrid>
      </FormSection>
      
      {/* ── Content & Receipt ── */}
      <FormSection title="Details & Documentation">
        <FormGrid>
          {/* Description */}
          <FormRow className="md:col-span-2">
            <label className={formStyles.label}>
              Description <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <textarea
              {...register('description')}
              disabled={readOnly}
              placeholder='Must be specific (E.g. "Cab fare to site, 12 July 2026")'
              rows={3}
              className={formStyles.textarea(!!errors.description, readOnly)}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>
            )}
          </FormRow>
          
          {/* Receipt Upload */}
          <FormRow className="md:col-span-2">
            <label className={formStyles.label}>
              Receipt Upload
              <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(optional)</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              disabled={readOnly}
              onChange={handleFileChange}
            />

            {!receiptName ? (
              <button
                type="button"
                disabled={readOnly}
                onClick={() => fileInputRef.current?.click()}
                className={
                  `w-full flex items-center gap-2 px-3 py-2 border border-dashed rounded-sm text-sm transition-colors ` +
                  (readOnly
                    ? 'border-gray-200 dark:border-white/5 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 ' +
                      'hover:border-[#792359] hover:text-[#792359] dark:hover:border-[#c44997] dark:hover:text-[#c44997] cursor-pointer')
                }
              >
                <Paperclip size={14} />
                <span>Upload bill/receipt</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-white/10 rounded-sm bg-gray-50 dark:bg-white/[0.02]">
                <Paperclip size={14} className="text-[#792359] dark:text-[#c44997] shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1" title={receiptName}>
                  {receiptName}
                </span>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    title="Remove receipt"
                  >
                    <XIcon size={14} />
                  </button>
                )}
              </div>
            )}
          </FormRow>
        </FormGrid>
      </FormSection>
      
    </div>
  );
}

