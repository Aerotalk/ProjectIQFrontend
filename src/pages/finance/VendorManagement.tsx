import { Plus, Search, Filter, Download, MoreHorizontal } from 'lucide-react';

const VENDORS = [
  { id: 'VND-001', name: 'CloudTech Systems', contact: 'John Doe', email: 'john@cloudtech.in', phone: '+91 98765 43210', gst: '27AADCC1234E1Z5', value: '₹40,00,000', status: 'Active' },
  { id: 'VND-002', name: 'Nexus Hardware', contact: 'Jane Smith', email: 'jane@nexus.com', phone: '+91 91234 56789', gst: '29ABCDE1234F2Z4', value: '₹15,00,000', status: 'Active' },
  { id: 'VND-003', name: 'Prime Consulting', contact: 'Raj Patel', email: 'raj@prime.in', phone: '+91 99887 76655', gst: '27QWERTY123G1Z3', value: '₹8,50,000', status: 'Inactive' },
];

export default function VendorManagement() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendor Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your vendors</p>
        </div>
        <button className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} /> Add Vendor
        </button>
      </div>

      <div className="bg-white dark:bg-[#181a1f] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-black/10">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search vendors by name or GST..." className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:outline-none focus:ring-1 focus:ring-[#792359]" />
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
                <th className="px-6 py-4">Vendor Name</th>
                <th className="px-6 py-4">Contact Person</th>
                <th className="px-6 py-4">Email & Phone</th>
                <th className="px-6 py-4">GST Number</th>
                <th className="px-6 py-4">Total PO Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {VENDORS.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#792359] dark:text-[#e6a8d0]">{v.name}</div>
                    <div className="text-xs text-gray-500">{v.id}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{v.contact}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white">{v.email}</div>
                    <div className="text-xs text-gray-500">{v.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono text-xs">{v.gst}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{v.value}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-sm ${v.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'}`}>
                      {v.status}
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
