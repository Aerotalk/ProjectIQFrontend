import { useFormContext, useWatch } from 'react-hook-form';

interface Props {
  readOnly?: boolean;
}

// Basic Indian Number System to Words converter
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const numStr = num.toString();
  if (numStr.length > 9) return 'Amount too large';

  const n = ('000000000' + numStr).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';

  let str = '';
  str += (n[1] != '00') ? (a[Number(n[1])] || b[n[1][0] as any] + ' ' + a[n[1][1] as any]) + 'Crore ' : '';
  str += (n[2] != '00') ? (a[Number(n[2])] || b[n[2][0] as any] + ' ' + a[n[2][1] as any]) + 'Lakh ' : '';
  str += (n[3] != '00') ? (a[Number(n[3])] || b[n[3][0] as any] + ' ' + a[n[3][1] as any]) + 'Thousand ' : '';
  str += (n[4] != '0') ? (a[Number(n[4])] || b[n[4][0] as any] + ' ' + a[n[4][1] as any]) + 'Hundred ' : '';
  str += (n[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0] as any] + ' ' + a[n[5][1] as any]) : '';
  
  return str.trim() + ' Rupees Only';
}

export default function TotalsSection({ readOnly }: Props) {
  const { control } = useFormContext();

  const subTotal = useWatch({ control, name: 'subTotal', defaultValue: 0 });
  const totalDiscount = useWatch({ control, name: 'totalDiscount', defaultValue: 0 });
  const totalTaxableAmount = useWatch({ control, name: 'totalTaxableAmount', defaultValue: 0 });
  const totalGstAmount = useWatch({ control, name: 'totalGstAmount', defaultValue: 0 });
  const grandTotal = useWatch({ control, name: 'grandTotal', defaultValue: 0 });

  return (
    <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between gap-6">
      
      {/* Amount in words and Notes */}
      <div className="flex-1 space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount in Words</h4>
          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
            {numberToWords(Math.round(grandTotal))}
          </p>
        </div>
      </div>

      {/* Totals Grid */}
      <div className="w-full md:w-80 space-y-3 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-sm border border-gray-200 dark:border-white/10">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Sub Total</span>
          <span className="font-medium text-gray-900 dark:text-white">₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total Discount</span>
          <span className="font-medium text-gray-900 dark:text-white">₹{totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Taxable Amount</span>
          <span className="font-medium text-gray-900 dark:text-white">₹{totalTaxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm border-b border-gray-200 dark:border-white/10 pb-3">
          <span className="text-gray-600 dark:text-gray-400">Total GST</span>
          <span className="font-medium text-gray-900 dark:text-white">₹{totalGstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-gray-200 dark:border-white/10 pb-3">
          <span className="text-gray-600 dark:text-gray-400">Delivery Cost</span>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">₹</span>
            <input 
              type="number" 
              {...useFormContext().register('deliveryCost', { valueAsNumber: true })}
              disabled={readOnly}
              className="w-24 px-2 py-1 text-right bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 hide-arrows" 
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
