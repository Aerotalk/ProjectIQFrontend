import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  readOnly?: boolean;
}

export default function SalaryRevisionTab({ readOnly }: Props) {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'revisionSalaryComponents'
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Salary Revision" className="pt-0 border-t-0">
        <FormGrid>
          {/* Row: Revision Type | Effective Date */}
          <div>
            <label className={formStyles.label}>Revision Type</label>
            <Controller
              name={'revisionType'}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: 'Select Type', value: '' },
                    { label: 'Annual Appraisal', value: 'Annual Appraisal' },
                    { label: 'Mid-Year Appraisal', value: 'Mid-Year Appraisal' },
                    { label: 'Promotion', value: 'Promotion' },
                    { label: 'Correction', value: 'Correction' }
                  ]}
                  disabled={readOnly}
                />
              )}
            />
          </div>
          <div>
            <label className={formStyles.label}>Effective Date</label>
            <CustomDatePicker name="revisionEffectiveDate" disabled={readOnly} />
          </div>

          {/* Row: Annual CTC | Increment % */}
          <div>
            <label className={formStyles.label}>Annual CTC</label>
            <Input type="number" step="0.01" {...register('revisionAnnualCTC', { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })} disabled={readOnly} />
          </div>
          <div>
            <label className={formStyles.label}>Increment Percentage (%)</label>
            <Input type="number" step="0.01" {...register('revisionIncrementPercentage', { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })} disabled={readOnly} />
          </div>

          {/* Salary Components — full width */}
          <FormRow>
            <div className="flex items-center justify-between mb-4">
              <label className={formStyles.label}>Salary Components Breakdown</label>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => append({ componentName: '', percentage: undefined, amount: undefined })}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
                >
                  <Plus size={16} /> Add Component
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/10">
                  <div className="flex-1">
                    <Input
                      {...register(`revisionSalaryComponents.${index}.componentName`)}
                      placeholder="Component Name (e.g. Basic, HRA)"
                      disabled={readOnly}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`revisionSalaryComponents.${index}.percentage`, { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })}
                      placeholder="Percentage %"
                      disabled={readOnly}
                    />
                  </div>
                  <div className="w-40">
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`revisionSalaryComponents.${index}.amount`, { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })}
                      placeholder="Amount ₹"
                      disabled={readOnly}
                    />
                  </div>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              {fields.length === 0 && (
                <div className="text-center py-6 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200 dark:border-white/10 text-gray-500 text-sm">
                  No salary components added.
                </div>
              )}
            </div>
          </FormRow>

          {/* Reason — full width */}
          <FormRow>
            <label className={formStyles.label}>Reason</label>
            <Input type="text" {...register('revisionReason')} disabled={readOnly} />
          </FormRow>
        </FormGrid>
      </FormSection>
    </div>
  );
}
