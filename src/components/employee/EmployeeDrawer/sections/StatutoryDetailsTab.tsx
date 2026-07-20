import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function StatutoryDetailsTab({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
        Statutory Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">PAN Number</label>
          <Input type="text" {...register('panNumber')} disabled={readOnly} className="uppercase" />
          {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Aadhaar Number</label>
          <Input type="text" {...register('aadhaarNumber')} disabled={readOnly} />
          {errors.aadhaarNumber && <p className="text-red-500 text-xs mt-1">{errors.aadhaarNumber.message as string}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">UAN</label>
          <Input type="text" {...register('uan')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">PF Number</label>
          <Input type="text" {...register('pfNumber')} disabled={readOnly} />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">ESI Number</label>
          <Input type="text" {...register('esiNumber')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Tax Regime</label>
          <select {...register('taxRegime')} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
            <option value="">Select Regime</option>
            <option value="Old">Old Regime</option>
            <option value="New">New Regime</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Passport Number</label>
          <Input type="text" {...register('passportNumber')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Passport Expiry</label>
          <Input type="date" {...register('passportExpiry')} disabled={readOnly} />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Voter ID</label>
          <Input type="text" {...register('voterId')} disabled={readOnly} />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Driving License</label>
          <Input type="text" {...register('drivingLicense')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Driving License Expiry</label>
          <Input type="date" {...register('drivingLicenseExpiry')} disabled={readOnly} />
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="pfApplicable" {...register('pfApplicable')} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
            <label htmlFor="pfApplicable" className="text-sm text-gray-700 dark:text-gray-300">PF Applicable</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="esiApplicable" {...register('esiApplicable')} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
            <label htmlFor="esiApplicable" className="text-sm text-gray-700 dark:text-gray-300">ESI Applicable</label>
          </div>
        </div>
      </div>
    </div>
  );
}
