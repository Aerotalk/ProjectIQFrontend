import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Truck, Upload, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { FinanceService } from '../../services/finance.service';
import { VendorService } from '../../services/vendor.service';
import { ProjectService } from '../../services/project.service';
import type { Challan } from '../../types/finance.types';
import type { Vendor } from '../../types/vendor.types';
import type { Project } from '../../services/project.service';

export default function ChallanManagement() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [challans, setChallans] = useState<Challan[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    projectId: '', vendorId: '', challanNumber: '', challanDate: '', remarks: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [challansData, vendorsData, projectsData] = await Promise.all([
        FinanceService.getChallans(),
        VendorService.getVendors(),
        ProjectService.getProjects()
      ]);
      setChallans(challansData);
      setVendors(vendorsData);
      setProjects(projectsData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChallan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let attachmentFileId = undefined;
      if (file) {
        const uploadRes = await FinanceService.uploadFile(file);
        attachmentFileId = uploadRes.id;
      }

      await FinanceService.createChallan({
        projectId: formData.projectId,
        vendorId: formData.vendorId,
        challanNumber: formData.challanNumber,
        challanDate: formData.challanDate,
        remarks: formData.remarks,
        status: 'Pending',
        projectName: projects.find(p => p.id === formData.projectId)?.projectName || '',
        vendorName: vendors.find(v => v.id === formData.vendorId)?.displayName || '',
        attachmentFileId
      });

      toast.success('Delivery Challan added successfully');
      setIsFormVisible(false);
      setFormData({ projectId: '', vendorId: '', challanNumber: '', challanDate: '', remarks: '' });
      setFile(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to create Delivery Challan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'received': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'approved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredChallans = challans.filter(ch =>
    ch.challanNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredChallans.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredChallans.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
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
                {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
              </select>
              <select className="px-3 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#792359]">
                <option>All Vendors</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.displayName}</option>)}
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
                {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td></tr>
                ) : currentItems.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No delivery challans found.</td></tr>
                ) : currentItems.map((ch) => (
                  <tr key={ch.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group text-sm">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{ch.challanNumber}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{ch.vendorName}</td>
                    <td className="px-6 py-4 font-medium text-[#792359] dark:text-[#e6a8d0]">{ch.projectName}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{ch.challanDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${getStatusColor(ch.status)}`}>
                        {ch.status || 'Pending'}
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
              Showing {filteredChallans.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredChallans.length)} of {filteredChallans.length} entries
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
                  <select required value={formData.projectId} onChange={e => setFormData({ ...formData, projectId: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors">
                    <option value="">Select project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Vendor <span className="text-red-500">*</span></label>
                  <select required value={formData.vendorId} onChange={e => setFormData({ ...formData, vendorId: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors">
                    <option value="">Select vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.displayName}</option>)}
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
                  <div className="relative border-2 border-dashed border-gray-300 dark:border-white/10 rounded-sm p-8 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <Upload size={24} className="text-[#792359] dark:text-[#e6a8d0] mb-3 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-sm font-medium text-[#792359] dark:text-[#e6a8d0]">
                      {file ? file.name : 'Click to upload file'}
                    </span>
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
