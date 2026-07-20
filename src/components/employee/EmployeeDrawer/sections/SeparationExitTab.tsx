import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function SeparationExitTab({ readOnly }: Props) {
  const { register } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
        Separation / Exit
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Separation Type</label>
          <select {...register('separationType')} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
            <option value="">Select Type</option>
            <option value="Resignation">Resignation</option>
            <option value="Termination">Termination</option>
            <option value="Retirement">Retirement</option>
            <option value="Absconding">Absconding</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Resignation Date</label>
          <Input type="date" {...register('resignationDate')} disabled={readOnly} />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Last Working Date</label>
          <Input type="date" {...register('lastWorkingDate')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Notice Period Served (Days)</label>
          <Input type="number" {...register('exitNoticePeriod', { valueAsNumber: true })} disabled={readOnly} />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Reason</label>
          <Input type="text" {...register('separationReason')} disabled={readOnly} />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Remarks</label>
          <textarea
            {...register('separationRemarks')}
            disabled={readOnly}
            rows={3}
            className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white resize-none"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-2 mt-2">
          <input type="checkbox" id="exitInterview" {...register('exitInterview')} disabled={readOnly} className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
          <label htmlFor="exitInterview" className="text-sm text-gray-700 dark:text-gray-300">Exit Interview Completed</label>
        </div>
      </div>
    </div>
  );
}
