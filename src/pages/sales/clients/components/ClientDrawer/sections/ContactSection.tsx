"use no memo";
import { useFormContext } from 'react-hook-form';
import SharedPhoneInput from '@/components/shared/SharedPhoneInput';

interface Props {
  readOnly?: boolean;
}

export default function ContactSection({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
        Part C — Contact Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Primary Contact Person *</label>
          <input 
            type="text" 
            {...register('primaryContactPerson')} 
            disabled={readOnly}
            className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${errors.primaryContactPerson ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`} 
          />
          {errors.primaryContactPerson && <p className="text-red-500 text-xs mt-1">{errors.primaryContactPerson.message as string}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Designation</label>
          <input 
            type="text" 
            {...register('designation')} 
            disabled={readOnly}
            className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors" 
          />
          {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Email *</label>
          <input 
            type="email" 
            {...register('email')} 
            disabled={readOnly}
            className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`} 
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Phone *</label>
          <SharedPhoneInput
            name="phone"
            disabled={readOnly}
            defaultCountry="IN"
            className={errors.phone ? '[&>input]:border-red-500' : ''}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Alternate Phone</label>
          <SharedPhoneInput
            name="alternatePhone"
            disabled={readOnly}
            defaultCountry="IN"
          />
        </div>
      </div>
    </div>
  );
}
