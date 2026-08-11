import { useState, useEffect } from 'react';
import CustomTable from '../../../../../components/ui/CustomTable';
import { useNavigate, useLocation } from 'react-router-dom';
import TableRowActionMenu from '../../../../../components/ui/TableRowActionMenu';
import { Skeleton } from '../../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import type { SelfReview } from '../../types';
import toast from 'react-hot-toast';
import { api } from '../../../../../lib/api';

export default function SelfReviewsList() {
  const [reviews, setReviews] = useState<SelfReview[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiReviews = await api.get('/hrms/performance/reviews/self').catch(() => []);

      if (Array.isArray(apiReviews)) {
        setReviews(apiReviews.map((r: any) => ({
          id: r.id,
          employeeId: r.employee?.id || 'EMP-01',
          cycleId: r.cycle?.id || 'C-2026-01',
          goalAchievement: r.goalRatings?.map((gr: any) => ({
            goalId: gr.goal?.id,
            employeeRating: gr.employeeRating,
            employeeComment: gr.employeeComment
          })) || [],
          competencyRatings: r.competencyRatings?.map((cr: any) => ({
            competencyId: cr.competency?.id,
            employeeRating: cr.employeeRating,
            employeeComment: cr.employeeComment
          })) || [],
          strengths: r.strengths || '',
          areasOfImprovement: r.areasOfImprovement || '',
          overallRating: r.overallRating || 0,
          status: r.status || 'Draft',
          submittedOn: r.submittedOn || ''
        })));
      }
    } catch (e) {
      toast.error('Failed to load self-reviews');
      setReviews([]);
    }
    setLoading(false);
  };

  const columns = [
    { key: 'cycleId', label: 'Cycle' },
    { key: 'overallRating', label: 'Overall Self Rating', render: (val: number) => val ? val.toFixed(1) : '-' },
    { key: 'status', label: 'Status' },
    { key: 'submittedOn', label: 'Submitted On', render: (val: string) => val ? new Date(val).toLocaleDateString() : '-' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: SelfReview) => (
        <TableRowActionMenu
          actions={[
            { label: row.status === 'Submitted' ? 'View Review' : 'Continue Review', onClick: () => navigate(`${basePath}/hrms/performance/review/${row.id}?type=self`) }
          ]}
        />
      )
    }
  ];

  if (loading) {
    return <div className="p-4"><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#181a1f] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Self Performance Reviews</h3>
        <button 
          onClick={() => navigate(`${basePath}/hrms/performance/review/new?type=self`)}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Start Self Review
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={reviews} />
      </div>
    </div>
  );
}
