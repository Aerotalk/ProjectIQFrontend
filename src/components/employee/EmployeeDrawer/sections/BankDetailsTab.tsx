import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function BankDetailsTab({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Bank Details" className="pt-0 border-t-0">
        <FormGrid>
          {/* Row: Bank Name | Branch Name */}
          <div>
            <label className={formStyles.label}>Bank Name</label>
            <Input type="text" {...register('bankName')} disabled={readOnly} />
            {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Branch Name</label>
            <Input type="text" {...register('branchName')} disabled={readOnly} />
          </div>

          {/* Row: Account Number | Confirm Account Number */}
          <div>
            <label className={formStyles.label}>Account Number</label>
            <Input type="password" {...register('accountNumber')} disabled={readOnly} />
            {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Confirm Account Number</label>
            <Input type="text" {...register('confirmAccountNumber')} disabled={readOnly} />
            {errors.confirmAccountNumber && <p className="text-red-500 text-xs mt-1">{errors.confirmAccountNumber.message as string}</p>}
          </div>

          {/* Row: IFSC Code | Account Type */}
          <div>
            <label className={formStyles.label}>IFSC Code</label>
            <Input type="text" {...register('ifscCode')} disabled={readOnly} className="uppercase" />
            {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Account Type</label>
            <Controller
              name={'accountType'}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: 'Savings', value: 'Savings' },
                    { label: 'Current', value: 'Current' },
                    { label: 'Salary', value: 'Salary' }
                  ]}
                  disabled={readOnly}
                />
              )}
            />
            {errors.accountType && <p className="text-red-500 text-xs mt-1">{errors.accountType.message as string}</p>}
          </div>

          {/* Row: Account Holder Name | Payment Mode */}
          <div>
            <label className={formStyles.label}>Account Holder Name</label>
            <Input type="text" {...register('accountHolderName')} disabled={readOnly} />
            {errors.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors.accountHolderName.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Payment Mode</label>
            <Controller
              name={'paymentMode'}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: 'Bank Transfer', value: 'Bank Transfer' },
                    { label: 'Cheque', value: 'Cheque' },
                    { label: 'Cash', value: 'Cash' }
                  ]}
                  disabled={readOnly}
                />
              )}
            />
            {errors.paymentMode && <p className="text-red-500 text-xs mt-1">{errors.paymentMode.message as string}</p>}
          </div>

          {/* Primary Account checkbox — full width */}
          <FormRow>
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" id="primaryAccount" {...register('primaryAccount')} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
              <label htmlFor="primaryAccount" className="text-sm text-gray-700 dark:text-gray-300">Primary Salary Account</label>
            </div>
          </FormRow>
        </FormGrid>
      </FormSection>
    </div>
  );
}
