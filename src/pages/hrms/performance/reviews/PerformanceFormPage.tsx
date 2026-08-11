import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Goal } from '../types';
import { Star, ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function PerformanceFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const reviewType = searchParams.get('type') || 'self';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  
  const [formData, setFormData] = useState<any>({
    goalAchievement: [],
    competencyRatings: [],
  });
  
  const isReadOnly = formData?.status === 'Submitted' || formData?.status === 'Finalized' || formData?.status === 'Completed';

  useEffect(() => {
    fetchData();
  }, [id, reviewType]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [apiGoals] = await Promise.all([
        api.get('/hrms/performance/goals').catch(() => []),
      ]);
      
      const getArray = (res: any) => Array.isArray(res) ? res : (res?.data || res?.content || []);
      setGoals(getArray(apiGoals));

      if (id && id !== 'new') {
        const endpoint = reviewType === 'self' 
          ? `/hrms/performance/reviews/self/${id}`
          : `/hrms/performance/reviews/manager/${id}`;
        
        const data = await api.get(endpoint).catch(() => null);
        if (data) {
          setFormData({
            ...data,
            goalAchievement: data.goalRatings || data.goalAchievement || [],
            competencyRatings: data.competencyRatings || []
          });
        }
      }
    } catch (err) {
      toast.error('Failed to load review data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    toast.success('Draft saved successfully');
    navigate(-1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const endpoint = reviewType === 'self' 
          ? `/hrms/performance/reviews/self?submit=true`
          : `/hrms/performance/reviews/manager?submit=true`;
      
      await api.post(endpoint, formData);
      
      toast.success('Review submitted successfully');
      navigate(-1);
    } catch (e) {
      toast.error('Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoalRatingChange = (goalId: string, rating: number) => {
    if(isReadOnly) return;
    const newGoals = [...(formData.goalAchievement || [])];
    const index = newGoals.findIndex((g: any) => g.goalId === goalId);
    
    if (reviewType === 'self') {
      if(index >= 0) newGoals[index].employeeRating = rating;
      else newGoals.push({ goalId, employeeRating: rating, employeeComment: '' });
    } else {
      if(index >= 0) newGoals[index].managerRating = rating;
      else newGoals.push({ goalId, managerRating: rating, managerComment: '' });
    }
    setFormData({ ...formData, goalAchievement: newGoals });
  };

  const handleGoalCommentChange = (goalId: string, comment: string) => {
    if(isReadOnly) return;
    const newGoals = [...(formData.goalAchievement || [])];
    const index = newGoals.findIndex((g: any) => g.goalId === goalId);
    
    if (reviewType === 'self') {
      if(index >= 0) newGoals[index].employeeComment = comment;
      else newGoals.push({ goalId, employeeRating: 0, employeeComment: comment });
    } else {
      if(index >= 0) newGoals[index].managerComment = comment;
      else newGoals.push({ goalId, managerRating: 0, managerComment: comment });
    }
    setFormData({ ...formData, goalAchievement: newGoals });
  };

  const RatingStars = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            disabled={isReadOnly}
            className={`${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <Star 
              size={20} 
              className={star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'} 
            />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {reviewType === 'self' ? 'Self Assessment' : 'Manager Review'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {reviewType === 'self' ? 'Evaluate your performance for this cycle.' : 'Evaluate your direct report for this cycle.'}
            </p>
          </div>
        </div>
        {isReadOnly && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 rounded-full text-sm font-medium">
            <CheckCircle2 size={16} /> Submitted
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50/30 dark:bg-[#121212]/50">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Goals Section */}
          <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#181a1f] shadow-sm">
            <div className="bg-gray-50/80 dark:bg-white/[0.02] p-5 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goal Achievement</h3>
              <p className="text-sm text-gray-500">Rate performance against assigned goals.</p>
            </div>
            <div className="p-6 space-y-8">
              {goals.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No active goals found.</p>
              ) : goals.map((goal: Goal) => {
                const ratingData = formData.goalAchievement?.find((g: any) => g.goalId === goal.id);
                return (
                  <div key={goal.id} className="pb-6 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-base">{goal.title}</h4>
                        <div className="text-sm text-gray-500 flex gap-4 mt-1.5">
                          <span>Target: {goal.targetValue} {goal.unit}</span>
                          <span>Actual: {goal.currentValue} {goal.unit}</span>
                          <span>Weight: {goal.weightage}%</span>
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-3 py-1 rounded-full text-xs font-medium">
                        {goal.progress}% Complete
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-lg border border-gray-100 dark:border-white/5">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                        <RatingStars 
                          value={reviewType === 'self' ? (ratingData?.employeeRating || 0) : (ratingData?.managerRating || 0)} 
                          onChange={(v) => handleGoalRatingChange(goal.id, v)} 
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comments</label>
                        <textarea 
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent bg-white dark:bg-[#181a1f] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                          rows={2}
                          value={reviewType === 'self' ? (ratingData?.employeeComment || '') : (ratingData?.managerComment || '')}
                          onChange={(e) => handleGoalCommentChange(goal.id, e.target.value)}
                          disabled={isReadOnly}
                          placeholder="Detail achievements for this goal..."
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall Summary Section */}
          <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#181a1f] shadow-sm">
            <div className="bg-gray-50/80 dark:bg-white/[0.02] p-5 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Summary</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Strengths & Achievements</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent bg-gray-50/30 dark:bg-white/[0.01] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                  rows={4}
                  value={formData.strengths || ''}
                  onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                  disabled={isReadOnly}
                  placeholder="Highlight major contributions during this period..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Areas for Improvement & Development Needs</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent bg-gray-50/30 dark:bg-white/[0.01] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                  rows={4}
                  value={formData.areasOfImprovement || ''}
                  onChange={(e) => setFormData({...formData, areasOfImprovement: e.target.value})}
                  disabled={isReadOnly}
                  placeholder="What skills or areas do you want to focus on next?"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-5 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#181a1f] flex items-center justify-between shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
          {isReadOnly ? 'Back' : 'Cancel'}
        </button>

        {!isReadOnly && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
            >
              <Save size={16} /> Save Draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-[#5d1944] text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
