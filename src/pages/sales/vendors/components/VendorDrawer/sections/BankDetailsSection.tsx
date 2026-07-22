"use no memo";
import { useFormContext } from 'react-hook-form';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function BankDetailsSection({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();
  const bankErrors = (errors as any)?.bankDetails;

  return (
    <FormSection title="Bank Details">
      <FormGrid>
        <div>
          <label className={formStyles.label}>Account Name</label>
          <input 
            type="text" 
            {...register('bankDetails.accountName')} 
            disabled={readOnly}
            className={formStyles.field(!!bankErrors?.accountName, readOnly)} 
          />
          {bankErrors?.accountName && <p className="text-red-500 text-xs mt-1">{bankErrors.accountName.message as string}</p>}
        </div>

        <div>
          <label className={formStyles.label}>Account Number</label>
          <input 
            type="text" 
            {...register('bankDetails.accountNumber')} 
            disabled={readOnly}
            className={formStyles.field(!!bankErrors?.accountNumber, readOnly)} 
          />
          {bankErrors?.accountNumber && <p className="text-red-500 text-xs mt-1">{bankErrors.accountNumber.message as string}</p>}
        </div>

        <div>
          <label className={formStyles.label}>IFSC Code</label>
          <input 
            type="text" 
            {...register('bankDetails.ifscCode')} 
            disabled={readOnly}
            className={formStyles.field(!!bankErrors?.ifscCode, readOnly)} 
          />
          {bankErrors?.ifscCode && <p className="text-red-500 text-xs mt-1">{bankErrors.ifscCode.message as string}</p>}
        </div>

        <div>
          <label className={formStyles.label}>Bank Name</label>
          <input 
            type="text" 
            {...register('bankDetails.bankName')} 
            disabled={readOnly}
            className={formStyles.field(!!bankErrors?.bankName, readOnly)} 
          />
          {bankErrors?.bankName && <p className="text-red-500 text-xs mt-1">{bankErrors.bankName.message as string}</p>}
        </div>

        <div>
          <label className={formStyles.label}>Branch Name</label>
          <input 
            type="text" 
            {...register('bankDetails.branchName')} 
            disabled={readOnly}
            className={formStyles.field(false, readOnly)} 
          />
        </div>

        <div>
          <label className={formStyles.label}>Swift Code</label>
          <input 
            type="text" 
            {...register('bankDetails.swiftCode')} 
            disabled={readOnly}
            className={formStyles.field(false, readOnly)} 
          />
        </div>
      </FormGrid>
    </FormSection>
  );
}
