"use no memo";
import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { useProjects } from '@/hooks/useProjects';
import { useMemo } from 'react';
import { AutoNumberInput } from '@/components/shared/AutoNumberSettings';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import CustomDatePicker from '@/components/ui/CustomDatePicker';

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



  return (
    <div className="space-y-6">
      <FormSection title="Payment Details">
        <FormGrid>

          {/* Payment Number */}
          <div>
            <label className={formStyles.label}>
              Payment Number <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <AutoNumberInput
              name="paymentNo"
              disabled={readOnly}
              placeholder="e.g. PAY/2026/001"
              defaultPrefix="PAY/2026/"
              nextNumber={nextNumber}
              className={formStyles.field(!!errors.paymentNo, readOnly)}
            />
            {errors.paymentNo && (
              <p className="text-red-500 text-xs mt-1">{errors.paymentNo.message as string}</p>
            )}
          </div>

          {/* Project */}
          <div>
            <label className={formStyles.label}>
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
            <label className={formStyles.label}>
              Linked Invoice <span className="text-gray-400 normal-case font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              {...register('linkedInvoiceNumber')}
              disabled={readOnly}
              placeholder="e.g. INV-2026-001"
              className={formStyles.field(!!errors.linkedInvoiceNumber, readOnly)}
            />
          </div>

          {/* Payment Date */}
          <div>
            <label className={formStyles.label}>
              Payment Date <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <div className="relative">
              <CustomDatePicker name="paymentDate" disabled={readOnly} />
            </div>
            {errors.paymentDate && (
              <p className="text-red-500 text-xs mt-1">{errors.paymentDate.message as string}</p>
            )}
          </div>

          {/* Amount Paid */}
          <div>
            <label className={formStyles.label}>
              Amount Paid (₹) <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amountPaid', { valueAsNumber: true })}
              disabled={readOnly}
              placeholder="0.00"
              className={formStyles.field(!!errors.amountPaid, readOnly)}
            />
            {errors.amountPaid && (
              <p className="text-red-500 text-xs mt-1">{errors.amountPaid.message as string}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className={formStyles.label}>
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
            <label className={formStyles.label}>
              Reference / Transaction ID
            </label>
            <input
              type="text"
              {...register('referenceId')}
              disabled={readOnly}
              placeholder="e.g. TXN12345678"
              className={formStyles.field(!!errors.referenceId, readOnly)}
            />
          </div>

          {/* Status */}
          <div>
            <label className={formStyles.label}>
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
        </FormGrid>
      </FormSection>

      {/* Notes */}
      <FormSection title="Notes">
        <FormRow>
          <textarea
            {...register('notes')}
            disabled={readOnly}
            placeholder="Add any additional notes here..."
            rows={3}
            className={formStyles.textarea(false, readOnly)}
          />
        </FormRow>
      </FormSection>
    </div>
  );
}

