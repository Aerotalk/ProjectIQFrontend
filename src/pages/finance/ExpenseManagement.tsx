import { useState } from 'react';
import { Plus, Search, MoreHorizontal, CreditCard, Upload, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EXPENSES = [
  { id: 'EXP-014', date: '10 May 2025', project: 'PRJ-001', type: 'Travel Expense', amount: '5,000' },
  { id: 'EXP-013', date: '09 May 2025', project: 'PRJ-002', type: 'Training Expense', amount: '10,000' },
  { id: 'EXP-012', date: '08 May 2025', project: 'PRJ-003', type: 'Software License', amount: '25,000' },
  { id: 'EXP-011', date: '07 May 2025', project: 'PRJ-001', type: 'Internet Expense', amount: '2,500' },
  { id: 'EXP-010', date: '06 May 2025', project: 'PRJ-004', type: 'Hardware', amount: '45,000' },
  { id: 'EXP-009', date: '05 May 2025', project: 'PRJ-005', type: 'Miscellaneous', amount: '1,200' },
];

const EXPENSE_TYPES = [
  'Travel Expense',
  'Vendor Payment',
  'Software License',
  'Training Expense',
  'Hardware',
  'Internet Expense',
  'Miscellaneous'
];

export default function ExpenseManagement() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    project: '', expenseType: '', amount: '', expenseDate: '', remarks: ''
  });

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success('Expense added successfully');
    setIsFormVisible(false);
    setFormData({ project: '', expenseType: '', amount: '', expenseDate: '', remarks: '' });
    setIsSubmitting(false);
  };

  const filteredExpenses = EXPENSES.filter(ex => 
    ex.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ex.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-1">
            <span>Finance</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-gray-200">Expenses</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isFormVisible ? 'Add Expense' : 'Project Expenses'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {isFormVisible ? 'Record a new project expense' : 'Log and track all project-related expenses'}
          </p>
        </div>
        {!isFormVisible && (
          <button 
            onClick={() => setIsFormVisible(true)}
            className="flex items-center gap-2 bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] dark:focus:ring-offset-[#181a1f]"
          >
            <Plus size={16} /> Add Expense
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
                <option>Expense Type</option>
                {EXPENSE_TYPES.map(t => <option key={t}>{t}</option>)}
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

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-white/[0.02] text-gray-700 dark:text-gray-300 text-xs font-semibold">
                <tr className="border-b border-gray-200 dark:border-white/5">
                  <th className="px-6 py-3">Expense ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Amount (₹)</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {currentItems.map((ex) => (
                  <tr key={ex.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group text-sm">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{ex.id}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{ex.date}</td>
                    <td className="px-6 py-4 font-medium text-[#792359] dark:text-[#e6a8d0]">{ex.project}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{ex.type}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{ex.amount}</td>
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredExpenses.length)} of {filteredExpenses.length} entries
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
              <CreditCard size={18} className="text-[#792359] dark:text-[#e6a8d0]" />
              Add Expense
            </h2>
            <button 
              onClick={() => setIsFormVisible(false)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSaveExpense} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project <span className="text-red-500">*</span></label>
                  <select required value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors">
                    <option value="">Select project</option>
                    <option value="PRJ-001">PRJ-001 - Analytics Dashboard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Expense Type <span className="text-red-500">*</span></label>
                  <select required value={formData.expenseType} onChange={e => setFormData({...formData, expenseType: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors">
                    <option value="">Select expense type</option>
                    {EXPENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Amount (₹) <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="Enter amount" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Expense Date <span className="text-red-500">*</span></label>
                  <input required type="date" value={formData.expenseDate} onChange={e => setFormData({...formData, expenseDate: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Upload Bill</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-sm p-8 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                    <Upload size={24} className="text-[#792359] dark:text-[#e6a8d0] mb-3 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-sm font-medium text-[#792359] dark:text-[#e6a8d0]">Click to upload bill/receipt</span>
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
                  {isSubmitting ? 'Saving...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
