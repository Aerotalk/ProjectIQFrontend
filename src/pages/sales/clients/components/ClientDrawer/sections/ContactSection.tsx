"use no memo";
import { useFormContext } from 'react-hook-form';
import SharedPhoneInput from '@/components/shared/SharedPhoneInput';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function ContactSection({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection title="Part C — Contact Details">
      <FormGrid>
        <FormRow>
          <label className={formStyles.label}>Primary Contact Person *</label>
          <input 
            type="text" 
            {...register('primaryContactPerson')} 
            disabled={readOnly}
            className={formStyles.field(!!errors.primaryContactPerson, readOnly)} 
          />
          {errors.primaryContactPerson && <p className="text-red-500 text-xs mt-1">{errors.primaryContactPerson.message as string}</p>}
        </FormRow>
        
        <FormRow>
          <label className={formStyles.label}>Designation</label>
          <input 
            type="text" 
            {...register('designation')} 
            disabled={readOnly}
            className={formStyles.field(!!errors.designation, readOnly)} 
          />
          {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation.message as string}</p>}
        </FormRow>

        <div>
          <label className={formStyles.label}>Email *</label>
          <input 
            type="email" 
            {...register('email')} 
            disabled={readOnly}
            className={formStyles.field(!!errors.email, readOnly)} 
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
        </div>

        <div>
          <label className={formStyles.label}>Phone *</label>
          <SharedPhoneInput
            name="phone"
            disabled={readOnly}
            defaultCountry="IN"
            className={errors.phone ? '[&>input]:border-red-500' : ''}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
        </div>

        <div>
          <label className={formStyles.label}>Alternate Phone</label>
          <SharedPhoneInput
            name="alternatePhone"
            disabled={readOnly}
            defaultCountry="IN"
          />
        </div>
      </FormGrid>
    </FormSection>
  );
}
