import { useState } from 'react';
import { Paperclip, FileText, Download, CheckCircle, Circle } from 'lucide-react';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';

export default function TicketDetails() {
  const [activeTab, setActiveTab] = useState('Overview');

  useBreadcrumbs([
    { label: 'Tickets', path: '/companydashboard/tickets' },
    { label: 'TK-100245' }
  ]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Unable to access analytics dashboard</h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md text-red-700 bg-red-50 border border-red-100 dark:bg-red-500/10 dark:border-red-500/20">High</span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md text-purple-700 bg-purple-50 border border-purple-100 dark:bg-purple-500/10 dark:border-purple-500/20">In Progress</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
            Created on May 18, 2025 10:30 AM <span className="w-1 h-1 rounded-full bg-gray-300"></span> By Priya Sharma <span className="w-1 h-1 rounded-full bg-gray-300"></span> via Portal
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 transition-colors">
            Resolve Ticket
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* Tabs */}
          <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex text-sm font-medium">
            {['Overview', 'Comments (4)', 'Attachments (2)', 'Work Logs (3)', 'Audit Logs'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.split(' ')[0])}
                className={`px-6 py-3.5 transition-colors border-b-2 ${activeTab === tab.split(' ')[0] ? 'border-[#792359] text-[#792359] dark:text-[#e6a8d0] dark:border-[#e6a8d0] bg-gray-50/50 dark:bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.02]'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Overview' && (
            <>
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm p-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5 border-b border-gray-100 dark:border-white/5 pb-3">Ticket Information</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Ticket ID</span> <span className="font-medium text-gray-900 dark:text-white">TK-100245</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Category</span> <span className="font-medium text-gray-900 dark:text-white">Technical Issue {'>'} Dashboard / Reporting</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Priority</span> <span className="font-medium text-red-600">High</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Impact</span> <span className="font-medium text-gray-900 dark:text-white">Medium</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Urgency</span> <span className="font-medium text-red-600">High</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Status</span> <span className="font-medium text-gray-900 dark:text-white">In Progress</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">SLA</span> <span className="font-medium text-gray-900 dark:text-white">Response in 2h | Resolution in 8h</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Due Date</span> <span className="font-medium text-gray-900 dark:text-white">May 18, 2025 06:30 PM</span></div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm p-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5 border-b border-gray-100 dark:border-white/5 pb-3">Client Information</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-white/5 text-[#792359] font-bold flex items-center justify-center rounded text-xs">TN</div>
                      <span className="font-semibold text-gray-900 dark:text-white">TechNova Pvt Ltd</span>
                    </div>
                    <div className="flex justify-between"><span className="text-gray-500">Client ID</span> <span className="font-medium text-gray-900 dark:text-white">CL-10024</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Email</span> <span className="font-medium text-gray-900 dark:text-white">admin@technova.com</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Phone</span> <span className="font-medium text-gray-900 dark:text-white">+91 98765 43210</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Account Manager</span> <span className="font-medium text-gray-900 dark:text-white">Riya Mehta</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Support Plan</span> <span className="font-medium text-gray-900 dark:text-white">Premium</span></div>
                    
                    <div className="pt-2">
                      <a href="#" className="text-sm font-semibold text-[#792359] dark:text-[#e6a8d0] hover:underline">View Client Profile</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  We are unable to load the analytics dashboard since this morning. Getting error "Failed to load data" on the dashboard widget. Please check and resolve this at the earliest. We have a board meeting in the afternoon and need this data urgently.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Paperclip size={16} className="text-gray-400" />
                    Attachments (2)
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-md border border-gray-200 dark:border-white/10 w-64">
                      <div className="bg-[#792359]/10 p-2 rounded text-[#792359] dark:text-[#e6a8d0]"><FileText size={20} /></div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">error_screenshot.png</p>
                        <p className="text-[10px] text-gray-500">1.2 MB</p>
                      </div>
                      <Download size={14} className="text-gray-400 hover:text-gray-700 cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-md border border-gray-200 dark:border-white/10 w-64">
                      <div className="bg-[#792359]/10 p-2 rounded text-[#792359] dark:text-[#e6a8d0]"><FileText size={20} /></div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">dashboard_error.log</p>
                        <p className="text-[10px] text-gray-500">2.4 KB</p>
                      </div>
                      <Download size={14} className="text-gray-400 hover:text-gray-700 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Right Sidebar - Assignment & Timeline */}
        <div className="w-full xl:w-[340px] space-y-6">
          
          <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Assigned To</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center font-bold text-[#792359] dark:text-[#e6a8d0] border-2 border-white dark:border-[#181a1f] shadow-sm">
                RS
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Rohit Singh</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Senior Support Engineer</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Timeline</h3>
            <div className="relative pl-6 space-y-8">
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800"></div>
              
              <div className="relative">
                <CheckCircle className="absolute -left-6 top-0 text-gray-300 dark:text-gray-600 bg-white dark:bg-[#181a1f]" size={16} />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Open</p>
                <p className="text-xs text-gray-500 mt-1">May 18, 10:30 AM</p>
                <p className="text-xs text-gray-400 mt-0.5">By Priya Sharma</p>
              </div>
              
              <div className="relative">
                <CheckCircle className="absolute -left-6 top-0 text-gray-300 dark:text-gray-600 bg-white dark:bg-[#181a1f]" size={16} />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Assigned</p>
                <p className="text-xs text-gray-500 mt-1">May 18, 10:35 AM</p>
                <p className="text-xs text-gray-400 mt-0.5">By System</p>
              </div>
              
              <div className="relative">
                <Circle className="absolute -left-6 top-0 text-[#792359] dark:text-[#e6a8d0] fill-[#792359]/20 bg-white dark:bg-[#181a1f]" size={16} />
                <p className="text-sm font-bold text-[#792359] dark:text-[#e6a8d0]">In Progress</p>
                <p className="text-xs text-[#792359]/70 dark:text-[#e6a8d0]/70 mt-1">May 18, 10:40 AM</p>
                <p className="text-xs text-[#792359]/60 dark:text-[#e6a8d0]/60 mt-0.5">By Rohit Singh</p>
              </div>
              
              <div className="relative opacity-50">
                <Circle className="absolute -left-6 top-0 text-gray-300 dark:text-gray-600 bg-white dark:bg-[#181a1f]" size={16} />
                <p className="text-sm font-medium text-gray-500">Waiting for Client</p>
              </div>

              <div className="relative opacity-50">
                <Circle className="absolute -left-6 top-0 text-gray-300 dark:text-gray-600 bg-white dark:bg-[#181a1f]" size={16} />
                <p className="text-sm font-medium text-gray-500">Resolved</p>
              </div>
              
              <div className="relative opacity-50">
                <Circle className="absolute -left-6 top-0 text-gray-300 dark:text-gray-600 bg-white dark:bg-[#181a1f]" size={16} />
                <p className="text-sm font-medium text-gray-500">Closed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">SLA Status</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Response Time</span>
                  <span className="text-[#792359] dark:text-[#e6a8d0]">1h 30m / 2h</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                  <div className="bg-[#792359] dark:bg-[#e6a8d0] h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Resolution Time</span>
                  <span className="text-gray-500">-- / 8h</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                  <div className="bg-gray-300 dark:bg-gray-600 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
