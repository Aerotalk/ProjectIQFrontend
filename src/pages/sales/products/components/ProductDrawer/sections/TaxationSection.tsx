import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { HSN_SAC_CODES } from '@/data/hsnCodes';

interface Props {
  readOnly?: boolean;
}

export default function TaxationSection({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext();

  const GST_RATES = ['0%', '0.1%', '0.25%', '3%', '5%', '12%', '18%', '28%'];

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Step 3 — Taxation & Status
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">HSN / SAC Code</label>
          <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
            <Controller
              name="hsnSac"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={HSN_SAC_CODES}
                />
              )}
            />
          </div>
          {errors.hsnSac && <p className="text-red-500 text-xs mt-1">{errors.hsnSac.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">GST Rate *</label>
          <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
            <Controller
              name="gstRate"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={GST_RATES}
                />
              )}
            />
          </div>
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
