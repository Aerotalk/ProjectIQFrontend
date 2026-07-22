import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { formStyles } from '@/components/ui/form-styles';
import { FormGrid } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function DocumentsTab({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents"
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Documents
        </h3>
        {!readOnly && (
          <button
            type="button"
            onClick={() => append({ documentCategory: '', documentName: '', fileUrl: null, expiryDate: '' })}
            className="flex items-center gap-1.5 text-sm font-medium text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/5 px-2 py-1 rounded-sm transition-colors"
          >
            <Plus size={16} /> Add Document
          </button>
        )}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 dark:bg-black/10 rounded-lg border border-dashed border-gray-200 dark:border-white/10">
          No documents added yet. Click 'Add Document' to include a record.
        </div>
      )}

      <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-white/10">
        {fields.map((item, index) => {
          const docErrors = (errors.documents as any)?.[index];
          return (
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
                {/* Row: Document Category | Document Name */}
                <div>
                  <label className={formStyles.label}>Document Category *</label>
                  <Controller
                    name={`documents.${index}.documentCategory`}
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        value={field.value || ''}
                        onChange={field.onChange}
                        options={[
                          { label: 'Select', value: '' },
                          { label: 'Identity Proof', value: 'Identity Proof' },
                          { label: 'Address Proof', value: 'Address Proof' },
                          { label: 'Educational', value: 'Educational' },
                          { label: 'Experience', value: 'Experience' },
                          { label: 'Other', value: 'Other' }
                        ]}
                        disabled={readOnly}
                      />
                    )}
                  />
                  {docErrors?.documentCategory && <p className="text-red-500 text-xs mt-1">{docErrors.documentCategory.message}</p>}
                </div>
                <div>
                  <label className={formStyles.label}>Document Name *</label>
                  <Input type="text" {...register(`documents.${index}.documentName`)} disabled={readOnly} />
                  {docErrors?.documentName && <p className="text-red-500 text-xs mt-1">{docErrors.documentName.message}</p>}
                </div>

                {/* Row: File Upload | Expiry Date */}
                <div>
                  <label className={formStyles.label}>File Upload *</label>
                  <Input type="file" {...register(`documents.${index}.fileUrl`)} disabled={readOnly} />
                </div>
                <div>
                  <label className={formStyles.label}>Expiry Date</label>
                  <CustomDatePicker name={`documents.${index}.expiryDate`} disabled={readOnly} />
                </div>
              </FormGrid>
            </div>
          );
        })}
      </div>
    </div>
  );
}
