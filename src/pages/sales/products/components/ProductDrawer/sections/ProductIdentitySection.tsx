"use no memo";
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { AutoNumberInput } from '@/components/shared/AutoNumberSettings';

interface Props {
  readOnly?: boolean;
}

export default function ProductIdentitySection({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Step 1 — Product Identity
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Item Type *</label>
          <div className="flex gap-4 mt-2">
            <label htmlFor="type-product" className="flex items-center gap-2 cursor-pointer">
              <input id="type-product" type="radio" value="Product" {...register('type')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Product</span>
            </label>
            <label htmlFor="type-service" className="flex items-center gap-2 cursor-pointer">
              <input id="type-service" type="radio" value="Service" {...register('type')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Service</span>
            </label>
          </div>
        </div>

        <div></div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Item Code <span className="text-[10px] text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          <AutoNumberInput 
            name="itemCode"
            disabled={readOnly}
            placeholder="e.g. ITEM-001"
            defaultPrefix="ITEM-"
            className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${errors.itemCode ? 'border-red-500' : ''}`} 
          />
          {errors.itemCode && <p className="text-red-500 text-xs mt-1">{errors.itemCode.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Item Name *</label>
          <Input 
            type="text" 
            {...register('itemName')} 
            disabled={readOnly}
            className={`${errors.itemName ? 'border-red-500' : ''}`} 
          />
          {errors.itemName && <p className="text-red-500 text-xs mt-1">{errors.itemName.message as string}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Description</label>
          <textarea 
            {...register('description')} 
            disabled={readOnly}
            rows={3}
            className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors resize-none" 
            placeholder="Detailed description of the product or service"
          />
        </div>
      </div>
    </div>
  );
}
