import { useFormContext } from 'react-hook-form';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { Image as ImageIcon } from 'lucide-react';
import { formStyles } from '../../../ui/form-styles';

interface Props {
  readOnly?: boolean;
}

export default function PayrollConfigurationTab({ readOnly }: Props) {
  const { register } = useFormContext<PayrollFormValues>();
  
  return (
    <div className="space-y-8">
      {/* Payslip Templates */}
      <FormSection title="Payslip Templates" description="Configure HTML layouts for employee payslips.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Template Name *
            </label>
            <Input
              {...register('payrollConfiguration.templateName')}
              placeholder="e.g., Standard Professional"
              disabled={readOnly}
            />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>
              Layout HTML *
            </label>
            <textarea
              {...register('payrollConfiguration.layoutHTML')}
              disabled={readOnly}
              className="w-full h-32 p-3 text-sm font-mono bg-gray-50 dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="<div>Payslip HTML goes here...</div>"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>Preview Image</label>
            <div className="flex items-center gap-3">
              <div className="w-24 h-32 bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 rounded-sm flex items-center justify-center text-gray-400">
                <ImageIcon size={24} />
              </div>
              <div>
                <button type="button" disabled={readOnly} className="px-3 py-1.5 text-sm bg-white dark:bg-[#1f2229] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50">
                  Upload Preview
                </button>
                <p className="text-xs text-gray-500 mt-2">Upload a thumbnail of how this payslip looks.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('payrollConfiguration.setAsDefault')} disabled={readOnly} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary dark:border-gray-600 dark:bg-gray-700" />
              <span className={formStyles.label}>Set as Default Template</span>
            </label>
          </div>
        </FormGrid>
      </FormSection>
    </div>
  );
}
