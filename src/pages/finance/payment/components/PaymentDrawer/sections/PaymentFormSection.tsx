"use no memo";
import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { useProjects } from '@/hooks/useProjects';
import { useMemo } from 'react';
import { AutoNumberInput } from '@/components/shared/AutoNumberSettings';

interface Props {
  readOnly?: boolean;
  nextNumber?: number;
}

const PAYMENT_METHODS = [
  { label: 'Bank Transfer', value: 'Bank Transfer' },
  { label: 'Credit Card', value: 'Credit Card' },
  { label: 'Cash', value: 'Cash' },
  { label: 'Cheque', value: 'Cheque' },
  { label: 'UPI', value: 'UPI' }
];

const STATUS_OPTIONS = [
  { label: 'Completed', value: 'Completed' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Refunded', value: 'Refunded' }
];

export default function PaymentFormSection({ readOnly, nextNumber }: Props) {
  const { control, register, formState: { errors } } = useFormContext();
  const { projects } = useProjects();

  const PROJECT_OPTIONS = useMemo(() => {
    return projects.map(p => ({ label: `${p.projectCode} - ${p.projectName}`, value: p.id }));
  }, [projects]);

  const fieldClass = (hasError: boolean) =>
    `w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white ` +
    `focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors appearance-none ` +
    `disabled:opacity-60 disabled:cursor-not-allowed ` +
    (hasError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-white/10');

  const labelClass = 'block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2 mb-4">
          Payment Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Payment Number */}
          <div>
            <label className={labelClass}>
              Payment Number <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <AutoNumberInput
              name="paymentNo"
              disabled={readOnly}
              placeholder="e.g. PAY/2026/001"
              defaultPrefix="PAY/2026/"
              nextNumber={nextNumber}
              className={fieldClass(!!errors.paymentNo)}
            />
            {errors.paymentNo && (
              <p className="text-red-500 text-xs mt-1">{errors.paymentNo.message as string}</p>
            )}
          </div>

          {/* Project */}
          <div>
            <label className={labelClass}>
              Project <span className="text-gray-400 normal-case font-normal">(Optional)</span>
            </label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={PROJECT_OPTIONS}
                  />
                )}
              />
            </div>
            {errors.projectId && (
              <p className="text-red-500 text-xs mt-1">{errors.projectId.message as string}</p>
            )}
          </div>

          {/* Linked Invoice */}
          <div>
            <label className={labelClass}>
              Linked Invoice <span className="text-gray-400 normal-case font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              {...register('linkedInvoiceNumber')}
              disabled={readOnly}
              placeholder="e.g. INV-2026-001"
              className={fieldClass(!!errors.linkedInvoiceNumber)}
            />
          </div>

          {/* Payment Date */}
          <div>
            <label className={labelClass}>
              Payment Date <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                {...register('paymentDate')}
                disabled={readOnly}
                className={fieldClass(!!errors.paymentDate) + " [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:pr-8 [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"}
              />
            </div>
            {errors.paymentDate && (
              <p className="text-red-500 text-xs mt-1">{errors.paymentDate.message as string}</p>
            )}
          </div>

          {/* Amount Paid */}
          <div>
            <label className={labelClass}>
              Amount Paid (₹) <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amountPaid', { valueAsNumber: true })}
              disabled={readOnly}
              placeholder="0.00"
              className={fieldClass(!!errors.amountPaid)}
            />
            {errors.amountPaid && (
              <p className="text-red-500 text-xs mt-1">{errors.amountPaid.message as string}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className={labelClass}>
              Payment Method <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={PAYMENT_METHODS}
                  />
                )}
              />
            </div>
          </div>

          {/* Reference ID */}
          <div>
            <label className={labelClass}>
              Reference / Transaction ID
            </label>
            <input
              type="text"
              {...register('referenceId')}
              disabled={readOnly}
              placeholder="e.g. TXN12345678"
              className={fieldClass(!!errors.referenceId)}
            />
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>
              Status <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={STATUS_OPTIONS}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2 mb-4">
          Notes
        </h3>
        <div>
          <textarea
            {...register('notes')}
            disabled={readOnly}
            placeholder="Add any additional notes here..."
            rows={3}
            className={fieldClass(false) + " resize-none"}
          />
        </div>
      </div>
    </div>
  );
}

