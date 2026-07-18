import { useState } from 'react';
import { Search, MoreVertical, Plus, ChevronLeft, ChevronRight, Store, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useVendors } from '../../hooks/useVendors';
import type { Vendor } from '../../types/vendor.types';
import VendorDrawer from './vendors/components/VendorDrawer';
import VendorProfileView from './vendors/components/VendorProfileView';
import type { VendorFormValues } from './vendors/validators/vendorValidation';
import { Input } from '@/components/ui/input';

export default function VendorsList() {
  const { selectedCompanyId: companyId } = useAuth();
  const { vendors, isListLoading: isLoading, isSaveLoading: isSubmitting, createVendor, updateVendor } = useVendors({ companyId });
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleSaveVendor = async (data: VendorFormValues) => {
    try {
      if (drawerMode === 'create') {
        await createVendor(data as unknown as Omit<Vendor, 'id' | 'vendorNo'>);
        toast.success('Vendor added successfully');
      } else if (drawerMode === 'edit' && selectedVendor) {
        await updateVendor(selectedVendor.id, data as unknown as Partial<Vendor>);
        toast.success('Vendor updated successfully');
      }
      setIsDrawerOpen(false);
    } catch (error: any) {
      // Pass the error to the drawer to map validation errors
      throw error;
    }
  };

  const openDrawer = (mode: 'create' | 'edit' | 'view', vendor?: Vendor) => {
    setDrawerMode(mode);
    setSelectedVendor(vendor || null);
    setIsDrawerOpen(true);
    setOpenDropdownId(null);
  };

  const filteredVendors = vendors.filter(v => 
    v.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.primaryContactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVendors.slice(indexOfFirstItem, indexOfLastItem);

  if (isDrawerOpen) {
    return (
      <div className="max-w-[1400px] mx-auto">
        {drawerMode === 'view' ? (
          <VendorProfileView 
            vendor={selectedVendor!} 
            onClose={() => setIsDrawerOpen(false)}
            onEdit={() => setDrawerMode('edit')}
          />
        ) : (
          <VendorDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)}
            mode={drawerMode}
            initialData={selectedVendor as Partial<Vendor>}
            vendorId={selectedVendor?.id}
            onSave={handleSaveVendor}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-1">
            <span>Sales</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-gray-200">Vendors</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Vendors</h1>
        </div>
        <button 
          onClick={() => openDrawer('create')}
          className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
        >
          <Plus size={16} />
          Add Vendor
        </button>
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              type="text" 
              placeholder="Search vendors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#792359]" />
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-gray-500">
              <Store size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">No vendors found</p>
              <p className="text-sm">Try adjusting your search or add a new vendor.</p>
            </div>
          ) : (
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
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {vendor.displayName || vendor.companyName || vendor.firstName}
                      <div className="text-xs text-gray-500 font-normal mt-0.5">{vendor.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{vendor.primaryContactPerson}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{vendor.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{vendor.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{vendor.billingCity}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium border
                        ${vendor.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                          : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-center ${openDropdownId === vendor.id ? 'relative z-50' : 'relative z-10'}`}>
                      <button 
                        onClick={() => setOpenDropdownId(openDropdownId === vendor.id ? null : vendor.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors inline-flex"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdownId === vendor.id && (
                        <div className="absolute right-8 top-10 w-32 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-lg z-10 py-1 text-left">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openDrawer('view', vendor);
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                          >
                            View
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openDrawer('edit', vendor);
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredVendors.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredVendors.length)} of {filteredVendors.length} entries
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

    </div>
  );
}
