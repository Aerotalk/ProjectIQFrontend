import { useFormContext, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { formStyles } from '@/components/ui/form-styles';
import { FormGrid, FormRow } from '@/components/ui/FormLayout';

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
      <div className="flex items-center justify-between">
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

      <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-white/10">
        {fields.map((item, index) => (
          <div key={item.id} className="p-4 bg-gray-50 dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5 relative group">
            {!readOnly && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 size={16} />
              </button>
            )}

            <FormGrid>
              <FormRow>
                <label className={formStyles.label}>Degree</label>
                <Input type="text" {...register(`educations.${index}.degree`)} disabled={readOnly} />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Qualification</label>
                <Input type="text" {...register(`educations.${index}.qualification`)} disabled={readOnly} />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Institution</label>
                <Input type="text" {...register(`educations.${index}.institution`)} disabled={readOnly} />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Field of Study</label>
                <Input type="text" {...register(`educations.${index}.fieldOfStudy`)} disabled={readOnly} />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Start Year</label>
                <Input type="text" placeholder="YYYY" {...register(`educations.${index}.startYear`)} disabled={readOnly} />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>End Year</label>
                <Input type="text" placeholder="YYYY" {...register(`educations.${index}.endYear`)} disabled={readOnly} />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Grade / CGPA</label>
                <Input type="text" {...register(`educations.${index}.grade`)} disabled={readOnly} />
              </FormRow>
            </FormGrid>
          </div>
        ))}
      </div>
    </div>
  );
}
