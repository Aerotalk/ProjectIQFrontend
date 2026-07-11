import { FileText, Edit, UserCheck, CheckCircle2, Send, Trophy, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SalesDashboard() {
  const navigate = useNavigate();
  const stats = [
    { label: 'Total Quotations', value: '56', trend: '+12.5%', icon: FileText, color: 'text-[#b8458f]', bgColor: 'bg-pink-50 dark:bg-[#b8458f]/10' },
    { label: 'Draft', value: '18', trend: '+8.4%', icon: Edit, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-500/10' },
    { label: 'Sent for Approval', value: '12', trend: '+15.3%', icon: UserCheck, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Approved', value: '10', trend: '+10.2%', icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-500/10' },
    { label: 'Sent to Client', value: '8', trend: '+12.1%', icon: Send, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-500/10' },
    { label: 'Converted', value: '7', trend: '+16.7%', icon: Trophy, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  const pipelineStages = [
    { label: 'Draft', count: 18, amount: '₹ 18,45,000', color: 'bg-blue-100/50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' },
    { label: 'Sent for Approval', count: 12, amount: '₹ 12,41,000', color: 'bg-purple-100/50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200' },
    { label: 'Approved', count: 10, amount: '₹ 10,30,000', color: 'bg-orange-100/50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200' },
    { label: 'Sent to Client', count: 8, amount: '₹ 8,40,000', color: 'bg-emerald-100/50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200' },
    { label: 'Client Asked for Changes', count: 5, amount: '₹ 4,81,000', color: 'bg-fuchsia-100/50 text-fuchsia-800 dark:bg-fuchsia-900/20 dark:text-fuchsia-200' },
    { label: 'Converted', count: 7, amount: '₹ 7,23,000', color: 'bg-green-100/50 text-green-800 dark:bg-green-900/20 dark:text-green-200' },
  ];

  const recentQuotations = [
    { id: '1', no: 'QTN-100245', client: 'TechNova Pvt Ltd', project: 'Analytics Dashboard', amount: '₹ 2,71,400', status: 'Sent for Approval', statusColor: 'bg-blue-100 text-blue-600', validTill: '20 May 2025', owner: 'Arjun Dev' },
    { id: '2', no: 'QTN-100244', client: 'Glober Corporation', project: 'Data Integration Platform', amount: '₹ 1,05,000', status: 'Draft', statusColor: 'bg-gray-100 text-gray-600', validTill: '18 May 2025', owner: 'Sneha Iyer' },
    { id: '3', no: 'QTN-100243', client: 'Hexa Finance', project: 'Support Portal', amount: '₹ 3,30,000', status: 'Approved', statusColor: 'bg-green-100 text-green-600', validTill: '25 May 2025', owner: 'Rohit Singh' },
    { id: '4', no: 'QTN-100242', client: 'NexGen Retail', project: 'Customer Portal', amount: '₹ 96,800', status: 'Sent to Client', statusColor: 'bg-purple-100 text-purple-600', validTill: '17 May 2025', owner: 'Amit Verma' },
    { id: '5', no: 'QTN-100241', client: 'BlueStone Ltd', project: 'Mobile App Development', amount: '₹ 1,08,000', status: 'Client Asked for Changes', statusColor: 'bg-orange-100 text-orange-600', validTill: '22 May 2025', owner: 'Neha Patil' },
  ];

  const topClients = [
    { rank: 1, name: 'TechNova Pvt Ltd', amount: '₹ 12,75,000' },
    { rank: 2, name: 'Glober Corporation', amount: '₹ 9,40,000' },
    { rank: 3, name: 'Hexa Finance', amount: '₹ 8,30,000' },
    { rank: 4, name: 'NexGen Retail', amount: '₹ 6,20,000' },
    { rank: 5, name: 'BlueStone Ltd', amount: '₹ 4,35,000' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Sales Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#181a1f] p-5 rounded-sm border border-gray-200 dark:border-white/5 flex flex-col justify-between hover:border-[#792359]/30 transition-colors group shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-sm border ${stat.bgColor} border-transparent`}>
                <stat.icon size={16} className={stat.color} strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stat.label}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{stat.value}</div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight size={12} strokeWidth={2.5} />
                <span>{stat.trend}</span>
                <span className="text-gray-400 dark:text-gray-500 font-medium ml-0.5">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quotation Pipeline */}
      <div className="bg-white dark:bg-[#181a1f] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
        <h2 className="text-[15px] font-bold text-gray-900 dark:text-white mb-6">Quotation Pipeline</h2>
        <div className="flex w-full h-[100px] relative isolate overflow-hidden rounded-sm">
          {pipelineStages.map((stage, i) => (
            <div 
              key={i} 
              className={`flex-1 flex flex-col items-center justify-center relative ${stage.color} border-r-2 border-white dark:border-[#181a1f] last:border-r-0 hover:brightness-95 transition-all cursor-pointer`}
              style={{
                clipPath: i === pipelineStages.length - 1 
                  ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 15px 50%)' 
                  : i === 0 
                    ? 'polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%)'
                    : 'polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%, 15px 50%)',
                marginLeft: i > 0 ? '-10px' : '0'
              }}
            >
              <div className="text-xs font-semibold mb-1 truncate px-6">{stage.label}</div>
              <div className="text-lg font-bold mb-0.5">{stage.count}</div>
              <div className="text-xs font-medium opacity-80">{stage.amount}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quotations */}
        <div className="lg:col-span-2 bg-white dark:bg-[#181a1f] p-6 rounded-sm border border-gray-200 dark:border-white/5 flex flex-col shadow-sm">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white mb-5">Recent Quotations</h2>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">QTN No.</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Client</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Project</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Valid Till</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {recentQuotations.map((q, i) => (
                  <tr key={i} onClick={() => navigate(`/companydashboard/sales/quotations/${q.id}`)} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <td className="py-3 text-[#792359] font-medium text-xs group-hover:underline">{q.no}</td>
                    <td className="py-3 text-gray-900 dark:text-white font-medium text-xs">{q.client}</td>
                    <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">{q.project}</td>
                    <td className="py-3 text-gray-900 dark:text-white font-medium text-xs">{q.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${q.statusColor}`}>{q.status}</span>
                    </td>
                    <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">{q.validTill}</td>
                    <td className="py-3 text-gray-900 dark:text-white text-xs">{q.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
            <button 
              onClick={() => navigate('/companydashboard/sales/quotations')}
              className="text-[#792359] text-xs font-bold hover:text-[#52173c] transition-colors flex items-center gap-1"
            >
              View All Quotations
            </button>
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white dark:bg-[#181a1f] p-6 rounded-sm border border-gray-200 dark:border-white/5 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Top Clients</h2>
            <button className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              This Month <ChevronDown size={14} />
            </button>
          </div>
          
          <div className="space-y-4 flex-1">
            {topClients.map((client, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-sm bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 flex items-center justify-center text-xs font-bold border border-gray-200/50 dark:border-white/5">
                    {client.rank}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#792359] transition-colors">{client.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{client.amount}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
            <button 
              onClick={() => navigate('/companydashboard/sales/clients')}
              className="text-[#792359] text-xs font-bold hover:text-[#52173c] transition-colors flex items-center gap-1"
            >
              View All Clients
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
