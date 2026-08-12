import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import CustomSelect from '../../../ui/CustomSelect';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { Plus, Trash2 } from 'lucide-react';
import { formStyles } from '../../../ui/form-styles';

interface Props {
  readOnly?: boolean;
}

export default function PayComponentSetupTab({ readOnly }: Props) {
  const { register, control, watch } = useFormContext<PayrollFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'payComponentSetup.components'
  });

  const componentTypes = [
    { value: 'Earning', label: 'Earning' },
    { value: 'Deduction', label: 'Deduction' },
    { value: 'Reimbursement', label: 'Reimbursement' },
    { value: 'Employer Contribution', label: 'Employer Contribution' },
  ];

  const subTypes = [
    { value: 'Fixed', label: 'Fixed' },
    { value: 'Variable', label: 'Variable' },
    { value: 'Statutory', label: 'Statutory' },
    { value: 'Voluntary', label: 'Voluntary' },
  ];

  const calculationTypes = [
    { value: 'Flat Amount', label: 'Flat Amount' },
    { value: 'Percentage', label: 'Percentage' },
    { value: 'Formula', label: 'Formula Based' },
    { value: 'Slab', label: 'Slab Based' },
  ];

  return (
    <div className="space-y-8">
      <FormSection title="Pay Component Setup" description="Create or modify master salary components.">
        <div className="space-y-6">
          {fields.map((field, index) => {
            const calcType = watch(`payComponentSetup.components.${index}.calculationType`);
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
                    <Input {...register(`payComponentSetup.components.${index}.componentName` as const)} placeholder="e.g., House Rent Allowance" disabled={readOnly} />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Code *</label>
                    <Input {...register(`payComponentSetup.components.${index}.code` as const)} placeholder="e.g., HRA" disabled={readOnly} />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Type *</label>
                    <Controller
                      name={`payComponentSetup.components.${index}.type` as const}
                      control={control}
                      render={({ field }) => (
                        <CustomSelect options={componentTypes} value={field.value || ''} onChange={field.onChange} disabled={readOnly} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Sub-Type</label>
                    <Controller
                      name={`payComponentSetup.components.${index}.subType` as const}
                      control={control}
                      render={({ field }) => (
                        <CustomSelect options={subTypes} value={field.value || ''} onChange={field.onChange} disabled={readOnly} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Calculation Type *</label>
                    <Controller
                      name={`payComponentSetup.components.${index}.calculationType` as const}
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
                        <Input {...register(`payComponentSetup.components.${index}.percentageOf` as const)} placeholder="e.g., Basic" disabled={readOnly} />
                      </div>
                      <div className="space-y-2">
                        <label className={formStyles.label}>Percentage Value</label>
                        <Input type="number" step="0.01" {...register(`payComponentSetup.components.${index}.percentageValue` as const)} placeholder="e.g., 40" disabled={readOnly} />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label className={formStyles.label}>Max Limit</label>
                    <Input type="number" step="0.01" {...register(`payComponentSetup.components.${index}.maxLimit` as const)} placeholder="Optional limit (e.g. 1800)" disabled={readOnly} />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Display Order</label>
                    <Input type="number" {...register(`payComponentSetup.components.${index}.displayOrder` as const)} placeholder="e.g., 1" disabled={readOnly} />
                  </div>
                </FormGrid>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-3 bg-gray-50 dark:bg-white/5 rounded-md border border-gray-100 dark:border-white/5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register(`payComponentSetup.components.${index}.taxable` as const)} disabled={readOnly} className="w-4 h-4 text-primary rounded" />
                    <span className={formStyles.label}>Is Taxable</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register(`payComponentSetup.components.${index}.proRata` as const)} disabled={readOnly} className="w-4 h-4 text-primary rounded" />
                    <span className={formStyles.label}>Is Pro-rata</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register(`payComponentSetup.components.${index}.partOfCTC` as const)} disabled={readOnly} className="w-4 h-4 text-primary rounded" />
                    <span className={formStyles.label}>Part of CTC</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register(`payComponentSetup.components.${index}.partOfGross` as const)} disabled={readOnly} className="w-4 h-4 text-primary rounded" />
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
    </div>
  );
}
