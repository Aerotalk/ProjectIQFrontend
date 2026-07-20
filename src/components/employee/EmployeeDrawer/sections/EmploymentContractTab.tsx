import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function EmploymentContractTab({ readOnly }: Props) {
  const { register } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
        Employment Contract
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Contract Type</label>
          <select {...register('contractType')} disabled={readOnly} className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white">
            <option value="">Select Type</option>
            <option value="Permanent">Permanent</option>
            <option value="Fixed Term">Fixed Term</option>
            <option value="Consultant">Consultant</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div className="hidden md:block"></div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Start Date</label>
          <Input type="date" {...register('contractStartDate')} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">End Date</label>
          <Input type="date" {...register('contractEndDate')} disabled={readOnly} />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Annual CTC</label>
          <Input type="number" step="0.01" {...register('contractAnnualCTC', { valueAsNumber: true })} disabled={readOnly} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Notice Period (Days)</label>
          <Input type="number" {...register('contractNoticePeriod', { valueAsNumber: true })} disabled={readOnly} />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Contract Terms</label>
          <textarea
            {...register('contractTerms')}
            disabled={readOnly}
            rows={3}
            className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] dark:text-white resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Signed Contract Upload</label>
          <Input type="file" {...register('signedContractUpload')} disabled={readOnly} />
        </div>
      </div>
    </div>
  );
}
