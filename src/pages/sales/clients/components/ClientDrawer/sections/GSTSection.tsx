"use no memo";
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { 
  shouldShowGSTIN, 
  shouldShowPAN, 
  shouldShowPlaceOfSupply, 
  shouldShowSEZFields,
  shouldShowOverseasFields,
  getStateFromGSTIN,
} from '../../../utils/gstRules';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid } from '@/components/ui/FormLayout';
import { cn } from '@/lib/utils';

// Common Indian States list
const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

interface Props {
  readOnly?: boolean;
}

export default function GSTSection({ readOnly }: Props) {
  const { register, formState: { errors }, setValue, control } = useFormContext();
  const treatment = useWatch({ name: 'gstTreatment' });


  const showGSTIN = shouldShowGSTIN(treatment);
  const showPAN = shouldShowPAN(treatment);
  const showPlaceOfSupply = shouldShowPlaceOfSupply(treatment);
  const showSEZ = shouldShowSEZFields(treatment);
  const showOverseas = shouldShowOverseasFields(treatment);


  if (!showGSTIN && !showPAN && !showPlaceOfSupply && !showSEZ && !showOverseas) {
    return null; // Consumer might only show place of supply. If all false, hide section.
  }

  return (
    <FormSection title="Part B — GST & Tax Fields">
      <FormGrid>
        {showGSTIN && (
          <div>
            <label className={formStyles.label}>GSTIN *</label>
            <input 
              type="text" 
              {...register('gstin')} 
              disabled={readOnly}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                setValue('gstin', val);
                // Auto-extract PAN (chars 3-12) if 15 chars
                if (val.length >= 12) {
                  setValue('panNumber', val.substring(2, 12));
                }
                // Auto-detect Place of Supply from GSTIN state code
                const stateName = getStateFromGSTIN(val);
                if (stateName) {
                  setValue('placeOfSupply', stateName, { shouldValidate: true, shouldDirty: true });
                }
              }}
              placeholder="15-character GSTIN"
              className={cn(formStyles.field(!!errors.gstin, readOnly), "uppercase")} 
            />
            {errors.gstin && <p className="text-red-500 text-xs mt-1">{errors.gstin.message as string}</p>}
          </div>
        )}

        {showPAN && (
          <div>
            <label className={formStyles.label}>
              PAN Number {treatment !== 'business_none' && treatment !== 'overseas' && '*'}
              {(treatment === 'business_none' || treatment === 'overseas') && <span className="text-gray-400 font-normal normal-case ml-1">(optional)</span>}
            </label>
            <input 
              type="text" 
              {...register('panNumber')} 
              disabled={readOnly || (showGSTIN)} // Pre-filled if GSTIN is present
              placeholder="10-character PAN"
              className={cn(formStyles.field(!!errors.panNumber, readOnly || showGSTIN), "uppercase", showGSTIN && "opacity-80 bg-gray-50 dark:bg-white/5")} 
            />
            {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber.message as string}</p>}
          </div>
        )}

        {showSEZ && (
          <>
            <div>
              <label className={formStyles.label}>SEZ Unit / Developer Name *</label>
              <input 
                type="text" 
                {...register('sezUnitName')} 
                disabled={readOnly}
                className={formStyles.field(!!errors.sezUnitName, readOnly)} 
              />
              {errors.sezUnitName && <p className="text-red-500 text-xs mt-1">{errors.sezUnitName.message as string}</p>}
            </div>
            <div>
              <label className={formStyles.label}>LUT / Bond Reference No.</label>
              <input 
                type="text" 
                {...register('lutBondNo')} 
                disabled={readOnly}
                className={formStyles.field(false, readOnly)} 
              />
            </div>
          </>
        )}

        {showPlaceOfSupply && (
          <div>
            <label className={formStyles.label}>Place of Supply *</label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="placeOfSupply"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={INDIAN_STATES.map(s => ({ label: s, value: s }))}
                  />
                )}
              />
            </div>
            {errors.placeOfSupply && <p className="text-red-500 text-xs mt-1">{errors.placeOfSupply.message as string}</p>}
          </div>
        )}

        {showOverseas && (
          <>
            <div>
              <label className={formStyles.label}>Country *</label>
              <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      value={field.value || ''}
                      onChange={field.onChange}
                      options={[
                        { label: 'United States', value: 'United States' },
                        { label: 'United Kingdom', value: 'United Kingdom' },
                        { label: 'United Arab Emirates', value: 'United Arab Emirates' },
                        { label: 'Singapore', value: 'Singapore' },
                        { label: 'Australia', value: 'Australia' },
                        { label: 'Other', value: 'Other' }
                      ]}
                    />
                  )}
                />
              </div>
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message as string}</p>}
            </div>
            <div>
              <label className={formStyles.label}>Currency *</label>
              <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      value={field.value || ''}
                      onChange={field.onChange}
                      options={[
                        { label: 'USD - US Dollar', value: 'USD' },
                        { label: 'EUR - Euro', value: 'EUR' },
                        { label: 'GBP - British Pound', value: 'GBP' },
                        { label: 'AED - UAE Dirham', value: 'AED' },
                        { label: 'SGD - Singapore Dollar', value: 'SGD' },
                        { label: 'INR - Indian Rupee', value: 'INR' }
                      ]}
                    />
                  )}
                />
              </div>
              {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency.message as string}</p>}
            </div>
            <div>
              <label className={formStyles.label}>Foreign Tax ID</label>
              <input 
                type="text" 
                {...register('foreignTaxId')} 
                disabled={readOnly}
                placeholder="e.g. VAT ID, EIN"
                className={formStyles.field(false, readOnly)} 
              />
            </div>
          </>
        )}
      </FormGrid>
    </FormSection>
  );
}
