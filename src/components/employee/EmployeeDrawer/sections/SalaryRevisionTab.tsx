import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function SalaryRevisionTab({ readOnly }: Props) {
  const { register, control } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Salary Revision" className="pt-0 border-t-0">
        <FormGrid>
        <FormRow>
          <label className={formStyles.label}>Revision Type</label>
          <Controller
            name={'revisionType'}
            control={control}
            render={({ field }) => (
              <CustomSelect
                value={field.value || ''}
                onChange={field.onChange}
                options={[
                  { label: 'Select Type', value: '' },
                  { label: 'Annual Appraisal', value: 'Annual Appraisal' },
                  { label: 'Mid-Year Appraisal', value: 'Mid-Year Appraisal' },
                  { label: 'Promotion', value: 'Promotion' },
                  { label: 'Correction', value: 'Correction' }
                ]}
                disabled={readOnly}
              />
            )}
          />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Effective Date</label>
          <CustomDatePicker name="revisionEffectiveDate" disabled={readOnly} />
        </FormRow>
        
        <FormRow>
          <label className={formStyles.label}>Annual CTC</label>
          <Input type="number" step="0.01" {...register('revisionAnnualCTC', { valueAsNumber: true })} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Increment %</label>
          <Input type="number" step="0.01" {...register('revisionIncrementPercentage', { valueAsNumber: true })} disabled={readOnly} />
        </FormRow>
        
        <FormRow className="md:col-span-2">
          <label className={formStyles.label}>Salary Components Breakdown</label>
          <textarea
            {...register('revisionSalaryComponents')}
            disabled={readOnly}
            rows={3}
            className={formStyles.textarea(false, readOnly)}
            placeholder="e.g. Basic: 40%, HRA: 20%, etc."
          />
        </FormRow>

        <FormRow className="md:col-span-2">
          <label className={formStyles.label}>Reason</label>
          <Input type="text" {...register('revisionReason')} disabled={readOnly} />
        </FormRow>
      </FormGrid>
      </FormSection>
    </div>
  );
}
