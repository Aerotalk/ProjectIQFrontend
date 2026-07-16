import { useFormContext, useWatch, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { 
  shouldShowGSTIN, 
  shouldShowPAN, 
  shouldShowPlaceOfSupply, 
  shouldShowSEZFields,
  shouldShowOverseasFields,
  shouldShowRegisteredGstAddress
} from '../../../utils/gstRules';

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
  const showRegisteredGstAddress = shouldShowRegisteredGstAddress(treatment);



  if (!showGSTIN && !showPAN && !showPlaceOfSupply && !showSEZ && !showOverseas && !showRegisteredGstAddress) {
    return null; // Consumer might only show place of supply. If all false, hide section.
  }

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
        Part B — GST & Tax Fields
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showGSTIN && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">GSTIN *</label>
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
              }}
              placeholder="15-character GSTIN"
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors uppercase ${errors.gstin ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`} 
            />
            {errors.gstin && <p className="text-red-500 text-xs mt-1">{errors.gstin.message as string}</p>}
          </div>
        )}

        {showPAN && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              PAN Number {treatment !== 'business_none' && treatment !== 'overseas' && '*'}
              {(treatment === 'business_none' || treatment === 'overseas') && <span className="text-gray-400 font-normal normal-case ml-1">(optional)</span>}
            </label>
            <input 
              type="text" 
              {...register('panNumber')} 
              disabled={readOnly || (showGSTIN)} // Pre-filled if GSTIN is present
              placeholder="10-character PAN"
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors uppercase ${errors.panNumber ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} ${(showGSTIN) ? 'bg-gray-50 dark:bg-white/5 opacity-80' : ''}`} 
            />
            {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber.message as string}</p>}
          </div>
        )}

        {showSEZ && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">SEZ Unit / Developer Name *</label>
              <input 
                type="text" 
                {...register('sezUnitName')} 
                disabled={readOnly}
                className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${errors.sezUnitName ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`} 
              />
              {errors.sezUnitName && <p className="text-red-500 text-xs mt-1">{errors.sezUnitName.message as string}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">LUT / Bond Reference No.</label>
              <input 
                type="text" 
                {...register('lutBondNo')} 
                disabled={readOnly}
                className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors" 
              />
            </div>
          </>
        )}

        {showRegisteredGstAddress && (
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Registered GST Address</label>
            <textarea
              {...register('registeredGstAddress')}
              disabled={readOnly}
              rows={2}
              className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors custom-scrollbar"
              placeholder="Full address as per GST registration"
            />
            {errors.registeredGstAddress && <p className="text-red-500 text-xs mt-1">{errors.registeredGstAddress.message as string}</p>}
          </div>
        )}

        {showPlaceOfSupply && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Place of Supply *</label>
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
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Country *</label>
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
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Currency *</label>
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
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Foreign Tax ID</label>
              <input 
                type="text" 
                {...register('foreignTaxId')} 
                disabled={readOnly}
                placeholder="e.g. VAT ID, EIN"
                className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors" 
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
