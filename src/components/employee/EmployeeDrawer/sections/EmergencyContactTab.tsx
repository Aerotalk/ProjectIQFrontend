import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function EmergencyContactTab({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
        Emergency Contact
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Contact Name</label>
          <Input type="text" {...register('emergencyContactName')} disabled={readOnly} />
          {errors.emergencyContactName && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactName.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Relationship</label>
          <Input type="text" {...register('emergencyRelationship')} disabled={readOnly} />
          {errors.emergencyRelationship && <p className="text-red-500 text-xs mt-1">{errors.emergencyRelationship.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Phone</label>
          <Input type="text" {...register('emergencyPhone')} disabled={readOnly} />
          {errors.emergencyPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyPhone.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Alternate Phone</label>
          <Input type="text" {...register('emergencyAlternatePhone')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Email</label>
          <Input type="email" {...register('emergencyEmail')} disabled={readOnly} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Address</label>
          <Input type="text" {...register('emergencyAddress')} disabled={readOnly} />
        </div>
        <div className="md:col-span-2 flex items-center gap-2">
          <input type="checkbox" id="emergencyPrimaryContact" {...register('emergencyPrimaryContact')} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
          <label htmlFor="emergencyPrimaryContact" className="text-sm text-gray-700 dark:text-gray-300">Primary Contact</label>
        </div>
      </div>
    </div>
  );
}
