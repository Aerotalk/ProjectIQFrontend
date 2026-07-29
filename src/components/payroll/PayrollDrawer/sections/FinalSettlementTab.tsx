import { useFormContext } from 'react-hook-form';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { Calculator } from 'lucide-react';
import { formStyles } from '../../../ui/form-styles';
import CustomDatePicker from '../../../ui/CustomDatePicker';

interface Props {
  readOnly?: boolean;
}

export default function FinalSettlementTab({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext<PayrollFormValues>();

  return (
    <div className="space-y-6">
      <FormSection title="Final Settlement" description="Process full and final (FnF) settlement for exiting employees.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Employee *
            </label>
            <Input
              {...register('finalSettlement.employee')}
              placeholder="Search exiting employee..."
              disabled={readOnly}
              className={errors.finalSettlement?.employee ? 'border-red-500' : ''}
            />
            {errors.finalSettlement?.employee && (
              <p className="text-xs text-red-500">{errors.finalSettlement.employee.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Settlement Date *
            </label>
            <CustomDatePicker
              name="finalSettlement.settlementDate"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Last Working Date *
            </label>
            <CustomDatePicker
              name="finalSettlement.lastWorkingDate"
              disabled={readOnly}
            />
          </div>
        </FormGrid>
      </FormSection>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calculator size={16} className="text-gray-500" /> Auto-Calculated Settlement Items
        </h3>
        <div className="border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-4 py-3">Item Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Calculated Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-[#181a1f]">
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Leave Encashment</td>
                <td className="px-4 py-3 text-gray-500">Unused PL (12 days)</td>
                <td className="px-4 py-3 text-right text-green-600 font-medium">+₹18,500.00</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Notice Period Recovery</td>
                <td className="px-4 py-3 text-gray-500">Shortfall of 15 days</td>
                <td className="px-4 py-3 text-right text-red-500 font-medium">-₹22,000.00</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Gratuity</td>
                <td className="px-4 py-3 text-gray-500">Completed 6 years</td>
                <td className="px-4 py-3 text-right text-green-600 font-medium">+₹85,000.00</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Loan Outstanding</td>
                <td className="px-4 py-3 text-gray-500">Personal Loan recovery</td>
                <td className="px-4 py-3 text-right text-red-500 font-medium">-₹50,000.00</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-white/[0.02]">
                <td colSpan={2} className="px-4 py-4 font-bold text-gray-900 dark:text-white text-right">Net Settlement Amount</td>
                <td className="px-4 py-4 text-right font-bold text-primary dark:text-secondary text-lg">₹31,500.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
