import { useFormContext, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  readOnly?: boolean;
}

export default function EducationTab({ readOnly }: Props) {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations"
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Education History
        </h3>
        {!readOnly && (
          <button
            type="button"
            onClick={() => append({ degree: '', qualification: '', institution: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '' })}
            className="flex items-center gap-1.5 text-sm font-medium text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/5 px-2 py-1 rounded-sm transition-colors"
          >
            <Plus size={16} /> Add Education
          </button>
        )}
      </div>
      
      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 dark:bg-black/10 rounded-lg border border-dashed border-gray-200 dark:border-white/10">
          No education records added yet. Click 'Add Education' to include a record.
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Degree</label>
                <Input type="text" {...register(`educations.${index}.degree`)} disabled={readOnly} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Qualification</label>
                <Input type="text" {...register(`educations.${index}.qualification`)} disabled={readOnly} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Institution</label>
                <Input type="text" {...register(`educations.${index}.institution`)} disabled={readOnly} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Field of Study</label>
                <Input type="text" {...register(`educations.${index}.fieldOfStudy`)} disabled={readOnly} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Start Year</label>
                <Input type="text" placeholder="YYYY" {...register(`educations.${index}.startYear`)} disabled={readOnly} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">End Year</label>
                <Input type="text" placeholder="YYYY" {...register(`educations.${index}.endYear`)} disabled={readOnly} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Grade / CGPA</label>
                <Input type="text" {...register(`educations.${index}.grade`)} disabled={readOnly} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
