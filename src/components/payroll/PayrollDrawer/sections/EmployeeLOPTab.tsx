import { useFormContext, Controller } from 'react-hook-form';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import CustomSelect from '../../../ui/CustomSelect';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { formStyles } from '../../../ui/form-styles';
import CustomDatePicker from '../../../ui/CustomDatePicker';

interface Props {
  readOnly?: boolean;
}

export default function EmployeeLOPTab({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext<PayrollFormValues>();

  const sourceOptions = [
    { value: 'Attendance', label: 'Attendance' },
    { value: 'Manual', label: 'Manual' },
    { value: 'Leave System', label: 'Leave System' },
  ];

  return (
    <div className="space-y-6">
      <FormSection title="Loss of Pay (LOP) Details" description="Record unpaid leave or LOP days for an employee.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Employee *
            </label>
            <Input
              {...register('employeeLOP.employee')}
              placeholder="Search employee..."
              disabled={readOnly}
              className={errors.employeeLOP?.employee ? 'border-red-500' : ''}
            />
            {errors.employeeLOP?.employee && (
              <p className="text-xs text-red-500">{errors.employeeLOP.employee.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Payroll Period *
            </label>
            <CustomDatePicker
              name="employeeLOP.payrollPeriod"
              disabled={readOnly}
            />
            {errors.employeeLOP?.payrollPeriod && (
              <p className="text-xs text-red-500">{errors.employeeLOP.payrollPeriod.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              LOP Days *
            </label>
            <Input
              type="number"
              step="0.5"
              {...register('employeeLOP.lopDays')}
              placeholder="e.g., 1.5"
              disabled={readOnly}
              className={errors.employeeLOP?.lopDays ? 'border-red-500' : ''}
            />
            {errors.employeeLOP?.lopDays && (
              <p className="text-xs text-red-500">{errors.employeeLOP.lopDays.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Source *
            </label>
            <Controller
              name="employeeLOP.source"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={sourceOptions}
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={readOnly}
                />
              )}
            />
            {errors.employeeLOP?.source && (
              <p className="text-xs text-red-500">{errors.employeeLOP.source.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>
              Reason
            </label>
            <Input
              {...register('employeeLOP.reason')}
              placeholder="Enter reason for LOP..."
              disabled={readOnly}
            />
          </div>

        </FormGrid>
      </FormSection>
    </div>
  );
}
