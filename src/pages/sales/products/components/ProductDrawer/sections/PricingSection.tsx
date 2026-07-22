"use no memo";
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/ui/CustomSelect';

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
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Step 2 — Pricing & Unit
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Standard Rate (₹) <span className="text-[10px] text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          <Input 
            type="number" 
            step="0.01"
            placeholder="0.00"
            {...register('standardRate', { valueAsNumber: true })} 
            disabled={readOnly}
            className={`${errors.standardRate ? 'border-red-500' : ''}`} 
          />
          {errors.standardRate && <p className="text-red-500 text-xs mt-1">{errors.standardRate.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Unit of Measure *</label>
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
        </div>
      </div>
    </div>
  );
}
