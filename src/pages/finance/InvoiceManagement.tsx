import { Plus, Search, Filter, Download, MoreHorizontal, FileCheck } from 'lucide-react';

const INVOICES = [
  { id: 'INV-2026-501', customer: 'TechNova Pvt Ltd', project: 'PRJ-1001 (Cloud Migration)', date: '01-Jul-2026', due: '15-Jul-2026', value: '₹30,00,000', status: 'Partially Paid' },
  { id: 'INV-2026-502', customer: 'GlobalCorp', project: 'PRJ-1002 (ERP Implementation)', date: '05-Jul-2026', due: '20-Jul-2026', value: '₹50,00,000', status: 'Sent' },
  { id: 'INV-2026-503', customer: 'Nexus Ind', project: 'PRJ-1003 (Network Setup)', date: '10-Jul-2026', due: '25-Jul-2026', value: '₹10,00,000', status: 'Draft' },
];

export default function InvoiceManagement() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Generate and track client invoices</p>
        </div>
        <button className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} /> Generate Invoice
        </button>
      </div>

      <div className="bg-white dark:bg-[#181a1f] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-black/10">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search Invoices..." className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:outline-none focus:ring-1 focus:ring-[#792359]" />
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
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Invoice Date</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Invoice Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#792359] dark:text-[#e6a8d0] flex items-center gap-2">
                      <FileCheck size={14} className="text-gray-400" />
                      {inv.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{inv.customer}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{inv.project}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{inv.date}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{inv.due}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{inv.value}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-sm 
                      ${inv.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        inv.status === 'Partially Paid' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                        inv.status === 'Sent' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        inv.status === 'Overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'}`}>
                      {inv.status}
                    </span>
                  </td>
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
