import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';

interface Props {
  readOnly?: boolean;
}

export default function CommercialSection({ readOnly }: Props) {
  const { register, control } = useFormContext();

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
        Part E — Commercial Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Payment Terms</label>
          <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
            <Controller
              name="paymentTerms"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: 'Immediate', value: 'Immediate' },
                    { label: '15 Days', value: '15 Days' },
                    { label: '30 Days', value: '30 Days' },
                    { label: '45 Days', value: '45 Days' },
                    { label: '60 Days', value: '60 Days' },
                    { label: '90 Days', value: '90 Days' },
                    { label: 'Custom', value: 'Custom' }
                  ]}
                />
              )}
            />
          </div>
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
          <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: 'Manufacturing', value: 'Manufacturing' },
                    { label: 'Trading', value: 'Trading' },
                    { label: 'IT / ITES', value: 'IT/ITES' },
                    { label: 'Construction', value: 'Construction' },
                    { label: 'Healthcare', value: 'Healthcare' },
                    { label: 'Education', value: 'Education' },
                    { label: 'Retail', value: 'Retail' },
                    { label: 'Other', value: 'Other' }
                  ]}
                />
              )}
            />
          </div>
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
