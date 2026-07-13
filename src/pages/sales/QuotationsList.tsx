import { useState } from 'react';
import { Search, Filter, Plus, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Quotation {
  id: string;
  qtnNo: string;
  client: string;
  project: string;
  amount: string;
  status: string;
  validTill: string;
  owner: string;
}

export default function QuotationsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10';
      case 'Pending Approval': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20';
      case 'Sent to Client': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 'Under Negotiation': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
      case 'Accepted':
      case 'Converted': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const [quotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('demo_quotations');
    if (saved) {
      return JSON.parse(saved);
    }
    const initialData = [
      { id: '1', qtnNo: 'QTN-100245', client: 'TechNova Pvt Ltd', project: 'Analytics Dashboard', amount: '271400', status: 'Pending Approval', validTill: '2025-05-20', owner: 'Arjun Dev' },
      { id: '2', qtnNo: 'QTN-100246', client: 'Global Systems', project: 'ERP Implementation', amount: '1550000', status: 'Sent to Client', validTill: '2025-05-25', owner: 'Priya Sharma' },
      { id: '3', qtnNo: 'QTN-100247', client: 'Nexus Corp', project: 'Cloud Migration', amount: '890000', status: 'Under Negotiation', validTill: '2025-05-15', owner: 'Rahul Verma' },
      { id: '4', qtnNo: 'QTN-100248', client: 'Apex Solutions', project: 'Security Audit', amount: '345000', status: 'Draft', validTill: '2025-05-30', owner: 'Anita Desai' },
      { id: '5', qtnNo: 'QTN-100249', client: 'Future Tech', project: 'Mobile App Dev', amount: '1200000', status: 'Accepted', validTill: '2025-05-10', owner: 'Arjun Dev' },
      { id: '6', qtnNo: 'QTN-100250', client: 'DataServe Inc', project: 'Database Upgrade', amount: '450000', status: 'Converted', validTill: '2025-05-05', owner: 'Priya Sharma' },
      { id: '7', qtnNo: 'QTN-100251', client: 'Zephyr Systems', project: 'Network Setup', amount: '620000', status: 'Sent to Client', validTill: '2025-05-28', owner: 'Rahul Verma' },
      { id: '8', qtnNo: 'QTN-100252', client: 'Quantum Logic', project: 'AI Consultation', amount: '975000', status: 'Pending Approval', validTill: '2025-05-22', owner: 'Anita Desai' },
      { id: '9', qtnNo: 'QTN-100253', client: 'Innovatech', project: 'Website Redesign', amount: '210000', status: 'Draft', validTill: '2025-06-01', owner: 'Arjun Dev' },
    ];
    localStorage.setItem('demo_quotations', JSON.stringify(initialData));
    return initialData;
  });

  const filteredQuotations = quotations.filter(q => q.client.toLowerCase().includes(searchTerm.toLowerCase()) || q.qtnNo.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuotations.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span className="hover:text-[#792359] dark:hover:text-[#e6a8d0] cursor-pointer">Sales</span>
            <ChevronRight size={14} />
            <span className="text-gray-900 dark:text-white font-medium">All Quotations</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Quotations</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button className="bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={() => navigate('/companydashboard/sales/quotations/new')}
            className="bg-[#792359] hover:bg-[#52173c] text-white px-4 py-2 text-sm font-medium rounded-sm transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Create Quotation
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <div className="relative">
              <select className="w-full pl-3 pr-8 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] appearance-none">
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Sent to Client">Sent to Client</option>
                <option value="Under Negotiation">Under Negotiation</option>
                <option value="Accepted">Accepted</option>
                <option value="Converted">Converted</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="w-full pl-3 pr-8 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] appearance-none">
                <option value="">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="This Quarter">This Quarter</option>
                <option value="This Year">This Year</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search quotation..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">QTN No.</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Valid Till</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {currentItems.map((qtn) => (
                <tr 
                  key={qtn.id} 
                  onClick={() => navigate(`/companydashboard/sales/quotations/${qtn.id}`)}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <td className="px-4 py-3 text-xs font-bold text-[#792359] dark:text-[#e6a8d0]">{qtn.qtnNo}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900 dark:text-white">{qtn.client}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">{qtn.project}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                    {qtn.amount ? `₹ ${Number(qtn.amount).toLocaleString('en-IN')}` : qtn.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusStyle(qtn.status)}`}>
                      {qtn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{qtn.validTill}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{qtn.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredQuotations.length)} of {filteredQuotations.length} entries
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
