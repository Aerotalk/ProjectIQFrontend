import { useFormContext } from 'react-hook-form';

interface Props {
  readOnly?: boolean;
}

export default function CommercialSection({ readOnly }: Props) {
  const { register } = useFormContext();

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
        Part E — Commercial Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Payment Terms</label>
          <select 
            {...register('paymentTerms')} 
            disabled={readOnly}
            className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors"
          >
            <option value="">Select Terms</option>
            <option value="Immediate">Immediate</option>
            <option value="15 Days">15 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="45 Days">45 Days</option>
            <option value="60 Days">60 Days</option>
            <option value="90 Days">90 Days</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Credit Limit (₹)</label>
          <input 
            type="number" 
            {...register('creditLimit', { valueAsNumber: true })} 
            disabled={readOnly}
            className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors" 
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Industry / Segment</label>
          <select 
            {...register('industry')} 
            disabled={readOnly}
            className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors"
          >
            <option value="">Select Industry</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Trading">Trading</option>
            <option value="IT/ITES">IT / ITES</option>
            <option value="Construction">Construction</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Retail">Retail</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Internal Notes</label>
          <textarea 
            {...register('notes')} 
            disabled={readOnly}
            rows={3}
            className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors resize-none" 
          />
          <p className="text-xs text-gray-500 mt-1">Never shown on any document.</p>
        </div>

        <div className="md:col-span-2">
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
