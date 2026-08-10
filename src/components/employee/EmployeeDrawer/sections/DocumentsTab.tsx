import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { formStyles } from '@/components/ui/form-styles';
import { FormGrid } from '@/components/ui/FormLayout';
import { useState } from 'react';
import { api } from '../../../../lib/api';

interface Props {
 readOnly?: boolean;
}

export default function DocumentsTab({ readOnly }: Props) {
  const { register, control, setValue, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents"
  });

  // Track upload state per document index
  const [uploadingIdx, setUploadingIdx] = useState<Record<number, boolean>>({});

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(prev => ({ ...prev, [index]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('module', 'employee_documents');
      const res = await api.request('/admin/files/upload', { method: 'POST', data: formData });
      if (res?.id) {
        setValue(`documents.${index}.fileUrl`, res.id);
      }
    } catch (err) {
      console.warn('Document upload failed', err);
    } finally {
      setUploadingIdx(prev => ({ ...prev, [index]: false }));
    }
  };

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
            className="flex items-center gap-1.5 text-sm font-medium text-primary dark:text-secondary hover:bg-primary/5 px-2 py-1 rounded-sm transition-colors"
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
          const fileUuid = watch(`documents.${index}.fileUrl`);
          const isUploading = uploadingIdx[index];
  return (
  <div key={item.id} className="p-4 bg-gray-50 dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5 relative group">
  {!readOnly && (
  <button
  type="button"
  onClick={() => remove(index)}
  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10"
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
  <label className={formStyles.label}>File Upload</label>
  {!readOnly && (
   <div className="space-y-1">
    <input
     type="file"
     onChange={(e) => handleFileUpload(index, e)}
     disabled={isUploading}
     className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
    />
    {isUploading && (
     <p className="text-xs text-gray-400 flex items-center gap-1">
      <Loader2 size={10} className="animate-spin" /> Uploading...
     </p>
    )}
    {fileUuid && typeof fileUuid === 'string' && !isUploading && (
     <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
      <CheckCircle2 size={10} /> File uploaded
     </p>
    )}
   </div>
  )}
  {readOnly && fileUuid && (
   <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
    <Upload size={10} /> File attached
   </p>
  )}
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
