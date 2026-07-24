import { useFormContext, Controller } from 'react-hook-form';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import CustomSelect from '../../../ui/CustomSelect';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { Image as ImageIcon } from 'lucide-react';
import { formStyles } from '../../../ui/form-styles';

interface Props {
  readOnly?: boolean;
}

export default function PayrollConfigurationTab({ readOnly }: Props) {
  const { register, control, watch } = useFormContext<PayrollFormValues>();

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
      <FormSection title="Pay Component Setup" description="Create or modify a salary component.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Component Name *
            </label>
            <Input
              {...register('payrollConfiguration.componentName')}
              placeholder="e.g., Basic Pay"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Code *
            </label>
            <Input
              {...register('payrollConfiguration.code')}
              placeholder="e.g., BASIC"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Type *
            </label>
            <Controller
              name="payrollConfiguration.type"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={componentTypes}
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={readOnly}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Calculation Type *
            </label>
            <Controller
              name="payrollConfiguration.calculationType"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={calculationTypes}
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={readOnly}
                />
              )}
            />
          </div>

          {watch('payrollConfiguration.calculationType') === 'Percentage' && (
            <>
              <div className="space-y-2">
                <label className={formStyles.label}>
                  Percentage Of
                </label>
                <Input
                  {...register('payrollConfiguration.percentageOf')}
                  placeholder="e.g., CTC"
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <label className={formStyles.label}>
                  Percentage Value
                </label>
                <Input
                  type="number"
                  {...register('payrollConfiguration.percentageValue')}
                  placeholder="e.g., 40"
                  disabled={readOnly}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className={formStyles.label}>
              Max Limit
            </label>
            <Input
              type="number"
              {...register('payrollConfiguration.maxLimit')}
              placeholder="Optional limit"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Display Order
            </label>
            <Input
              type="number"
              {...register('payrollConfiguration.displayOrder')}
              placeholder="e.g., 1"
              disabled={readOnly}
            />
          </div>
        </FormGrid>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('payrollConfiguration.taxable')} disabled={readOnly} className="w-4 h-4 text-[#792359] border-gray-300 rounded focus:ring-[#792359] dark:border-gray-600 dark:bg-gray-700" />
            <span className={formStyles.label}>Taxable</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('payrollConfiguration.proRata')} disabled={readOnly} className="w-4 h-4 text-[#792359] border-gray-300 rounded focus:ring-[#792359] dark:border-gray-600 dark:bg-gray-700" />
            <span className={formStyles.label}>Pro-rata</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('payrollConfiguration.partOfCTC')} disabled={readOnly} className="w-4 h-4 text-[#792359] border-gray-300 rounded focus:ring-[#792359] dark:border-gray-600 dark:bg-gray-700" />
            <span className={formStyles.label}>Part of CTC</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('payrollConfiguration.partOfGross')} disabled={readOnly} className="w-4 h-4 text-[#792359] border-gray-300 rounded focus:ring-[#792359] dark:border-gray-600 dark:bg-gray-700" />
            <span className={formStyles.label}>Part of Gross</span>
          </label>
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
              className="w-full h-32 p-3 text-sm font-mono bg-gray-50 dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#792359]"
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
              <input type="checkbox" {...register('payrollConfiguration.setAsDefault')} disabled={readOnly} className="w-4 h-4 text-[#792359] border-gray-300 rounded focus:ring-[#792359] dark:border-gray-600 dark:bg-gray-700" />
              <span className={formStyles.label}>Set as Default Template</span>
            </label>
          </div>
        </FormGrid>
      </FormSection>
    </div>
  );
}
