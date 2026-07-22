"use no memo";
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import SharedPhoneInput from '@/components/shared/SharedPhoneInput';
import { formStyles } from '@/components/ui/form-styles';
import { FormGrid } from '@/components/ui/FormLayout';

interface Props {
  readOnly?: boolean;
}

export default function AdditionalContacts({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalContacts'
  });

  return (
    <div className="space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Additional Contacts</h4>
        {!readOnly && (
          <button
            type="button"
            onClick={() => append({ name: '', email: '', phone: '', role: 'Other' })}
            className="flex items-center gap-1.5 text-xs font-medium text-[#792359] dark:text-[#e6a8d0] hover:text-[#52173c] dark:hover:text-[#f3c8e3] transition-colors"
          >
            <Plus size={14} /> Add Contact
          </button>
        )}
      </div>

      {fields.length === 0 && !readOnly && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">No additional contacts added.</p>
      )}

      <div className="space-y-4">
        {fields.map((item, index) => {
          // The errors object might have array errors
          const fieldErrors = (errors.additionalContacts as any)?.[index];

          return (
            <div key={item.id} className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-sm relative">
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
              
              <FormGrid className="pr-6">
                <div>
                  <label className={formStyles.label}>Name *</label>
                  <input 
                    type="text" 
                    {...register(`additionalContacts.${index}.name`)} 
                    disabled={readOnly}
                    className={formStyles.field(!!fieldErrors?.name, readOnly)} 
                  />
                  {fieldErrors?.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name.message}</p>}
                </div>

                <div>
                  <label className={formStyles.label}>Designation</label>
                  <input 
                    type="text" 
                    {...register(`additionalContacts.${index}.designation`)} 
                    disabled={readOnly}
                    className={formStyles.field(false, readOnly)} 
                  />
                </div>

                <div>
                  <label className={formStyles.label}>Email *</label>
                  <input 
                    type="email" 
                    {...register(`additionalContacts.${index}.email`)} 
                    disabled={readOnly}
                    className={formStyles.field(!!fieldErrors?.email, readOnly)} 
                  />
                  {fieldErrors?.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={formStyles.label}>Phone *</label>
                    <SharedPhoneInput
                      name={`additionalContacts.${index}.phone`}
                      disabled={readOnly}
                      defaultCountry="IN"
                      className={fieldErrors?.phone ? '[&>input]:border-red-500' : ''}
                    />
                    {fieldErrors?.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone.message}</p>}
                  </div>
                  <div>
                    <label className={formStyles.label}>Role</label>
                    <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
                      <Controller
                        name={`additionalContacts.${index}.role`}
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            value={field.value || 'Other'}
                            onChange={field.onChange}
                            options={[
                              { label: 'Billing', value: 'Billing' },
                              { label: 'Purchase', value: 'Purchase' },
                              { label: 'Technical', value: 'Technical' },
                              { label: 'Other', value: 'Other' }
                            ]}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </FormGrid>
            </div>
          );
        })}
      </div>
    </div>
  );
}
