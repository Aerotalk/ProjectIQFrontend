import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function TaxationSection({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Step 3 — Taxation & Status
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">HSN / SAC Code</label>
          <Input 
            type="text" 
            {...register('hsnSac')} 
            disabled={readOnly}
            placeholder="e.g. 9983"
            className={`${errors.hsnSac ? 'border-red-500' : ''}`} 
          />
          {errors.hsnSac && <p className="text-red-500 text-xs mt-1">{errors.hsnSac.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">GST Rate *</label>
          <select 
            {...register('gstRate')} 
            disabled={readOnly}
            className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${errors.gstRate ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`}
          >
            <option value="">Select Rate</option>
            <option value="0%">0%</option>
            <option value="0.1%">0.1%</option>
            <option value="0.25%">0.25%</option>
            <option value="3%">3%</option>
            <option value="5%">5%</option>
            <option value="12%">12%</option>
            <option value="18%">18%</option>
            <option value="28%">28%</option>
          </select>
          {errors.gstRate && <p className="text-red-500 text-xs mt-1">{errors.gstRate.message as string}</p>}
        </div>

        <div className="md:col-span-2 mt-4">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Status</label>
          <div className="flex gap-4">
            <label htmlFor="status-active" className="flex items-center gap-2 cursor-pointer">
              <input id="status-active" type="radio" value="Active" {...register('status')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Active</span>
            </label>
            <label htmlFor="status-inactive" className="flex items-center gap-2 cursor-pointer">
              <input id="status-inactive" type="radio" value="Inactive" {...register('status')} disabled={readOnly} className="text-red-500 focus:ring-red-500" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Inactive</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
