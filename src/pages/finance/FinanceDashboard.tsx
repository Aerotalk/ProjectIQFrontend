import { Briefcase, IndianRupee, ShoppingCart, CreditCard, ArrowUpRight, ArrowDownRight, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import { POService } from '../../services/po.service';
import { ExpenseService } from '../../services/expense.service';
import { ChallanService } from '../../services/challan.service';
import { useAuth } from '../../contexts/AuthContext';

const KPI_DATA = [
  { label: 'Active Projects', value: '24', trend: '+12% vs last month', icon: Briefcase, color: 'text-[#792359]', bgColor: 'bg-purple-50 dark:bg-[#792359]/10', isPositive: true },
  { label: 'Project Value', value: '₹ 1,20,00,000', trend: '+18% vs last month', icon: IndianRupee, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-500/10', isPositive: true },
  { label: 'PO Value', value: '₹ 45,00,000', trend: '+8% vs last month', icon: ShoppingCart, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10', isPositive: true },
  { label: 'Expenses', value: '₹ 12,50,000', trend: '-5% vs last month', icon: CreditCard, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10', isPositive: false },
  { label: 'Profit (Est.)', value: '₹ 32,50,000', trend: '+22% vs last month', icon: IndianRupee, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-500/10', isPositive: true },
];

// Mock data is removed, data will be fetched from backend.

export default function FinanceDashboard() {
  const { selectedCompanyId: companyId } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [recentPOs, setRecentPOs] = useState<any[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [recentChallans, setRecentChallans] = useState<any[]>([]);
  const [poTotal, setPoTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [allPOs, setAllPOs] = useState<any[]>([]);
  const [allExpenses, setAllExpenses] = useState<any[]>([]);
  const [trendYear, setTrendYear] = useState<number>(new Date().getFullYear());
  const [trendQuarter, setTrendQuarter] = useState<string>('All');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!companyId) return;
        const [pos, expenses, challans, projs] = await Promise.all([
          POService.getAll(companyId),
          ExpenseService.getAll(companyId),
          ChallanService.getAll(companyId),
          import('../../services/project.service').then(m => m.ProjectService.getAll(companyId))
        ]);

        setAllPOs(pos);
        setAllExpenses(expenses);

        const poSum = pos.reduce((acc, po) => acc + (po.grandTotal || 0), 0);
        setPoTotal(poSum);
        
        const formattedPOs = pos.slice(0, 5).map(po => ({
          id: po.poNumber || po.id,
          vendor: po.vendorName,
          project: po.projectId,
          amount: `₹ ${(po.grandTotal || 0).toLocaleString('en-IN')}`,
          status: po.status,
          statusColor: po.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        }));
        setRecentPOs(formattedPOs);

        const expSum = expenses.reduce((acc, ex) => acc + (ex.amount || 0), 0);
        setExpenseTotal(expSum);

        const formattedExpenses = expenses.slice(0, 5).map(ex => ({
          date: new Date(ex.expenseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: ex.category,
          project: ex.projectId,
          amount: `₹ ${(ex.amount || 0).toLocaleString('en-IN')}`
        }));
        setRecentExpenses(formattedExpenses);

        const formattedChallans = challans.slice(0, 5).map(ch => ({
          id: ch.challanNumber || ch.id,
          vendor: ch.vendorName || 'Vendor',
          project: ch.projectId,
          date: new Date(ch.challanDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          status: 'Received',
          statusColor: 'bg-green-100 text-green-700'
        }));
        setRecentChallans(formattedChallans);
        
        const formattedProjects = projs.slice(0, 5).map(p => {
          const pPOs = pos.filter(po => po.projectId === p.id);
          const pExps = expenses.filter(ex => ex.projectId === p.id);
          const pCost = pPOs.reduce((acc, po) => acc + (po.grandTotal || 0), 0) + pExps.reduce((acc, ex) => acc + (ex.amount || 0), 0);
          return {
            id: p.projectCode || p.id,
            realId: p.id,
            name: p.projectName,
            customer: 'N/A', // Client association not stored in Project
            value: 'N/A', // Project Value not stored
            cost: `₹ ${pCost.toLocaleString('en-IN')}`,
            profit: 'N/A',
            profitPercent: 'N/A',
            status: p.status || 'Active',
            statusColor: (p.status === 'Completed' || p.status === 'Closed') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          };
        });
        setProjects(formattedProjects);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    
    fetchDashboardData();
  }, [companyId]);

  // Generate trend data based on year and quarter
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let monthsToInclude = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  if (trendQuarter === 'Q1') monthsToInclude = [0, 1, 2];
  else if (trendQuarter === 'Q2') monthsToInclude = [3, 4, 5];
  else if (trendQuarter === 'Q3') monthsToInclude = [6, 7, 8];
  else if (trendQuarter === 'Q4') monthsToInclude = [9, 10, 11];

  const trendData = monthsToInclude.map(month => {
    const monthYear = `${monthNames[month]} ${trendYear}`;
    
    const monthPOs = allPOs.filter(po => {
      const dateStr = po.poDate || po.createdAt;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d.getMonth() === month && d.getFullYear() === trendYear;
    });
    
    const monthExps = allExpenses.filter(ex => {
      const dateStr = ex.expenseDate || ex.createdAt;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d.getMonth() === month && d.getFullYear() === trendYear;
    });

    const poAmount = monthPOs.reduce((acc, po) => acc + (po.grandTotal || 0), 0);
    const expAmount = monthExps.reduce((acc, ex) => acc + (ex.amount || 0), 0);
    
    return { name: monthNames[month], fullLabel: monthYear, PO: poAmount, Expense: expAmount };
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white dark:bg-[#181a1f] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of financial health and active projects</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0">
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
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_DATA.map((kpi, i) => {
          let displayValue = kpi.value;
          if (kpi.label === 'Active Projects') displayValue = projects.length.toString();
          if (kpi.label === 'PO Value') displayValue = `₹ ${poTotal.toLocaleString('en-IN')}`;
          if (kpi.label === 'Expenses') displayValue = `₹ ${expenseTotal.toLocaleString('en-IN')}`;
          if (kpi.label === 'Profit (Est.)' || kpi.label === 'Project Value') displayValue = 'N/A';
          
          return (
            <div key={i} className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col justify-between hover:border-[#792359]/30 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-sm border ${kpi.bgColor} border-transparent`}>
                  <kpi.icon size={18} className={kpi.color} strokeWidth={2} />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{kpi.label}</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white leading-none whitespace-nowrap">{displayValue}</div>
                <div className={`flex items-center gap-1 text-[11px] font-semibold ${kpi.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  {kpi.isPositive ? <ArrowUpRight size={12} strokeWidth={2.5} /> : <ArrowDownRight size={12} strokeWidth={2.5} />}
                  <span>{kpi.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Trend Chart */}
      <div className="bg-white dark:bg-[#181a1f] p-6 rounded-sm border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Financial Trend (POs vs Expenses)</h2>
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
                <linearGradient id="colorPO" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
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
                formatter={(value: any, name: string) => [`₹ ${Number(value).toLocaleString('en-IN')}`, name]}
              />
              <Legend iconType="rect" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Area type="monotone" dataKey="PO" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPO)" />
              <Area type="monotone" dataKey="Expense" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Section: Projects Table */}
      <div className="bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Project Financial Summary</h2>
          <button 
            onClick={() => navigate('/companydashboard/finance/projects')}
            className="text-xs font-semibold text-[#792359] dark:text-[#e6a8d0] hover:underline"
          >
            View All Projects
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 font-semibold">Project ID</th>
                <th className="px-6 py-3 font-semibold">Project Name</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Project Value (₹)</th>
                <th className="px-6 py-3 font-semibold">Total Cost (₹)</th>
                <th className="px-6 py-3 font-semibold">Profit (₹)</th>
                <th className="px-6 py-3 font-semibold">Profit %</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {projects.map((p, i) => (
                <tr key={p.realId} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group text-sm">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? 'bg-blue-500' : i % 3 === 1 ? 'bg-green-500' : i % 3 === 2 ? 'bg-orange-500' : 'bg-purple-500'}`}></div>
                      <span className="font-medium text-gray-900 dark:text-white">{p.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-300">{p.name}</td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-300">{p.customer}</td>
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{p.value}</td>
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{p.cost}</td>
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{p.profit}</td>
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{p.profitPercent}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button onClick={() => navigate(`/companydashboard/finance/projects/${p.realId}`)} className="p-1 text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/10 rounded-full transition-colors inline-flex">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No active projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase Orders */}
        <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-50 dark:bg-[#792359]/10 rounded-sm">
                <Briefcase size={14} className="text-[#792359] dark:text-[#e6a8d0]" />
              </div>
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-white">Recent Purchase Orders</h2>
            </div>
            <button onClick={() => navigate('/companydashboard/finance/pos')} className="text-xs font-bold text-[#792359] dark:text-[#e6a8d0] hover:underline whitespace-nowrap">View All</button>
          </div>
          <div className="flex-1 space-y-3">
            {recentPOs.map((po, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 shrink-0 whitespace-nowrap">{po.id}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">{po.vendor}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm shrink-0 whitespace-nowrap">{po.project}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap">{po.amount}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-sm ${po.statusColor} whitespace-nowrap`}>{po.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-sm">
                <CreditCard size={14} className="text-amber-500 dark:text-amber-400" />
              </div>
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-white">Recent Expenses</h2>
            </div>
            <button onClick={() => navigate('/companydashboard/finance/expenses')} className="text-xs font-bold text-[#792359] dark:text-[#e6a8d0] hover:underline whitespace-nowrap">View All</button>
          </div>
          <div className="flex-1 space-y-3">
            {recentExpenses.map((ex, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 whitespace-nowrap">{ex.date}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">{ex.type}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm shrink-0 whitespace-nowrap">{ex.project}</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap shrink-0">{ex.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Challans */}
        <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-sm">
                <Briefcase size={14} className="text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-white">Recent Delivery Challans</h2>
            </div>
            <button onClick={() => navigate('/companydashboard/finance/challans')} className="text-xs font-bold text-[#792359] dark:text-[#e6a8d0] hover:underline whitespace-nowrap">View All</button>
          </div>
          <div className="flex-1 space-y-3">
            {recentChallans.map((ch, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 shrink-0 whitespace-nowrap">{ch.id}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">{ch.vendor}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm shrink-0 whitespace-nowrap">{ch.project}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{ch.date}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-sm ${ch.statusColor} whitespace-nowrap`}>{ch.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
