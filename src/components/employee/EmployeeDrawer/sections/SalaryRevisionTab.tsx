import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface Props {
  readOnly?: boolean;
}

export default function SalaryRevisionTab({ readOnly }: Props) {
  const { register, control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'revisionSalaryComponents'
  });

  const annualCTC = useWatch({ control, name: 'revisionAnnualCTC' }) || 0;
  const components = useWatch({ control, name: 'revisionSalaryComponents' }) || [];

  const { totalEarnings, totalDeductions, totalReimbursements } = useMemo(() => {
    let e = 0, d = 0, r = 0;
    components.forEach((c: any) => {
      let annualAmount = 0;
      if (c.percentage) {
        annualAmount = (annualCTC * c.percentage) / 100;
      } else if (c.amount) {
        annualAmount = c.amount;
      }
      
      if (c.type === 'EARNING') e += annualAmount;
      else if (c.type === 'DEDUCTION') d += annualAmount;
      else if (c.type === 'REIMBURSEMENT') r += annualAmount;
    });
    return { totalEarnings: e, totalDeductions: d, totalReimbursements: r };
  }, [annualCTC, components]);

  const balance = totalEarnings - annualCTC;

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
                    { label: 'Initial', value: 'INITIAL' },
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
                  onClick={() => append({ componentName: '', type: 'EARNING', percentage: undefined, amount: undefined })}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
                >
                  <Plus size={16} /> Add Component
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {fields.map((item, index) => {
                const comp = components[index] || {};

                
                let monthlyPreview = 0;
                if (comp.percentage) {
                   monthlyPreview = (annualCTC * comp.percentage / 100) / 12;
                } else if (comp.amount) {
                   monthlyPreview = comp.amount / 12;
                }

                return (
                  <div key={item.id} className="flex flex-col gap-2 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          {...register(`revisionSalaryComponents.${index}.componentName`)}
                          placeholder="Name (e.g. Basic)"
                          disabled={readOnly}
                        />
                      </div>
                      <div className="w-40">
                        <Controller
                          name={`revisionSalaryComponents.${index}.type`}
                          control={control}
                          render={({ field }) => (
                            <CustomSelect
                              value={field.value || 'EARNING'}
                              onChange={field.onChange}
                              options={[
                                { label: 'Earning', value: 'EARNING' },
                                { label: 'Deduction', value: 'DEDUCTION' },
                                { label: 'Reimbursement', value: 'REIMBURSEMENT' }
                              ]}
                              disabled={readOnly}
                            />
                          )}
                        />
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          step="0.01"
                          {...register(`revisionSalaryComponents.${index}.percentage`, { 
                            setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v),
                            onChange: (e) => {
                              const p = parseFloat(e.target.value);
                              if (!isNaN(p) && annualCTC > 0) {
                                setValue(`revisionSalaryComponents.${index}.amount`, Number((annualCTC * p / 100).toFixed(2)), { shouldValidate: true, shouldDirty: true });
                              } else if (e.target.value === "") {
                                setValue(`revisionSalaryComponents.${index}.amount`, undefined, { shouldValidate: true, shouldDirty: true });
                              }
                            }
                          })}
                          placeholder="Percentage %"
                          disabled={readOnly}
                        />
                      </div>
                      <div className="w-40">
                        <Input
                          type="number"
                          step="0.01"
                          {...register(`revisionSalaryComponents.${index}.amount`, { 
                            setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v),
                            onChange: (e) => {
                              const a = parseFloat(e.target.value);
                              if (!isNaN(a) && annualCTC > 0) {
                                setValue(`revisionSalaryComponents.${index}.percentage`, Number((a / annualCTC * 100).toFixed(2)), { shouldValidate: true, shouldDirty: true });
                              } else if (e.target.value === "") {
                                setValue(`revisionSalaryComponents.${index}.percentage`, undefined, { shouldValidate: true, shouldDirty: true });
                              }
                            }
                          })}
                          placeholder="Annual Amount ₹"
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
                    {monthlyPreview > 0 && (
                      <div className="text-xs text-gray-500 text-right pr-[50px]">
                        Monthly Preview: ₹{monthlyPreview.toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })}
              {fields.length === 0 && (
                <div className="text-center py-6 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200 dark:border-white/10 text-gray-500 text-sm">
                  No salary components added.
                </div>
              )}
            </div>
            
            {/* Running Totals Panel */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Total Earnings</div>
                  <div className="font-semibold">₹{totalEarnings.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Total Deductions</div>
                  <div className="font-semibold text-red-500">₹{totalDeductions.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Reimbursements</div>
                  <div className="font-semibold text-blue-500">₹{totalReimbursements.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Balance vs CTC</div>
                  <div className={`font-semibold ${balance === 0 ? 'text-green-500' : 'text-orange-500'}`}>
                    {balance > 0 ? '+' : ''}₹{balance.toFixed(2)}
                  </div>
                </div>
              </div>
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
