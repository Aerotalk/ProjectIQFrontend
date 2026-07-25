import { useState } from 'react';
import { 
 Users, DollarSign, Clock, FileText, CheckCircle, AlertTriangle, 
 Search, Filter, Plus, FileInput, Upload, Settings, Calculator, RefreshCw, FileImage
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PayrollDashboard() {
 const navigate = useNavigate();
 const [searchTerm, setSearchTerm] = useState('');

 const stats = [
 { title: 'Current Payroll Period', value: 'July 2026', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
 { title: 'Employees Processed', value: '142 / 150', icon: Users, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-500/10' },
 { title: 'Pending Payroll', value: '8', icon: AlertTriangle, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-500/10' },
 { title: 'Total Payroll Amount', value: '₹14,50,000', icon: DollarSign, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-500/10' },
 { title: 'Held Salaries', value: '₹45,000', icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-500/10' },
 { title: 'Final Settlements', value: '3 Pending', icon: FileText, color: 'text-[#792359]', bgColor: 'bg-[#792359]/10' },
 ];

 return (
 <div className="flex flex-col gap-6">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div>
 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Dashboard</h1>
 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage employee salaries, claims, and settlements</p>
 </div>
 
 <div className="flex flex-wrap items-center gap-2">
 <button 
 onClick={() => navigate('/companydashboard/hrms/payroll/list')}
 className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1f2229] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium shadow-sm"
 >
 <Users size={16} />
 View All Payrolls
 </button>
 <button onClick={() => navigate('/companydashboard/hrms/payroll/list')} className="flex items-center gap-2 px-4 py-2 bg-[#792359] text-white rounded-md hover:bg-[#5d1944] transition-colors text-sm font-medium shadow-sm">
 <Plus size={16} />
 New Payroll Run
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {stats.map((stat, i) => (
 <div key={i} className="bg-white dark:bg-[#181a1f] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-[#792359]/30 transition-all group flex items-center gap-4 cursor-default">
 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor} ${stat.color} group-hover:scale-105 transition-transform`}>
 <stat.icon size={24} />
 </div>
 <div>
 <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 group-hover:text-[#792359] dark:group-hover:text-[#e6a8d0] transition-colors">{stat.value}</h3>
 </div>
 </div>
 ))}
 </div>

 <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
 <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
 </div>
 <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
 {[
 { label: 'Salary Inputs', icon: FileInput, color: 'text-blue-500' },
 { label: 'IT Declaration', icon: FileText, color: 'text-purple-500' },
 { label: 'Reimbursement', icon: Upload, color: 'text-green-500' },
 { label: 'Process Payroll', icon: RefreshCw, color: 'text-orange-500' },
 { label: 'Final Settlement', icon: CheckCircle, color: 'text-red-500' },
 { label: 'Pay Components', icon: Calculator, color: 'text-gray-500' },
 { label: 'Payslip Templates', icon: FileImage, color: 'text-indigo-500' },
 { label: 'Configuration', icon: Settings, color: 'text-teal-500' }
 ].map((action, i) => (
 <button key={i} onClick={() => navigate('/companydashboard/hrms/payroll/list')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-md border border-gray-200 dark:border-gray-800 hover:border-[#792359]/30 hover:bg-[#792359]/5 transition-all group">
 <div className={`w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-[#1f2229] shadow-sm ${action.color}`}>
 <action.icon size={20} />
 </div>
 <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#792359] dark:group-hover:text-[#e6a8d0]">{action.label}</span>
 </button>
 ))}
 </div>
 </div>

 <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
 <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-transparent">
 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payroll Runs</h2>
 
 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#792359]" size={16} />
 <input
 type="text"
 placeholder="Search runs..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="pl-9 pr-4 py-2 w-64 text-sm bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-[#792359] transition-all"
 />
 </div>
 <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
 <Filter size={16} />
 <span className="text-sm font-medium">Filter</span>
 </button>
 </div>
 </div>

 <div className="overflow-x-auto custom-scrollbar">
 <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 border-collapse">
 <thead className="bg-gray-50/80 dark:bg-[#1f2229] border-b border-gray-200 dark:border-gray-800">
 <tr>
 <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payroll Period</th>
 <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Run Type</th>
 <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employees</th>
 <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Gross</th>
 <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
 <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 dark:divide-white/5">
 <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
 <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">June 2026</td>
 <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Regular</td>
 <td className="px-6 py-4 text-gray-600 dark:text-gray-400">150</td>
 <td className="px-6 py-4 text-gray-600 dark:text-gray-400">₹14,50,000</td>
 <td className="px-6 py-4">
 <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-green-50 border border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400 uppercase tracking-wider">Processed</span>
 </td>
 <td className="px-6 py-4 text-right ">
 <button onClick={() => navigate('/companydashboard/hrms/payroll/list')} className="text-[#792359] dark:text-[#e6a8d0] hover:underline font-medium text-xs bg-[#792359]/5 px-3 py-1.5 rounded-md">View Details</button>
 </td>
 </tr>
 <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
 <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">July 2026</td>
 <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Regular</td>
 <td className="px-6 py-4 text-gray-600 dark:text-gray-400">142</td>
 <td className="px-6 py-4 text-gray-600 dark:text-gray-400">₹13,80,000</td>
 <td className="px-6 py-4">
 <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-orange-50 border border-orange-200 text-orange-700 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400 uppercase tracking-wider">Processing</span>
 </td>
 <td className="px-6 py-4 text-right ">
 <button onClick={() => navigate('/companydashboard/hrms/payroll/list')} className="text-[#792359] dark:text-[#e6a8d0] hover:underline font-medium text-xs bg-[#792359]/5 px-3 py-1.5 rounded-md">View Details</button>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
