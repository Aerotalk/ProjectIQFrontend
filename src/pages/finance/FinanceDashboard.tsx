import React, { useState } from 'react';
import { Briefcase, IndianRupee, ShoppingCart, CreditCard, ArrowUpRight, ArrowDownRight, Eye, Calendar, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KPI_DATA = [
  { label: 'Active Projects', value: '24', trend: '+12% vs last month', icon: Briefcase, color: 'text-[#792359]', bgColor: 'bg-purple-50 dark:bg-[#792359]/10', isPositive: true },
  { label: 'Project Value', value: '₹ 1,20,00,000', trend: '+18% vs last month', icon: IndianRupee, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-500/10', isPositive: true },
  { label: 'PO Value', value: '₹ 45,00,000', trend: '+8% vs last month', icon: ShoppingCart, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10', isPositive: true },
  { label: 'Expenses', value: '₹ 12,50,000', trend: '-5% vs last month', icon: CreditCard, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-500/10', isPositive: false },
  { label: 'Profit (Est.)', value: '₹ 32,50,000', trend: '+22% vs last month', icon: IndianRupee, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-500/10', isPositive: true },
];

const PROJECTS = [
  { id: 'PRJ-001', name: 'Analytics Dashboard', customer: 'ABC Bank', value: '10,00,000', cost: '3,00,000', profit: '7,00,000', profitPercent: '70%', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'PRJ-002', name: 'Mobile App Development', customer: 'XYZ Ltd', value: '8,00,000', cost: '2,00,000', profit: '6,00,000', profitPercent: '75%', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'PRJ-003', name: 'Cloud Migration', customer: 'PQR Corp', value: '15,00,000', cost: '7,00,000', profit: '8,00,000', profitPercent: '53%', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'PRJ-004', name: 'Website Redesign', customer: 'LMN Pvt Ltd', value: '5,00,000', cost: '1,00,000', profit: '4,00,000', profitPercent: '80%', status: 'Completed', statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'PRJ-005', name: 'Data Integration', customer: 'TechNova Ltd', value: '12,00,000', cost: '4,80,000', profit: '7,20,000', profitPercent: '60%', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
];

const RECENT_POS = [
  { id: 'PO-014', vendor: 'AWS India Pvt Ltd', project: 'PRJ-001', amount: '₹ 1,50,000', status: 'Approved', statusColor: 'bg-green-100 text-green-700' },
  { id: 'PO-013', vendor: 'SMS Solutions', project: 'PRJ-002', amount: '₹ 50,000', status: 'Pending', statusColor: 'bg-orange-100 text-orange-700' },
  { id: 'PO-012', vendor: 'TechSoft Pvt Ltd', project: 'PRJ-003', amount: '₹ 2,20,000', status: 'Approved', statusColor: 'bg-green-100 text-green-700' },
  { id: 'PO-011', vendor: 'DigitalOcean', project: 'PRJ-003', amount: '₹ 1,80,000', status: 'Approved', statusColor: 'bg-green-100 text-green-700' },
];

const RECENT_EXPENSES = [
  { date: '10 May 2025', type: 'Travel Expense', project: 'PRJ-001', amount: '₹ 5,000' },
  { date: '09 May 2025', type: 'Training Expense', project: 'PRJ-002', amount: '₹ 10,000' },
  { date: '08 May 2025', type: 'Software License', project: 'PRJ-003', amount: '₹ 25,000' },
  { date: '07 May 2025', type: 'Internet Expense', project: 'PRJ-001', amount: '₹ 2,500' },
];

const RECENT_CHALLANS = [
  { id: 'DC-006', vendor: 'AWS India Pvt Ltd', project: 'PRJ-001', date: '10 May', status: 'Received', statusColor: 'bg-green-100 text-green-700' },
  { id: 'DC-005', vendor: 'SMS Solutions', project: 'PRJ-002', date: '09 May', status: 'Received', statusColor: 'bg-green-100 text-green-700' },
  { id: 'DC-004', vendor: 'TechSoft Pvt Ltd', project: 'PRJ-003', date: '07 May', status: 'Pending', statusColor: 'bg-orange-100 text-orange-700' },
  { id: 'DC-003', vendor: 'AWS India Pvt Ltd', project: 'PRJ-003', date: '05 May', status: 'Received', statusColor: 'bg-green-100 text-green-700' },
];

export default function FinanceDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Top Header & Date Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm text-sm text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            01 May 2025 - 31 May 2025 <Calendar size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {KPI_DATA.map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col justify-between hover:border-[#792359]/30 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-sm border ${kpi.bgColor} border-transparent`}>
                <kpi.icon size={18} className={kpi.color} strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{kpi.label}</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{kpi.value}</div>
              <div className={`flex items-center gap-1 text-[11px] font-semibold ${kpi.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                {kpi.isPositive ? <ArrowUpRight size={12} strokeWidth={2.5} /> : <ArrowDownRight size={12} strokeWidth={2.5} />}
                <span>{kpi.trend}</span>
              </div>
            </div>
          </div>
        ))}
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
              {PROJECTS.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group text-sm">
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
                    <button onClick={() => navigate(`/companydashboard/finance/projects/${p.id}`)} className="p-1 text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/10 rounded-full transition-colors inline-flex">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase Orders */}
        <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-50 dark:bg-[#792359]/10 rounded-sm">
                <Briefcase size={14} className="text-[#792359] dark:text-[#e6a8d0]" />
              </div>
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-white">Recent Purchase Orders</h2>
            </div>
            <button onClick={() => navigate('/companydashboard/finance/pos')} className="text-xs font-bold text-[#792359] dark:text-[#e6a8d0] hover:underline">View All</button>
          </div>
          <div className="flex-1 space-y-3">
            {RECENT_POS.map((po, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-12">{po.id}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-32 truncate">{po.vendor}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm">{po.project}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{po.amount}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-sm ${po.statusColor}`}>{po.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-50 dark:bg-red-500/10 rounded-sm">
                <CreditCard size={14} className="text-red-500 dark:text-red-400" />
              </div>
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-white">Recent Expenses</h2>
            </div>
            <button onClick={() => navigate('/companydashboard/finance/expenses')} className="text-xs font-bold text-[#792359] dark:text-[#e6a8d0] hover:underline">View All</button>
          </div>
          <div className="flex-1 space-y-3">
            {RECENT_EXPENSES.map((ex, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 dark:text-gray-500 w-16">{ex.date}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 w-28 truncate">{ex.type}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm">{ex.project}</span>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{ex.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Challans */}
        <div className="bg-white dark:bg-[#181a1f] p-5 rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-sm">
                <Briefcase size={14} className="text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-white">Recent Delivery Challans</h2>
            </div>
            <button onClick={() => navigate('/companydashboard/finance/challans')} className="text-xs font-bold text-[#792359] dark:text-[#e6a8d0] hover:underline">View All</button>
          </div>
          <div className="flex-1 space-y-3">
            {RECENT_CHALLANS.map((ch, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-12">{ch.id}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-24 truncate">{ch.vendor}</span>
                  <span className="text-[10px] font-semibold text-[#792359] dark:text-[#e6a8d0] bg-[#792359]/10 px-1.5 rounded-sm">{ch.project}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{ch.date}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-sm ${ch.statusColor}`}>{ch.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
