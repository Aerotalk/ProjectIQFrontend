"use no memo";
import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function CommercialSection({ readOnly }: Props) {
  const { register, control } = useFormContext();

  return (
    <FormSection title="Part E — Commercial Settings">
      <FormGrid>
        <div>
          <label className={formStyles.label}>Payment Terms</label>
          <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
            <Controller
              name="paymentTerms"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: 'Immediate', value: 'Immediate' },
                    { label: '15 Days', value: '15 Days' },
                    { label: '30 Days', value: '30 Days' },
                    { label: '45 Days', value: '45 Days' },
                    { label: '60 Days', value: '60 Days' },
                    { label: '90 Days', value: '90 Days' },
                    { label: 'Custom', value: 'Custom' }
                  ]}
                />
              )}
            />
          </div>
        </div>

        <div>
          <label className={formStyles.label}>Credit Limit (₹)</label>
          <input 
            type="number" 
            {...register('creditLimit', { valueAsNumber: true })} 
            disabled={readOnly}
            className={formStyles.field(false, readOnly)} 
          />
        </div>

        <FormRow>
          <label className={formStyles.label}>Industry / Segment</label>
          <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: 'Manufacturing', value: 'Manufacturing' },
                    { label: 'Trading', value: 'Trading' },
                    { label: 'IT / ITES', value: 'IT/ITES' },
                    { label: 'Construction', value: 'Construction' },
                    { label: 'Healthcare', value: 'Healthcare' },
                    { label: 'Education', value: 'Education' },
                    { label: 'Retail', value: 'Retail' },
                    { label: 'Other', value: 'Other' }
                  ]}
                />
              )}
            />
          </div>
        </FormRow>

        <FormRow>
          <label className={formStyles.label}>Internal Notes</label>
          <textarea 
            {...register('notes')} 
            disabled={readOnly}
            rows={3}
            className={formStyles.textarea(false, readOnly)} 
          />
          <p className="text-xs text-gray-500 mt-1">Never shown on any document.</p>
        </FormRow>

        <FormRow>
          <label className={formStyles.label}>Status</label>
          <div className="flex gap-4">
            <label htmlFor="status-active" className="flex items-center gap-2 cursor-pointer">
              <input id="status-active" type="radio" value="Active" {...register('status')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Active</span>
            </label>
            <label htmlFor="status-inactive" className="flex items-center gap-2 cursor-pointer">
              <input id="status-inactive" type="radio" value="Inactive" {...register('status')} disabled={readOnly} className="text-red-500 focus:ring-red-500" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Inactive</span>
            </label>
          </div>
        </FormRow>
      </FormGrid>
    </FormSection>
  );
}
