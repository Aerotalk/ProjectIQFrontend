import SharedPhoneInput from '@/components/shared/SharedPhoneInput';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { api } from '../../../../lib/api';
import { Input } from '@/components/ui/input';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function BasicInfoTab({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext();
  const companyId = useWatch({ control, name: 'companyId' });
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const query = companyId ? `?companyId=${companyId}` : '';
        const [deptRes, desigRes, managerRes] = await Promise.all([
          api.get(`/admin/departments${query}`),
          api.get(`/admin/designations${query}`),
          api.get(`/admin/employees${query}`)
        ]);

        setDepartments(deptRes);
        setDesignations(desigRes);
        setManagers(managerRes);
      } catch (err) {
        console.error("Failed to load departments/designations", err);
      }
    };
    
    // Always fetch if no companyId (for org-level) or if companyId changes
    fetchDropdownData();
  }, [companyId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FormSection title="Basic Information" className="pt-0 border-t-0">
        <FormGrid>
          {/* Row: First Name | Last Name */}
          <div>
            <label className={formStyles.label}>First Name *</label>
            <Input type="text" {...register('firstName')} disabled={readOnly} />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Last Name *</label>
            <Input type="text" {...register('lastName')} disabled={readOnly} />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message as string}</p>}
          </div>

          {/* Row: Middle Name | Date of Birth */}
          <div>
            <label className={formStyles.label}>Middle Name</label>
            <Input type="text" {...register('middleName')} disabled={readOnly} />
          </div>
          <div>
            <label className={formStyles.label}>Date of Birth *</label>
            <CustomDatePicker name="dateOfBirth" disabled={readOnly} />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message as string}</p>}
          </div>

          {/* Row: Work Email | Phone */}
          <div>
            <label className={formStyles.label}>Work Email *</label>
            <Input type="email" {...register('workEmail')} disabled={readOnly} />
            {errors.workEmail && <p className="text-red-500 text-xs mt-1">{errors.workEmail.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Phone *</label>
            <SharedPhoneInput name="phone" disabled={readOnly} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
          </div>

          {/* Row: Alternate Phone | Gender */}
          <div>
            <label className={formStyles.label}>Alternate Phone</label>
            <SharedPhoneInput name="alternatePhone" disabled={readOnly} />
          </div>
          <div>
            <label className={formStyles.label}>Gender *</label>
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
          </div>

          {/* Row: Marital Status | Blood Group */}
          <div>
            <label className={formStyles.label}>Marital Status *</label>
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
            {errors.maritalStatus && <p className="text-red-500 text-xs mt-1">{errors.maritalStatus.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Blood Group *</label>
            <Input type="text" {...register('bloodGroup')} disabled={readOnly} />
            {errors.bloodGroup && <p className="text-red-500 text-xs mt-1">{errors.bloodGroup.message as string}</p>}
          </div>

          {/* Row: Nationality | Profile Photo */}
          <div>
            <label className={formStyles.label}>Nationality *</label>
            <Input type="text" {...register('nationality')} disabled={readOnly} />
            {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Profile Photo *</label>
            <Input type="file" {...register('profilePhoto')} disabled={readOnly} />
            {errors.profilePhoto && <p className="text-red-500 text-xs mt-1">{errors.profilePhoto.message as string}</p>}
          </div>
        </FormGrid>
      </FormSection>

      <FormSection title="Employment Details">
        <FormGrid>
          {/* Row: Date of Joining | Employment Type */}
          <div>
            <label className={formStyles.label}>Date of Joining *</label>
            <CustomDatePicker name="dateOfJoining" disabled={readOnly} />
            {errors.dateOfJoining && <p className="text-red-500 text-xs mt-1">{errors.dateOfJoining.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Employment Type *</label>
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
          </div>

          {/* Row: Company / Legal Entity | Department */}
          <div>
            <label className={formStyles.label}>Company / Legal Entity *</label>
            <Input type="text" {...register('companyId')} disabled={readOnly} />
            {errors.companyId && <p className="text-red-500 text-xs mt-1">{errors.companyId.message as string}</p>}
          </div>
          {/* Row: Department | Designation */}
          <div>
            <label className={formStyles.label}>Department *</label>
            <Controller
              name={'departmentId'}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: '-- Select Department --', value: '' },
                    ...departments.map((d: any) => ({ label: d.departmentName, value: d.id }))
                  ]}
                  disabled={readOnly}
                />
              )}
            />
            {errors.departmentId && <p className="text-red-500 text-xs mt-1">{errors.departmentId.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Designation *</label>
            <Controller
              name={'designationId'}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: '-- Select Designation --', value: '' },
                    ...designations.map((d: any) => ({ label: d.designationName, value: d.id }))
                  ]}
                  disabled={readOnly}
                />
              )}
            />
            {errors.designationId && <p className="text-red-500 text-xs mt-1">{errors.designationId.message as string}</p>}
          </div>

          {/* Row: Location | Grade / Band */}
          <div>
            <label className={formStyles.label}>Location *</label>
            <Input type="text" {...register('location')} disabled={readOnly} />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message as string}</p>}
          </div>

          {/* Row: Grade / Band | Reporting Manager */}
          <div>
            <label className={formStyles.label}>Grade / Band *</label>
            <Input type="text" {...register('grade')} disabled={readOnly} />
            {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Reporting Manager *</label>
            <Controller
              name={'reportingManagerId'}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: '-- Select Reporting Manager --', value: '' },
                    ...managers.map((m: any) => ({ label: `${m.firstName} ${m.lastName}`, value: m.id }))
                  ]}
                  disabled={readOnly}
                />
              )}
            />
            {errors.reportingManagerId && <p className="text-red-500 text-xs mt-1">{errors.reportingManagerId.message as string}</p>}
          </div>

          {/* Row: HR Manager | Weekly Off */}
          <div>
            <label className={formStyles.label}>HR Manager *</label>
            <Controller
              name={'hrManagerId'}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: '-- Select HR Manager --', value: '' },
                    ...managers.map((m: any) => ({ label: `${m.firstName} ${m.lastName}`, value: m.id }))
                  ]}
                  disabled={readOnly}
                />
              )}
            />
            {errors.hrManagerId && <p className="text-red-500 text-xs mt-1">{errors.hrManagerId.message as string}</p>}
          </div>
          <div>
            <label className={formStyles.label}>Weekly Off *</label>
            <Input type="text" {...register('weeklyOff')} disabled={readOnly} />
            {errors.weeklyOff && <p className="text-red-500 text-xs mt-1">{errors.weeklyOff.message as string}</p>}
          </div>

          {/* Row: Father's Name | Notice Period */}
          <div>
            <label className={formStyles.label}>Father's Name</label>
            <Input type="text" {...register('fatherName')} disabled={readOnly} />
          </div>
          <div>
            <label className={formStyles.label}>Notice Period (Days) *</label>
            <Input type="number" {...register('noticePeriodDays', { valueAsNumber: true })} disabled={readOnly} />
            {errors.noticePeriodDays && <p className="text-red-500 text-xs mt-1">{errors.noticePeriodDays.message as string}</p>}
          </div>
        </FormGrid>
      </FormSection>
    </div>
  );
}
