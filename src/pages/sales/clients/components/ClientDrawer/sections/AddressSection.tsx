import { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { shouldShowOverseasFields } from '../../../utils/gstRules';

interface Props {
  readOnly?: boolean;
}

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Singapore', 'Australia', 'Other'
];

const STATES_MAP: Record<string, string[]> = {
  'India': ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'],
  'United States': ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'United Arab Emirates': ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al-Quwain', 'Fujairah', 'Ras Al Khaimah'],
  'Singapore': ['Central Region', 'East Region', 'North Region', 'North-East Region', 'West Region'],
  'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory']
};

const COUNTRY_CODES: Record<string, string> = {
  'India': '+91 ',
  'United States': '+1 ',
  'United Kingdom': '+44 ',
  'United Arab Emirates': '+971 ',
  'Singapore': '+65 ',
  'Australia': '+61 '
};

export default function AddressSection({ readOnly }: Props) {
  const { register, watch, formState: { errors }, setValue, control } = useFormContext();
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

  // Phone code auto-detection
  useEffect(() => {
    if (billingCountry && !readOnly) {
      const code = COUNTRY_CODES[billingCountry];
      if (code && (!billingPhone || billingPhone.trim() === '')) {
        setValue('billingPhone', code, { shouldValidate: true });
      }
    }
  }, [billingCountry, setValue, readOnly]);

  const shippingCountry = watch('shippingCountry');
  const shippingPhone = watch('shippingPhone');
  useEffect(() => {
    if (shippingCountry && !readOnly) {
      const code = COUNTRY_CODES[shippingCountry];
      if (code && (!shippingPhone || shippingPhone.trim() === '')) {
        setValue('shippingPhone', code, { shouldValidate: true });
      }
    }
  }, [shippingCountry, setValue, readOnly]);

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
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="billingCountry"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue('billingState', ''); // reset state when country changes
                    }}
                    options={COUNTRIES}
                  />
                )}
              />
            </div>
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
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="billingState"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={STATES_MAP[billingCountry] || []}
                  />
                )}
              />
            </div>
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
            <div className={readOnly || sameAsBilling ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="shippingCountry"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue('shippingState', ''); // reset state when country changes
                    }}
                    options={COUNTRIES}
                  />
                )}
              />
            </div>
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
            <div className={readOnly || sameAsBilling ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="shippingState"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={STATES_MAP[shippingCountry] || []}
                  />
                )}
              />
            </div>
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
