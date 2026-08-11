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
  const { register, control, setValue, watch, formState: { errors } } = useFormContext();
  const companyId = useWatch({ control, name: 'companyId' });
  const [companies, setCompanies] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);

  // Load company list once on mount
  useEffect(() => {
    api.get('/org/companies').then((res: any) => {
      setCompanies(res || []);
      if (res && res.length === 1 && !companyId) {
        setValue('companyId', String(res[0].id));
      }
    }).catch(() => {});
  }, [companyId, setValue]);

  const [photoUploading, setPhotoUploading] = useState(false);
  const profilePhotoValue = watch('profilePhoto');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('module', 'profile_pictures');
      const res = await api.request('/admin/files/upload', { method: 'POST', data: formData });
      if (res?.id) setValue('profilePhoto', res.id);
    } catch (err) {
      console.warn('Profile photo upload failed', err);
    } finally {
      setPhotoUploading(false);
    }
  };

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
            <Controller
              name={'bloodGroup'}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: 'Select', value: '' },
                    { label: 'A+', value: 'A+' },
                    { label: 'A-', value: 'A-' },
                    { label: 'B+', value: 'B+' },
                    { label: 'B-', value: 'B-' },
                    { label: 'AB+', value: 'AB+' },
                    { label: 'AB-', value: 'AB-' },
                    { label: 'O+', value: 'O+' },
                    { label: 'O-', value: 'O-' }
                  ]}
                  disabled={readOnly}
                />
              )}
            />
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
            {!readOnly && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={photoUploading}
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
              />
            )}
            {photoUploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
            {profilePhotoValue && typeof profilePhotoValue === 'string' && !photoUploading && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Photo uploaded</p>
            )}
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
            <Controller
              name={'companyId'}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={[
                    { label: '-- Select Company --', value: '' },
                    ...companies.map((c: any) => ({ label: c.companyName, value: String(c.id) }))
                  ]}
                  disabled={readOnly}
                />
              )}
            />
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
            <Input type="number" {...register('noticePeriodDays', { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })} disabled={readOnly} />
            {errors.noticePeriodDays && <p className="text-red-500 text-xs mt-1">{errors.noticePeriodDays.message as string}</p>}
          </div>
        </FormGrid>
      </FormSection>
    </div>
  );
}
