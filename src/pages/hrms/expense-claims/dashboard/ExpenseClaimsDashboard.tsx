import { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { CheckCircle, Clock, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ExpenseClaimsDashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setLoading(false), 800);
  }, []);

  const kpis = [
    { title: 'Total Claims', value: '1,245', icon: FileText, color: 'text-blue-500' },
    { title: 'Pending Approval', value: '142', icon: Clock, color: 'text-orange-500' },
    { title: 'Approved Amount', value: '$45,231', icon: CheckCircle, color: 'text-green-500' },
    { title: 'Pending Advances', value: '18', icon: AlertCircle, color: 'text-yellow-500' },
  ];

  const categoryData = [
    { name: 'Travel', value: 400 },
    { name: 'Meals', value: 300 },
    { name: 'Office Supplies', value: 300 },
    { name: 'Misc', value: 200 },
  ];

  const trendData = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 2000 },
    { name: 'Apr', amount: 2780 },
    { name: 'May', amount: 1890 },
    { name: 'Jun', amount: 2390 },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-white/5 animate-pulse rounded-md" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-80 bg-gray-200 dark:bg-white/5 animate-pulse rounded-md" />
          <div className="h-80 bg-gray-200 dark:bg-white/5 animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-[#181a1f] p-5 rounded-md border border-gray-200 dark:border-white/5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</h3>
            </div>
            <div className={`p-3 rounded-full bg-gray-50 dark:bg-white/5 ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-[#181a1f] p-5 rounded-md border border-gray-200 dark:border-white/5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white dark:bg-[#181a1f] p-5 rounded-md border border-gray-200 dark:border-white/5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Monthly Spend Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <RechartsTooltip />
                <Bar dataKey="amount" fill="#792359" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Claims Widget */}
      <div className="bg-white dark:bg-[#181a1f] rounded-md border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Claims</h3>
          <button 
            onClick={() => navigate('/companydashboard/hrms/expense-claims/claims')}
            className="text-sm text-[#792359] dark:text-[#e6a8d0] font-medium flex items-center"
          >
            View All <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="px-5 py-3">Claim No</th>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {['CLM-1001', 'CLM-1002', 'CLM-1003'].map((clm, i) => (
                <tr key={i} className="border-b border-gray-200 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{clm}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">John Doe</td>
                  <td className="px-5 py-3 text-gray-900 dark:text-white">$250.00</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">Pending</span>
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
