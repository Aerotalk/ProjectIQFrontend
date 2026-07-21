import { useEffect, useState } from 'react';
import { X, FileText, ShoppingCart, CreditCard, Loader2 } from 'lucide-react';
import type { Project } from '../../../types/project.types';
import { POService } from '../../../services/po.service';
import { QuotationService } from '../../../services/quotation.service';
import { ExpenseService } from '../../../services/expense.service';
import type { PurchaseOrder } from '../../../types/po.types';
import type { Quotation } from '../../../types/quotation.types';
import type { Expense } from '../../../types/expense.types';

interface Props {
  project: Project;
  companyId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectQuickGlance({ project, companyId, isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'pos' | 'quotations' | 'expenses'>('pos');
  const [isLoading, setIsLoading] = useState(false);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (!isOpen || !companyId) return;
    
    const fetchRelatedData = async () => {
      setIsLoading(true);
      try {
        const [allPos, allQuotations, allExpenses] = await Promise.all([
          POService.getAll(companyId).catch(() => []),
          QuotationService.getQuotations(companyId).catch(() => []),
          ExpenseService.getAll(companyId).catch(() => [])
        ]);
        
        // Filter by projectId
        setPos(allPos.filter(po => po.projectId === project.id));
        
        // Assuming Quotations don't natively have projectId, filter by linkedQuotations array if it exists or subject mapping
        setQuotations(allQuotations.filter(q => 
          project.linkedQuotations?.includes(q.id) || 
          q.subject?.toLowerCase().includes(project.projectName.toLowerCase())
        ));
        
        setExpenses(allExpenses.filter(ex => ex.projectId === project.id));
      } catch (error) {
        console.error("Failed to fetch quick glance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedData();
  }, [isOpen, project.id, companyId, project.linkedQuotations, project.projectName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#181a1f] w-full max-w-2xl rounded-md shadow-lg border border-gray-200 dark:border-white/10 flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-white/10 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Quick Glance: {project.projectName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wide">
              {project.projectCode}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-gray-200 dark:border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'pos' 
                ? 'border-[#792359] text-[#792359] dark:border-[#e6a8d0] dark:text-[#e6a8d0]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <ShoppingCart size={16} /> Recent POs
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
              {pos.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('quotations')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'quotations' 
                ? 'border-[#792359] text-[#792359] dark:border-[#e6a8d0] dark:text-[#e6a8d0]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FileText size={16} /> Quotations
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
              {quotations.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'expenses' 
                ? 'border-[#792359] text-[#792359] dark:border-[#e6a8d0] dark:text-[#e6a8d0]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <CreditCard size={16} /> Expenses
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
              {expenses.length}
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-[#181a1f]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Loader2 className="animate-spin mb-2" size={24} />
              <p className="text-sm">Loading related data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'pos' && (
                <div className="space-y-3">
                  {pos.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No Purchase Orders found for this project.</p>
                  ) : (
                    pos.map(po => (
                      <div key={po.id} className="flex justify-between items-center p-3 rounded-md border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{po.poNumber || 'Draft PO'}</div>
                          <div className="text-xs text-gray-500">{po.vendorName} • {new Date(po.poDate).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">₹{(po.grandTotal || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                          <div className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mt-1 inline-block">
                            {po.status}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'quotations' && (
                <div className="space-y-3">
                  {quotations.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No Quotations found for this project.</p>
                  ) : (
                    quotations.map(q => (
                      <div key={q.id} className="flex justify-between items-center p-3 rounded-md border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{q.quotationNo}</div>
                          <div className="text-xs text-gray-500">{q.clientName || q.subject || 'No Subject'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">₹{(q.grandTotal || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                          <div className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mt-1 inline-block">
                            {q.status}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'expenses' && (
                <div className="space-y-3">
                  {expenses.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No Expenses logged against this project.</p>
                  ) : (
                    expenses.map(ex => (
                      <div key={ex.id} className="flex justify-between items-center p-3 rounded-md border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{ex.description}</div>
                          <div className="text-xs text-gray-500">{ex.category} • {new Date(ex.expenseDate).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">₹{(ex.amount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                          <div className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 mt-1 inline-block">
                            Logged
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
