
import { 
  Target, 
  Users, 
  CheckCircle2, 
  Clock, 
  Award,
  AlertCircle,
  Plus
} from 'lucide-react';
import { performanceService } from '../../../../services/performance.service';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PerformanceDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [kpis, setKpis] = useState<any>({
    activeCycles: 0,
    pendingSelf: 0,
    pendingManager: 0,
    completedReviews: 0,
    averageRating: 0.0,
    topGoals: [],
    cycleStatuses: [],
    departmentRatings: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await performanceService.getDashboardKPIs();
        setKpis(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Active Cycles', value: kpis.activeCycles, icon: <Clock size={20} className="text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { title: 'Pending Self Reviews', value: kpis.pendingSelf, icon: <AlertCircle size={20} className="text-orange-500" />, bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { title: 'Pending Manager Reviews', value: kpis.pendingManager, icon: <Users size={20} className="text-purple-500" />, bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { title: 'Completed Reviews', value: kpis.completedReviews, icon: <CheckCircle2 size={20} className="text-green-500" />, bg: 'bg-green-50 dark:bg-green-500/10' },
    { title: 'Average Rating', value: kpis.averageRating, icon: <Award size={20} className="text-yellow-500" />, bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col space-y-6 h-full pb-10">
        <div className="h-12 bg-gray-200 dark:bg-white/5 animate-pulse rounded-md w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-white/5 animate-pulse rounded-md" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 dark:bg-white/5 animate-pulse rounded-md" />
            <div className="h-80 bg-gray-200 dark:bg-white/5 animate-pulse rounded-md" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-200 dark:bg-white/5 animate-pulse rounded-md" />
            <div className="h-48 bg-gray-200 dark:bg-white/5 animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 overflow-y-auto custom-scrollbar h-full pb-10">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Overview of organization performance metrics and active cycles.</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="flex items-center px-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm" 
            onClick={() => navigate('../goal/new')}
          >
            <Plus size={16} className="mr-2" />
            Create Goal
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-sm shadow-sm transition-colors" 
            onClick={() => navigate('../cycle/new')}
          >
            <Plus size={16} className="mr-2" />
            New Cycle
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex items-center space-x-4 animate-in slide-in-from-bottom fade-in duration-500 fill-mode-both"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Upcoming Deadlines / Recent Activities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#181a1f] p-6 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <Target size={20} className="mr-2 text-primary dark:text-secondary" />
                Goal Completion Tracking
              </h3>
            </div>
            
            <div className="space-y-4">
              {kpis.topGoals?.slice(0, 3).map((goal: any, index: number) => (
                <div 
                  key={goal.id} 
                  className="border border-gray-100 dark:border-white/5 rounded-sm p-4 animate-in slide-in-from-bottom fade-in duration-500 fill-mode-both"
                  style={{ animationDelay: `${300 + index * 150}ms` }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{goal.title}</span>
                    <span className="text-sm text-gray-500">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full animate-grow-width ${goal.progress >= 100 ? 'bg-green-500' : goal.progress >= 50 ? 'bg-blue-500' : 'bg-orange-500'}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>{goal.employee?.name}</span>
                    <span>Due: {goal.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Recharts Chart */}
          <div className="bg-white dark:bg-[#181a1f] p-6 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm h-80 animate-in slide-in-from-bottom fade-in duration-500 fill-mode-both" style={{ animationDelay: '500ms' }}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Department Performance Trend</h3>
            <div className="w-full h-full pb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpis.departmentRatings || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#181a1f', borderColor: '#374151', color: '#fff', borderRadius: '4px' }}
                    itemStyle={{ color: '#e6a8d0' }}
                  />
                  <Bar 
                    dataKey="rating" 
                    fill="#792359" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#181a1f] p-6 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-white/10 pb-2">
              Active Cycles
            </h3>
            <div className="space-y-4">
              {kpis.cycleStatuses?.map((cycle: any, index: number) => (
                <div key={index} className="flex flex-col p-3 bg-gray-50 dark:bg-white/5 rounded-sm">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{cycle.name}</span>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{cycle.value}% Completed</span>
                    <span className="text-primary dark:text-secondary">Active</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                    <div 
                      className="h-1.5 rounded-full bg-primary dark:bg-secondary animate-grow-width"
                      style={{ width: `${cycle.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#181a1f] p-6 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-white/10 pb-2">
              Requires Attention
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full mt-0.5">
                  <AlertCircle size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Self Review Overdue</p>
                  <p className="text-xs text-gray-500">12 employees missed the Q1 Check-in deadline.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-full mt-0.5">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Manager Reviews Due</p>
                  <p className="text-xs text-gray-500">Sales department reviews due in 3 days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
