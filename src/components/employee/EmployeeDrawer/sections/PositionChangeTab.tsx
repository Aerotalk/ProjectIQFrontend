import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function PositionChangeTab({ readOnly }: Props) {
  const { register, control } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Position Change" className="pt-0 border-t-0">
        <FormGrid>
        <FormRow>
          <label className={formStyles.label}>Change Type</label>
          <Controller
            name={'positionChangeType'}
            control={control}
            render={({ field }) => (
              <CustomSelect
                value={field.value || ''}
                onChange={field.onChange}
                options={[
                  { label: 'Select Type', value: '' },
                  { label: 'Promotion', value: 'Promotion' },
                  { label: 'Demotion', value: 'Demotion' },
                  { label: 'Transfer', value: 'Transfer' },
                  { label: 'Role Change', value: 'Role Change' }
                ]}
                disabled={readOnly}
              />
            )}
          />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Effective Date</label>
          <CustomDatePicker name="positionChangeEffectiveDate" disabled={readOnly} />
        </FormRow>
        
        <FormRow>
          <label className={formStyles.label}>New Department</label>
          <Input type="text" {...register('positionChangeDepartmentId')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>New Designation</label>
          <Input type="text" {...register('positionChangeDesignationId')} disabled={readOnly} />
        </FormRow>
        
        <FormRow>
          <label className={formStyles.label}>New Grade / Band</label>
          <Input type="text" {...register('positionChangeGrade')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>New Location</label>
          <Input type="text" {...register('positionChangeLocation')} disabled={readOnly} />
        </FormRow>

        <FormRow>
          <label className={formStyles.label}>New Reporting Manager</label>
          <Input type="text" {...register('positionChangeReportingManagerId')} disabled={readOnly} />
        </FormRow>
        
        <FormRow className="md:col-span-2">
          <label className={formStyles.label}>Remarks</label>
          <textarea
            {...register('positionChangeRemarks')}
            disabled={readOnly}
            rows={3}
            className={formStyles.textarea(false, readOnly)}
          />
        </FormRow>
      </FormGrid>
      </FormSection>
    </div>
  );
}
