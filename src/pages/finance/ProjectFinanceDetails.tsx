import React, { useState } from 'react';
import { ArrowLeft, Edit, IndianRupee, FileText, FileDown, TrendingUp, Download, Eye, Link2, MoreHorizontal } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const TABS = ['Overview', 'Purchase Orders', 'Delivery Challans', 'Expenses'];

const SUMMARY = [
  { label: 'Project Value', value: '₹ 10,00,000', icon: IndianRupee, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-500/10' },
  { label: 'PO Cost', value: '₹ 2,00,000', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
  { label: 'Expenses', value: '₹ 50,000', icon: FileDown, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-500/10' },
  { label: 'Profit (Est.)', value: '₹ 7,50,000', icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10', trend: '+15%' },
];

const CHART_DATA = [
  { name: 'PO Cost', value: 20, color: '#3b82f6' },
  { name: 'Expenses', value: 5, color: '#ef4444' },
  { name: 'Profit', value: 75, color: '#10b981' },
];

const RECENT_TRANSACTIONS = [
  { date: '10 May 2025', refNo: 'EXP-014', desc: 'Team Travel', type: 'Expense', amount: '₹ 5,000', status: 'Approved', statusColor: 'bg-green-100 text-green-700' },
  { date: '08 May 2025', refNo: 'PO-012', desc: 'Server Costs', type: 'Purchase Order', amount: '₹ 2,20,000', status: 'Approved', statusColor: 'bg-green-100 text-green-700' },
  { date: '07 May 2025', refNo: 'DC-004', desc: 'Hardware Delivery', type: 'Delivery Challan', amount: '-', status: 'Pending', statusColor: 'bg-orange-100 text-orange-700' },
];

export default function ProjectFinanceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/5 rounded-sm transition-colors group">
          <ArrowLeft size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </button>
        <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400">
          <span>Projects</span>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-gray-900 dark:text-gray-200">{id || 'PRJ-001'}</span>
        </div>
      </div>

      {/* Project Header Card */}
      <div className="bg-white dark:bg-[#181a1f] p-6 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 text-xl font-bold border-2 border-blue-200 dark:border-blue-800/50">
            {id?.split('-')[1] || '01'}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold rounded-sm uppercase tracking-wide">
                In Progress
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5"><span className="font-semibold text-gray-700 dark:text-gray-300">Customer:</span> ABC Bank</div>
              <div className="flex items-center gap-1.5"><span className="font-semibold text-gray-700 dark:text-gray-300">Project Manager:</span> Sarah J.</div>
              <div className="flex items-center gap-1.5"><span className="font-semibold text-gray-700 dark:text-gray-300">Start Date:</span> 01 Jan 2025</div>
              <div className="flex items-center gap-1.5"><span className="font-semibold text-gray-700 dark:text-gray-300">End Date:</span> 31 Dec 2025</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 lg:border-l lg:border-gray-200 dark:lg:border-white/10 lg:pl-6 w-full lg:w-auto">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Project Value</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹ 10,00,000</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {SUMMARY.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-sm border ${stat.bgColor} border-transparent`}>
                <stat.icon size={18} className={stat.color} strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">{stat.value}</h3>
              {stat.trend && (
                <span className={`text-[11px] font-bold ${stat.color} bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-sm`}>
                  {stat.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-white/5 hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 outline-none ${
                activeTab === tab 
                  ? 'border-[#792359] text-[#792359] dark:border-[#e6a8d0] dark:text-[#e6a8d0] bg-[#792359]/5' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.02]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-0">
          {activeTab === 'Overview' && (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Financial Overview Donut */}
              <div className="lg:col-span-1 border border-gray-200 dark:border-white/10 rounded-sm p-5 bg-gray-50/30 dark:bg-white/[0.01]">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6">Financial Overview</h3>
                <div className="h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CHART_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {CHART_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '600' }}
                        itemStyle={{ color: '#111827' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-gray-500 font-medium">Profit %</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">75%</span>
                  </div>
                </div>
                
                {/* Cost Breakdown */}
                <div className="mt-6 space-y-3">
                  {CHART_DATA.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="lg:col-span-2 border border-gray-200 dark:border-white/10 rounded-sm p-5 bg-white dark:bg-[#181a1f]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                  <button className="text-xs font-semibold text-[#792359] dark:text-[#e6a8d0] hover:underline">View All</button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-white/[0.02] text-gray-700 dark:text-gray-300 text-[11px] font-semibold uppercase tracking-wider">
                      <tr className="border-b border-gray-200 dark:border-white/5">
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Ref No</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {RECENT_TRANSACTIONS.map((tx, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm">
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{tx.date}</td>
                          <td className="px-4 py-3 font-medium text-[#792359] dark:text-[#e6a8d0]">{tx.refNo}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{tx.desc}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-sm text-[10px] font-medium">
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white text-right">{tx.amount}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-wide ${tx.statusColor}`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'Overview' && (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/30 dark:bg-white/[0.01]">
              <div className="w-16 h-16 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No {activeTab} Records</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                There are currently no {activeTab.toLowerCase()} associated with this project.
              </p>
              <button className="mt-6 px-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
                Add Record
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
