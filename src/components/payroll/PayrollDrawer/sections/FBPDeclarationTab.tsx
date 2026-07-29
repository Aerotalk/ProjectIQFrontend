import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import CustomSelect from '../../../ui/CustomSelect';
import { CurrencyInput } from '../../../ui/CurrencyInput';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { formStyles } from '../../../ui/form-styles';

interface Props {
  readOnly?: boolean;
}

export default function FBPDeclarationTab({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext<PayrollFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fbpDeclarations.items',
  });

  const fbpTypes = [
    { value: 'LTA', label: 'Leave Travel Allowance' },
    { value: 'Food Coupons', label: 'Food Coupons' },
    { value: 'Fuel Allowance', label: 'Fuel Allowance' },
    { value: 'Telephone', label: 'Telephone/Internet' },
    { value: 'Driver Salary', label: 'Driver Salary' },
  ];

  return (
    <div className="space-y-6">
      <FormSection title="Flexible Benefit Plan (FBP)" description="Declare flexible benefit allocations for the financial year.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Financial Year *
            </label>
            <Input
              {...register('fbpDeclarations.financialYear')}
              placeholder="e.g., 2026-2027"
              disabled={readOnly}
              className={errors.fbpDeclarations?.financialYear ? 'border-red-500' : ''}
            />
            {errors.fbpDeclarations?.financialYear && (
              <p className="text-xs text-red-500">{errors.fbpDeclarations.financialYear.message}</p>
            )}
          </div>
        </FormGrid>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">FBP Components</h3>
            {!readOnly && (
              <button
                type="button"
                onClick={() => append({ reimbursementType: '', annualAmount: '' })}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark dark:text-secondary dark:hover:text-[#f4d1e7] transition-colors"
              >
                <Plus size={16} />
                Add Component
              </button>
            )}
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={formStyles.label}>Component Type</label>
                    <Controller
                      name={`fbpDeclarations.items.${index}.reimbursementType` as const}
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          options={fbpTypes}
                          value={field.value || ''}
                          onChange={field.onChange}
                          disabled={readOnly}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Annual Amount</label>
                    <CurrencyInput
                      {...register(`fbpDeclarations.items.${index}.annualAmount` as const)}
                      placeholder="0.00"
                      disabled={readOnly}
                    />
                  </div>
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 mt-6 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-sm transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            
            {fields.length === 0 && (
              <div className="text-center py-8 bg-gray-50 dark:bg-white/[0.02] border border-dashed border-gray-300 dark:border-white/20 rounded-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">No FBP components added.</p>
              </div>
            )}
          </div>
        </div>
      </FormSection>
    </div>
  );
}
