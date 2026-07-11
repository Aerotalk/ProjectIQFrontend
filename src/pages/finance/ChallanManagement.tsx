import React, { useState } from 'react';
import { Plus, Search, Filter, Download, MoreHorizontal, Truck, X, Upload, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CHALLANS = [
  { id: 'DC-006', vendor: 'AWS India Pvt Ltd', project: 'PRJ-001', date: '10 May 2025', status: 'Received', statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'DC-005', vendor: 'SMS Solutions', project: 'PRJ-002', date: '09 May 2025', status: 'Received', statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'DC-004', vendor: 'TechSoft Pvt Ltd', project: 'PRJ-003', date: '07 May 2025', status: 'Pending', statusColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 'DC-003', vendor: 'AWS India Pvt Ltd', project: 'PRJ-003', date: '05 May 2025', status: 'Received', statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'DC-002', vendor: 'DigitalOcean', project: 'PRJ-004', date: '04 May 2025', status: 'Received', statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'DC-001', vendor: 'Zoho Corporation', project: 'PRJ-005', date: '03 May 2025', status: 'Received', statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
];

export default function ChallanManagement() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    project: '', vendor: '', challanNumber: '', challanDate: '', remarks: ''
  });

  const handleSaveChallan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success('Delivery Challan added successfully');
    setIsFormVisible(false);
    setFormData({ project: '', vendor: '', challanNumber: '', challanDate: '', remarks: '' });
    setIsSubmitting(false);
  };

  const filteredChallans = CHALLANS.filter(ch =>
    ch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredChallans.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredChallans.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-1">
            <span>Finance</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-gray-200">Delivery Challans</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isFormVisible ? 'Add Delivery Challan' : 'Delivery Challans'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {isFormVisible ? 'Add a new delivery challan' : 'Track deliveries received from vendors'}
          </p>
        </div>
        {!isFormVisible && (
          <button
            onClick={() => setIsFormVisible(true)}
            className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
          >
            <Plus size={16} /> Add Challan
          </button>
        )}
      </div>

      {!isFormVisible ? (
        <div className="bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              <select className="px-3 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#792359]">
                <option>All Projects</option>
                <option>PRJ-001</option>
              </select>
              <select className="px-3 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#792359]">
                <option>All Vendors</option>
                <option>AWS India</option>
              </select>
              <select className="px-3 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#792359]">
                <option>Status</option>
                <option>Received</option>
              </select>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#792359]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-white/[0.02] text-gray-700 dark:text-gray-300 text-xs font-semibold">
                <tr className="border-b border-gray-200 dark:border-white/5">
                  <th className="px-6 py-3">Challan No</th>
                  <th className="px-6 py-3">Vendor</th>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Challan Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {currentItems.map((ch) => (
                  <tr key={ch.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group text-sm">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{ch.id}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{ch.vendor}</td>
                    <td className="px-6 py-4 font-medium text-[#792359] dark:text-[#e6a8d0]">{ch.project}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{ch.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${ch.statusColor}`}>
                        {ch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-1 text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/10 rounded-full transition-colors inline-flex">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredChallans.length)} of {filteredChallans.length} entries
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm font-medium transition-colors ${currentPage === page
                      ? 'bg-[#792359] text-white shadow-sm'
                      : 'border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-center rounded-t-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Truck size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
              Add Delivery Challan
            </h2>
            <button
              onClick={() => setIsFormVisible(false)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSaveChallan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project <span className="text-red-500">*</span></label>
                  <select required value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors">
                    <option value="">Select project</option>
                    <option value="PRJ-001">PRJ-001 - Analytics Dashboard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Vendor <span className="text-red-500">*</span></label>
                  <select required value={formData.vendor} onChange={e => setFormData({ ...formData, vendor: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors">
                    <option value="">Select vendor</option>
                    <option value="AWS">AWS India Pvt Ltd</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Challan Number <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="Enter challan number" value={formData.challanNumber} onChange={e => setFormData({ ...formData, challanNumber: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Challan Date <span className="text-red-500">*</span></label>
                  <input required type="date" value={formData.challanDate} onChange={e => setFormData({ ...formData, challanDate: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Upload Document <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-sm p-8 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                    <Upload size={24} className="text-[#792359] dark:text-[#e6a8d0] mb-3 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-sm font-medium text-[#792359] dark:text-[#e6a8d0]">Click to upload file</span>
                    <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</span>
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Remarks</label>
                  <div className="relative">
                    <textarea
                      placeholder="Enter remarks (optional)"
                      value={formData.remarks}
                      onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors min-h-[120px] resize-none"
                    />
                    <span className="absolute bottom-2 right-2 text-[10px] text-gray-400">{formData.remarks.length} / 500</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-6 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? 'Saving...' : 'Save Challan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
