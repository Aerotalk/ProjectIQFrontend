import { useFormContext, Controller } from 'react-hook-form';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import CustomSelect from '../../../ui/CustomSelect';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { Users, Calculator, Wallet, Coins } from 'lucide-react';
import { formStyles } from '../../../ui/form-styles';
import CustomMonthPicker from '../../../ui/CustomMonthPicker';

interface Props {
  readOnly?: boolean;
}

export default function PayrollProcessingTab({ readOnly }: Props) {
  const { register, control, watch, formState: { errors } } = useFormContext<PayrollFormValues>();

  const scope = watch('payrollProcessing.employeeScope');

  const scopeOptions = [
    { value: 'All Employees', label: 'All Employees' },
    { value: 'Department', label: 'Specific Department' },
    { value: 'Selected Employees', label: 'Selected Employees' },
  ];

  const runTypeOptions = [
    { value: 'Regular', label: 'Regular Run' },
    { value: 'Supplementary', label: 'Supplementary Run' },
    { value: 'Arrears', label: 'Arrears Run' },
  ];

  return (
    <div className="space-y-6">
      <FormSection title="Payroll Processing" description="Configure parameters for the payroll run and review estimates.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Payroll Period *
            </label>
            <CustomMonthPicker
              name="payrollProcessing.payrollPeriod"
              disabled={readOnly}
              hasError={!!errors.payrollProcessing?.payrollPeriod}
            />
            {errors.payrollProcessing?.payrollPeriod && (
              <p className="text-xs text-red-500">{errors.payrollProcessing.payrollPeriod.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Run Type *
            </label>
            <Controller
              name="payrollProcessing.runType"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={runTypeOptions}
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={readOnly}
                />
              )}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>
              Employee Scope *
            </label>
            <Controller
              name="payrollProcessing.employeeScope"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={scopeOptions}
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={readOnly}
                />
              )}
            />
          </div>

          {scope === 'Department' && (
            <div className="space-y-2 sm:col-span-2 animate-in fade-in slide-in-from-top-2">
              <label className={formStyles.label}>
                Select Department *
              </label>
              <Input
                {...register('payrollProcessing.departmentId')}
                placeholder="Search department..."
                disabled={readOnly}
              />
            </div>
          )}

          {scope === 'Selected Employees' && (
            <div className="space-y-2 sm:col-span-2 animate-in fade-in slide-in-from-top-2">
              <label className={formStyles.label}>
                Select Employees *
              </label>
              <Input
                placeholder="Search and add employees..."
                disabled={readOnly}
              />
              {/* Dummy tags area */}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-gray-100 dark:bg-white/10 text-xs rounded-full">John Doe ✕</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-white/10 text-xs rounded-full">Jane Smith ✕</span>
              </div>
            </div>
          )}
        </FormGrid>
      </FormSection>
    </div>
  );
}
