import { useFormContext, Controller } from 'react-hook-form';
import { FormSection, FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import CustomSelect from '../../../ui/CustomSelect';
import type { PayrollFormValues } from '../validators/payrollValidation';
import { Users, Calculator, Wallet, Coins } from 'lucide-react';
import { formStyles } from '../../../ui/form-styles';
import CustomDatePicker from '../../../ui/CustomDatePicker';

interface Props {
  readOnly?: boolean;
}

export default function PayrollProcessingTab({ readOnly }: Props) {
  const { register, control, watch, formState: { errors } } = useFormContext<PayrollFormValues>();

  const scope = watch('payrollProcessing.employeeScope');

  const scopeOptions = [
    { value: 'All Employees', label: 'All Employees' },
    { value: 'Department', label: 'Specific Department' },
    { value: 'Selected Employees', label: 'Selected Employees' },
  ];

  const runTypeOptions = [
    { value: 'Regular', label: 'Regular Run' },
    { value: 'Supplementary', label: 'Supplementary Run' },
    { value: 'Arrears', label: 'Arrears Run' },
  ];

  return (
    <div className="space-y-6">
      <FormSection title="Payroll Processing" description="Configure parameters for the payroll run and review estimates.">
        <FormGrid>
          <div className="space-y-2">
            <label className={formStyles.label}>
              Payroll Period *
            </label>
            <CustomDatePicker
              name="payrollProcessing.payrollPeriod"
              disabled={readOnly}
            />
            {errors.payrollProcessing?.payrollPeriod && (
              <p className="text-xs text-red-500">{errors.payrollProcessing.payrollPeriod.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              Run Type *
            </label>
            <Controller
              name="payrollProcessing.runType"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={runTypeOptions}
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={readOnly}
                />
              )}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={formStyles.label}>
              Employee Scope *
            </label>
            <Controller
              name="payrollProcessing.employeeScope"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={scopeOptions}
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={readOnly}
                />
              )}
            />
          </div>

          {scope === 'Department' && (
            <div className="space-y-2 sm:col-span-2 animate-in fade-in slide-in-from-top-2">
              <label className={formStyles.label}>
                Select Department *
              </label>
              <Input
                {...register('payrollProcessing.departmentId')}
                placeholder="Search department..."
                disabled={readOnly}
              />
            </div>
          )}

          {scope === 'Selected Employees' && (
            <div className="space-y-2 sm:col-span-2 animate-in fade-in slide-in-from-top-2">
              <label className={formStyles.label}>
                Select Employees *
              </label>
              <Input
                placeholder="Search and add employees..."
                disabled={readOnly}
              />
              {/* Dummy tags area */}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-gray-100 dark:bg-white/10 text-xs rounded-full">John Doe ✕</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-white/10 text-xs rounded-full">Jane Smith ✕</span>
              </div>
            </div>
          )}
        </FormGrid>

        {/* Dummy Estimate Summary Panel */}
        <div className="mt-8 bg-[#f8f9fc] dark:bg-[#1a1c23] border border-gray-200 dark:border-white/10 rounded-md p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Run Estimate</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1f2229] p-4 rounded-sm border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-blue-500" />
                <span className="text-xs font-medium text-gray-500">Employee Count</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">142</p>
            </div>
            <div className="bg-white dark:bg-[#1f2229] p-4 rounded-sm border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={16} className="text-green-500" />
                <span className="text-xs font-medium text-gray-500">Est. Gross</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">₹13,80,000</p>
            </div>
            <div className="bg-white dark:bg-[#1f2229] p-4 rounded-sm border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Calculator size={16} className="text-orange-500" />
                <span className="text-xs font-medium text-gray-500">Est. Deductions</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">₹2,10,000</p>
            </div>
            <div className="bg-white dark:bg-[#1f2229] p-4 rounded-sm border border-gray-100 dark:border-white/5 shadow-sm ring-1 ring-[#792359]/30">
              <div className="flex items-center gap-2 mb-2">
                <Coins size={16} className="text-[#792359] dark:text-[#e6a8d0]" />
                <span className="text-xs font-bold text-[#792359] dark:text-[#e6a8d0]">Est. Net Salary</span>
              </div>
              <p className="text-xl font-bold text-[#792359] dark:text-[#e6a8d0]">₹11,70,000</p>
            </div>
          </div>
          {!readOnly && (
            <div className="mt-6 flex justify-end">
              <button type="button" className="px-6 py-2 bg-[#792359] hover:bg-[#52173c] text-white text-sm font-medium rounded-sm shadow-sm transition-colors">
                Process Payroll
              </button>
            </div>
          )}
        </div>
      </FormSection>
    </div>
  );
}
