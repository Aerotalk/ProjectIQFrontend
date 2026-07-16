import { useFormContext, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

const UNIT_OPTIONS = [
  'Pieces', 'Units', 'Nos', 'Sets', 'Boxes', 'Packs',
  'Kg', 'Grams', 'Litres', 'Metres', 'Sqft',
  'Hours', 'Days', 'Months', 'Year',
  'Licenses', 'Subscriptions', 'Service', 'MB', 'GB', 'TB',
  'SMS', 'Domains', 'Instances', 'TB/Month', 'GB/Month',
];

interface Props {
  readOnly?: boolean;
}

export default function POLineItemsSection({ readOnly }: Props) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  const lineItems = useWatch({ control, name: 'lineItems', defaultValue: [] });

  const lineItemsError = errors.lineItems as { message?: string } | undefined;

  const cellClass = `px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-white/[0.02]`;

  const addNewItem = () => {
    append({
      id: undefined,
      description: '',
      quantity: 1,
      unit: 'Pieces',
      unitPrice: 0,
      totalAmount: 0,
    });
  };

  return (
    <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-white/10">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Line Items
        </h3>
        {!readOnly && (
          <button
            type="button"
            onClick={addNewItem}
            className="flex items-center gap-1 text-xs font-medium text-[#792359] hover:text-[#52173c] dark:text-[#c44997] dark:hover:text-[#db6cb3] transition-colors"
          >
            <Plus size={14} /> Add Item
          </button>
        )}
      </div>

      {lineItemsError?.message && (
        <p className="text-red-500 text-xs">{lineItemsError.message}</p>
      )}

      <div className="overflow-x-auto rounded-sm border border-gray-200 dark:border-white/10">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-[35%]">
                Description
              </th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-[12%]">
                Qty
              </th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-[16%]">
                Unit
              </th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-[18%]">
                Unit Price (₹)
              </th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right w-[16%]">
                Total (₹)
              </th>
              {!readOnly && (
                <th className="px-3 py-2.5 w-10"></th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {fields.map((field, index) => {
              const currentTotal = lineItems?.[index]?.totalAmount || 0;
              const lineErrors = (errors.lineItems as any)?.[index];

              return (
                <tr key={field.id} className="group">
                  {/* Description */}
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      {...register(`lineItems.${index}.description`)}
                      disabled={readOnly}
                      placeholder="Item description"
                      className={`${cellClass} ${lineErrors?.description ? 'border-red-400' : ''}`}
                    />
                    {lineErrors?.description && (
                      <p className="text-red-500 text-[10px] mt-0.5">{lineErrors.description.message}</p>
                    )}
                  </td>

                  {/* Quantity */}
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                      disabled={readOnly}
                      className={`${cellClass} ${lineErrors?.quantity ? 'border-red-400' : ''}`}
                    />
                    {lineErrors?.quantity && (
                      <p className="text-red-500 text-[10px] mt-0.5">{lineErrors.quantity.message}</p>
                    )}
                  </td>

                  {/* Unit */}
                  <td className="px-3 py-2">
                    <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
                      <Controller
                        name={`lineItems.${index}.unit`}
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            value={field.value || 'Pieces'}
                            onChange={field.onChange}
                            options={UNIT_OPTIONS.map(u => ({ label: u, value: u }))}
                          />
                        )}
                      />
                    </div>
                  </td>

                  {/* Unit Price */}
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register(`lineItems.${index}.unitPrice`, { valueAsNumber: true })}
                      disabled={readOnly}
                      className={`${cellClass} ${lineErrors?.unitPrice ? 'border-red-400' : ''}`}
                    />
                    {lineErrors?.unitPrice && (
                      <p className="text-red-500 text-[10px] mt-0.5">{lineErrors.unitPrice.message}</p>
                    )}
                  </td>

                  {/* Total (read-only, auto-calculated) */}
                  <td className="px-3 py-2 text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {currentTotal.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>

                  {/* Remove */}
                  {!readOnly && (
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}

            {fields.length === 0 && (
              <tr>
                <td
                  colSpan={readOnly ? 5 : 6}
                  className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500"
                >
                  {readOnly ? 'No line items.' : (
                    <span>
                      No items added yet.{' '}
                      <button
                        type="button"
                        onClick={addNewItem}
                        className="text-[#792359] dark:text-[#c44997] font-medium hover:underline"
                      >
                        Add the first item
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
