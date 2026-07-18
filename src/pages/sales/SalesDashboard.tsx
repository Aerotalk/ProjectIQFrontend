import { FileText, Edit, UserCheck, CheckCircle2, Send, Trophy, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react';
import { QuotationService } from '../../services/quotation.service';
import { ClientService } from '../../services/client.service';
import { useAuth } from '../../contexts/AuthContext';
import { formatQuotationId } from '../../lib/utils';

export default function SalesDashboard() {
  const { selectedCompanyId: companyId } = useAuth();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [trendYear, setTrendYear] = useState<number>(new Date().getFullYear());
  const [trendQuarter, setTrendQuarter] = useState<string>('All');
  const [pipelineYear, setPipelineYear] = useState<number>(new Date().getFullYear());
  const [pipelineQuarter, setPipelineQuarter] = useState<string>('All');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!companyId) return;
        
        const [quots, clis] = await Promise.all([
          QuotationService.getQuotations(companyId),
          ClientService.getClients(companyId)
        ]);
        setQuotations(quots);
        setClients(clis);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [companyId]);

  const navigate = useNavigate();

  const pipelineStages = [
    { label: 'Draft', statusMatches: ['Draft'], icon: Edit },
    { label: 'Sent for Approval', statusMatches: ['Pending Approval', 'Sent for Approval'], icon: UserCheck },
    { label: 'Approved', statusMatches: ['Approved'], icon: CheckCircle2 },
    { label: 'Sent to Client', statusMatches: ['Sent to Client'], icon: Send },
    { label: 'Revisions Requested', statusMatches: ['Rejected', 'Changes Requested'], icon: FileText },
    { label: 'Converted', statusMatches: ['Accepted'], icon: Trophy },
  ].map(stage => {
    const stageQuots = quotations.filter(q => {
      if (!stage.statusMatches.includes(q.status)) return false;
      const dateStr = q.date || q.createdAt;
      if (!dateStr) return pipelineQuarter === 'All';
      
      const qDate = new Date(dateStr);
      if (qDate.getFullYear() !== pipelineYear) return false;
      
      if (pipelineQuarter === 'All') return true;
      const m = qDate.getMonth();
      if (pipelineQuarter === 'Q1') return m >= 0 && m <= 2;
      if (pipelineQuarter === 'Q2') return m >= 3 && m <= 5;
      if (pipelineQuarter === 'Q3') return m >= 6 && m <= 8;
      if (pipelineQuarter === 'Q4') return m >= 9 && m <= 11;
      return true;
    });
    const rawValue = stageQuots.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
    return {
      label: stage.label,
      count: stageQuots.length,
      rawValue,
      amount: `₹ ${rawValue.toLocaleString('en-IN')}`,
      icon: stage.icon
    };
  });

  const stats = [
    { label: 'Total Quotations', value: quotations.length.toString(), trend: 'N/A', icon: FileText, color: 'text-[#792359]' },
    { label: 'Draft', value: pipelineStages[0].count.toString(), trend: 'N/A', icon: Edit, color: 'text-gray-500' },
    { label: 'Sent for Approval', value: pipelineStages[1].count.toString(), trend: 'N/A', icon: UserCheck, color: 'text-blue-500' },
    { label: 'Approved', value: pipelineStages[2].count.toString(), trend: 'N/A', icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Sent to Client', value: pipelineStages[3].count.toString(), trend: 'N/A', icon: Send, color: 'text-purple-500' },
    { label: 'Converted', value: pipelineStages[5].count.toString(), trend: 'N/A', icon: Trophy, color: 'text-amber-500' },
  ];

  const recentQuotations = quotations.slice(0, 5).map(q => ({
    id: q.id,
    no: formatQuotationId(q.quotationNo || q.id),
    client: q.clientName,
    project: q.subject,
    amount: `₹ ${(q.grandTotal || 0).toLocaleString('en-IN')}`,
    status: q.status,
    statusColor: q.status === 'Approved' ? 'bg-green-100 text-green-600' : (q.status === 'Draft' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'),
    validTill: new Date(q.validUntil).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    owner: 'System'
  }));

  const topClients = clients.map((c) => {
    const clientQuotations = quotations.filter(q => q.clientId === c.id && q.status === 'Accepted');
    const totalSales = clientQuotations.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
    return {
      name: c.companyName || c.displayName || 'Unknown Client',
      amount: totalSales > 0 ? `₹ ${totalSales.toLocaleString('en-IN')}` : '₹ 0'
    };
  }).sort((a, b) => {
    const amountA = parseFloat(a.amount.replace(/[^0-9.-]+/g, ""));
    const amountB = parseFloat(b.amount.replace(/[^0-9.-]+/g, ""));
    return amountB - amountA;
  }).slice(0, 5).map((c, i) => ({ ...c, rank: i + 1 }));

  // Generate trend data based on year and quarter
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  let monthsToInclude = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  if (trendQuarter === 'Q1') monthsToInclude = [0, 1, 2];
  else if (trendQuarter === 'Q2') monthsToInclude = [3, 4, 5];
  else if (trendQuarter === 'Q3') monthsToInclude = [6, 7, 8];
  else if (trendQuarter === 'Q4') monthsToInclude = [9, 10, 11];

  const trendData = monthsToInclude.map(month => {
    const monthYear = `${monthNames[month]} ${trendYear}`;
    
    const monthQuotations = quotations.filter(q => {
      const dateStr = q.date || q.createdAt;
      if (!dateStr) return false;
      const qDate = new Date(dateStr);
      return qDate.getMonth() === month && qDate.getFullYear() === trendYear;
    });

    const amount = monthQuotations.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
    return { name: monthNames[month], fullLabel: monthYear, amount };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Sales Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#181a1f] p-5 rounded-sm border border-gray-200 dark:border-white/5 flex flex-col justify-between hover:border-[#792359]/30 transition-colors group shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-sm bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10`}>
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

      {/* Pipeline Value Chart */}
      <div className="bg-white dark:bg-[#181a1f] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Pipeline Value (₹)</h2>
          <div className="flex items-center gap-2">
            <select 
              value={pipelineQuarter}
              onChange={(e) => setPipelineQuarter(e.target.value)}
              className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-2 py-1.5 rounded-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors outline-none cursor-pointer"
            >
              <option value="All">Full Year</option>
              <option value="Q1">Q1 (Jan-Mar)</option>
              <option value="Q2">Q2 (Apr-Jun)</option>
              <option value="Q3">Q3 (Jul-Sep)</option>
              <option value="Q4">Q4 (Oct-Dec)</option>
            </select>
            <select
              value={pipelineYear}
              onChange={(e) => setPipelineYear(Number(e.target.value))}
              className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-2 py-1.5 rounded-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors outline-none cursor-pointer"
            >
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
              <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
            </select>
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineStages} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: '#6b7280' }} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6b7280' }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
              />
              <Tooltip 
                cursor={{ fill: '#f3f4f6', opacity: 0.5 }}
                contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '12px', backgroundColor: '#fff', color: '#111827' }}
                formatter={(value: number) => [`₹ ${value.toLocaleString('en-IN')}`, 'Amount']}
              />
              <Bar dataKey="rawValue" fill="#792359" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white dark:bg-[#181a1f] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Quotations Trend</h2>
          <div className="flex items-center gap-2">
            <select 
              value={trendQuarter}
              onChange={(e) => setTrendQuarter(e.target.value)}
              className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-2 py-1.5 rounded-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors outline-none cursor-pointer"
            >
              <option value="All">Full Year</option>
              <option value="Q1">Q1 (Jan-Mar)</option>
              <option value="Q2">Q2 (Apr-Jun)</option>
              <option value="Q3">Q3 (Jul-Sep)</option>
              <option value="Q4">Q4 (Oct-Dec)</option>
            </select>
            <select
              value={trendYear}
              onChange={(e) => setTrendYear(Number(e.target.value))}
              className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-2 py-1.5 rounded-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors outline-none cursor-pointer"
            >
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
              <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
            </select>
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#792359" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#792359" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: '#6b7280' }} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6b7280' }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
              />
              <Tooltip 
                cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '3 3' }}
                contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '12px', backgroundColor: '#fff', color: '#111827' }}
                formatter={(value: number) => [`₹ ${value.toLocaleString('en-IN')}`, 'Amount']}
              />
              <Area type="monotone" dataKey="amount" stroke="#792359" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
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
                    <td className="py-3 text-gray-900 dark:text-white font-medium text-xs whitespace-nowrap">{q.amount}</td>
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
                <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{client.amount}</span>
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
