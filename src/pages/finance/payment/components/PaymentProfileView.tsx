import { useState, useEffect } from 'react';
import { 
  X, Edit, FileText, CreditCard, 
  Activity, Info, Banknote, Save
} from 'lucide-react';
import type { PaymentRecord } from '../../../../types/payment.types';
import toast from 'react-hot-toast';

interface Props {
  payment: PaymentRecord;
  onClose: () => void;
  onEdit: () => void;
}

export default function PaymentProfileView({ payment: initialPayment, onClose, onEdit }: Props) {
  const [payment, setPayment] = useState<PaymentRecord>(initialPayment);
  const [activeTab, setActiveTab] = useState<'overview'>('overview');

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(initialPayment.notes || '');

  useEffect(() => {
    setPayment(initialPayment);
    setNotesText(initialPayment.notes || '');
  }, [initialPayment]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSaveNotes = () => {
    // In a real app we would call API to save
    // PaymentService.update(payment.id, { notes: notesText }).then(...)
    setPayment(prev => ({ ...prev, notes: notesText }));
    setIsEditingNotes(false);
    toast.success('Notes updated successfully');
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-[#0a0a0a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col min-h-[calc(100vh-8rem)] overflow-hidden transition-colors duration-300">
      
      {/* ── 1. Header Section ── */}
      <div className="px-6 py-5 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#792359] text-white flex items-center justify-center rounded-lg text-2xl font-bold shrink-0 shadow-sm">
            <Banknote size={24} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              Payment Record
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {payment.paymentId || 'No ID'}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${
                payment.status === 'Completed' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' 
                  : payment.status === 'Failed' || (payment.status as any) === 'Bounced'
                  ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50'
                  : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  payment.status === 'Completed' ? 'bg-emerald-500' 
                  : payment.status === 'Failed' || (payment.status as any) === 'Bounced' ? 'bg-red-500'
                  : 'bg-orange-500'
                }`} />
                {payment.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Edit size={16} className="text-gray-500" /> 
            <span>Edit Payment</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── 2. Navigation Tabs ── */}
      <div className="px-6 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 flex items-center gap-8">
        {[
          { id: 'overview', label: 'Payment Details', icon: <Activity size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-[#792359] text-[#792359] dark:text-[#e6a8d0] dark:border-[#e6a8d0]' 
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 3. Profile Content Workspace ── */}
      <div className="flex-1 p-6 overflow-y-auto">
        
        {/* ── TABS CORE CONTENT: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-stretch">
            
            {/* LEFT PROFILE COLUMN */}
            <div className="flex flex-col gap-6">
              
              {/* Payment Details Box */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Transaction Details</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Payment ID</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{payment.paymentId || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Project</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{payment.projectName || payment.projectId || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Linked Invoice</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{payment.linkedInvoiceNumber || payment.linkedInvoiceId || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Date</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{formatDate(payment.paymentDate)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-6">
              
              {/* Financial & Method Box */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-gray-400" size={18} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Method & Amount</h4>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Amount Paid</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {formatCurrency(payment.amountPaid)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Method</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{payment.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Reference ID</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{payment.referenceId || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="text-gray-400" size={18} />
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notes</h4>
                  </div>
                  {!isEditingNotes && (
                    <button 
                      onClick={() => setIsEditingNotes(true)}
                      className="text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/10 p-1.5 rounded-md transition-colors"
                      title="Edit Notes"
                    >
                      <Edit size={14} />
                    </button>
                  )}
                </div>
                
                <div className="flex-1">
                  {isEditingNotes ? (
                    <div className="flex flex-col h-full gap-3">
                      <textarea
                        value={notesText}
                        onChange={e => setNotesText(e.target.value)}
                        className="flex-1 w-full p-3 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:border-[#792359] dark:focus:border-[#e6a8d0] resize-none"
                        placeholder="Add your notes here..."
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            setNotesText(payment.notes || '');
                            setIsEditingNotes(false);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSaveNotes}
                          className="px-3 py-1.5 text-xs font-medium bg-[#792359] hover:bg-[#52173c] text-white rounded-md transition-colors flex items-center gap-1.5"
                        >
                          <Save size={14} />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap h-full flex items-start">
                      {payment.notes ? payment.notes : <span className="italic text-gray-400">No notes provided.</span>}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
