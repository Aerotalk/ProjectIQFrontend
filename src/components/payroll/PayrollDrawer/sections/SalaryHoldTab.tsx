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

export default function SalaryHoldTab({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext<PayrollFormValues>();

  return (
    <div className="space-y-6">
      <FormSection title="Salary Hold" description="Temporarily withhold salary payout for an employee.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Employee *
            </label>
            <Input
              {...register('salaryHold.employee')}
              placeholder="Search employee..."
              disabled={readOnly}
              className={errors.salaryHold?.employee ? 'border-red-500' : ''}
            />
            {errors.salaryHold?.employee && (
              <p className="text-xs text-red-500">{errors.salaryHold.employee.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Payroll Period *
            </label>
            <CustomDatePicker
              name="salaryHold.payrollPeriod"
              disabled={readOnly}
            />
            {errors.salaryHold?.payrollPeriod && (
              <p className="text-xs text-red-500">{errors.salaryHold.payrollPeriod.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Hold Amount *
            </label>
            <CurrencyInput
              {...register('salaryHold.holdAmount')}
              placeholder="0.00"
              disabled={readOnly}
              className={errors.salaryHold?.holdAmount ? 'border-red-500' : ''}
            />
            {errors.salaryHold?.holdAmount && (
              <p className="text-xs text-red-500">{errors.salaryHold.holdAmount.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>
              Reason *
            </label>
            <Input
              {...register('salaryHold.reason')}
              placeholder="Enter reason for holding salary..."
              disabled={readOnly}
              className={errors.salaryHold?.reason ? 'border-red-500' : ''}
            />
            {errors.salaryHold?.reason && (
              <p className="text-xs text-red-500">{errors.salaryHold.reason.message}</p>
            )}
          </div>
        </FormGrid>
      </FormSection>
    </div>
  );
}
