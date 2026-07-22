"use no memo";
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/ui/CustomSelect';

interface Props {
  readOnly?: boolean;
}

export default function KBFormSection({ readOnly }: Props) {
  const { register, control, watch, formState: { errors } } = useFormContext();

  const labelClass = 'block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1';
  const fieldClass = (hasError: boolean) => 
    `w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white ` +
    `focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors appearance-none ` +
    `disabled:opacity-60 disabled:cursor-not-allowed ` +
    (hasError ? 'border-red-500' : 'border-gray-300 dark:border-white/10');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2 mb-4">
          Article Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="md:col-span-2">
            <label className={labelClass}>Title {readOnly ? '' : '*'}</label>
            {readOnly ? (
              <p className="text-sm text-gray-900 dark:text-white mt-1 font-medium">{watch('title') || '-'}</p>
            ) : (
              <>
                <Input 
                  type="text" 
                  {...register('title')} 
                  placeholder="e.g. How to reset your password"
                  className={`${errors.title ? 'border-red-500' : ''}`} 
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
              </>
            )}
          </div>

          <div>
            <label className={labelClass}>Category {readOnly ? '' : '*'}</label>
            {readOnly ? (
              <p className="text-sm text-gray-900 dark:text-white mt-1">{watch('category') || '-'}</p>
            ) : (
              <>
                <Input 
                  type="text" 
                  {...register('category')} 
                  placeholder="e.g. General"
                  className={`${errors.category ? 'border-red-500' : ''}`} 
                />
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message as string}</p>}
              </>
            )}
          </div>

          <div>
            <label className={labelClass}>Status {readOnly ? '' : '*'}</label>
            {readOnly ? (
              <div className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                  watch('status') === 'Published' ? 'text-green-700 bg-green-50 dark:bg-green-500/10' :
                  'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-800'
                }`}>
                  {watch('status') || 'Draft'}
                </span>
              </div>
            ) : (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={['Draft', 'Published']}
                  />
                )}
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Content {readOnly ? '' : '*'}</label>
            {readOnly ? (
              <div className="text-sm text-gray-800 dark:text-gray-200 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-md border border-gray-100 dark:border-white/5">
                {watch('content') || '-'}
              </div>
            ) : (
              <>
                <textarea 
                  {...register('content')} 
                  rows={8}
                  placeholder="Write your article content here..."
                  className={fieldClass(!!errors.content)}
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message as string}</p>}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

