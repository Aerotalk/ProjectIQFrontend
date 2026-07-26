import { useState } from 'react';
import CustomTable from '../../../../../components/ui/CustomTable';
import { Search, Filter, FileText } from 'lucide-react';
import { mockSelfReviews, mockCycles } from '../../mock/mockPerformanceData';
import type { SelfReview } from '../../types';
import SelfReviewDrawer from './SelfReviewDrawer';

export default function SelfReviewsList() {
  const [reviews] = useState<SelfReview[]>(mockSelfReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<SelfReview | null>(null);

  const handleOpenDrawer = (review?: SelfReview) => {
    setSelectedReview(review || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedReview(null);
  };

  const filteredReviews = reviews.filter(review => 
    review.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Submitted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'Pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Finalized': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const columns = [
    { 
      key: 'cycleId', 
      label: 'Appraisal Cycle',
      render: (val: any) => {
        const cycle = mockCycles.find((c: any) => c.id === val);
        return (
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{cycle?.name}</p>
            <p className="text-xs text-gray-500">{cycle?.period}</p>
          </div>
        );
      }
    },
    { 
      key: 'overallRating', 
      label: 'Self Rating',
      render: (val: any) => (
        <div className="flex items-center gap-1">
          <span className="font-bold text-[#792359] dark:text-[#e6a8d0]">{val ? val.toFixed(1) : '-'}</span>
          <span className="text-xs text-gray-400">/ 5.0</span>
        </div>
      )
    },
    { 
      key: 'submittedOn', 
      label: 'Submitted On',
      render: (val: any) => val || '-'
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
      render: (_: any, row: SelfReview) => (
        <div className="flex items-center gap-2">
          {row.status === 'Submitted' || row.status === 'Finalized' ? (
            <button onClick={() => handleOpenDrawer(row)} className="flex items-center text-xs text-gray-500 hover:text-[#792359] dark:hover:text-[#e6a8d0] transition-colors">
              <FileText size={14} className="mr-1" /> View
            </button>
          ) : (
            <button className="px-3 py-1.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm" onClick={() => handleOpenDrawer(row)}>
              Complete Review
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Self Reviews</h2>
          <p className="text-sm text-gray-500">Complete self-assessments for active appraisal cycles.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-sm bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-1 focus:ring-[#792359] dark:text-white w-64"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
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
        <SelfReviewDrawer 
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          review={selectedReview}
        />
      )}
    </div>
  );
}
