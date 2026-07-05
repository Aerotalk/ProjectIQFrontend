import { Plus, Search, Filter, Download, MoreHorizontal, FileText } from 'lucide-react';

const POS = [
  { id: 'PO-2026-001', vendor: 'CloudTech Systems', project: 'PRJ-1001 (Cloud Migration)', amount: '₹12,00,000', date: '01-Jul-2026', status: 'Approved' },
  { id: 'PO-2026-002', vendor: 'Nexus Hardware', project: 'PRJ-1003 (Network Setup)', amount: '₹10,00,000', date: '02-Jul-2026', status: 'Pending' },
  { id: 'PO-2026-003', vendor: 'CloudTech Systems', project: 'PRJ-1002 (ERP Implementation)', amount: '₹8,00,000', date: '03-Jul-2026', status: 'Draft' },
];

export default function POManagement() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage vendor purchase orders linked to projects</p>
        </div>
        <button className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} /> Create PO
        </button>
      </div>

      <div className="bg-white dark:bg-[#181a1f] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-black/10">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search POs by number or vendor..." className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:outline-none focus:ring-1 focus:ring-[#792359]" />
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
                <th className="px-6 py-4">PO Number</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Project Linked</th>
                <th className="px-6 py-4">PO Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {POS.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#792359] dark:text-[#e6a8d0] flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      {po.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{po.vendor}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{po.project}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{po.date}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{po.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-sm 
                      ${po.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        po.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'}`}>
                      {po.status}
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
