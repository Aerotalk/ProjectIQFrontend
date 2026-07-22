"use no memo";
import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { cn } from '@/lib/utils';

interface Props {
  readOnly?: boolean;
}

export default function PricingSection({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext();

  const UNITS = [
    'Piece (Nos)', 'Unit', 'Box', 'Carton', 'Packet', 'Pair', 'Set',
    'Kilogram (Kg)', 'Gram (g)', 'Metric Ton (MT)', 
    'Litre (L)', 'Millilitre (ml)',
    'Meter (m)', 'Centimeter (cm)', 'Millimeter (mm)', 
    'Square Meter (Sq. m)', 'Cubic Meter (Cu. m)',
    'Feet', 'Inch', 'Roll', 'Bundle', 'Bag', 'Bottle', 'Can', 
    'Hour', 'Day', 'Month'
  ];

  return (
    <FormSection title="Step 2 — Pricing & Unit">
      <FormGrid>
        <FormRow>
          <label className={formStyles.label}>
            Standard Rate (₹) <span className="text-[10px] text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          <input 
            type="number" 
            step="0.01"
            placeholder="0.00"
            {...register('standardRate', { valueAsNumber: true })} 
            disabled={readOnly}
            className={cn(formStyles.field(!!errors.standardRate, readOnly), "hide-arrows")} 
          />
          {errors.standardRate && <p className="text-red-500 text-xs mt-1">{errors.standardRate.message as string}</p>}
        </FormRow>

        <FormRow>
          <label className={formStyles.label}>Unit of Measure *</label>
          <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={UNITS}
                />
              )}
            />
          </div>
          {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit.message as string}</p>}
        </FormRow>
      </FormGrid>
    </FormSection>
  );
}
