import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function BasicInfoTab({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
        Basic Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">First Name *</label>
          <Input type="text" {...register('firstName')} disabled={readOnly} />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Middle Name</label>
          <Input type="text" {...register('middleName')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Last Name *</label>
          <Input type="text" {...register('lastName')} disabled={readOnly} />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Work Email *</label>
          <Input type="email" {...register('workEmail')} disabled={readOnly} />
          {errors.workEmail && <p className="text-red-500 text-xs mt-1">{errors.workEmail.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Phone *</label>
          <Input type="text" {...register('phone')} disabled={readOnly} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Alternate Phone</label>
          <Input type="text" {...register('alternatePhone')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Date of Birth</label>
          <Input type="date" {...register('dateOfBirth')} disabled={readOnly} />
          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Gender</label>
          <select {...register('gender')} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Marital Status</label>
          <select {...register('maritalStatus')} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Blood Group</label>
          <Input type="text" {...register('bloodGroup')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Nationality</label>
          <Input type="text" {...register('nationality')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Profile Photo</label>
          <Input type="file" {...register('profilePhoto')} disabled={readOnly} />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2 mt-8">
        Employment Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Date of Joining</label>
          <Input type="date" {...register('dateOfJoining')} disabled={readOnly} />
          {errors.dateOfJoining && <p className="text-red-500 text-xs mt-1">{errors.dateOfJoining.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Employment Type</label>
          <select {...register('employmentType')} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
            <option value="">Select</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
          {errors.employmentType && <p className="text-red-500 text-xs mt-1">{errors.employmentType.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Company / Legal Entity *</label>
          <Input type="text" {...register('companyId')} disabled={readOnly} />
          {errors.companyId && <p className="text-red-500 text-xs mt-1">{errors.companyId.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Department</label>
          <Input type="text" {...register('departmentId')} disabled={readOnly} />
          {errors.departmentId && <p className="text-red-500 text-xs mt-1">{errors.departmentId.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Designation</label>
          <Input type="text" {...register('designationId')} disabled={readOnly} />
          {errors.designationId && <p className="text-red-500 text-xs mt-1">{errors.designationId.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Location</label>
          <Input type="text" {...register('location')} disabled={readOnly} />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Grade / Band</label>
          <Input type="text" {...register('grade')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Reporting Manager</label>
          <Input type="text" {...register('reportingManagerId')} disabled={readOnly} />
          {errors.reportingManagerId && <p className="text-red-500 text-xs mt-1">{errors.reportingManagerId.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">HR Manager</label>
          <Input type="text" {...register('hrManagerId')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Weekly Off</label>
          <Input type="text" {...register('weeklyOff')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Father's Name</label>
          <Input type="text" {...register('fatherName')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Notice Period (Days)</label>
          <Input type="number" {...register('noticePeriodDays', { valueAsNumber: true })} disabled={readOnly} />
        </div>
      </div>
    </div>
  );
}
