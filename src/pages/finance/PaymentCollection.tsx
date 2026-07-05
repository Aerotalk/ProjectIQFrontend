import { Plus, Search, Filter, Download, MoreHorizontal, Landmark } from 'lucide-react';

const PAYMENTS = [
  { id: 'PAY-2026-901', invoice: 'INV-2026-501', customer: 'TechNova Pvt Ltd', value: '₹30,00,000', received: '₹15,00,000', tds: '₹3,00,000', outstanding: '₹12,00,000', date: '10-Jul-2026' },
  { id: 'PAY-2026-902', invoice: 'INV-2026-502', customer: 'GlobalCorp', value: '₹50,00,000', received: '₹0', tds: '₹0', outstanding: '₹50,00,000', date: '-' },
  { id: 'PAY-2026-903', invoice: 'INV-2026-503', customer: 'Nexus Ind', value: '₹10,00,000', received: '₹10,00,000', tds: '₹1,00,000', outstanding: '₹0', date: '12-Jul-2026' },
];

export default function PaymentCollection() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Collection</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Record and track payments received against invoices</p>
        </div>
        <button className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} /> Record Payment
        </button>
      </div>

      <div className="bg-white dark:bg-[#181a1f] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-black/10">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search Payments by Invoice or Customer..." className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:outline-none focus:ring-1 focus:ring-[#792359]" />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
              <Filter size={16} /> Filter
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Invoice Number</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Invoice Value</th>
                <th className="px-6 py-4">Received Amt</th>
                <th className="px-6 py-4">TDS Amt</th>
                <th className="px-6 py-4">Outstanding</th>
                <th className="px-6 py-4">Payment Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {PAYMENTS.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#792359] dark:text-[#e6a8d0] flex items-center gap-2">
                      <Landmark size={14} className="text-gray-400" />
                      {pay.invoice}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{pay.customer}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{pay.value}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">{pay.received}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{pay.tds}</td>
                  <td className="px-6 py-4 text-red-500 font-medium">{pay.outstanding}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{pay.date}</td>
                  <td className="px-6 py-4 text-center relative">
                    <button className="p-1 text-gray-400 hover:text-[#792359] dark:hover:text-[#e6a8d0] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
