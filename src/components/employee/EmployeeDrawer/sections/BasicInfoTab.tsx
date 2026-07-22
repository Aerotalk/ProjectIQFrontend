import SharedPhoneInput from '@/components/shared/SharedPhoneInput';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';


interface Props {
  readOnly?: boolean;
}

export default function BasicInfoTab({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Basic Information" className="pt-0 border-t-0">
        <FormGrid>
        <FormRow>
          <label className={formStyles.label}>First Name *</label>
          <Input type="text" {...register('firstName')} disabled={readOnly} />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Middle Name</label>
          <Input type="text" {...register('middleName')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Last Name *</label>
          <Input type="text" {...register('lastName')} disabled={readOnly} />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Work Email *</label>
          <Input type="email" {...register('workEmail')} disabled={readOnly} />
          {errors.workEmail && <p className="text-red-500 text-xs mt-1">{errors.workEmail.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Phone *</label>
          <SharedPhoneInput name="phone" disabled={readOnly} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Alternate Phone</label>
          <SharedPhoneInput name="alternatePhone" disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Date of Birth</label>
          <CustomDatePicker name="dateOfBirth" disabled={readOnly} />
          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Gender</label>
          <Controller
            name={'gender'}
            control={control}
            render={({ field }) => (
              <CustomSelect
                value={field.value || ''}
                onChange={field.onChange}
                options={[
                  { label: 'Select Gender', value: '' },
                  { label: 'Male', value: 'Male' },
                  { label: 'Female', value: 'Female' },
                  { label: 'Other', value: 'Other' }
                ]}
                disabled={readOnly}
              />
            )}
          />
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Marital Status</label>
          <Controller
            name={'maritalStatus'}
            control={control}
            render={({ field }) => (
              <CustomSelect
                value={field.value || ''}
                onChange={field.onChange}
                options={[
                  { label: 'Select', value: '' },
                  { label: 'Single', value: 'Single' },
                  { label: 'Married', value: 'Married' },
                  { label: 'Divorced', value: 'Divorced' },
                  { label: 'Widowed', value: 'Widowed' }
                ]}
                disabled={readOnly}
              />
            )}
          />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Blood Group</label>
          <Input type="text" {...register('bloodGroup')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Nationality</label>
          <Input type="text" {...register('nationality')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Profile Photo</label>
          <Input type="file" {...register('profilePhoto')} disabled={readOnly} />
        </FormRow>
      </FormGrid>
      </FormSection>

      <FormSection title="Employment Details">
        <FormGrid>
        <FormRow>
          <label className={formStyles.label}>Date of Joining</label>
          <CustomDatePicker name="dateOfJoining" disabled={readOnly} />
          {errors.dateOfJoining && <p className="text-red-500 text-xs mt-1">{errors.dateOfJoining.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Employment Type</label>
          <Controller
            name={'employmentType'}
            control={control}
            render={({ field }) => (
              <CustomSelect
                value={field.value || ''}
                onChange={field.onChange}
                options={[
                  { label: 'Select', value: '' },
                  { label: 'Full Time', value: 'Full Time' },
                  { label: 'Part Time', value: 'Part Time' },
                  { label: 'Contract', value: 'Contract' },
                  { label: 'Intern', value: 'Intern' }
                ]}
                disabled={readOnly}
              />
            )}
          />
          {errors.employmentType && <p className="text-red-500 text-xs mt-1">{errors.employmentType.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Company / Legal Entity *</label>
          <Input type="text" {...register('companyId')} disabled={readOnly} />
          {errors.companyId && <p className="text-red-500 text-xs mt-1">{errors.companyId.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Department</label>
          <Input type="text" {...register('departmentId')} disabled={readOnly} />
          {errors.departmentId && <p className="text-red-500 text-xs mt-1">{errors.departmentId.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Designation</label>
          <Input type="text" {...register('designationId')} disabled={readOnly} />
          {errors.designationId && <p className="text-red-500 text-xs mt-1">{errors.designationId.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Location</label>
          <Input type="text" {...register('location')} disabled={readOnly} />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Grade / Band</label>
          <Input type="text" {...register('grade')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Reporting Manager</label>
          <Input type="text" {...register('reportingManagerId')} disabled={readOnly} />
          {errors.reportingManagerId && <p className="text-red-500 text-xs mt-1">{errors.reportingManagerId.message as string}</p>}
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>HR Manager</label>
          <Input type="text" {...register('hrManagerId')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Weekly Off</label>
          <Input type="text" {...register('weeklyOff')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Father's Name</label>
          <Input type="text" {...register('fatherName')} disabled={readOnly} />
        </FormRow>
        <FormRow>
          <label className={formStyles.label}>Notice Period (Days)</label>
          <Input type="number" {...register('noticePeriodDays', { valueAsNumber: true })} disabled={readOnly} />
        </FormRow>
      </FormGrid>
    </FormSection>
    </div>
  );
}
