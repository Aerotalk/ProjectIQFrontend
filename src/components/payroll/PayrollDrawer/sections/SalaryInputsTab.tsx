import { useFormContext } from 'react-hook-form';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import { CurrencyInput } from '../../../ui/CurrencyInput';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { formStyles } from '../../../ui/form-styles';
import CustomDatePicker from '../../../ui/CustomDatePicker';

interface Props {
  readOnly?: boolean;
}

export default function SalaryInputsTab({ readOnly }: Props) {
  const { register, watch, formState: { errors } } = useFormContext<PayrollFormValues>();

  const recurring = watch('salaryInputs.recurring');

  const inputTypeOptions = [
    { value: 'Addition', label: 'Addition' },
    { value: 'Override', label: 'Override' },
    { value: 'Deduction', label: 'Deduction' },
  ];

  return (
    <div className="space-y-6">
      <FormSection title="Salary Input Details" description="Add or override salary components for an employee.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Employee *
            </label>
            <Input
              {...register('salaryInputs.employee')}
              placeholder="Search employee..."
              disabled={readOnly}
              className={errors.salaryInputs?.employee ? 'border-red-500' : ''}
            />
            {errors.salaryInputs?.employee && (
              <p className="text-xs text-red-500">{errors.salaryInputs.employee.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Payroll Period *
            </label>
            <CustomDatePicker
              name="salaryInputs.payrollPeriod"
              disabled={readOnly}
            />
            {errors.salaryInputs?.payrollPeriod && (
              <p className="text-xs text-red-500">{errors.salaryInputs.payrollPeriod.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Pay Component *
            </label>
            <Input
              {...register('salaryInputs.payComponent')}
              placeholder="e.g., Bonus, Overtime"
              disabled={readOnly}
              className={errors.salaryInputs?.payComponent ? 'border-red-500' : ''}
            />
            {errors.salaryInputs?.payComponent && (
              <p className="text-xs text-red-500">{errors.salaryInputs.payComponent.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Amount *
            </label>
            <CurrencyInput
              {...register('salaryInputs.amount')}
              placeholder="0.00"
              disabled={readOnly}
              className={errors.salaryInputs?.amount ? 'border-red-500' : ''}
            />
            {errors.salaryInputs?.amount && (
              <p className="text-xs text-red-500">{errors.salaryInputs.amount.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>
              Input Type *
            </label>
            <div className="flex items-center gap-4 mt-2">
              {inputTypeOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={option.value}
                    {...register('salaryInputs.inputType')}
                    disabled={readOnly}
                    className="w-4 h-4 text-[#792359] border-gray-300 focus:ring-[#792359] dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className={formStyles.label}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>
              Reason
            </label>
            <Input
              {...register('salaryInputs.reason')}
              placeholder="Enter reason..."
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer mt-6">
              <input
                type="checkbox"
                {...register('salaryInputs.recurring')}
                disabled={readOnly}
                className="w-4 h-4 text-[#792359] border-gray-300 rounded focus:ring-[#792359] dark:border-gray-600 dark:bg-gray-700"
              />
              <span className={formStyles.label}>Recurring</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Recurring Until
            </label>
            <CustomDatePicker
              name="salaryInputs.recurringUntil"
              disabled={!recurring || readOnly}
            />
          </div>

        </FormGrid>
      </FormSection>
    </div>
  );
}
