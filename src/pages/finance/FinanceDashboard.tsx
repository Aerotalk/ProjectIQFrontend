import { Plus, IndianRupee, Briefcase, FileText, FileCheck, Landmark, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KPI_DATA = [
  { label: 'Active Projects', value: '12', icon: Briefcase },
  { label: 'Total Project Value', value: '₹4.2 Cr', icon: IndianRupee },
  { label: 'Total Expenses', value: '₹1.8 Cr', icon: FileText },
  { label: 'Invoices Raised', value: '₹3.5 Cr', icon: FileCheck },
  { label: 'Payments Received', value: '₹2.1 Cr', icon: Landmark },
  { label: 'Gross Profit', value: '₹2.4 Cr', icon: ArrowUpRight, color: 'text-green-500' },
];

const PROJECTS = [
  { id: 'PRJ-1001', name: 'Cloud Migration', customer: 'TechNova', value: '₹50,00,000', cost: '₹20,00,000', invoiced: '₹30,00,000', received: '₹25,00,000', profit: '₹30,00,000', status: 'Active' },
  { id: 'PRJ-1002', name: 'ERP Implementation', customer: 'GlobalCorp', value: '₹1,20,00,000', cost: '₹60,00,000', invoiced: '₹80,00,000', received: '₹80,00,000', profit: '₹60,00,000', status: 'Active' },
  { id: 'PRJ-1003', name: 'Network Setup', customer: 'Nexus Ind', value: '₹30,00,000', cost: '₹10,00,000', invoiced: '₹10,00,000', received: '₹5,00,000', profit: '₹20,00,000', status: 'New' },
];

export default function FinanceDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Quick Actions */}
      <div className="flex justify-between items-center bg-white dark:bg-[#181a1f] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of financial health and active projects</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-200 transition-colors">
            Create PO
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-200 transition-colors">
            Add Expense
          </button>
          <button className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] transition-colors shadow-sm flex items-center gap-2">
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {KPI_DATA.map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-[#181a1f] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-sm">
                <kpi.icon size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{kpi.label}</p>
            <h3 className={`text-xl font-bold mt-1 ${kpi.color ? kpi.color : 'text-gray-900 dark:text-white'}`}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Section: Projects Table */}
      <div className="bg-white dark:bg-[#181a1f] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Project Financial Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Project Code</th>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Project Value</th>
                <th className="px-6 py-4">Cost Incurred</th>
                <th className="px-6 py-4">Invoiced</th>
                <th className="px-6 py-4">Received</th>
                <th className="px-6 py-4">Profit</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {PROJECTS.map((p) => (
                <tr key={p.id} onClick={() => navigate(`/companydashboard/finance/projects/${p.id}`)} className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                  <td className="px-6 py-4 font-medium text-[#792359] dark:text-[#e6a8d0]">{p.id}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{p.customer}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{p.value}</td>
                  <td className="px-6 py-4 text-red-600 font-medium">{p.cost}</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">{p.invoiced}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">{p.received}</td>
                  <td className="px-6 py-4 text-green-600 font-bold">{p.profit}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-sm">
                      {p.status}
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
