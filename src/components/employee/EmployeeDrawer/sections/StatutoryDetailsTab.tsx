import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';


interface Props {
  readOnly?: boolean;
}

export default function StatutoryDetailsTab({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Statutory Details" className="pt-0 border-t-0">
        <FormGrid>
        <FormRow>
          <label className={formStyles.label}>PAN Number</label>
          <Input type="text" {...register('panNumber')} disabled={readOnly} className="uppercase" />
          {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Aadhaar Number</label>
          <Input type="text" {...register('aadhaarNumber')} disabled={readOnly} />
          {errors.aadhaarNumber && <p className="text-red-500 text-xs mt-1">{errors.aadhaarNumber.message as string}</p>}
        </FormRow>
        
        <FormRow>
          <label className={formStyles.label}>UAN</label>
          <Input type="text" {...register('uan')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>PF Number</label>
          <Input type="text" {...register('pfNumber')} disabled={readOnly} />
        </FormRow>
        
        <FormRow>
          <label className={formStyles.label}>ESI Number</label>
          <Input type="text" {...register('esiNumber')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Tax Regime</label>
          <Controller
            name={'taxRegime'}
            control={control}
            render={({ field }) => (
              <CustomSelect
                value={field.value || ''}
                onChange={field.onChange}
                options={[
                  { label: 'Select Regime', value: '' },
                  { label: 'Old Regime', value: 'Old' },
                  { label: 'New Regime', value: 'New' }
                ]}
                disabled={readOnly}
              />
            )}
          />
        </FormRow>

        <FormRow>
          <label className={formStyles.label}>Passport Number</label>
          <Input type="text" {...register('passportNumber')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Passport Expiry</label>
          <CustomDatePicker name="passportExpiry" disabled={readOnly} />
        </FormRow>
        
        <FormRow>
          <label className={formStyles.label}>Voter ID</label>
          <Input type="text" {...register('voterId')} disabled={readOnly} />
        </FormRow>
        
        <FormRow>
          <label className={formStyles.label}>Driving License</label>
          <Input type="text" {...register('drivingLicense')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Driving License Expiry</label>
          <CustomDatePicker name="drivingLicenseExpiry" disabled={readOnly} />
        </FormRow>

        <FormRow className="flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="pfApplicable" {...register('pfApplicable')} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
            <label htmlFor="pfApplicable" className="text-sm text-gray-700 dark:text-gray-300 mb-0">PF Applicable</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="esiApplicable" {...register('esiApplicable')} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
            <label htmlFor="esiApplicable" className="text-sm text-gray-700 dark:text-gray-300 mb-0">ESI Applicable</label>
          </div>
        </FormRow>
      </FormGrid>
      </FormSection>
    </div>
  );
}
