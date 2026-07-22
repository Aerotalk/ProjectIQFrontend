import { useEffect, useRef } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { Country, State } from 'country-state-city';
import SharedPhoneInput from './SharedPhoneInput';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { cn } from '@/lib/utils';

interface AddressSectionProps {
  prefix: string; // e.g. 'billing', 'shipping', or 'address'
  title?: string;
  readOnly?: boolean;
  isOverseas?: boolean;
  disabledState?: boolean;
  optionalFields?: boolean;
}

const COUNTRIES = Country.getAllCountries().map(c => ({
  label: c.name,
  value: c.isoCode
}));

export function AddressFormGroup({ prefix, title, readOnly, isOverseas, disabledState, optionalFields }: AddressSectionProps) {
  const { formState: { errors }, setValue, control } = useFormContext();

  const countryCode = useWatch({ name: `${prefix}Country`, control });
  const prevCountryCode = useRef(countryCode);

  useEffect(() => {
    if (countryCode && countryCode !== prevCountryCode.current) {
      if (prevCountryCode.current) {
        if (!disabledState && !readOnly) {
          const states = State.getStatesOfCountry(countryCode);
          setValue(`${prefix}State`, states.length > 0 ? '' : 'N/A', { shouldValidate: true, shouldDirty: true });
        }
      }
      prevCountryCode.current = countryCode;
    }
  }, [countryCode, prefix, setValue, disabledState, readOnly]);

  const pointerEventsClass = (readOnly || disabledState) ? 'opacity-80 pointer-events-none' : '';

  return (
    <div>
      {title && <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">{title}</h4>}
      <FormGrid>
        <FormRow>
          <label className={formStyles.label}>Attention</label>
          <Controller
            name={`${prefix}Attention`}
            control={control}
            render={({ field }) => (
              <input 
                type="text" 
                {...field}
                value={field.value || ''}
                readOnly={readOnly || disabledState}
                className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${pointerEventsClass}`} 
              />
            )}
          />
        </FormRow>

        <div>
          <label className={formStyles.label}>Country / Region</label>
          <div className={pointerEventsClass}>
            <Controller
              name={`${prefix}Country`}
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
          <label className={formStyles.label}>Address Line 1 {!optionalFields && '*'}</label>
          <Controller
            name={`${prefix}AddressLine1`}
            control={control}
            render={({ field }) => (
              <input 
                type="text" 
                {...field}
                value={field.value || ''}
                readOnly={readOnly || disabledState}
                className={cn(formStyles.field(!!(errors as any)[`${prefix}AddressLine1`], readOnly || disabledState), pointerEventsClass)} 
              />
            )}
          />
          {(errors as any)[`${prefix}AddressLine1`] && <p className="text-red-500 text-xs mt-1">{(errors as any)[`${prefix}AddressLine1`].message}</p>}
        </div>

        <div>
          <label className={formStyles.label}>Address Line 2 (Area/Locality)</label>
          <Controller
            name={`${prefix}AddressLine2`}
            control={control}
            render={({ field }) => (
              <input 
                type="text" 
                {...field}
                value={field.value || ''}
                readOnly={readOnly || disabledState}
                className={cn(formStyles.field(false, readOnly || disabledState), pointerEventsClass)} 
              />
            )}
          />
        </div>

        <div>
          <label className={formStyles.label}>City {!optionalFields && '*'}</label>
          <Controller
            name={`${prefix}City`}
            control={control}
            render={({ field }) => (
              <input 
                type="text" 
                {...field}
                value={field.value || ''}
                readOnly={readOnly || disabledState}
                className={cn(formStyles.field(!!(errors as any)[`${prefix}City`], readOnly || disabledState), pointerEventsClass)} 
              />
            )}
          />
          {(errors as any)[`${prefix}City`] && <p className="text-red-500 text-xs mt-1">{(errors as any)[`${prefix}City`].message}</p>}
        </div>

        <div>
          <label className={formStyles.label}>State / Province {!isOverseas && !optionalFields && '*'}</label>
          <div className={pointerEventsClass}>
            <Controller
              name={`${prefix}State`}
              control={control}
              render={({ field }) => {
                const states = countryCode ? State.getStatesOfCountry(countryCode).map(s => ({
                  label: s.name,
                  value: s.name
                })) : [];
                
                const options = states.length > 0 ? states : [{ label: 'Not Applicable', value: 'N/A' }];
                
                return (
                  <CustomSelect
                    value={field.value}
                    onChange={(val) => setValue(`${prefix}State`, val, { shouldValidate: true, shouldDirty: true })}
                    options={options}
                    disabled={readOnly || disabledState || states.length === 0}
                  />
                );
              }}
            />
          </div>
          {(errors as any)[`${prefix}State`] && <p className="text-red-500 text-xs mt-1">{(errors as any)[`${prefix}State`].message}</p>}
        </div>

        <div>
          <label className={formStyles.label}>PIN / Postal Code {!isOverseas && !optionalFields && '*'}</label>
          <Controller
            name={`${prefix}PinCode`}
            control={control}
            render={({ field }) => (
              <input 
                type="text" 
                {...field}
                value={field.value || ''}
                readOnly={readOnly || disabledState}
                className={cn(formStyles.field(!!(errors as any)[`${prefix}PinCode`], readOnly || disabledState), pointerEventsClass)} 
              />
            )}
          />
          {(errors as any)[`${prefix}PinCode`] && <p className="text-red-500 text-xs mt-1">{(errors as any)[`${prefix}PinCode`].message}</p>}
        </div>
        
        <div>
          <label className={formStyles.label}>Phone</label>
          <SharedPhoneInput
            name={`${prefix}Phone`}
            disabled={readOnly || disabledState}
            defaultCountry={countryCode}
            className={pointerEventsClass}
          />
        </div>
      </FormGrid>
    </div>
  );
}

interface SharedAddressSectionProps {
  readOnly?: boolean;
  treatment?: string; // used to calculate isOverseas
  showSameAsBilling?: boolean;
  sourcePrefix?: string;
  targetPrefix?: string;
  singlePrefix?: string; // if only one address is needed
}

export default function SharedAddressSection({ 
  readOnly, 
  treatment, 
  showSameAsBilling = true,
  sourcePrefix = 'billing',
  targetPrefix = 'shipping',
  singlePrefix
}: SharedAddressSectionProps) {
  const { watch, setValue, getValues, control } = useFormContext();
  const isOverseas = treatment ? ['OVERSEAS', 'SEZ', 'DEEMED_EXPORT'].includes(treatment) : false;
  
  const isSameAsBilling = watch('sameAsBillingAddress');

  const sourceAttention = watch(`${sourcePrefix}Attention`);
  const sourceAddressLine1 = watch(`${sourcePrefix}AddressLine1`);
  const sourceAddressLine2 = watch(`${sourcePrefix}AddressLine2`);
  const sourceCity = watch(`${sourcePrefix}City`);
  const sourceCountry = watch(`${sourcePrefix}Country`);
  const sourceState = watch(`${sourcePrefix}State`);
  const sourcePinCode = watch(`${sourcePrefix}PinCode`);
  const sourcePhone = watch(`${sourcePrefix}Phone`);

  useEffect(() => {
    if (isSameAsBilling && !readOnly && !singlePrefix) {
      const opts = { shouldValidate: true, shouldDirty: true };
      setValue(`${targetPrefix}Attention`, sourceAttention || '', opts);
      setValue(`${targetPrefix}AddressLine1`, sourceAddressLine1 || '', opts);
      setValue(`${targetPrefix}AddressLine2`, sourceAddressLine2 || '', opts);
      setValue(`${targetPrefix}City`, sourceCity || '', opts);
      setValue(`${targetPrefix}Country`, sourceCountry || '', opts);
      setValue(`${targetPrefix}State`, sourceState || '', opts);
      setValue(`${targetPrefix}PinCode`, sourcePinCode || '', opts);
      setValue(`${targetPrefix}Phone`, sourcePhone || '', opts);
    }
  }, [
    isSameAsBilling, readOnly, setValue, targetPrefix, singlePrefix,
    sourceAttention, sourceAddressLine1, sourceAddressLine2,
    sourceCity, sourceCountry, sourceState, sourcePinCode, sourcePhone
  ]);

  if (singlePrefix) {
    return (
      <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-white/10">
        <AddressFormGroup prefix={singlePrefix} readOnly={readOnly} isOverseas={isOverseas} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-white/10">
      <FormSection title="Part D - Address Details">
        <AddressFormGroup 
          prefix={sourcePrefix} 
          title="Billing Address" 
          readOnly={readOnly} 
          isOverseas={isOverseas} 
        />
      </FormSection>

      <div className="pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Shipping Address</h4>
          {showSameAsBilling && (
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
                        setValue(`${targetPrefix}Attention`, vals[`${sourcePrefix}Attention`] || '', opts);
                        setValue(`${targetPrefix}AddressLine1`, vals[`${sourcePrefix}AddressLine1`] || '', opts);
                        setValue(`${targetPrefix}AddressLine2`, vals[`${sourcePrefix}AddressLine2`] || '', opts);
                        setValue(`${targetPrefix}City`, vals[`${sourcePrefix}City`] || '', opts);
                        setValue(`${targetPrefix}Country`, vals[`${sourcePrefix}Country`] || '', opts);
                        setValue(`${targetPrefix}State`, vals[`${sourcePrefix}State`] || '', opts);
                        setValue(`${targetPrefix}PinCode`, vals[`${sourcePrefix}PinCode`] || '', opts);
                        setValue(`${targetPrefix}Phone`, vals[`${sourcePrefix}Phone`] || '', opts);
                      }
                    }}
                    disabled={readOnly}
                    className="text-[#792359] focus:ring-[#792359] rounded-sm" 
                  />
                )}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Same as Billing Address</span>
            </label>
          )}
        </div>

        <AddressFormGroup 
          prefix={targetPrefix} 
          readOnly={readOnly} 
          disabledState={isSameAsBilling}
          isOverseas={isOverseas} 
        />
      </div>
    </div>
  );
}
