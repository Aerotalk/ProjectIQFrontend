import SharedPhoneInput from '@/components/shared/SharedPhoneInput';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function EmergencyContactTab({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Emergency Contact" className="pt-0 border-t-0">
        <FormGrid>
          {/* Row: Contact Name | Relationship */}
          <div>
            <label className={formStyles.label}>Contact Name</label>
            <Input type="text" {...register('emergencyContactName')} disabled={readOnly} />
            {errors.emergencyContactName && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactName.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Relationship</label>
            <Input type="text" {...register('emergencyRelationship')} disabled={readOnly} />
            {errors.emergencyRelationship && <p className="text-red-500 text-xs mt-1">{errors.emergencyRelationship.message as string}</p>}
          </div>

          {/* Row: Phone | Alternate Phone */}
          <div>
            <label className={formStyles.label}>Phone</label>
            <SharedPhoneInput name="emergencyPhone" disabled={readOnly} />
            {errors.emergencyPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyPhone.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Alternate Phone</label>
            <SharedPhoneInput name="emergencyAlternatePhone" disabled={readOnly} />
          </div>

          {/* Row: Email | (spacer) */}
          <div>
            <label className={formStyles.label}>Email</label>
            <Input type="email" {...register('emergencyEmail')} disabled={readOnly} />
          </div>
          <div /> {/* intentional spacer */}

          {/* Address — full width */}
          <FormRow>
            <label className={formStyles.label}>Address</label>
            <Input type="text" {...register('emergencyAddress')} disabled={readOnly} />
          </FormRow>

          {/* Primary Contact checkbox — full width */}
          <FormRow>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="emergencyPrimaryContact" {...register('emergencyPrimaryContact')} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
              <label htmlFor="emergencyPrimaryContact" className="text-sm text-gray-700 dark:text-gray-300">Primary Contact</label>
            </div>
          </FormRow>
        </FormGrid>
      </FormSection>
    </div>
  );
}
