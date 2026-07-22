import { useFormContext } from 'react-hook-form';
import { AutoNumberInput } from '@/components/shared/AutoNumberSettings';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { cn } from '@/lib/utils';

interface Props {
  readOnly?: boolean;
  nextNumber?: number;
}

export default function ProductIdentitySection({ readOnly, nextNumber }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection title="Step 1 — Product Identity" className="pt-0 border-t-0">
      <FormGrid>
        <FormRow>
          <label className={formStyles.label}>Item Type *</label>
          <div className="flex gap-4 mt-2">
            <label htmlFor="type-product" className="flex items-center gap-2 cursor-pointer">
              <input id="type-product" type="radio" value="Product" {...register('type')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Product</span>
            </label>
            <label htmlFor="type-service" className="flex items-center gap-2 cursor-pointer">
              <input id="type-service" type="radio" value="Service" {...register('type')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Service</span>
            </label>
          </div>
        </FormRow>

        <div className="hidden md:block"></div>

        <FormRow>
          <label className={formStyles.label}>
            Item Code <span className="text-[10px] text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          <AutoNumberInput 
            name="itemCode"
            disabled={readOnly}
            placeholder="e.g. ITEM-001"
            defaultPrefix="ITEM-"
            nextNumber={nextNumber}
            className={cn(formStyles.field(!!errors.itemCode, readOnly))} 
          />
          {errors.itemCode && <p className="text-red-500 text-xs mt-1">{errors.itemCode.message as string}</p>}
        </FormRow>

        <FormRow>
          <label className={formStyles.label}>Item Name *</label>
          <input 
            type="text" 
            {...register('itemName')} 
            disabled={readOnly}
            className={formStyles.field(!!errors.itemName, readOnly)} 
          />
          {errors.itemName && <p className="text-red-500 text-xs mt-1">{errors.itemName.message as string}</p>}
        </FormRow>

        <FormRow>
          <label className={formStyles.label}>Description</label>
          <textarea 
            {...register('description')} 
            disabled={readOnly}
            rows={3}
            className={formStyles.textarea(false, readOnly)} 
            placeholder="Detailed description of the product or service"
          />
        </FormRow>
      </FormGrid>
    </FormSection>
  );
}
