import { useFormContext, useWatch } from 'react-hook-form';

interface Props {
  readOnly?: boolean;
}

export default function POTotalsSection({ readOnly }: Props) {
  const { control, register } = useFormContext();
  const grandTotal = useWatch({ control, name: 'grandTotal', defaultValue: 0 });

  return (
    <div className="pt-6 border-t border-gray-200 dark:border-white/10 space-y-6">
      {/* Grand Total Summary */}
      <div className="flex flex-col md:flex-row justify-end">
        <div className="w-full md:w-72 bg-gray-50 dark:bg-white/[0.02] rounded-sm border border-gray-200 dark:border-white/10 p-4 space-y-3">
          <div className="flex justify-between items-center text-base font-bold">
            <span className="text-gray-900 dark:text-white">Grand Total</span>
            <span className="text-[#792359] dark:text-[#c44997]">
              ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
            Sum of all line item amounts (Qty × Unit Price). Taxes, if applicable, to be computed separately.
          </p>
        </div>
      </div>

      {/* Internal Notes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2 mb-3">
          Internal Notes
        </h3>
        <div className="relative">
          <textarea
            {...register('internalNotes')}
            disabled={readOnly}
            placeholder="Add any internal notes, remarks or approval comments here (optional)..."
            rows={4}
            className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
