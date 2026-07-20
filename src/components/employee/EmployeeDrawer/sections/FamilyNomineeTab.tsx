import { useFormContext, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  readOnly?: boolean;
}

export default function FamilyNomineeTab({ readOnly }: Props) {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "families"
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Family & Nominee Details
        </h3>
        {!readOnly && (
          <button
            type="button"
            onClick={() => append({ name: '', relationship: '', dateOfBirth: '', gender: '', dependent: false, nominee: false, nomineePercentage: 0, phone: '' })}
            className="flex items-center gap-1.5 text-sm font-medium text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/5 px-2 py-1 rounded-sm transition-colors"
          >
            <Plus size={16} /> Add Member
          </button>
        )}
      </div>
      
      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 dark:bg-black/10 rounded-lg border border-dashed border-gray-200 dark:border-white/10">
          No family members added yet. Click 'Add Member' to include a record.
        </div>
      )}

      <div className="space-y-4">
        {fields.map((item, index) => (
          <div key={item.id} className="p-4 bg-gray-50 dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5 relative group">
            {!readOnly && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-8">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Name</label>
                <Input type="text" {...register(`families.${index}.name`)} disabled={readOnly} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Relationship</label>
                <Input type="text" {...register(`families.${index}.relationship`)} disabled={readOnly} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Date of Birth</label>
                <Input type="date" {...register(`families.${index}.dateOfBirth`)} disabled={readOnly} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Gender</label>
                <select {...register(`families.${index}.gender`)} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Phone</label>
                <Input type="text" {...register(`families.${index}.phone`)} disabled={readOnly} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Nominee %</label>
                <Input type="number" step="1" max="100" min="0" {...register(`families.${index}.nomineePercentage`, { valueAsNumber: true })} disabled={readOnly} />
              </div>
              
              <div className="flex gap-4 items-center md:col-span-2 lg:col-span-3 mt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id={`families.${index}.dependent`} {...register(`families.${index}.dependent`)} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
                  <label htmlFor={`families.${index}.dependent`} className="text-sm text-gray-700 dark:text-gray-300">Is Dependent</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id={`families.${index}.nominee`} {...register(`families.${index}.nominee`)} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
                  <label htmlFor={`families.${index}.nominee`} className="text-sm text-gray-700 dark:text-gray-300">Is Nominee</label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
