import { useState, useEffect } from 'react';
import CustomTable from '../../../../../components/ui/CustomTable';
import TableRowActionMenu from '../../../../../components/ui/TableRowActionMenu';
import ManagerReviewDrawer from './ManagerReviewDrawer';
import { Skeleton } from '../../../../../components/ui/skeleton';
import type { ManagerReview, Goal, Competency, RatingScale } from '../../types';
import toast from 'react-hot-toast';
import { api } from '../../../../../lib/api';

export default function ManagerReviewsQueue() {
  const [reviews, setReviews] = useState<ManagerReview[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [ratingScales, setRatingScales] = useState<RatingScale[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ManagerReview | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apiReviews, apiGoals, apiCompetencies, apiScales] = await Promise.all([
        api.get('/hrms/performance/reviews/manager').catch(() => []),
        api.get('/hrms/performance/goals').catch(() => []),
        api.get('/hrms/performance/competencies').catch(() => []),
        api.get('/hrms/performance/rating-scales').catch(() => [])
      ]);

      if (Array.isArray(apiReviews)) {
        setReviews(apiReviews.map((r: any) => ({
          id: r.id,
          selfReviewId: r.selfReview?.id || '',
          employee: {
            id: r.employee?.id || 'EMP-01',
            name: r.employee?.firstName ? `${r.employee.firstName} ${r.employee.lastName}` : 'Employee',
            designation: r.employee?.designation?.designationName || 'Staff',
            department: r.employee?.department?.departmentName || 'General'
          },
          cycle: r.cycle?.name || 'Annual Review 2026',
          goalAssessment: r.goalRatings?.map((gr: any) => ({
            goalId: gr.goal?.id,
            managerRating: gr.managerRating,
            managerComment: gr.managerComment
          })) || [],
          competencyAssessment: r.competencyRatings?.map((cr: any) => ({
            competencyId: cr.competency?.id,
            managerRating: cr.managerRating,
            managerComment: cr.managerComment
          })) || [],
          promotionRecommendation: r.promotionRecommendation || '',
          trainingRecommendation: r.trainingRecommendation || '',
          improvementPlan: r.improvementPlan || '',
          overallRating: r.overallRating || 0,
          managerComments: r.managerComments || '',
          status: r.status || 'Pending'
        })));
      }

      const getArray = (res: any) => Array.isArray(res) ? res : (res?.data || res?.content || []);
      setGoals(getArray(apiGoals));
      setCompetencies(getArray(apiCompetencies));
      setRatingScales(getArray(apiScales));
    } catch (e) {
      toast.error('Failed to load manager review queue');
      setReviews([]);
      setGoals([]);
      setCompetencies([]);
      setRatingScales([]);
    }
    setLoading(false);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedReview) {
        await api.put(`/hrms/performance/reviews/manager/${selectedReview.id}`, data);
        toast.success('Manager review submitted');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error submitting manager review');
    }
  };

  const columns = [
    { key: 'employee', label: 'Employee', render: (val: any) => val?.name || '-' },
    { key: 'cycle', label: 'Cycle' },
    { key: 'overallRating', label: 'Manager Rating', render: (val: number) => val ? val.toFixed(1) : '-' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ManagerReview) => (
        <TableRowActionMenu
          actions={[
            { label: ['Manager Reviewed', 'HR Reviewed', 'Finalized'].includes(row.status) ? 'View Review' : 'Conduct Review', onClick: () => { setSelectedReview(row); setIsDrawerOpen(true); } }
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manager Review Queue</h3>
      </div>

      <div className="flex-1 overflow-auto">
        <CustomTable columns={columns} data={reviews} />
      </div>

      {selectedReview && (
        <ManagerReviewDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSave}
          goals={goals}
          competencies={competencies}
          ratingScale={ratingScales[0]!}
          initialData={selectedReview}
        />
      )}
    </div>
  );
}
