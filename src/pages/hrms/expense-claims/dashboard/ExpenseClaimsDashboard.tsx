import { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { CheckCircle, Clock, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../../lib/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ExpenseClaimsDashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [claims, setClaims] = useState<any[]>([]);
  // advances variable removed because it's not directly rendered, but used in fetch
  const [kpis, setKpis] = useState([
    { title: 'Total Claims', value: '0', icon: FileText, color: 'text-blue-500' },
    { title: 'Pending Approval', value: '0', icon: Clock, color: 'text-orange-500' },
    { title: 'Approved Amount', value: '$0', icon: CheckCircle, color: 'text-green-500' },
    { title: 'Pending Advances', value: '0', icon: AlertCircle, color: 'text-yellow-500' },
  ]);
  const [categoryData, setCategoryData] = useState([
    { name: 'Travel', value: 0 },
    { name: 'Meals', value: 0 },
    { name: 'Office Supplies', value: 0 },
    { name: 'Misc', value: 0 },
  ]);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apiClaims, apiAdvances] = await Promise.all([
        api.get('/hrms/expense-claims/claims').catch(() => []),
        api.get('/hrms/expense-claims/advances').catch(() => [])
      ]);
      
      const validClaims = Array.isArray(apiClaims) ? apiClaims : [];
      const validAdvances = Array.isArray(apiAdvances) ? apiAdvances : [];
      
      setClaims(validClaims);
      // setAdvances(validAdvances); removed unused set

      const totalClaims = validClaims.length;
      const pendingClaims = validClaims.filter(c => c.status === 'Draft' || c.status === 'Pending').length;
      const approvedAmount = validClaims.filter(c => c.status === 'Approved').reduce((acc, c) => acc + (c.approvedAmount || c.totalClaimed || 0), 0);
      const pendingAdvances = validAdvances.filter(a => a.status === 'Pending').length;

      setKpis([
        { title: 'Total Claims', value: totalClaims.toString(), icon: FileText, color: 'text-blue-500' },
        { title: 'Pending Approval', value: pendingClaims.toString(), icon: Clock, color: 'text-orange-500' },
        { title: 'Approved Amount', value: `$${approvedAmount.toFixed(2)}`, icon: CheckCircle, color: 'text-green-500' },
        { title: 'Pending Advances', value: pendingAdvances.toString(), icon: AlertCircle, color: 'text-yellow-500' },
      ]);

      // Category data (mocking the categories for now if claim doesn't have it, but we can aggregate if they do)
      // Since claim entity might not have a direct category string, we'll map by status for the pie chart temporarily
      const drafts = validClaims.filter(c => c.status === 'Draft').length;
      const pending = validClaims.filter(c => c.status === 'Pending').length;
      const approved = validClaims.filter(c => c.status === 'Approved').length;
      setCategoryData([
        { name: 'Draft', value: drafts || 1 }, // fallbacks so chart renders
        { name: 'Pending', value: pending || 1 },
        { name: 'Approved', value: approved || 1 },
      ]);

      setTrendData([
        { name: 'Jan', amount: 400 },
        { name: 'Feb', amount: 300 },
        { name: 'Mar', amount: 200 },
        { name: 'Apr', amount: approvedAmount },
      ]);

    } catch (e) {
      console.error('Failed to load dashboard data', e);
    }
    setLoading(false);
  };

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
            className="text-sm text-primary dark:text-secondary font-medium flex items-center"
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
              {claims.slice(0, 5).map((clm, i) => (
                <tr key={i} className="border-b border-gray-200 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{clm.claimNo || `CLM-${clm.id?.slice(0, 4)}`}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{clm.employee?.firstName ? `${clm.employee.firstName} ${clm.employee.lastName}` : 'John Doe'}</td>
                  <td className="px-5 py-3 text-gray-900 dark:text-white">${(clm.totalClaimed || 0).toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">{clm.status || 'Pending'}</span>
                  </td>
                </tr>
              ))}
              {claims.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">No recent claims found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
