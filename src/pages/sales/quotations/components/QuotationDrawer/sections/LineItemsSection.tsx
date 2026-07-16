import { useEffect, useState } from 'react';
import { useFormContext, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import { ProductService } from '../../../../../../services/product.service';
import type { Product } from '../../../../../../types/product.types';

interface Props {
  readOnly?: boolean;
}

export default function LineItemsSection({ readOnly }: Props) {
  const { control, register, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems'
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (!companyId) {
      setIsLoadingProducts(false);
      return;
    }
    ProductService.getProducts(companyId).then((data) => {
      setProducts(data);
      setIsLoadingProducts(false);
    }).catch(() => {
      setIsLoadingProducts(false);
    });
  }, []);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setValue(`lineItems.${index}.itemName`, product.itemName);
      setValue(`lineItems.${index}.description`, product.description || '');
      setValue(`lineItems.${index}.unit`, product.unit);
      setValue(`lineItems.${index}.rate`, product.standardRate);
      setValue(`lineItems.${index}.gstRate`, parseFloat(product.gstRate) || 0); // e.g., "18%" -> 18
      setValue(`lineItems.${index}.quantity`, 1);
      setValue(`lineItems.${index}.discount`, 0);
    }
  };

  const lineItems = useWatch({ control, name: 'lineItems' });

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Line Items
        </h3>
        {!readOnly && (
          <button 
            type="button" 
            onClick={() => append({ productId: '', itemName: '', quantity: 1, unit: 'Pieces', rate: 0, discount: 0, gstRate: 0, taxableAmount: 0, gstAmount: 0, totalAmount: 0 })}
            className="flex items-center gap-1 text-xs font-medium text-[#792359] hover:text-[#52173c] dark:text-[#c44997] dark:hover:text-[#db6cb3]"
          >
            <Plus size={14} /> Add Item
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
              <th className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 w-1/4">Product/Service</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 w-24">Qty</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 w-24">Unit</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 w-32">Rate (₹)</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 w-24">Disc (₹)</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 w-24">GST (%)</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 w-32 text-right">Amount (₹)</th>
              {!readOnly && <th className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 w-10"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {fields.map((field, index) => {
              const currentTotal = lineItems?.[index]?.totalAmount || 0;
              return (
                <tr key={field.id} className="group">
                  <td className="px-3 py-2">
                    <div className={readOnly || isLoadingProducts ? 'opacity-80 pointer-events-none relative' : 'relative'}>
                      <Controller
                        name={`lineItems.${index}.productId`}
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            value={field.value || ''}
                            onChange={(val) => {
                              field.onChange(val);
                              handleProductChange(index, val);
                            }}
                            options={products.map(p => ({ label: p.itemName, value: p.id }))}
                          />
                        )}
                      />
                      {isLoadingProducts && <Loader2 className="absolute right-8 top-2 w-3.5 h-3.5 animate-spin text-gray-400" />}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" step="0.01" {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })} disabled={readOnly} className="w-full px-2 py-1.5 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm focus:ring-[#792359]/50" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="text" {...register(`lineItems.${index}.unit`)} disabled={readOnly} className="w-full px-2 py-1.5 bg-gray-50 dark:bg-white/[0.02] border border-gray-300 dark:border-white/10 rounded-sm text-sm" readOnly />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" step="0.01" {...register(`lineItems.${index}.rate`, { valueAsNumber: true })} disabled={readOnly} className="w-full px-2 py-1.5 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm focus:ring-[#792359]/50" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" step="0.01" {...register(`lineItems.${index}.discount`, { valueAsNumber: true })} disabled={readOnly} className="w-full px-2 py-1.5 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm focus:ring-[#792359]/50" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" {...register(`lineItems.${index}.gstRate`, { valueAsNumber: true })} disabled={readOnly} className="w-full px-2 py-1.5 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm focus:ring-[#792359]/50" />
                  </td>
                  <td className="px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {currentTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  {!readOnly && (
                    <td className="px-3 py-2 text-center">
                      <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {fields.length === 0 && (
              <tr>
                <td colSpan={readOnly ? 7 : 8} className="px-3 py-8 text-center text-sm text-gray-500">
                  No line items added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
