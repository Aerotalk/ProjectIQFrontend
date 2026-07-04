import { Search, Filter, Plus, Download, MoreHorizontal } from 'lucide-react';

const mockTickets = [
  { id: 'TK-100289', subject: 'Issue with login to portal', client: 'TechNova Pvt Ltd', priority: 'High', status: 'Open', assigned: 'Arjun Dev', updated: '10m ago' },
  { id: 'TK-100288', subject: 'Unable to access reports', client: 'Globex Corporation', priority: 'Medium', status: 'In Progress', assigned: 'Sneha Iyer', updated: '35m ago' },
  { id: 'TK-100287', subject: 'API integration failure', client: 'Hexa Finance', priority: 'High', status: 'Open', assigned: 'Rohit Singh', updated: '1h ago' },
  { id: 'TK-100286', subject: 'Data sync not working', client: 'NextGen Retail', priority: 'Low', status: 'Resolved', assigned: 'Amit Verma', updated: '2h ago' },
  { id: 'TK-100285', subject: 'Payment gateway error', client: 'BlueStone Ltd', priority: 'Medium', status: 'In Progress', assigned: 'Neha Patil', updated: '3h ago' },
];

export default function TicketList() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Tickets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track all customer support tickets.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search tickets..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm text-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white" />
          </div>
          <button className="px-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
          <button className="px-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} /> Export
          </button>
          <button className="px-4 py-2 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Plus size={16} /> Create Ticket
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
                </th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:text-gray-700">Ticket ID</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Subject</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:text-gray-700">Client</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:text-gray-700">Priority</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:text-gray-700">Status</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5">Assigned To</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:text-gray-700">Updated At</th>
                <th className="px-6 py-4 border-b border-gray-100 dark:border-white/5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {mockTickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-[#792359] focus:ring-[#792359]" />
                  </td>
                  <td className="px-6 py-4 font-medium text-[#792359] dark:text-[#e6a8d0]">{t.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{t.subject}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{t.client}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                      t.priority === 'High' ? 'text-red-700 bg-red-50 dark:bg-red-500/10' :
                      t.priority === 'Medium' ? 'text-orange-700 bg-orange-50 dark:bg-orange-500/10' :
                      'text-green-700 bg-green-50 dark:bg-green-500/10'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                      t.status === 'Open' ? 'text-blue-700 bg-blue-50 dark:bg-blue-500/10' :
                      t.status === 'In Progress' ? 'text-purple-700 bg-purple-50 dark:bg-purple-500/10' :
                      'text-green-700 bg-green-50 dark:bg-green-500/10'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                      {t.assigned.split(' ').map(n => n[0]).join('')}
                    </div>
                    {t.assigned}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{t.updated}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-sm text-gray-500">
          <span>Showing 1 to 5 of 50 tickets</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md bg-[#792359] text-white font-medium">1</button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5">2</button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5">3</button>
            <span className="px-2 py-1">...</span>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5">10</button>
          </div>
        </div>
      </div>
    </div>
  );
}
