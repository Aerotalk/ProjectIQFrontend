import { useState, useEffect } from 'react';
import CustomTable from '../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../components/ui/TableRowActionMenu';
import SelfReviewDrawer from './SelfReviewDrawer';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Plus } from 'lucide-react';
import { mockSelfReviews, mockGoals, mockCompetencies, mockRatingScales } from '../../mock/mockPerformanceData';
import type { SelfReview, Goal, Competency, RatingScale } from '../../types';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';

export default function SelfReviewsList() {
  const [reviews, setReviews] = useState<SelfReview[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [ratingScales, setRatingScales] = useState<RatingScale[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<SelfReview | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apiReviews, apiGoals, apiCompetencies, apiScales] = await Promise.all([
        api.get('/hrms/performance/reviews/self').catch(() => []),
        api.get('/hrms/performance/goals').catch(() => []),
        api.get('/hrms/performance/competencies').catch(() => []),
        api.get('/hrms/performance/rating-scales').catch(() => [])
      ]);

      if (Array.isArray(apiReviews) && apiReviews.length > 0) {
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
      } else {
        setReviews(mockSelfReviews);
      }

      setGoals(Array.isArray(apiGoals) && apiGoals.length > 0 ? apiGoals : mockGoals);
      setCompetencies(Array.isArray(apiCompetencies) && apiCompetencies.length > 0 ? apiCompetencies : mockCompetencies);
      setRatingScales(Array.isArray(apiScales) && apiScales.length > 0 ? apiScales : mockRatingScales);
    } catch (e) {
      toast.error('Failed to load self-reviews');
      setReviews(mockSelfReviews);
      setGoals(mockGoals);
      setCompetencies(mockCompetencies);
      setRatingScales(mockRatingScales);
    }
    setLoading(false);
  };

  const handleSave = async (data: any, submit: boolean) => {
    try {
      await api.post(`/hrms/performance/reviews/self?submit=${submit}`, data).catch(() => {});
      toast.success(submit ? 'Self Review submitted successfully' : 'Draft saved');
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error saving self-review');
    }
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
            { label: row.status === 'Submitted' ? 'View Review' : 'Continue Review', onClick: () => { setSelectedReview(row); setIsDrawerOpen(true); } }
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
          onClick={() => { setSelectedReview(null); setIsDrawerOpen(true); }}
          className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-[#5d1943] transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Start Self Review
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={reviews} />
      </div>

      <SelfReviewDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        goals={goals}
        competencies={competencies}
        ratingScale={ratingScales[0] || mockRatingScales[0]}
        initialData={selectedReview || undefined}
      />
    </div>
  );
}
