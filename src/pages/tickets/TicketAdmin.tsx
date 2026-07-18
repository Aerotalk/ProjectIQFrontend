import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';

export default function TicketAdmin() {
  const [activeTab, setActiveTab] = useState('Projects');

  const tabs = ['Projects', 'Categories', 'Teams', 'Roles', 'SLAs', 'Escalation Rules', 'Custom Fields', 'Email Templates'];

  useBreadcrumbs([
    { label: 'Support', path: '/companydashboard/tickets' },
    { label: 'Admin Settings' }
  ]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your ticket management system preferences.</p>
        </div>
        <button className="px-4 py-2 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} /> Add {activeTab.replace(/s$/, '')}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Vertical Tabs Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex flex-col font-medium">
            {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3.5 transition-colors border-l-2 text-left text-sm ${activeTab === tab ? 'border-[#792359] text-[#792359] dark:text-[#e6a8d0] dark:border-[#e6a8d0] bg-[#792359]/5 dark:bg-white/5' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-white/[0.02]'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
          
          <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{activeTab} Configuration</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" placeholder={`Search ${activeTab.toLowerCase()}...`} className="pl-8 pr-4 py-1.5 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:border-[#792359] text-gray-900 dark:text-white w-full sm:w-64" />
              </div>
              <button className="px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                <Filter size={14} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'Projects' ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Project Name</th>
                    <th className="px-6 py-4">Project Code</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {[
                    { name: 'Analytics Platform', code: 'ANP', desc: 'Analytics and reporting platform', status: 'Active' },
                    { name: 'Customer Portal', code: 'CSP', desc: 'Customer self service portal', status: 'Active' },
                    { name: 'Mobile Application', code: 'MOB', desc: 'Mobile app support', status: 'Inactive' },
                    { name: 'API Services', code: 'API', desc: 'API and integration services', status: 'Active' },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                      <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{item.code}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.desc}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md ${
                          item.status === 'Active' ? 'text-green-700 bg-green-50 dark:bg-green-500/10' : 'text-gray-500 bg-gray-100 dark:bg-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-gray-400 hover:text-[#792359] dark:hover:text-[#e6a8d0] rounded-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Filter size={24} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-base font-medium text-gray-900 dark:text-white mb-1">{activeTab} configuration data</p>
                <p className="text-sm">Select 'Projects' tab to see the preview table implementation.</p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
