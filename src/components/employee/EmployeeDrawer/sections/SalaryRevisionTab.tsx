import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function SalaryRevisionTab({ readOnly }: Props) {
  const { register } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
        Salary Revision
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Revision Type</label>
          <select {...register('revisionType')} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
            <option value="">Select Type</option>
            <option value="Annual Appraisal">Annual Appraisal</option>
            <option value="Mid-Year Appraisal">Mid-Year Appraisal</option>
            <option value="Promotion">Promotion</option>
            <option value="Correction">Correction</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Effective Date</label>
          <Input type="date" {...register('revisionEffectiveDate')} disabled={readOnly} />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Annual CTC</label>
          <Input type="number" step="0.01" {...register('revisionAnnualCTC', { valueAsNumber: true })} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Increment %</label>
          <Input type="number" step="0.01" {...register('revisionIncrementPercentage', { valueAsNumber: true })} disabled={readOnly} />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Salary Components Breakdown</label>
          <textarea
            {...register('revisionSalaryComponents')}
            disabled={readOnly}
            rows={3}
            className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white resize-none"
            placeholder="e.g. Basic: 40%, HRA: 20%, etc."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Reason</label>
          <Input type="text" {...register('revisionReason')} disabled={readOnly} />
        </div>
      </div>
    </div>
  );
}
