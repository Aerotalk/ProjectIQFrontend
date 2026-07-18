"use no memo";
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function TaxationSection({ readOnly }: Props) {
  const { register } = useFormContext();

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Taxation Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">TDS Percentage (%)</label>
          <Input 
            type="number" 
            step="0.01"
            {...register('tdsPercentage', { valueAsNumber: true })} 
            disabled={readOnly}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Reverse Charge</label>
          <div className="flex gap-4 mt-2">
            <label htmlFor="rc-yes" className="flex items-center gap-2 cursor-pointer">
              <input id="rc-yes" type="radio" value="true" {...register('reverseCharge')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Yes</span>
            </label>
            <label htmlFor="rc-no" className="flex items-center gap-2 cursor-pointer">
              <input id="rc-no" type="radio" value="false" {...register('reverseCharge')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
