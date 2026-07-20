import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function BankDetailsTab({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
        Bank Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Bank Name</label>
          <Input type="text" {...register('bankName')} disabled={readOnly} />
          {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Branch Name</label>
          <Input type="text" {...register('branchName')} disabled={readOnly} />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Account Number</label>
          <Input type="password" {...register('accountNumber')} disabled={readOnly} />
          {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Confirm Account Number</label>
          <Input type="text" {...register('confirmAccountNumber')} disabled={readOnly} />
          {errors.confirmAccountNumber && <p className="text-red-500 text-xs mt-1">{errors.confirmAccountNumber.message as string}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">IFSC Code</label>
          <Input type="text" {...register('ifscCode')} disabled={readOnly} className="uppercase" />
          {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Account Type</label>
          <select {...register('accountType')} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
            <option value="Salary">Salary</option>
          </select>
          {errors.accountType && <p className="text-red-500 text-xs mt-1">{errors.accountType.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Account Holder Name</label>
          <Input type="text" {...register('accountHolderName')} disabled={readOnly} />
          {errors.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors.accountHolderName.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Payment Mode</label>
          <select {...register('paymentMode')} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Cash">Cash</option>
          </select>
          {errors.paymentMode && <p className="text-red-500 text-xs mt-1">{errors.paymentMode.message as string}</p>}
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <input type="checkbox" id="primaryAccount" {...register('primaryAccount')} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
          <label htmlFor="primaryAccount" className="text-sm text-gray-700 dark:text-gray-300">Primary Salary Account</label>
        </div>
      </div>
    </div>
  );
}
