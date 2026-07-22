import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function EmploymentContractTab({ readOnly }: Props) {
  const { register, control } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Employment Contract" className="pt-0 border-t-0">
        <FormGrid>
        <FormRow>
          <label className={formStyles.label}>Contract Type</label>
          <Controller
            name={'contractType'}
            control={control}
            render={({ field }) => (
              <CustomSelect
                value={field.value || ''}
                onChange={field.onChange}
                options={[
                  { label: 'Select Type', value: '' },
                  { label: 'Permanent', value: 'Permanent' },
                  { label: 'Fixed Term', value: 'Fixed Term' },
                  { label: 'Consultant', value: 'Consultant' },
                  { label: 'Internship', value: 'Internship' }
                ]}
                disabled={readOnly}
              />
            )}
          />
        </FormRow>
        <div className="hidden md:block"></div>
        <FormRow>
          <label className={formStyles.label}>Start Date</label>
          <CustomDatePicker name="contractStartDate" disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>End Date</label>
          <CustomDatePicker name="contractEndDate" disabled={readOnly} />
        </FormRow>
        
        <FormRow>
          <label className={formStyles.label}>Annual CTC</label>
          <Input type="number" step="0.01" {...register('contractAnnualCTC', { valueAsNumber: true })} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Notice Period (Days)</label>
          <Input type="number" {...register('contractNoticePeriod', { valueAsNumber: true })} disabled={readOnly} />
        </FormRow>
        
        <FormRow className="md:col-span-2">
          <label className={formStyles.label}>Contract Terms</label>
          <textarea
            {...register('contractTerms')}
            disabled={readOnly}
            rows={3}
            className={formStyles.textarea(false, readOnly)}
          />
        </FormRow>

        <FormRow className="md:col-span-2">
          <label className={formStyles.label}>Signed Contract Upload</label>
          <Input type="file" {...register('signedContractUpload')} disabled={readOnly} />
        </FormRow>
      </FormGrid>
      </FormSection>
    </div>
  );
}
