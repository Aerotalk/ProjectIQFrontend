import { ArrowLeft, CheckCircle2, Circle, Edit, TrendingUp, IndianRupee, FileText, FileDown, Landmark, FileCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TABS = ['Overview', 'Purchase Orders', 'Delivery Challans', 'Expenses', 'Invoices', 'Payments', 'Profitability'];

export default function ProjectFinanceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-[#181a1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{id || 'PRJ-1001'} - Cloud Migration</h1>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-sm">Active</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Customer: TechNova Pvt Ltd</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Edit size={16} /> Edit Project
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Project Value', value: '₹50,00,000', icon: IndianRupee },
          { label: 'Total PO Value', value: '₹20,00,000', icon: FileText },
          { label: 'Total Expenses', value: '₹12,500', icon: FileDown },
          { label: 'Total Invoices', value: '₹30,00,000', icon: FileCheck },
          { label: 'Payments Received', value: '₹25,00,000', icon: Landmark },
          { label: 'Net Profit', value: '₹30,00,000', icon: TrendingUp, color: 'text-green-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#181a1f] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-gray-50 dark:bg-white/5 rounded-sm">
                <stat.icon size={16} className="text-[#792359] dark:text-[#e6a8d0]" />
              </div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
            <h3 className={`text-lg font-bold ${stat.color ? stat.color : 'text-gray-900 dark:text-white'}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#181a1f] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100 dark:border-white/5 custom-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab 
                  ? 'border-[#792359] text-[#792359] dark:border-[#e6a8d0] dark:text-[#e6a8d0]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[400px]">
          {activeTab === 'Overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Project Timeline</h3>
                
                {/* Custom Progress Timeline */}
                <div className="relative flex justify-between items-center max-w-4xl mx-auto px-12">
                  <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-1 bg-gray-200 dark:bg-white/10 z-0"></div>
                  <div className="absolute left-16 right-1/4 top-1/2 -translate-y-1/2 h-1 bg-[#792359] dark:bg-[#e6a8d0] z-0"></div>
                  
                  {[
                    { label: 'Confirmed Project', date: '01-Jul', status: 'done' },
                    { label: 'Vendor Assigned', date: '02-Jul', status: 'done' },
                    { label: 'PO Created', date: '03-Jul', status: 'done' },
                    { label: 'Invoice Raised', date: '10-Jul', status: 'current' },
                    { label: 'Payment Received', date: 'Pending', status: 'pending' },
                  ].map((step, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center gap-3 bg-white dark:bg-[#181a1f] px-2">
                      {step.status === 'done' ? (
                        <CheckCircle2 size={32} className="text-[#792359] dark:text-[#e6a8d0] bg-white dark:bg-[#181a1f] rounded-full" />
                      ) : step.status === 'current' ? (
                        <div className="w-8 h-8 rounded-full border-4 border-[#792359] dark:border-[#e6a8d0] bg-white dark:bg-[#181a1f] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-[#792359] dark:bg-[#e6a8d0] rounded-full"></div>
                        </div>
                      ) : (
                        <Circle size={32} className="text-gray-300 dark:text-gray-600 bg-white dark:bg-[#181a1f] rounded-full" />
                      )}
                      <div className="text-center">
                        <p className={`text-sm font-semibold ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>{step.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Latest Activity</h4>
                <ul className="space-y-4 text-sm">
                  <li className="flex gap-4">
                    <span className="text-gray-400 w-24">Today, 10:30 AM</span>
                    <span className="text-gray-800 dark:text-gray-200">Invoice <span className="font-medium text-[#792359]">INV-2026-501</span> generated for ₹30,00,000</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-gray-400 w-24">04-Jul, 02:15 PM</span>
                    <span className="text-gray-800 dark:text-gray-200">Expense <span className="font-medium text-[#792359]">EXP-26-001</span> logged for Travel (₹12,500)</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-gray-400 w-24">01-Jul, 09:00 AM</span>
                    <span className="text-gray-800 dark:text-gray-200">Purchase Order <span className="font-medium text-[#792359]">PO-2026-001</span> sent to CloudTech Systems</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab !== 'Overview' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No {activeTab} Data Found</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm">This project currently has no associated records for this category, or you do not have permission to view them.</p>
              <button className="mt-6 px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] transition-colors shadow-sm">
                Add New Record
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
