
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Ticket, Clock, CheckCircle, AlertTriangle, UserCheck, ChevronRight 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import CustomSelect from '@/components/ui/CustomSelect';
import { TicketService } from '../../services/ticket.service';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const trendData = [
  { name: 'May 12', created: 40, resolved: 24 },
  { name: 'May 13', created: 30, resolved: 13 },
  { name: 'May 14', created: 20, resolved: 38 },
  { name: 'May 15', created: 27, resolved: 39 },
  { name: 'May 16', created: 18, resolved: 48 },
  { name: 'May 17', created: 23, resolved: 38 },
  { name: 'May 18', created: 34, resolved: 43 },
];

const recentActivities = [
  { id: 1, text: 'Ticket #TK-100245 updated to In Progress', time: '10m ago', type: 'update' },
  { id: 2, text: 'New ticket #TK-100289 created', time: '35m ago', type: 'create' },
  { id: 3, text: 'Ticket #TK-100121 resolved', time: '1h ago', type: 'resolve' },
  { id: 4, text: 'SLA breached for Ticket #TK-100175', time: '2h ago', type: 'breach' },
];



export default function TicketDashboard() {
  const [trendRange, setTrendRange] = useState('Last 7 Days');
  const { selectedCompanyId: companyId } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!companyId) return;
      try {
        const data = await TicketService.getAll(companyId);
        setTickets(data);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
      }
    };
    fetchTickets();
  }, [companyId]);

  const openTicketsCount = tickets.filter(t => t.state === 'Open' || t.state === 'New').length;
  const inProgressCount = tickets.filter(t => t.state === 'In Progress').length;
  const closedCount = tickets.filter(t => t.state === 'Resolved' || t.state === 'Closed').length;
  // SLA breach is mock for now since it might require complex date math
  const slaBreachedCount = 0; 
  const assignedToMeCount = 0; // Mock until user tracking is complete

  const displayTickets = tickets.slice(0, 5).map(t => ({
    id: t.ticketNo || t.id,
    realId: t.id,
    subject: t.shortDescription || 'No Subject',
    client: t.customerCompany || 'N/A',
    priority: t.priority || 'P4',
    status: t.state || 'Open',
    assigned: t.assignedTo || 'Unassigned',
    updated: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'Just now'
  }));

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your tickets today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[
          { label: 'Total Open', value: openTicketsCount.toString(), icon: Ticket, trend: 'N/A', trendColor: 'text-gray-500' },
          { label: 'In Progress', value: inProgressCount.toString(), icon: Clock, trend: 'N/A', trendColor: 'text-gray-500' },
          { label: 'Closed Tickets', value: closedCount.toString(), icon: CheckCircle, trend: 'N/A', trendColor: 'text-gray-500' },
          { label: 'SLA Breached', value: slaBreachedCount.toString(), icon: AlertTriangle, trend: 'N/A', trendColor: 'text-gray-500', textClass: 'text-red-600' },
          { label: 'Assigned To Me', value: assignedToMeCount.toString(), icon: UserCheck, trend: 'N/A', trendColor: 'text-gray-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#181a1f] p-5 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{stat.label}</span>
              <stat.icon size={18} className="text-gray-400 group-hover:text-[#792359] dark:group-hover:text-[#e6a8d0] transition-colors" />
            </div>
            <div>
              <div className={`text-3xl font-bold tracking-tight mb-2 ${stat.textClass || 'text-gray-900 dark:text-white'}`}>{stat.value}</div>
              <div className="text-xs font-medium">
                <span className={stat.trendColor}>{stat.trend}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">from last week</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white dark:bg-[#181a1f] p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Ticket Trend</h3>
            <div className="w-40">
              <CustomSelect
                value={trendRange}
                onChange={setTrendRange}
                options={[
                  { label: 'Last 7 Days', value: 'Last 7 Days' },
                  { label: 'Last 30 Days', value: 'Last 30 Days' }
                ]}
              />
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#792359" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#792359" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E6A8D0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E6A8D0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="created" stroke="#792359" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" />
                <Area type="monotone" dataKey="resolved" stroke="#E6A8D0" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-[#181a1f] p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm lg:col-span-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Recent Activities</h3>
          <div className="space-y-5">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex gap-4">
                <div className="mt-0.5">
                  {act.type === 'update' && <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/20"></div>}
                  {act.type === 'create' && <div className="w-2 h-2 rounded-full bg-green-500 ring-4 ring-green-50 dark:ring-green-900/20"></div>}
                  {act.type === 'resolve' && <div className="w-2 h-2 rounded-full bg-purple-500 ring-4 ring-purple-50 dark:ring-purple-900/20"></div>}
                  {act.type === 'breach' && <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-50 dark:ring-red-900/20"></div>}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{act.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Tickets</h3>
          <button 
            onClick={() => navigate('/companydashboard/tickets')}
            className="text-sm font-semibold text-[#792359] dark:text-[#e6a8d0] hover:underline flex items-center gap-1"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Ticket ID</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Updated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {displayTickets.map((t) => (
                <tr key={t.realId} onClick={() => navigate(`/companydashboard/tickets/${t.realId}`)} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-[#792359] dark:text-[#e6a8d0]">{t.id === t.realId ? 'Unknown Ticket' : t.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{t.subject}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{t.client}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md ${
                      t.priority === 'P1' || t.priority === 'Critical' || t.priority === 'High' ? 'text-red-700 bg-red-50 dark:bg-red-500/10' :
                      t.priority === 'P2' ? 'text-orange-700 bg-orange-50 dark:bg-orange-500/10' :
                      t.priority === 'P3' || t.priority === 'Medium' ? 'text-yellow-700 bg-yellow-50 dark:bg-yellow-500/10' :
                      'text-green-700 bg-green-50 dark:bg-green-500/10'
                    }`}>
                      {t.priority === 'P1' || t.priority === 'Critical' || t.priority === 'High' ? 'P1 - Critical' :
                       t.priority === 'P2' || t.priority === 'Medium' ? 'P2' :
                       t.priority === 'P3' || t.priority === 'Medium' ? 'P3' : 'P4'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                      t.status === 'Open' || t.status === 'New' ? 'text-blue-700 bg-blue-50 dark:bg-blue-500/10' :
                      t.status === 'In Progress' ? 'text-purple-700 bg-purple-50 dark:bg-purple-500/10' :
                      'text-green-700 bg-green-50 dark:bg-green-500/10'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{t.assigned}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{t.updated}</td>
                </tr>
              ))}
              {displayTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
