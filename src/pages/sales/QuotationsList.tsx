import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Plus, ChevronLeft, ChevronRight, FileText, Loader2, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useQuotations } from '../../hooks/useQuotations';
import type { Quotation } from '../../types/quotation.types';
import QuotationDrawer from './quotations/components/QuotationDrawer';
import type { QuotationFormValues } from './quotations/validators/quotationValidation';
import { Input } from '@/components/ui/input';
import { formatQuotationId } from '../../lib/utils';
import { getNextSequenceNumber } from '../../utils/sequence';

export default function QuotationsList() {
  const { selectedCompanyId: companyId } = useAuth();
  const navigate = useNavigate();
  const { quotations, isListLoading: isLoading, isSaveLoading: isSubmitting, createQuotation, updateQuotation } = useQuotations({ companyId });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleSaveQuotation = async (data: QuotationFormValues) => {
    try {
      if (drawerMode === 'create') {
        await createQuotation(data as unknown as Omit<Quotation, 'id'>);
        toast.success('Quotation created successfully');
      } else if (drawerMode === 'edit' && selectedQuotation) {
        await updateQuotation(selectedQuotation.id, data as unknown as Partial<Quotation>);
        toast.success('Quotation updated successfully');
      }
      setIsDrawerOpen(false);
    } catch (error: any) {
      throw error;
    }
  };

  const openDrawer = (mode: 'create' | 'edit' | 'view', quotation?: Quotation) => {
    setDrawerMode(mode);
    setSelectedQuotation(quotation || null);
    setIsDrawerOpen(true);
    setOpenDropdownId(null);
  };

  const filteredQuotations = quotations.filter(q =>
    q.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.quotationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuotations.slice(indexOfFirstItem, indexOfLastItem);

  if (isDrawerOpen) {
    return (
      <div className="max-w-[1400px] mx-auto">
        <QuotationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveQuotation}
          mode={drawerMode}
          initialData={selectedQuotation as Partial<QuotationFormValues>}
          quotationNo={selectedQuotation?.quotationNo || selectedQuotation?.id}
          isSubmitting={isSubmitting}
        />
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
            <span className="text-gray-900 dark:text-gray-200">Quotations</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Quotations</h1>
        </div>
        <button
          onClick={() => openDrawer('create')}
          className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
        >
          <Plus size={16} />
          Create Quotation
        </button>
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              type="text"
              placeholder="Search quotations..."
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
          ) : filteredQuotations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-gray-500">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">No quotations found</p>
              <p className="text-sm">Try adjusting your search or create a new quotation.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Quotation No</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Valid Until</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Client Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider max-w-[150px]">Salesperson</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-right">Amount (₹)</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {currentItems.map((quotation) => (
                  <tr
                    key={quotation.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/companydashboard/sales/quotations/${quotation.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-[#792359] dark:text-[#c43890]">{formatQuotationId(quotation.quotationNo || quotation.id)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300">{new Date(quotation.date).toLocaleDateString('en-GB')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString('en-GB') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{quotation.clientName || 'Unknown Client'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px]" title={quotation.salesperson}>{quotation.salesperson || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white text-right">
                      {quotation.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-medium border
                        ${quotation.status === 'Draft' ? 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20' : ''}
                        ${quotation.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : ''}
                        ${quotation.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : ''}
                        ${quotation.status === 'Sent to Client' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : ''}
                        ${quotation.status === 'Confirmed Lead' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' : ''}
                      `}>
                        {quotation.status === 'Pending Approval' && <Clock size={12} />}
                        {quotation.status === 'Approved' && <CheckCircle2 size={12} />}
                        {quotation.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-center ${openDropdownId === quotation.id ? 'relative z-50' : 'relative z-10'}`}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === quotation.id ? null : quotation.id); }}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors inline-flex"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdownId === quotation.id && (
                        <div className="absolute right-8 top-10 w-32 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-lg z-10 py-1 text-left">
                          <button
                            onClick={(e) => { e.stopPropagation(); openDrawer('view', quotation); }}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openDrawer('edit', quotation); }}
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
            Showing {filteredQuotations.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredQuotations.length)} of {filteredQuotations.length} entries
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
                className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm font-medium transition-colors ${currentPage === page
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

      <QuotationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveQuotation}
        mode={drawerMode}
        initialData={selectedQuotation as Partial<QuotationFormValues>}
        quotationNo={selectedQuotation?.quotationNo || selectedQuotation?.id}
        isSubmitting={isSubmitting}
        nextNumber={getNextSequenceNumber(quotations, 'quotationNo')}
      />
    </div>
  );
}
