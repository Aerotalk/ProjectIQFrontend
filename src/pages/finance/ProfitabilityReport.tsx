import { Download, PieChart, TrendingUp, BarChart3 } from 'lucide-react';

const PROFIT_DATA = [
  { id: 'PRJ-1001', customer: 'TechNova Pvt Ltd', value: '₹50,00,000', expenses: '₹20,00,000', invoices: '₹30,00,000', received: '₹25,00,000', profit: '₹30,00,000', margin: '60%' },
  { id: 'PRJ-1002', customer: 'GlobalCorp', value: '₹1,20,00,000', expenses: '₹60,00,000', invoices: '₹80,00,000', received: '₹80,00,000', profit: '₹60,00,000', margin: '50%' },
  { id: 'PRJ-1003', customer: 'Nexus Ind', value: '₹30,00,000', expenses: '₹10,00,000', invoices: '₹10,00,000', received: '₹5,00,000', profit: '₹20,00,000', margin: '66.6%' },
];

export default function ProfitabilityReport() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profitability Report</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Analyze project margins and overall financial performance</p>
        </div>
        <button className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] transition-colors shadow-sm flex items-center gap-2">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#181a1f] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center min-h-[250px]">
          <BarChart3 size={48} className="text-[#792359] dark:text-[#e6a8d0] mb-4 opacity-50" />
          <h3 className="text-gray-900 dark:text-white font-medium mb-1">Revenue vs Expenses</h3>
          <p className="text-sm text-gray-500 text-center">Chart displaying monthly comparative data</p>
        </div>
        <div className="bg-white dark:bg-[#181a1f] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center min-h-[250px]">
          <TrendingUp size={48} className="text-[#792359] dark:text-[#e6a8d0] mb-4 opacity-50" />
          <h3 className="text-gray-900 dark:text-white font-medium mb-1">Monthly Collections</h3>
          <p className="text-sm text-gray-500 text-center">Trend of payments received over time</p>
        </div>
        <div className="bg-white dark:bg-[#181a1f] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center min-h-[250px]">
          <PieChart size={48} className="text-[#792359] dark:text-[#e6a8d0] mb-4 opacity-50" />
          <h3 className="text-gray-900 dark:text-white font-medium mb-1">Top Profitable Projects</h3>
          <p className="text-sm text-gray-500 text-center">Distribution of profit across top 5 projects</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#181a1f] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Project Profitability Detail</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Project Value</th>
                <th className="px-6 py-4">Total Expenses</th>
                <th className="px-6 py-4">Total Invoices</th>
                <th className="px-6 py-4">Payments Received</th>
                <th className="px-6 py-4">Net Profit</th>
                <th className="px-6 py-4">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {PROFIT_DATA.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#792359] dark:text-[#e6a8d0]">{p.id}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{p.customer}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{p.value}</td>
                  <td className="px-6 py-4 text-red-500 font-medium">{p.expenses}</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">{p.invoices}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">{p.received}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">{p.profit}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-[#792359]/10 text-[#792359] dark:bg-[#e6a8d0]/20 dark:text-[#e6a8d0] text-xs font-semibold rounded-sm">
                      {p.margin}
                    </span>
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
