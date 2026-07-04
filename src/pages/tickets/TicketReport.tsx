
import { Download, FileText, Activity, Zap, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function TicketReport() {
  return (
    <div className="max-w-[1100px] mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Tickets</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">TK-100245</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-[#792359] dark:text-[#e6a8d0] font-medium text-sm">Final Report</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Final Report - TK-100245</h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md text-green-700 bg-green-50 border border-green-100 dark:bg-green-500/10 dark:border-green-500/20">Resolved</span>
          </div>
        </div>
        <button className="px-5 py-2.5 bg-[#792359] hover:bg-[#52173c] text-white rounded-sm text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Download size={16} /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Nav (Simulated as content flow instead of tabs for a report feel) */}
        <div className="lg:col-span-1 space-y-2">
           <div className="bg-[#792359]/5 text-[#792359] dark:bg-[#e6a8d0]/10 dark:text-[#e6a8d0] font-semibold flex items-center gap-3 px-4 py-3 rounded-md">
             <FileText size={18} /> Ticket Summary
           </div>
           <div className="text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-colors">
             <Activity size={18} /> Root Cause Analysis
           </div>
           <div className="text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-colors">
             <Zap size={18} /> Resolution Steps
           </div>
           <div className="text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-colors">
             <MessageSquare size={18} /> Customer Feedback
           </div>
           <div className="text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-colors">
             <CheckCircle2 size={18} /> SLA Compliance
           </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/5 pb-3">Ticket Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Ticket ID</span> <span className="col-span-2 font-medium text-gray-900 dark:text-white">TK-100245</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Subject</span> <span className="col-span-2 font-medium text-gray-900 dark:text-white">Unable to access analytics dashboard</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Client</span> <span className="col-span-2 font-medium text-gray-900 dark:text-white">TechNova Pvt Ltd</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Category</span> <span className="col-span-2 font-medium text-gray-900 dark:text-white">Technical Issue {'>'} Dashboard</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Priority</span> <span className="col-span-2 font-medium text-red-600">High</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Status</span> <span className="col-span-2 font-medium text-green-600">Resolved</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Created On</span> <span className="col-span-2 font-medium text-gray-900 dark:text-white">May 18, 2025 10:30 AM</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Resolved On</span> <span className="col-span-2 font-medium text-gray-900 dark:text-white">May 18, 2025 03:45 PM</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Resolved By</span> <span className="col-span-2 font-medium text-gray-900 dark:text-white">Rohit Singh</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/5 pb-3">SLA Compliance</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-green-500" />
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">Response Time</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">1h 30m <span className="text-xs text-gray-400 ml-1">(Within SLA)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-green-500" />
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">Resolution Time</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">5h 15m <span className="text-xs text-gray-400 ml-1">(Within SLA)</span></span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/5 pb-3">Customer Feedback</h3>
              <div className="space-y-3">
                <div className="flex gap-1">
                   {[1,2,3,4,5].map(star => (
                     <svg key={star} className="w-5 h-5 text-orange-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                   ))}
                </div>
                <p className="text-xs text-gray-500 font-medium">Excellent</p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Comments</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 italic">"Very quick response. Issue resolved perfectly. Thank you!"</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#181a1f] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm p-6">
             <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-white/5 pb-3">Root Cause Analysis</h3>
             <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
               The analytics database cluster experienced a connection timeout issue due to a sudden spike in malformed queries originating from a legacy integration script. This caused the connection pool to become exhausted, resulting in the "Failed to load data" error on the frontend widget.
             </p>
             
             <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 mt-8 border-b border-gray-100 dark:border-white/5 pb-3">Resolution Steps</h3>
             <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
               <li>Identified the source of malformed queries and temporarily disabled the legacy script.</li>
               <li>Restarted the connection pool manager to flush dead connections.</li>
               <li>Applied a rate limit filter to the specific API endpoint handling the legacy integration.</li>
               <li>Verified data loading on the customer's dashboard successfully.</li>
             </ul>
             
             <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 mt-8 border-b border-gray-100 dark:border-white/5 pb-3">Engineer Notes</h3>
             <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 p-4 rounded-md">
               We need to schedule a follow-up call with TechNova to permanently migrate them off the legacy integration script to the new API v2. I have created a sub-task for the Customer Success team.
             </p>
          </div>

        </div>
      </div>

    </div>
  );
}
