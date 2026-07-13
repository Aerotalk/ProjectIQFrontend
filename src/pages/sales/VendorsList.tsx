import React, { useState } from 'react';
import { Search, MoreVertical, Plus, ChevronLeft, ChevronRight, Store, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  status: 'Active' | 'Inactive';
}

export default function VendorsList() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: '1', name: 'CloudServe Pvt Ltd', contactPerson: 'Amit Joshi', email: 'amit@cloudserve.com', phone: '+91 98765 11111', city: 'Mumbai', status: 'Active' },
    { id: '2', name: 'SMSProvider Ltd', contactPerson: 'Riya Malhotra', email: 'riya@smsprovider.com', phone: '+91 91234 22222', city: 'Delhi', status: 'Active' },
    { id: '3', name: 'TechInfra Solutions', contactPerson: 'Saurabh Jain', email: 'saurabh@techinfra.com', phone: '+91 88888 33333', city: 'Bengaluru', status: 'Active' },
    { id: '4', name: 'DataXchange India', contactPerson: 'Pankaj Nair', email: 'pankaj@dataxchange.com', phone: '+91 98775 44444', city: 'Mumbai', status: 'Inactive' },
    { id: '5', name: 'MaXion Technologies', contactPerson: 'Rahul Iyer', email: 'rahul@maxion.com', phone: '+91 91300 56666', city: 'Chennai', status: 'Active' },
  ]);

  const [formData, setFormData] = useState({
    name: '', contactPerson: '', email: '', phone: '', city: '', status: 'Active' as 'Active' | 'Inactive'
  });

  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    if (editingId) {
      setVendors(vendors.map(v => v.id === editingId ? { ...formData, id: editingId } : v));
      toast.success('Details updated successfully');
    } else {
      const newVendor: Vendor = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setVendors([newVendor, ...vendors]);
      toast.success('Vendor added successfully');
    }

    setIsFormVisible(false);
    setEditingId(null);
    setFormData({ name: '', contactPerson: '', email: '', phone: '', city: '', status: 'Active' });
    setIsSubmitting(false);
  };

  const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVendors.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-1">
            <span>Sales</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-gray-200">Vendors</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Vendors</h1>
        </div>
        {!isFormVisible && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', contactPerson: '', email: '', phone: '', city: '', status: 'Active' });
              setIsFormVisible(true);
            }}
            className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
          >
            <Plus size={16} />
            Add Vendor
          </button>
        )}
      </div>

      {isFormVisible ? (
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-center rounded-t-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Store size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
              {editingId ? 'Edit Vendor Details' : 'Add New Vendor'}
            </h2>
            <button 
              onClick={() => {
                setIsFormVisible(false);
                setEditingId(null);
                setFormData({ name: '', contactPerson: '', email: '', phone: '', city: '', status: 'Active' });
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSaveVendor} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Vendor Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" placeholder="e.g. CloudServe Pvt Ltd" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Contact Person <span className="text-red-500">*</span></label>
                  <input required type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" placeholder="e.g. Amit Joshi" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">City</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" placeholder="e.g. Mumbai" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email <span className="text-red-500">*</span></label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" placeholder="amit@example.com" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Phone <span className="text-red-500">*</span></label>
                  <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" placeholder="+91 98765 11111" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-6 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Save Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search vendors..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Vendor Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Contact Person</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {currentItems.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{vendor.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{vendor.contactPerson}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{vendor.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{vendor.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{vendor.city}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium border
                        ${vendor.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                          : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <button 
                        onClick={() => setOpenDropdownId(openDropdownId === vendor.id ? null : vendor.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors inline-flex"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdownId === vendor.id && (
                        <div className="absolute right-8 top-10 w-32 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-lg z-10 py-1 text-left">
                          <button 
                            onClick={() => {
                              setFormData({
                                name: vendor.name,
                                contactPerson: vendor.contactPerson,
                                email: vendor.email,
                                phone: vendor.phone,
                                city: vendor.city,
                                status: vendor.status
                              });
                              setEditingId(vendor.id);
                              setIsFormVisible(true);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                          >
                            View/Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredVendors.length)} of {filteredVendors.length} entries
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      : 'border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
