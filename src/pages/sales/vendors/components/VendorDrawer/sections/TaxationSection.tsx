"use no memo";
import { useFormContext } from 'react-hook-form';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { cn } from '@/lib/utils';

interface Props {
  readOnly?: boolean;
}

export default function TaxationSection({ readOnly }: Props) {
  const { register } = useFormContext();

  return (
    <FormSection title="Taxation Details">
      <FormGrid>
        <FormRow>
          <label className={formStyles.label}>TDS Percentage (%)</label>
          <input 
            type="number" 
            step="0.01"
            {...register('tdsPercentage', { valueAsNumber: true })} 
            disabled={readOnly}
            className={cn(formStyles.field(false, readOnly), "hide-arrows")}
          />
        </FormRow>

        <FormRow>
          <label className={formStyles.label}>Reverse Charge</label>
          <div className="flex gap-4 mt-2">
            <label htmlFor="rc-yes" className="flex items-center gap-2 cursor-pointer">
              <input id="rc-yes" type="radio" value="true" {...register('reverseCharge')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Yes</span>
            </label>
            <label htmlFor="rc-no" className="flex items-center gap-2 cursor-pointer">
              <input id="rc-no" type="radio" value="false" {...register('reverseCharge')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">No</span>
            </label>
          </div>
        </FormRow>
      </FormGrid>
    </FormSection>
  );
}
