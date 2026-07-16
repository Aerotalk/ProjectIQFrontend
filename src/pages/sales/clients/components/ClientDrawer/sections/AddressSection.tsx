import { useEffect, useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { shouldShowOverseasFields } from '../../../utils/gstRules';

interface Props {
  readOnly?: boolean;
}

import { Country, State } from 'country-state-city';

const COUNTRIES = Country.getAllCountries().map(c => ({
  label: c.name,
  value: c.name
}));

const getStatesForCountry = (countryName: string) => {
  if (!countryName) return [];
  const country = Country.getAllCountries().find(c => c.name === countryName);
  if (!country) return [];
  return State.getStatesOfCountry(country.isoCode).map(s => ({
    label: s.name,
    value: s.name
  }));
};

const getPhoneCodeForCountry = (countryName: string) => {
  const country = Country.getAllCountries().find(c => c.name === countryName);
  return country ? `+${country.phonecode} ` : '';
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
  const billingPhone = watch('billingPhone');
  const billingCountry = watch('billingCountry');

  const { getValues } = useFormContext();

  const prevBillingCountry = useRef(billingCountry);
  const prevShippingCountry = useRef(watch('shippingCountry'));

  const prevBillingCountryCode = useRef(getPhoneCodeForCountry(getValues('billingCountry') || ''));
  const prevShippingCountryCode = useRef(getPhoneCodeForCountry(getValues('shippingCountry') || ''));

  // Handle billing country change (state reset & phone code update)
  useEffect(() => {
    if (billingCountry && billingCountry !== prevBillingCountry.current) {
      // 1. Reset state
      if (prevBillingCountry.current) {
        setValue('billingState', '', { shouldValidate: true, shouldDirty: true });
      }
      prevBillingCountry.current = billingCountry;

      // 2. Update phone code
      if (!readOnly) {
        const newCode = getPhoneCodeForCountry(billingCountry);
        if (newCode) {
          const currentPhone = getValues('billingPhone') || '';
          const prevCode = prevBillingCountryCode.current;
          if (!currentPhone || currentPhone.trim() === '' || currentPhone.trim() === prevCode.trim() || currentPhone.startsWith(prevCode)) {
            const updatedPhone = currentPhone ? currentPhone.replace(prevCode, newCode) : newCode;
            setValue('billingPhone', updatedPhone, { shouldValidate: true, shouldDirty: true });
          } else if (!currentPhone.startsWith('+')) {
            setValue('billingPhone', newCode + currentPhone, { shouldValidate: true, shouldDirty: true });
          }
          prevBillingCountryCode.current = newCode;
        }
      }
    }
  }, [billingCountry, setValue, readOnly, getValues]);

  const shippingCountry = watch('shippingCountry');
  const shippingPhone = watch('shippingPhone');
  
  // Handle shipping country change
  useEffect(() => {
    if (shippingCountry && shippingCountry !== prevShippingCountry.current) {
      // 1. Reset state
      if (prevShippingCountry.current) {
        setValue('shippingState', '', { shouldValidate: true, shouldDirty: true });
      }
      prevShippingCountry.current = shippingCountry;

      // 2. Update phone code
      if (!readOnly) {
        const newCode = getPhoneCodeForCountry(shippingCountry);
        if (newCode) {
          const currentPhone = getValues('shippingPhone') || '';
          const prevCode = prevShippingCountryCode.current;
          if (!currentPhone || currentPhone.trim() === '' || currentPhone.trim() === prevCode.trim() || currentPhone.startsWith(prevCode)) {
            const updatedPhone = currentPhone ? currentPhone.replace(prevCode, newCode) : newCode;
            setValue('shippingPhone', updatedPhone, { shouldValidate: true, shouldDirty: true });
          } else if (!currentPhone.startsWith('+')) {
            setValue('shippingPhone', newCode + currentPhone, { shouldValidate: true, shouldDirty: true });
          }
          prevShippingCountryCode.current = newCode;
        }
      }
    }
  }, [shippingCountry, setValue, readOnly, getValues]);

  // Effect removed to prevent continuous sync. Copying is now handled in the checkbox onChange.
  const pointerEventsClass = '';

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
                    onChange={field.onChange}
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
                render={({ field }) => {
                  const states = getStatesForCountry(billingCountry);
                  return states.length > 0 ? (
                    <CustomSelect
                      value={field.value}
                      onChange={(val) => setValue('billingState', val, { shouldValidate: true, shouldDirty: true })}
                      options={states}
                    />
                  ) : (
                    <input 
                      type="text" 
                      {...field}
                      disabled={readOnly}
                      placeholder="Enter state manually"
                      className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${errors.billingState ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`} 
                    />
                  );
                }}
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
            <Controller
              name="sameAsBillingAddress"
              control={control}
              render={({ field }) => (
                <input 
                  type="checkbox" 
                  checked={field.value}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    field.onChange(isChecked);
                    if (isChecked && !readOnly) {
                      const vals = getValues();
                      const opts = { shouldValidate: true, shouldDirty: true };
                      setValue('shippingAttention', vals.billingAttention || '', opts);
                      setValue('shippingAddressLine1', vals.billingAddressLine1 || '', opts);
                      setValue('shippingAddressLine2', vals.billingAddressLine2 || '', opts);
                      setValue('shippingCity', vals.billingCity || '', opts);
                      setValue('shippingCountry', vals.billingCountry || '', opts);
                      setValue('shippingState', vals.billingState || '', opts);
                      setValue('shippingPinCode', vals.billingPinCode || '', opts);
                      setValue('shippingPhone', vals.billingPhone || '', opts);
                    }
                  }}
                  disabled={readOnly}
                  className="text-[#792359] focus:ring-[#792359] rounded-sm" 
                />
              )}
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
                    onChange={field.onChange}
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
                render={({ field }) => {
                  const states = getStatesForCountry(shippingCountry);
                  return states.length > 0 ? (
                    <CustomSelect
                      value={field.value}
                      onChange={(val) => setValue('shippingState', val, { shouldValidate: true, shouldDirty: true })}
                      options={states}
                    />
                  ) : (
                    <input 
                      type="text" 
                      {...field}
                      readOnly={readOnly}
                      placeholder="Enter state manually"
                      className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${pointerEventsClass} ${errors.shippingState ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`} 
                    />
                  );
                }}
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
