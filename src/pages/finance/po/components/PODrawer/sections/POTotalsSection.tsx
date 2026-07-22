"use no memo";
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { VendorService } from '@/services/vendor.service';
import { numberToWords, cn } from '@/lib/utils';
import { formStyles } from '@/components/ui/form-styles';

interface Props {
  readOnly?: boolean;
}

export default function POTotalsSection({ readOnly }: Props) {
  const { control, register } = useFormContext();
  const { selectedCompanyId } = useAuth();
  
  const [company, setCompany] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCompanyId) {
      api.get(`/admin/companies/${selectedCompanyId}`)
         .then(res => setCompany(res.data || res))
         .catch(console.error);
      VendorService.getVendors(selectedCompanyId)
         .then(setVendors)
         .catch(console.error);
    }
  }, [selectedCompanyId]);

  const subTotal = useWatch({ control, name: 'subTotal', defaultValue: 0 });
  const totalDiscount = useWatch({ control, name: 'totalDiscount', defaultValue: 0 });
  const totalTaxableAmount = useWatch({ control, name: 'totalTaxableAmount', defaultValue: 0 });
  const grandTotal = useWatch({ control, name: 'grandTotal', defaultValue: 0 });
  
  const vendorId = useWatch({ control, name: 'vendorId' });
  const lineItems = useWatch({ control, name: 'lineItems', defaultValue: [] });

  const companyState = company?.addresses?.[0]?.state?.trim().toLowerCase() || '';
  const selectedVendor = vendors.find(v => v.id === vendorId);
  const vendorState = selectedVendor?.billingState?.trim().toLowerCase() || '';
  const isSameState = companyState && vendorState && companyState === vendorState;

  const taxGroups: Record<number, { taxable: number, taxAmount: number }> = {};
  lineItems.forEach((item: any) => {
    if (item.gstRate > 0) {
      if (!taxGroups[item.gstRate]) taxGroups[item.gstRate] = { taxable: 0, taxAmount: 0 };
      const qty = item.quantity || 0;
      const rate = item.rate || 0;
      const discType = item.discountType || 'FLAT';
      const disc = item.discount || 0;
      
      const rowSubTotal = qty * rate;
      const discountAmount = discType === 'PERCENTAGE' ? (rowSubTotal * disc / 100) : disc;
      const taxable = Math.max(0, rowSubTotal - discountAmount);
      
      taxGroups[item.gstRate].taxable += taxable;
      taxGroups[item.gstRate].taxAmount += (taxable * (item.gstRate / 100));
    }
  });

  const uiTaxBreakdown: { type: string, rate: number, amount: number }[] = [];
  Object.keys(taxGroups).forEach(rateStr => {
    const rate = Number(rateStr);
    const group = taxGroups[rate];
    const halfRate = rate / 2;
    const halfAmount = group.taxAmount / 2;
    
    uiTaxBreakdown.push({ type: 'CGST', rate: halfRate, amount: isSameState ? halfAmount : 0 });
    uiTaxBreakdown.push({ type: 'SGST', rate: halfRate, amount: isSameState ? halfAmount : 0 });
    uiTaxBreakdown.push({ type: 'IGST', rate: rate, amount: isSameState ? 0 : group.taxAmount });
  });

  return (
    <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between gap-6">
      
      {/* Amount in words and Notes */}
      <div className="flex-1 space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount in Words</h4>
          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
            {numberToWords(grandTotal)}
          </p>
        </div>

        <div>
          <h3 className={cn(formStyles.sectionTitle, "mb-3 mt-6")}>
            Internal Notes
          </h3>
          <div className="relative">
            <textarea
              {...register('internalNotes')}
              disabled={readOnly}
              placeholder="Add any internal notes, remarks or approval comments here (optional)..."
              rows={4}
              className={formStyles.textarea(false, readOnly)}
            />
          </div>
        </div>
      </div>

      {/* Totals Grid */}
      <div className="w-full md:w-80 space-y-3 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-sm border border-gray-200 dark:border-white/10 self-start">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Sub Total</span>
          <span className="font-medium text-gray-900 dark:text-white">₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Discount</span>
          <span className="font-medium text-gray-900 dark:text-white">-₹{totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Taxable Amount</span>
          <span className="font-medium text-gray-900 dark:text-white">₹{totalTaxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        
        {uiTaxBreakdown.length > 0 ? (
          uiTaxBreakdown.map((tax, idx) => (
            <div key={idx} className={`flex justify-between text-sm ${idx === uiTaxBreakdown.length - 1 ? 'border-b border-gray-200 dark:border-white/10 pb-3' : ''}`}>
              <span className="text-gray-600 dark:text-gray-400">{tax.type} ({tax.rate}%)</span>
              <span className="font-medium text-gray-900 dark:text-white">₹{tax.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          ))
        ) : (
          <div className="flex justify-between text-sm border-b border-gray-200 dark:border-white/10 pb-3">
            <span className="text-gray-600 dark:text-gray-400">GST</span>
            <span className="font-medium text-gray-900 dark:text-white">₹0.00</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm border-b border-gray-200 dark:border-white/10 pb-3">
          <span className="text-gray-600 dark:text-gray-400">Delivery Cost</span>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">₹</span>
            <input 
              type="number" 
              {...register('deliveryCost', { valueAsNumber: true })}
              disabled={readOnly}
              className={cn(formStyles.field(false, readOnly), "w-24 px-2 py-1 text-right hide-arrows h-8")}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="flex justify-between text-base font-bold pt-1">
          <span className="text-gray-900 dark:text-white">Grand Total</span>
          <span className="text-[#792359] dark:text-[#c44997]">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

    </div>
  );
}

