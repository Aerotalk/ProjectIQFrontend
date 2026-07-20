import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function PositionChangeTab({ readOnly }: Props) {
  const { register } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
        Position Change
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Change Type</label>
          <select {...register('positionChangeType')} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
            <option value="">Select Type</option>
            <option value="Promotion">Promotion</option>
            <option value="Demotion">Demotion</option>
            <option value="Transfer">Transfer</option>
            <option value="Role Change">Role Change</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Effective Date</label>
          <Input type="date" {...register('positionChangeEffectiveDate')} disabled={readOnly} />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">New Department</label>
          <Input type="text" {...register('positionChangeDepartmentId')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">New Designation</label>
          <Input type="text" {...register('positionChangeDesignationId')} disabled={readOnly} />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">New Grade / Band</label>
          <Input type="text" {...register('positionChangeGrade')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">New Location</label>
          <Input type="text" {...register('positionChangeLocation')} disabled={readOnly} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">New Reporting Manager</label>
          <Input type="text" {...register('positionChangeReportingManagerId')} disabled={readOnly} />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Remarks</label>
          <textarea
            {...register('positionChangeRemarks')}
            disabled={readOnly}
            rows={3}
            className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white resize-none"
          />
        </div>
      </div>
    </div>
  );
}
