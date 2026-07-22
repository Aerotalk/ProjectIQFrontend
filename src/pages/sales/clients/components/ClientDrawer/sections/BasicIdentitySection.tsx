"use no memo";
import { useFormContext } from 'react-hook-form';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function BasicIdentitySection({ readOnly }: Props) {
  const { register, watch, formState: { errors } } = useFormContext();
  const customerType = watch('customerType');

  return (
    <FormSection title="Part A — Basic Identity">
      <FormGrid>
        <FormRow>
          <label className={formStyles.label}>Customer Type *</label>
          <div className="flex gap-4 mt-2">
            <label htmlFor="customer-type-business" className="flex items-center gap-2">
              <input id="customer-type-business" type="radio" value="Business" {...register('customerType')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Business</span>
            </label>
            <label htmlFor="customer-type-individual" className="flex items-center gap-2">
              <input id="customer-type-individual" type="radio" value="Individual" {...register('customerType')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Individual</span>
            </label>
          </div>
        </FormRow>

        {customerType === 'Business' ? (
          <FormRow>
            <label className={formStyles.label}>Company Name *</label>
            <input 
              type="text" 
              {...register('companyName')} 
              disabled={readOnly}
              placeholder="e.g. Acme Corp"
              className={formStyles.field(!!errors.companyName, readOnly)} 
            />
            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message as string}</p>}
          </FormRow>
        ) : (
          <>
            <div>
              <label className={formStyles.label}>First Name *</label>
              <input 
                type="text" 
                {...register('firstName')} 
                disabled={readOnly}
                className={formStyles.field(!!errors.firstName, readOnly)} 
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message as string}</p>}
            </div>
            <div>
              <label className={formStyles.label}>Last Name</label>
              <input 
                type="text" 
                {...register('lastName')} 
                disabled={readOnly}
                className={formStyles.field(!!errors.lastName, readOnly)} 
              />
            </div>
          </>
        )}

        <FormRow>
          <label className={formStyles.label}>Display Name *</label>
          <input 
            type="text" 
            {...register('displayName')} 
            disabled={readOnly}
            placeholder="Name shown in all dropdowns and document headers"
            className={formStyles.field(!!errors.displayName, readOnly)} 
          />
          <p className="text-xs text-gray-500 mt-1">Must be unique. Max 100 characters.</p>
          {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName.message as string}</p>}
        </FormRow>
      </FormGrid>
    </FormSection>
  );
}
