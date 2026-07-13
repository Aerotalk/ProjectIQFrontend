import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function BankDetailsSection({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();
  const bankErrors = (errors as any)?.bankDetails;

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Bank Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Account Name</label>
          <Input 
            type="text" 
            {...register('bankDetails.accountName')} 
            disabled={readOnly}
            className={`${bankErrors?.accountName ? 'border-red-500' : ''}`} 
          />
          {bankErrors?.accountName && <p className="text-red-500 text-xs mt-1">{bankErrors.accountName.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Account Number</label>
          <Input 
            type="text" 
            {...register('bankDetails.accountNumber')} 
            disabled={readOnly}
            className={`${bankErrors?.accountNumber ? 'border-red-500' : ''}`} 
          />
          {bankErrors?.accountNumber && <p className="text-red-500 text-xs mt-1">{bankErrors.accountNumber.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">IFSC Code</label>
          <Input 
            type="text" 
            {...register('bankDetails.ifscCode')} 
            disabled={readOnly}
            className={`${bankErrors?.ifscCode ? 'border-red-500' : ''}`} 
          />
          {bankErrors?.ifscCode && <p className="text-red-500 text-xs mt-1">{bankErrors.ifscCode.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Bank Name</label>
          <Input 
            type="text" 
            {...register('bankDetails.bankName')} 
            disabled={readOnly}
            className={`${bankErrors?.bankName ? 'border-red-500' : ''}`} 
          />
          {bankErrors?.bankName && <p className="text-red-500 text-xs mt-1">{bankErrors.bankName.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Branch Name</label>
          <Input 
            type="text" 
            {...register('bankDetails.branchName')} 
            disabled={readOnly}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Swift Code</label>
          <Input 
            type="text" 
            {...register('bankDetails.swiftCode')} 
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  );
}
