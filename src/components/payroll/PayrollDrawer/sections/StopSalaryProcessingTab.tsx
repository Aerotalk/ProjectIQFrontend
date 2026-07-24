import { useFormContext } from 'react-hook-form';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { formStyles } from '../../../ui/form-styles';
import CustomDatePicker from '../../../ui/CustomDatePicker';

interface Props {
  readOnly?: boolean;
}

export default function StopSalaryProcessingTab({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext<PayrollFormValues>();

  return (
    <div className="space-y-6">
      <FormSection title="Stop Salary Processing" description="Permanently or indefinitely suspend salary processing for an employee.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Employee *
            </label>
            <Input
              {...register('stopSalary.employee')}
              placeholder="Search employee..."
              disabled={readOnly}
              className={errors.stopSalary?.employee ? 'border-red-500' : ''}
            />
            {errors.stopSalary?.employee && (
              <p className="text-xs text-red-500">{errors.stopSalary.employee.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Stop From Date *
            </label>
            <CustomDatePicker
              name="stopSalary.stopFromDate"
              disabled={readOnly}
            />
            {errors.stopSalary?.stopFromDate && (
              <p className="text-xs text-red-500">{errors.stopSalary.stopFromDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Stop Until Date <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <CustomDatePicker
              name="stopSalary.stopUntilDate"
              disabled={readOnly}
            />
            <p className="text-[10px] text-gray-500 mt-1">Leave blank for indefinite suspension.</p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>
              Reason *
            </label>
            <Input
              {...register('stopSalary.reason')}
              placeholder="Enter reason for stopping salary..."
              disabled={readOnly}
              className={errors.stopSalary?.reason ? 'border-red-500' : ''}
            />
            {errors.stopSalary?.reason && (
              <p className="text-xs text-red-500">{errors.stopSalary.reason.message}</p>
            )}
          </div>
        </FormGrid>
      </FormSection>
    </div>
  );
}
