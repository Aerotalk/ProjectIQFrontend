
import { useState, useEffect, useRef } from 'react';
import { Plus, Search, MoreHorizontal, FileText, Upload, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import { PurchaseOrderService } from '../../services/po.service';
import type { PurchaseOrder } from '../../services/po.service';
import { ProjectService } from '../../services/project.service';
import type { Project } from '../../services/project.service';
import { VendorService } from '../../services/vendor.service';

export default function POManagement() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    projectId: '', vendorId: '', poNumber: '', poDate: '', amount: '', remarks: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPOs();
    fetchProjects();
    fetchVendors();
  }, []);

  const fetchPOs = async () => {
    try {
      const data = await PurchaseOrderService.getPurchaseOrders();
      setPos(data);
    } catch (error) {
      toast.error('Failed to fetch Purchase Orders');
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await ProjectService.getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch Projects');
    }
  };

  const fetchVendors = async () => {
    try {
      const data = await VendorService.getVendors();
      setVendors(data);
    } catch (error) {
      toast.error('Failed to fetch Vendors');
    }
  };

  const uploadFile = async (selectedFile: File) => {
    const formDataObj = new FormData();
    formDataObj.append('file', selectedFile);
    formDataObj.append('organizationId', localStorage.getItem('selectedCompanyId') || '');
    
    const response = await api.post('/admin/files/upload', formDataObj);
    return response.data.id;
  };

  const handleSavePO = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let attachmentFileId = null;
      if (file) {
        attachmentFileId = await uploadFile(file);
      }

      await PurchaseOrderService.createPurchaseOrder({
        projectId: formData.projectId,
        vendorId: formData.vendorId,
        poNumber: formData.poNumber,
        poDate: formData.poDate,
        amount: parseFloat(formData.amount),
        remarks: formData.remarks,
        status: 'Pending',
        attachmentFileId: attachmentFileId
      });

      toast.success('Purchase Order created successfully');
      setIsFormVisible(false);
      setFormData({ projectId: '', vendorId: '', poNumber: '', poDate: '', amount: '', remarks: '' });
      setFile(null);
      fetchPOs();
    } catch (error) {
      toast.error('Failed to create Purchase Order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPOs = pos.filter(po => 
    po.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    po.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPOs.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage vendor purchase orders linked to projects</p>
        </div>
        <button 
          onClick={() => setIsFormVisible(true)}
          className="px-4 py-2 bg-[#792359] text-white rounded-sm text-sm font-medium hover:bg-[#52173c] transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={16} /> Create PO
        </button>
      </div>
      {!isFormVisible ? (
        <div className="bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              <select className="px-3 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#792359]">
                <option value="">All Projects</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
              </select>
              <select className="px-3 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#792359]">
                <option value="">All Vendors</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
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
                  <th className="px-6 py-3">PO Number</th>
                  <th className="px-6 py-3">Vendor</th>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">PO Date</th>
                  <th className="px-6 py-3">Amount (₹)</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {currentItems.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group text-sm">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{po.poNumber}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{po.vendorName}</td>
                    <td className="px-6 py-4 font-medium text-[#792359] dark:text-[#e6a8d0]">{po.projectName}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{po.poDate}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{po.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${getStatusColor(po.status || '')}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-1 text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/10 rounded-full transition-colors inline-flex">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No purchase orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPOs.length)} of {filteredPOs.length} entries
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
                  className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm font-medium transition-colors ${
                    currentPage === page 
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
              <FileText size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
              Add New Purchase Order
            </h2>
            <button 
              onClick={() => setIsFormVisible(false)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSavePO} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project <span className="text-red-500">*</span></label>
                  <select required value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors">
                    <option value="">Select project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Vendor <span className="text-red-500">*</span></label>
                  <select required value={formData.vendorId} onChange={e => setFormData({...formData, vendorId: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors">
                    <option value="">Select vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">PO Number <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="e.g. PO-2025-001" value={formData.poNumber} onChange={e => setFormData({...formData, poNumber: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">PO Date <span className="text-red-500">*</span></label>
                  <input required type="date" value={formData.poDate} onChange={e => setFormData({...formData, poDate: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Amount (₹) <span className="text-red-500">*</span></label>
                  <input required type="number" step="0.01" placeholder="e.g. 50000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Attachment</label>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }} 
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-sm p-8 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
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
                      onChange={e => setFormData({...formData, remarks: e.target.value})} 
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
                  {isSubmitting ? 'Saving...' : 'Save Purchase Order'}
                </button>
              </div>
            </form>
          </div>
>>>>>>> Stashed changes
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">PO Number</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Project Linked</th>
                <th className="px-6 py-4">PO Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {POS.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#792359] dark:text-[#e6a8d0] flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      {po.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{po.vendor}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{po.project}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{po.date}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{po.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-sm 
                      ${po.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        po.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'}`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center relative">
                    <button className="p-1 text-gray-400 hover:text-[#792359] dark:hover:text-[#e6a8d0] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
