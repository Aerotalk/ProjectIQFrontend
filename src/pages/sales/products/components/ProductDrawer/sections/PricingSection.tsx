import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function PricingSection({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Step 2 — Pricing & Unit
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Standard Rate (₹) *</label>
          <Input 
            type="number" 
            step="0.01"
            {...register('standardRate', { valueAsNumber: true })} 
            disabled={readOnly}
            className={`${errors.standardRate ? 'border-red-500' : ''}`} 
          />
          {errors.standardRate && <p className="text-red-500 text-xs mt-1">{errors.standardRate.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Unit of Measure *</label>
          <select 
            {...register('unit')} 
            disabled={readOnly}
            className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors ${errors.unit ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`}
          >
            <option value="">Select Unit</option>
            <option value="Pieces">Pieces (pcs)</option>
            <option value="Numbers">Numbers (nos)</option>
            <option value="Kilograms">Kilograms (kg)</option>
            <option value="Liters">Liters (ltr)</option>
            <option value="Meters">Meters (m)</option>
            <option value="Months">Months</option>
            <option value="Hours">Hours</option>
            <option value="Days">Days</option>
            <option value="Services">Services</option>
          </select>
          {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit.message as string}</p>}
        </div>
      </div>
    </div>
  );
}
