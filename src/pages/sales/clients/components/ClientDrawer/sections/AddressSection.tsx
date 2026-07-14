import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { shouldShowOverseasFields } from '../../../utils/gstRules';

interface Props {
  readOnly?: boolean;
}

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Singapore', 'Australia', 'Other'
];

export default function AddressSection({ readOnly }: Props) {
  const { register, watch, formState: { errors }, setValue } = useFormContext();
  const treatment = watch('gstTreatment');
  const isOverseas = shouldShowOverseasFields(treatment);
  const sameAsBilling = watch('sameAsBillingAddress');

  const billingAttention = watch('billingAttention');
  const billingLine1 = watch('billingAddressLine1');
  const billingLine2 = watch('billingAddressLine2');
  const billingCity = watch('billingCity');
  const billingState = watch('billingState');
  const billingPinCode = watch('billingPinCode');
  const billingCountry = watch('billingCountry');
  const billingPhone = watch('billingPhone');

  // Effect to copy billing to shipping when checkbox is checked
  useEffect(() => {
    if (sameAsBilling && !readOnly) {
      const opts = { shouldValidate: true, shouldDirty: true };
      setValue('shippingAttention', billingAttention || '', opts);
      setValue('shippingAddressLine1', billingLine1 || '', opts);
      setValue('shippingAddressLine2', billingLine2 || '', opts);
      setValue('shippingCity', billingCity || '', opts);
      setValue('shippingState', billingState || '', opts);
      setValue('shippingPinCode', billingPinCode || '', opts);
      setValue('shippingCountry', billingCountry || '', opts);
      setValue('shippingPhone', billingPhone || '', opts);
    }
  }, [sameAsBilling, billingAttention, billingLine1, billingLine2, billingCity, billingState, billingPinCode, billingCountry, billingPhone, setValue, readOnly]);

  const pointerEventsClass = sameAsBilling && !readOnly ? 'pointer-events-none opacity-60 bg-gray-50 dark:bg-white/5' : '';

  return (
    <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-white/10">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
          Part D — Address Details
        </h3>
        
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Billing Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Attention</label>
            <input 
              type="text" 
              {...register('billingAttention')} 
              disabled={readOnly}
              className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Country / Region</label>
            <select 
              {...register('billingCountry')} 
              disabled={readOnly}
              className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors"
            >
              <option value="">Select Country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Address Line 1 *</label>
            <input 
              type="text" 
              {...register('billingAddressLine1')} 
              disabled={readOnly}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${errors.billingAddressLine1 ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`} 
            />
            {errors.billingAddressLine1 && <p className="text-red-500 text-xs mt-1">{errors.billingAddressLine1.message as string}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Address Line 2 (Area/Locality)</label>
            <input 
              type="text" 
              {...register('billingAddressLine2')} 
              disabled={readOnly}
              className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">City *</label>
            <input 
              type="text" 
              {...register('billingCity')} 
              disabled={readOnly}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${errors.billingCity ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`} 
            />
            {errors.billingCity && <p className="text-red-500 text-xs mt-1">{errors.billingCity.message as string}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">State / Province {!isOverseas && '*'}</label>
            <input 
              type="text" 
              {...register('billingState')} 
              disabled={readOnly}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${errors.billingState ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`} 
            />
            {errors.billingState && <p className="text-red-500 text-xs mt-1">{errors.billingState.message as string}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">PIN / Postal Code {!isOverseas && '*'}</label>
            <input 
              type="text" 
              {...register('billingPinCode')} 
              disabled={readOnly}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${errors.billingPinCode ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`} 
            />
            {errors.billingPinCode && <p className="text-red-500 text-xs mt-1">{errors.billingPinCode.message as string}</p>}
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Phone</label>
            <input 
              type="text" 
              {...register('billingPhone')} 
              disabled={readOnly}
              className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors" 
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Shipping Address</h4>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              {...register('sameAsBillingAddress')} 
              disabled={readOnly}
              className="text-[#792359] focus:ring-[#792359] rounded-sm" 
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Same as Billing Address</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Attention</label>
            <input 
              type="text" 
              {...register('shippingAttention')} 
              readOnly={readOnly || sameAsBilling}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${pointerEventsClass}`} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Country / Region</label>
            <select 
              {...register('shippingCountry')} 
              disabled={readOnly}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${pointerEventsClass}`}
            >
              <option value="">Select Country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Address Line 1</label>
            <input 
              type="text" 
              {...register('shippingAddressLine1')} 
              readOnly={readOnly || sameAsBilling}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${pointerEventsClass}`} 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Address Line 2 (Area/Locality)</label>
            <input 
              type="text" 
              {...register('shippingAddressLine2')} 
              readOnly={readOnly || sameAsBilling}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${pointerEventsClass}`} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">City</label>
            <input 
              type="text" 
              {...register('shippingCity')} 
              readOnly={readOnly || sameAsBilling}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${pointerEventsClass}`} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">State / Province</label>
            <input 
              type="text" 
              {...register('shippingState')} 
              readOnly={readOnly || sameAsBilling}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${pointerEventsClass}`} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">PIN / Postal Code</label>
            <input 
              type="text" 
              {...register('shippingPinCode')} 
              readOnly={readOnly || sameAsBilling}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${pointerEventsClass}`} 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Phone</label>
            <input 
              type="text" 
              {...register('shippingPhone')} 
              readOnly={readOnly || sameAsBilling}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${pointerEventsClass}`} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
