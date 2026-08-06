import { Users, UserMinus, Clock, Calendar, CheckSquare, FileText, ShieldAlert, Fingerprint } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { useDashboardKPIs } from '../hooks';
import { Skeleton } from '../../../../components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export default function WorkforceDashboard() {
  const navigate = useNavigate();
  const { kpis, loading } = useDashboardKPIs();

  const trendData = kpis?.trendData || [];
  const leaveData = kpis?.leaveData || [];
  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  const KPI_CONFIG = [
    { label: 'Present Today', key: 'present', icon: Users, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', path: '../attendance/daily?status=Present' },
    { label: 'Absent', key: 'absent', icon: UserMinus, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20', path: '../attendance/daily?status=Absent' },
    { label: 'Late Arrivals', key: 'late', icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20', path: '../attendance/daily?status=Late' },
    { label: 'On Leave', key: 'onLeave', icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', path: '../attendance/daily?status=Leave' },
    { label: 'Pending Leave', key: 'pendingRequests', icon: FileText, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20', path: '../leave/approval-queue' },
    { label: 'Regularization', key: 'regularization', icon: CheckSquare, color: 'text-cyan-500', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20', path: '../attendance/regularization' },
  ];

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto p-4">
        <Skeleton className="h-[80px] w-full" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-[100px] w-full" />)}
        </div>
        <Skeleton className="h-[300px] w-full mt-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white dark:bg-[#181a1f] p-6 rounded-sm shadow-sm border border-gray-100 dark:border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workforce Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of daily attendance, leaves, and team activity</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_CONFIG.map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => navigate(kpi.path)}
            className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col justify-between hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-sm border ${kpi.bgColor} border-transparent`}>
                <kpi.icon size={18} className={kpi.color} strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{kpi.label}</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                {kpis?.[kpi.key] || 0}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Second Row: Tables / Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Today's Attendance (simplified widget) */}
        <div className="xl:col-span-2 bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Fingerprint size={16} className="text-primary dark:text-secondary" /> Today's Attendance
            </h2>
            <button className="text-xs text-primary hover:underline" onClick={() => navigate('../attendance/daily')}>View All</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-white/5 text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Shift</th>
                  <th className="px-3 py-2 font-medium">In</th>
                  <th className="px-3 py-2 font-medium">Out</th>
                  <th className="px-3 py-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {[1,2,3,4].map(i => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-medium">John Doe {i}</td>
                    <td className="px-3 py-2 text-gray-500">GS</td>
                    <td className="px-3 py-2 text-gray-500">09:00 AM</td>
                    <td className="px-3 py-2 text-gray-500">--:--</td>
                    <td className="px-3 py-2 text-right">
                      <span className="px-2 py-0.5 rounded-sm text-[10px] bg-emerald-100 text-emerald-700">Present</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-purple-500" /> Leave Requests
            </h2>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-2 rounded-sm border border-transparent hover:border-gray-200 dark:hover:border-white/10">
                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Jane Smith</p>
                  <p className="text-[10px] text-gray-500">Sick Leave • 2 Days</p>
                </div>
                <button className="text-xs bg-primary text-white px-2 py-1 rounded-sm hover:bg-primary-dark" onClick={() => navigate('../leave/applications')}>Review</button>
              </div>
            ))}
          </div>
        </div>

        {/* Exceptions & Holidays */}
        <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldAlert size={16} className="text-red-500" /> Exceptions
            </h2>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-300">Missing Swipes</span>
              <span className="text-xs font-bold text-red-500">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-300">Late Arrivals</span>
              <span className="text-xs font-bold text-amber-500">12</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
              <h2 className="text-[13px] font-bold text-gray-900 dark:text-white mb-2">Upcoming Holidays</h2>
              <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/10 p-2 rounded-sm text-xs">
                <span className="text-green-700 dark:text-green-400 font-semibold">Independence Day</span>
                <span className="text-green-600 dark:text-green-500">Aug 15</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Third Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Attendance Trend (7 Days)</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="Present" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" />
                <Area type="monotone" dataKey="Absent" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbsent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Utilization Pie */}
        <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Leave Utilization</h2>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
