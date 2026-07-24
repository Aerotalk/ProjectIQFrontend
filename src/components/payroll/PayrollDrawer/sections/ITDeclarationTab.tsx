import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2, Upload } from 'lucide-react';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import CustomSelect from '../../../ui/CustomSelect';
import { CurrencyInput } from '../../../ui/CurrencyInput';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { formStyles } from '../../../ui/form-styles';

interface Props {
  readOnly?: boolean;
}

export default function ITDeclarationTab({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext<PayrollFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itDeclarations.items',
  });

  const regimeOptions = [
    { value: 'Old Regime', label: 'Old Regime' },
    { value: 'New Regime', label: 'New Regime' },
  ];

  return (
    <div className="space-y-6">
      <FormSection title="IT Declarations" description="Manage Income Tax declarations and proof submissions.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Financial Year *
            </label>
            <Input
              {...register('itDeclarations.financialYear')}
              placeholder="e.g., 2026-2027"
              disabled={readOnly}
              className={errors.itDeclarations?.financialYear ? 'border-red-500' : ''}
            />
            {errors.itDeclarations?.financialYear && (
              <p className="text-xs text-red-500">{errors.itDeclarations.financialYear.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Tax Regime *
            </label>
            <Controller
              name="itDeclarations.taxRegime"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={regimeOptions}
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={readOnly}
                />
              )}
            />
          </div>
        </FormGrid>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Declaration Items</h3>
            {!readOnly && (
              <button
                type="button"
                onClick={() => append({ taxSection: '', description: '', declaredAmount: '' })}
                className="flex items-center gap-1.5 text-sm font-medium text-[#792359] hover:text-[#52173c] dark:text-[#e6a8d0] dark:hover:text-[#f4d1e7] transition-colors"
              >
                <Plus size={16} />
                Add Item
              </button>
            )}
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-sm relative group">
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-sm transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mr-8">
                  <div className="space-y-2">
                    <label className={formStyles.label}>Tax Section</label>
                    <Input
                      {...register(`itDeclarations.items.${index}.taxSection` as const)}
                      placeholder="e.g., 80C"
                      disabled={readOnly}
                      className={errors.itDeclarations?.items?.[index]?.taxSection ? 'border-red-500' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Description</label>
                    <Input
                      {...register(`itDeclarations.items.${index}.description` as const)}
                      placeholder="e.g., LIC Premium"
                      disabled={readOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={formStyles.label}>Declared Amount</label>
                    <CurrencyInput
                      {...register(`itDeclarations.items.${index}.declaredAmount` as const)}
                      placeholder="0.00"
                      disabled={readOnly}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <label className={formStyles.label}>Proof Document</label>
                    <div className="flex items-center gap-3">
                      <button type="button" disabled={readOnly} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-[#1f2229] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50">
                        <Upload size={14} />
                        Upload File
                      </button>
                      <span className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max 5MB)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {fields.length === 0 && (
              <div className="text-center py-8 bg-gray-50 dark:bg-white/[0.02] border border-dashed border-gray-300 dark:border-white/20 rounded-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">No declaration items added yet.</p>
              </div>
            )}
          </div>
        </div>
      </FormSection>
    </div>
  );
}
