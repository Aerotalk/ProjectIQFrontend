import { useFormContext, Controller } from 'react-hook-form';
import { Upload } from 'lucide-react';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import CustomSelect from '../../../ui/CustomSelect';
import { CurrencyInput } from '../../../ui/CurrencyInput';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { formStyles } from '../../../ui/form-styles';
import CustomDatePicker from '../../../ui/CustomDatePicker';

interface Props {
  readOnly?: boolean;
}

export default function ReimbursementClaimTab({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext<PayrollFormValues>();

  const reimbursementTypes = [
    { value: 'Travel', label: 'Travel & Commute' },
    { value: 'Medical', label: 'Medical' },
    { value: 'Internet', label: 'Internet / Phone' },
    { value: 'Meals', label: 'Meals / Entertainment' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      <FormSection title="Reimbursement Claim" description="Submit details for out-of-pocket expense claims.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Reimbursement Type *
            </label>
            <Controller
              name="reimbursement.reimbursementType"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={reimbursementTypes}
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={readOnly}
                />
              )}
            />
            {errors.reimbursement?.reimbursementType && (
              <p className="text-xs text-red-500">{errors.reimbursement.reimbursementType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Claim Period *
            </label>
            <CustomDatePicker
              name="reimbursement.claimPeriod"
              disabled={readOnly}
            />
            {errors.reimbursement?.claimPeriod && (
              <p className="text-xs text-red-500">{errors.reimbursement.claimPeriod.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Claimed Amount *
            </label>
            <CurrencyInput
              {...register('reimbursement.claimedAmount')}
              placeholder="0.00"
              disabled={readOnly}
              className={errors.reimbursement?.claimedAmount ? 'border-red-500' : ''}
            />
            {errors.reimbursement?.claimedAmount && (
              <p className="text-xs text-red-500">{errors.reimbursement.claimedAmount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Bill Date *
            </label>
            <CustomDatePicker
              name="reimbursement.billDate"
              disabled={readOnly}
            />
            {errors.reimbursement?.billDate && (
              <p className="text-xs text-red-500">{errors.reimbursement.billDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Bill Number *
            </label>
            <Input
              {...register('reimbursement.billNumber')}
              placeholder="e.g., INV-001"
              disabled={readOnly}
              className={errors.reimbursement?.billNumber ? 'border-red-500' : ''}
            />
            {errors.reimbursement?.billNumber && (
              <p className="text-xs text-red-500">{errors.reimbursement.billNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>Bill Document</label>
            <div className="flex items-center gap-3 mt-1">
              <button type="button" disabled={readOnly} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-[#1f2229] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50">
                <Upload size={14} />
                Upload Bill
              </button>
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>
              Remarks
            </label>
            <Input
              {...register('reimbursement.remarks')}
              placeholder="Enter remarks..."
              disabled={readOnly}
            />
          </div>

        </FormGrid>
      </FormSection>
    </div>
  );
}
