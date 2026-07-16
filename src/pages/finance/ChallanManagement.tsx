import { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, MoreVertical, Truck,
  ChevronLeft, ChevronRight, Loader2, Package,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ChallanService } from '../../services/challan.service';
import type { DeliveryChallan } from '../../types/challan.types';
import ChallanDrawer from './challan/components/ChallanDrawer';
import type { ChallanFormValues } from './challan/validators/challanValidation';
import { VendorService } from '../../services/vendor.service';
import { useProjects } from '../../hooks/useProjects';
import type { Vendor } from '../../types/vendor.types';
import CustomSelect from '@/components/ui/CustomSelect';
import { useAuth } from '../../contexts/AuthContext';

export default function ChallanManagement() {
  const { selectedCompanyId } = useAuth();
  const { projects } = useProjects();
  const [challans, setChallans] = useState<DeliveryChallan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedChallan, setSelectedChallan] = useState<DeliveryChallan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterVendor, setFilterVendor] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Dropdown
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    fetchData();
  }, [selectedCompanyId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!selectedCompanyId) return;
      const [challanData, vendorData] = await Promise.all([
        ChallanService.getAll(selectedCompanyId),
        VendorService.getVendors(selectedCompanyId),
      ]);
      setChallans(challanData);
      setVendors(vendorData);
    } catch {
      toast.error('Failed to load delivery challans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openDrawer = (mode: 'create' | 'edit' | 'view', challan?: DeliveryChallan) => {
    setDrawerMode(mode);
    setSelectedChallan(challan || null);
    setIsDrawerOpen(true);
    setOpenDropdownId(null);
  };

  const handleSaveChallan = async (data: ChallanFormValues) => {
    setIsSubmitting(true);
    try {
      const vendor = vendors.find(v => v.id === data.vendorId);
      const project = projects.find(p => p.id === data.projectId);

      const payload = {
        ...data,
        vendorName: vendor?.displayName || data.vendorName || '',
        projectName: project?.projectName || '',
      };

      if (drawerMode === 'create') {
        if (!selectedCompanyId) throw new Error('No company ID');
        await ChallanService.create(selectedCompanyId, payload as Omit<DeliveryChallan, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Delivery Challan created successfully');
      } else if (selectedChallan) {
        await ChallanService.update(selectedChallan.id, payload as Omit<DeliveryChallan, 'id' | 'createdAt'>);
        toast.success('Delivery Challan updated successfully');
      }
      setIsDrawerOpen(false);
      setCurrentPage(1);
      fetchData();
    } catch {
      toast.error('Failed to save Delivery Challan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (challan: DeliveryChallan) => {
    setOpenDropdownId(null);
    if (!window.confirm(`Delete Challan ${challan.challanNumber}? This cannot be undone.`)) return;
    try {
      await ChallanService.delete(challan.id);
      toast.success(`Challan ${challan.challanNumber} deleted`);
      fetchData();
    } catch {
      toast.error('Failed to delete Delivery Challan');
    }
  };

  const filtered = challans.filter(ch => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      ch.challanNumber.toLowerCase().includes(term) ||
      (ch.vendorName || '').toLowerCase().includes(term) ||
      (ch.projectName || '').toLowerCase().includes(term) ||
      (ch.description || '').toLowerCase().includes(term);

    const matchProject = !filterProject || ch.projectId === filterProject;
    const matchVendor = !filterVendor || ch.vendorId === filterVendor;

    return matchSearch && matchProject && matchVendor;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const idxLast = currentPage * itemsPerPage;
  const idxFirst = idxLast - itemsPerPage;
  const currentItems = filtered.slice(idxFirst, idxLast);

  const resetPage = () => setCurrentPage(1);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const selectClass =
    'px-3 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#792359] transition-colors';

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-1">
            <span>Finance</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-gray-200">Delivery Challans</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Delivery Challans
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Track deliveries received from vendors.
          </p>
        </div>
        <button
          onClick={() => openDrawer('create')}
          className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
        >
          <Plus size={16} />
          Add Challan
        </button>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/5 flex flex-col">
        
        {/* Filters row */}
        <div className="p-4 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex flex-wrap gap-2">
            {/* Project filter */}
            <div className="w-40 shrink-0">
              <CustomSelect
                value={filterProject}
                onChange={val => { setFilterProject(val); resetPage(); }}
                options={[
                  { label: 'All Projects', value: '' },
                  ...projects.map(p => ({ label: p.projectName, value: p.id }))
                ]}
              />
            </div>

            {/* Vendor filter */}
            <div className="w-48 shrink-0">
              <CustomSelect
                value={filterVendor}
                onChange={val => { setFilterVendor(val); resetPage(); }}
                options={[
                  { label: 'All Vendors', value: '' },
                  ...vendors.map(v => ({ label: v.displayName || v.id, value: v.id }))
                ]}
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search challan no., vendor…"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); resetPage(); }}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#792359] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[320px] pb-32">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-24">
              <Loader2 className="w-8 h-8 animate-spin text-[#792359]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-500">
              <Truck size={48} className="mb-4 opacity-20" />
              <p className="text-base font-medium text-gray-900 dark:text-white">No Delivery Challans found</p>
              <p className="text-sm mt-1">
                {searchTerm || filterProject || filterVendor
                  ? 'Try adjusting your filters or search term.'
                  : 'Add your first challan by clicking "Add Challan".'}
              </p>
              {(searchTerm || filterProject || filterVendor) && (
                <button
                  onClick={() => { setSearchTerm(''); setFilterProject(''); setFilterVendor(''); }}
                  className="mt-3 text-sm text-[#792359] dark:text-[#c44997] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Challan Number</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Challan Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {currentItems.map(ch => (
                  <tr
                    key={ch.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors text-sm group"
                  >
                    {/* Challan Number */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDrawer('view', ch)}
                        className="font-semibold text-[#792359] dark:text-[#c44997] hover:underline"
                      >
                        {ch.challanNumber}
                      </button>
                      {ch.description && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-[160px]" title={ch.description}>
                          {ch.description}
                        </p>
                      )}
                    </td>

                    {/* Vendor */}
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {ch.vendorName || ch.vendorId}
                    </td>

                    {/* Project */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">{ch.projectId}</span>
                      {ch.projectName && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">{ch.projectName}</p>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(ch.challanDate)}
                    </td>

                    {/* Actions dropdown */}
                    <td className="px-6 py-4 text-center relative" ref={openDropdownId === ch.id ? dropdownRef : undefined}>
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === ch.id ? null : ch.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors inline-flex"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdownId === ch.id && (
                        <div className="absolute right-8 top-10 w-36 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-lg z-20 py-1 text-left">
                          <button
                            onClick={() => openDrawer('view', ch)}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openDrawer('edit', ch)}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                          >
                            Edit
                          </button>
                          <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                          <button
                            onClick={() => handleDelete(ch)}
                            className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                          >
                            Delete
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

        {/* Pagination */}
        {!isLoading && filtered.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {idxFirst + 1}–{Math.min(idxLast, filtered.length)} of {filtered.length} entries
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
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
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* ── Statistics row ── */}
      {!isLoading && challans.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 bg-[#792359]/5 dark:bg-[#792359]/10">
              <Truck size={18} className="text-[#792359] dark:text-[#c44997]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Challans</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{challans.length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-500/10">
              <Package size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Deliveries This Month</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {challans.filter(c => new Date(c.challanDate).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Challan Drawer ── */}
      <ChallanDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveChallan}
        mode={drawerMode}
        initialData={selectedChallan || undefined}
        challanNumber={selectedChallan?.challanNumber}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
