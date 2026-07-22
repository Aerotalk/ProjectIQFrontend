"use no memo";
import { useEffect, useState } from 'react';
import { useFormContext, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import { ProductService } from '../../../../../../services/product.service';
import type { Product } from '../../../../../../types/product.types';
import { useAuth } from '../../../../../../contexts/AuthContext';
import { getQuantityInputConfig } from '@/utils/unit';

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

  const { selectedCompanyId: companyId } = useAuth();

  useEffect(() => {
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
  }, [companyId]);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setValue(`lineItems.${index}.itemName`, product.itemName);
      setValue(`lineItems.${index}.hsnSac`, product.hsnSac || '');
      setValue(`lineItems.${index}.description`, product.description || '');
      setValue(`lineItems.${index}.unit`, product.unit);
      setValue(`lineItems.${index}.rate`, product.standardRate);
      setValue(`lineItems.${index}.gstRate`, parseFloat(product.gstRate) || 0); // e.g., "18%" -> 18
      setValue(`lineItems.${index}.quantity`, 1);
      setValue(`lineItems.${index}.discount`, 0);
      setValue(`lineItems.${index}.discountValue`, 0);
      setValue(`lineItems.${index}.discountType`, '₹');
    }
  };

  const lineItems = useWatch({ control, name: 'lineItems' });

  const cellClass = `px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-white/[0.02]`;

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Line Items
        </h3>
        {!readOnly && (
          <button 
            type="button" 
            onClick={() => append({ productId: '', itemName: '', hsnSac: '', quantity: 1, unit: 'Pieces', rate: 0, discount: 0, discountValue: 0, discountType: 'FLAT', gstRate: 0, taxableAmount: 0, gstAmount: 0, totalAmount: 0 })}
            className="flex items-center gap-1 text-xs font-medium text-[#792359] hover:text-[#52173c] dark:text-[#c44997] dark:hover:text-[#db6cb3]"
          >
            <Plus size={14} /> Add Item
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-sm border border-gray-200 dark:border-white/10 min-h-[250px]">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-[25%]">Product/Service</th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-[10%]">Qty</th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-[12%]">Unit</th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-[12%]">Rate (₹)</th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-[14%]">Discount</th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-[10%]">GST (%)</th>
              <th className="px-3 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right w-[15%]">Amount (₹)</th>
              {!readOnly && <th className="px-3 py-2.5 w-10"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {fields.map((field, index) => {
              const qty = lineItems?.[index]?.quantity || 0;
              const rate = lineItems?.[index]?.rate || 0;
              // Amount column shows pre-discount to mathematically align with SubTotal sum.
              const currentTotal = qty * rate;
              const unit = lineItems?.[index]?.unit || '';
              const unitConfig = getQuantityInputConfig(unit);
              return (
                <tr key={field.id} className="group relative" style={{ zIndex: 100 - index }}>
                  <td className="px-3 py-2 align-top">
                    <div className={`flex flex-col gap-2 ${readOnly || isLoadingProducts ? 'opacity-80 pointer-events-none' : ''}`}>
                      <div className="relative">
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
                              options={products.map(p => ({ 
                                label: p.itemName, 
                                value: p.id,
                                subLabel: `Rate: ₹${(p.standardRate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}${p.description ? ` • ${p.description}` : ''}`
                              }))}
                            />
                          )}
                        />
                        {isLoadingProducts && <Loader2 className="absolute right-8 top-2 w-3.5 h-3.5 animate-spin text-gray-400" />}
                      </div>
                      
                      <textarea 
                        placeholder="Description (optional)..." 
                        {...register(`lineItems.${index}.description`)} 
                        disabled={readOnly} 
                        rows={2}
                        className={`${cellClass} resize-y min-h-[40px] text-xs`} 
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input 
                      type="number" 
                      step={unitConfig.step} 
                      min={unitConfig.min} 
                      {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })} 
                      onKeyDown={(e) => {
                        if (unitConfig.isDiscrete && (e.key === '.' || e.key === 'e' || e.key === 'E')) {
                          e.preventDefault();
                        }
                      }}
                      disabled={readOnly} 
                      className={cellClass} 
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input type="text" {...register(`lineItems.${index}.unit`)} disabled={readOnly} className={`${cellClass} !bg-gray-50 dark:!bg-white/[0.02]`} readOnly />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input type="number" step="0.01" {...register(`lineItems.${index}.rate`, { valueAsNumber: true })} disabled={readOnly} className={cellClass} />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="flex items-stretch rounded-sm shadow-sm group/disc border border-gray-300 dark:border-white/10 overflow-hidden focus-within:border-[#792359] focus-within:ring-1 focus-within:ring-[#792359]">
                      <Controller
                        name={`lineItems.${index}.discountType`}
                        control={control}
                        render={({ field }) => (
                          <select 
                            {...field}
                            value={field.value || 'FLAT'}
                            disabled={readOnly}
                            className="bg-gray-50 dark:bg-black/20 text-sm font-medium text-gray-700 dark:text-gray-300 px-1.5 border-r border-gray-300 dark:border-white/10 outline-none cursor-pointer"
                          >
                            <option value="FLAT">₹</option>
                            <option value="PERCENTAGE">%</option>
                          </select>
                        )}
                      />
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="0"
                        {...register(`lineItems.${index}.discount`, { valueAsNumber: true })} 
                        disabled={readOnly} 
                        className="w-full px-2 py-1.5 text-sm bg-white dark:bg-[#0f1115] outline-none text-gray-900 dark:text-white min-w-0"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input type="number" {...register(`lineItems.${index}.gstRate`, { valueAsNumber: true })} disabled={readOnly} className={cellClass} />
                  </td>
                  <td className="px-3 py-2 text-right align-top">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white block mt-2">
                      {currentTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  {!readOnly && (
                    <td className="px-3 py-2 text-center align-top">
                      <button 
                        type="button" 
                        onClick={() => remove(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-sm hover:bg-red-50 dark:hover:bg-red-500/10 mt-1"
                      >
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
