import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function SeparationExitTab({ readOnly }: Props) {
  const { register, control } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Separation / Exit" className="pt-0 border-t-0">
        <FormGrid>
        <FormRow>
          <label className={formStyles.label}>Separation Type</label>
          <Controller
            name={'separationType'}
            control={control}
            render={({ field }) => (
              <CustomSelect
                value={field.value || ''}
                onChange={field.onChange}
                options={[
                  { label: 'Select Type', value: '' },
                  { label: 'Resignation', value: 'Resignation' },
                  { label: 'Termination', value: 'Termination' },
                  { label: 'Retirement', value: 'Retirement' },
                  { label: 'Absconding', value: 'Absconding' }
                ]}
                disabled={readOnly}
              />
            )}
          />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Resignation Date</label>
          <CustomDatePicker name="resignationDate" disabled={readOnly} />
        </FormRow>
        
        <FormRow>
          <label className={formStyles.label}>Last Working Date</label>
          <CustomDatePicker name="lastWorkingDate" disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Notice Period Served (Days)</label>
          <Input type="number" {...register('exitNoticePeriod', { valueAsNumber: true })} disabled={readOnly} />
        </FormRow>
        
        <FormRow className="md:col-span-2">
          <label className={formStyles.label}>Reason</label>
          <Input type="text" {...register('separationReason')} disabled={readOnly} />
        </FormRow>
        
        <FormRow className="md:col-span-2">
          <label className={formStyles.label}>Remarks</label>
          <textarea
            {...register('separationRemarks')}
            disabled={readOnly}
            rows={3}
            className={formStyles.textarea(false, readOnly)}
          />
        </FormRow>

        <FormRow className="md:col-span-2 flex flex-row items-center gap-2 mt-2">
          <input type="checkbox" id="exitInterview" {...register('exitInterview')} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
          <label htmlFor="exitInterview" className="text-sm text-gray-700 dark:text-gray-300 mb-0">Exit Interview Completed</label>
        </FormRow>
      </FormGrid>
      </FormSection>
    </div>
  );
}
