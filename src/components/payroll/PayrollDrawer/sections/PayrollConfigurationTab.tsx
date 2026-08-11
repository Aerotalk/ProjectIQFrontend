import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import CustomSelect from '../../../ui/CustomSelect';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { formStyles } from '../../../ui/form-styles';

interface Props {
  readOnly?: boolean;
}

export default function PayrollConfigurationTab({ readOnly }: Props) {
  const { register, control, watch } = useFormContext<PayrollFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'payrollConfiguration.components'
  });

  const componentTypes = [
    { value: 'Earning', label: 'Earning' },
    { value: 'Deduction', label: 'Deduction' },
    { value: 'Reimbursement', label: 'Reimbursement' },
  ];

  const calculationTypes = [
    { value: 'Flat Amount', label: 'Flat Amount' },
    { value: 'Percentage', label: 'Percentage' },
    { value: 'Formula', label: 'Formula Based' },
  ];

  return (
    <div className="space-y-8">
      {/* Pay Component Setup */}
      <FormSection title="Pay Component Setup" description="Create or modify salary components.">
        <div className="space-y-6">
          {fields.map((field, index) => {
            const calcType = watch(`payrollConfiguration.components.${index}.calculationType`);
            return (
              <div key={field.id} className="p-4 border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-[#181a1f] relative group">
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                <FormGrid>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Component Name *</label>
                    <Input {...register(`payrollConfiguration.components.${index}.componentName` as const)} placeholder="e.g., Basic Pay" disabled={readOnly} />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Code *</label>
                    <Input {...register(`payrollConfiguration.components.${index}.code` as const)} placeholder="e.g., BASIC" disabled={readOnly} />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Type *</label>
                    <Controller
                      name={`payrollConfiguration.components.${index}.type` as const}
                      control={control}
                      render={({ field }) => (
                        <CustomSelect options={componentTypes} value={field.value || ''} onChange={field.onChange} disabled={readOnly} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Calculation Type *</label>
                    <Controller
                      name={`payrollConfiguration.components.${index}.calculationType` as const}
                      control={control}
                      render={({ field }) => (
                        <CustomSelect options={calculationTypes} value={field.value || ''} onChange={field.onChange} disabled={readOnly} />
                      )}
                    />
                  </div>

                  {calcType === 'Percentage' && (
                    <>
                      <div className="space-y-2">
                        <label className={formStyles.label}>Percentage Of</label>
                        <Input {...register(`payrollConfiguration.components.${index}.percentageOf` as const)} placeholder="e.g., CTC" disabled={readOnly} />
                      </div>
                      <div className="space-y-2">
                        <label className={formStyles.label}>Percentage Value</label>
                        <Input type="number" {...register(`payrollConfiguration.components.${index}.percentageValue` as const)} placeholder="e.g., 40" disabled={readOnly} />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label className={formStyles.label}>Max Limit</label>
                    <Input type="number" {...register(`payrollConfiguration.components.${index}.maxLimit` as const)} placeholder="Optional limit" disabled={readOnly} />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Display Order</label>
                    <Input type="number" {...register(`payrollConfiguration.components.${index}.displayOrder` as const)} placeholder="e.g., 1" disabled={readOnly} />
                  </div>
                </FormGrid>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-3 bg-gray-50 dark:bg-white/5 rounded-md border border-gray-100 dark:border-white/5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register(`payrollConfiguration.components.${index}.taxable` as const)} disabled={readOnly} className="w-4 h-4 text-primary rounded" />
                    <span className={formStyles.label}>Taxable</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register(`payrollConfiguration.components.${index}.proRata` as const)} disabled={readOnly} className="w-4 h-4 text-primary rounded" />
                    <span className={formStyles.label}>Pro-rata</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register(`payrollConfiguration.components.${index}.partOfCTC` as const)} disabled={readOnly} className="w-4 h-4 text-primary rounded" />
                    <span className={formStyles.label}>Part of CTC</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register(`payrollConfiguration.components.${index}.partOfGross` as const)} disabled={readOnly} className="w-4 h-4 text-primary rounded" />
                    <span className={formStyles.label}>Part of Gross</span>
                  </label>
                </div>
              </div>
            );
          })}

          {!readOnly && (
            <button
              type="button"
              onClick={() => append({ componentName: '', code: '', type: 'Earning', calculationType: 'Flat Amount', taxable: false, proRata: false, partOfCTC: false, partOfGross: false })}
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-primary text-primary rounded-md hover:bg-primary/5 transition-colors font-medium text-sm w-full justify-center"
            >
              <Plus size={16} /> Add Pay Component
            </button>
          )}
        </div>
      </FormSection>

      <hr className="border-gray-200 dark:border-white/10" />

      {/* Payslip Templates */}
      <FormSection title="Payslip Templates" description="Configure HTML layouts for employee payslips.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Template Name *
            </label>
            <Input
              {...register('payrollConfiguration.templateName')}
              placeholder="e.g., Standard Professional"
              disabled={readOnly}
            />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>
              Layout HTML *
            </label>
            <textarea
              {...register('payrollConfiguration.layoutHTML')}
              disabled={readOnly}
              className="w-full h-32 p-3 text-sm font-mono bg-gray-50 dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="<div>Payslip HTML goes here...</div>"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>Preview Image</label>
            <div className="flex items-center gap-3">
              <div className="w-24 h-32 bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 rounded-sm flex items-center justify-center text-gray-400">
                <ImageIcon size={24} />
              </div>
              <div>
                <button type="button" disabled={readOnly} className="px-3 py-1.5 text-sm bg-white dark:bg-[#1f2229] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50">
                  Upload Preview
                </button>
                <p className="text-xs text-gray-500 mt-2">Upload a thumbnail of how this payslip looks.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('payrollConfiguration.setAsDefault')} disabled={readOnly} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary dark:border-gray-600 dark:bg-gray-700" />
              <span className={formStyles.label}>Set as Default Template</span>
            </label>
          </div>
        </FormGrid>
      </FormSection>
    </div>
  );
}
