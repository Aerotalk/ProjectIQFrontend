import { useState } from 'react';
import CustomTable from '../../../../../components/ui/CustomTable';
import { Search, Filter, Edit, FileText, CheckCircle2 } from 'lucide-react';
import { mockManagerReviews } from '../../mock/mockPerformanceData';
import type { ManagerReview } from '../../types';
import ManagerReviewDrawer from './ManagerReviewDrawer';

export default function ManagerReviewsQueue() {
  const [reviews] = useState<ManagerReview[]>(mockManagerReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ManagerReview | null>(null);

  const handleOpenDrawer = (review?: ManagerReview) => {
    setSelectedReview(review || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedReview(null);
  };

  const filteredReviews = reviews.filter(review => 
    review.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Submitted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Finalized': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const columns = [
    { 
      key: 'employee', 
      label: 'Employee',
      render: (val: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{val.name}</p>
          <p className="text-xs text-gray-500">{val.designation} - {val.department}</p>
        </div>
      )
    },
    { key: 'cycle', label: 'Review Cycle' },
    { 
      key: 'overallRating', 
      label: 'Manager Rating',
      render: (val: any, row: ManagerReview) => (
        <div className="flex items-center gap-1">
          <span className={`font-bold ${row.status === 'Pending' ? 'text-gray-400' : 'text-primary dark:text-secondary'}`}>
            {row.status === 'Pending' ? 'Pending' : val?.toFixed(1) || '-'}
          </span>
          {row.status !== 'Pending' && <span className="text-xs text-gray-400">/ 5.0</span>}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: any) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(val)}`}>
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ManagerReview) => (
        <div className="flex items-center gap-2">
          {row.status === 'Pending' ? (
            <button className="px-3 py-1.5 flex items-center bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-sm shadow-sm transition-colors" onClick={() => handleOpenDrawer(row)}>
              <Edit size={14} className="mr-1" /> Assess
            </button>
          ) : (
            <button onClick={() => handleOpenDrawer(row)} className="flex items-center text-xs text-gray-500 hover:text-primary dark:hover:text-secondary transition-colors">
              <FileText size={14} className="mr-1" /> View Details
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manager Review Queue</h2>
          <p className="text-sm text-gray-500">Assess and rate your direct reports for the current cycles.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-sm bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:text-white w-64"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
        <div className="bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Assigned</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{reviews.length}</h3>
          </div>
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center">
            <FileText size={20} />
          </div>
        </div>
        <div className="bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending Assessment</p>
            <h3 className="text-2xl font-bold text-orange-600">{reviews.filter(r => r.status === 'Pending').length}</h3>
          </div>
          <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-full flex items-center justify-center">
            <Edit size={20} />
          </div>
        </div>
        <div className="bg-white dark:bg-[#181a1f] p-4 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <h3 className="text-2xl font-bold text-green-600">{reviews.filter(r => r.status !== 'Pending').length}</h3>
          </div>
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <CustomTable 
            columns={columns}
            data={filteredReviews}
          />
        </div>
      </div>

      {/* Drawer */}
      {selectedReview && (
        <ManagerReviewDrawer 
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          review={selectedReview}
        />
      )}
    </div>
  );
}
