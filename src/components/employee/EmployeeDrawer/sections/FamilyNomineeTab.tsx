import SharedPhoneInput from '@/components/shared/SharedPhoneInput';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { formStyles } from '@/components/ui/form-styles';
import { FormGrid, FormRow } from '@/components/ui/FormLayout';

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
      <div className="flex items-center justify-between">
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
                <label className={formStyles.label}>Name</label>
                <Input type="text" {...register(`families.${index}.name`)} disabled={readOnly} />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Relationship</label>
                <Input type="text" {...register(`families.${index}.relationship`)} disabled={readOnly} />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Date of Birth</label>
                <CustomDatePicker name="families.${index}.dateOfBirth" disabled={readOnly} />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Gender</label>
                <Controller
            name={`families.${index}.gender`}
            control={control}
            render={({ field }) => (
              <CustomSelect
                value={field.value || ''}
                onChange={field.onChange}
                options={[
                  { label: 'Select', value: '' },
                  { label: 'Male', value: 'Male' },
                  { label: 'Female', value: 'Female' },
                  { label: 'Other', value: 'Other' }
                ]}
                disabled={readOnly}
              />
            )}
          />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Phone</label>
                <SharedPhoneInput name={`families.${index}.phone`} disabled={readOnly} />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Nominee %</label>
                <Input type="number" step="1" max="100" min="0" {...register(`families.${index}.nomineePercentage`, { valueAsNumber: true })} disabled={readOnly} />
              </FormRow>
              
              <FormRow className="md:col-span-2 flex flex-row gap-4 items-center mt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id={`families.${index}.dependent`} {...register(`families.${index}.dependent`)} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
                  <label htmlFor={`families.${index}.dependent`} className="text-sm text-gray-700 dark:text-gray-300 mb-0">Is Dependent</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id={`families.${index}.nominee`} {...register(`families.${index}.nominee`)} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
                  <label htmlFor={`families.${index}.nominee`} className="text-sm text-gray-700 dark:text-gray-300 mb-0">Is Nominee</label>
                </div>
              </FormRow>
            </FormGrid>
          </div>
        ))}
      </div>
    </div>
  );
}
