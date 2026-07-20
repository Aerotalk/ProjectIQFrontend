import { useFormContext, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

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
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-2">
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

      <div className="space-y-4">
        {fields.map((item, index) => {
          const docErrors = (errors.documents as any)?.[index];
          return (
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-8">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Document Category *</label>
                  <select {...register(`documents.${index}.documentCategory`)} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
                    <option value="">Select</option>
                    <option value="Identity Proof">Identity Proof</option>
                    <option value="Address Proof">Address Proof</option>
                    <option value="Educational">Educational</option>
                    <option value="Experience">Experience</option>
                    <option value="Other">Other</option>
                  </select>
                  {docErrors?.documentCategory && <p className="text-red-500 text-xs mt-1">{docErrors.documentCategory.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Document Name *</label>
                  <Input type="text" {...register(`documents.${index}.documentName`)} disabled={readOnly} />
                  {docErrors?.documentName && <p className="text-red-500 text-xs mt-1">{docErrors.documentName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">File Upload *</label>
                  <Input type="file" {...register(`documents.${index}.fileUrl`)} disabled={readOnly} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Expiry Date</label>
                  <Input type="date" {...register(`documents.${index}.expiryDate`)} disabled={readOnly} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
