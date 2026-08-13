import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Goal, Competency } from '../types';
import { Star, ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../../../lib/api';
import { performanceService } from '../../../../services/performance.service';
import toast from 'react-hot-toast';

export default function PerformanceFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const reviewType = searchParams.get('type') || 'self';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  
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
      const [apiGoals, apiCycles, apiCompetencies] = await Promise.all([
        performanceService.getGoals().catch(() => []),
        performanceService.getCycles().catch(() => []),
        performanceService.getCompetencies().catch(() => [])
      ]);
      
      const getArray = (res: any) => Array.isArray(res) ? res : (res?.data || res?.content || []);
      const allGoals = getArray(apiGoals);
      setCompetencies(getArray(apiCompetencies));
      const cycles = getArray(apiCycles);

      if (id && id !== 'new') {
        if (reviewType === 'self') {
          const data = await performanceService.getSelfReviewById(id as string).catch(() => null);
          if (data) {
            setFormData({
              ...data,
              goalAchievement: data.goalRatings || data.goalAchievement || [],
              competencyRatings: data.competencyRatings || []
            });
            
            const empId = data.employee?.id || data.employeeId;
            const cycId = data.cycle?.id || data.cycleId;
            setGoals(allGoals.filter((g: Goal) => g.employee?.id === empId && g.cycleId === cycId));
          }
        } else {
          const managerData = await performanceService.getManagerReviewById(id as string).catch(() => null);
          if (managerData) {
            let selfData: any = null;
            if (managerData.selfReview?.id) {
              selfData = await performanceService.getSelfReviewById(managerData.selfReview.id).catch(() => null);
            }
            
            // Merge self data into manager data for display
            const allGoalIds = Array.from(new Set([
              ...(selfData?.goalRatings || []).map((g: any) => g.goalId),
              ...(managerData.goalRatings || []).map((g: any) => g.goalId)
            ]));
            
            const mergedGoalAchievement = allGoalIds.map(goalId => {
              const selfGoal = (selfData?.goalRatings || []).find((g: any) => g.goalId === goalId);
              const mgrGoal = (managerData.goalRatings || []).find((g: any) => g.goalId === goalId);
              return {
                goalId,
                employeeRating: selfGoal?.employeeRating,
                employeeComment: selfGoal?.employeeComment,
                managerRating: mgrGoal?.managerRating,
                managerComment: mgrGoal?.managerComment
              };
            });
            
            const allCompIds = Array.from(new Set([
              ...(selfData?.competencyRatings || []).map((c: any) => c.competencyId),
              ...(managerData.competencyRatings || []).map((c: any) => c.competencyId)
            ]));
            
            const mergedCompetencyRatings = allCompIds.map(compId => {
              const selfComp = (selfData?.competencyRatings || []).find((c: any) => c.competencyId === compId);
              const mgrComp = (managerData.competencyRatings || []).find((c: any) => c.competencyId === compId);
              return {
                competencyId: compId,
                employeeRating: selfComp?.employeeRating,
                employeeComment: selfComp?.employeeComment,
                managerRating: mgrComp?.managerRating,
                managerComment: mgrComp?.managerComment
              };
            });

            setFormData({
              ...managerData,
              goalAchievement: mergedGoalAchievement,
              competencyRatings: mergedCompetencyRatings,
              employeeStrengths: selfData?.strengths || '',
              employeeAreasOfImprovement: selfData?.areasOfImprovement || '',
              employeeOverallRating: selfData?.overallRating || 0
            });
            
            const empId = managerData.employee?.id || managerData.employeeId;
            const cycId = managerData.cycle?.id || managerData.cycleId;
            setGoals(allGoals.filter((g: Goal) => g.employee?.id === empId && g.cycleId === cycId));
          }
        }
      } else {
        const meRes = await api.get('/admin/employees/me').catch(() => null);
        const activeCycleId = cycles.length > 0 ? cycles[0].id : '';
        setFormData({
          goalAchievement: [],
          competencyRatings: [],
          employeeId: meRes?.id || '',
          cycleId: activeCycleId
        });
        
        setGoals(allGoals.filter((g: Goal) => g.employee?.id === meRes?.id && g.cycleId === activeCycleId));
      }
    } catch (err) {
      toast.error('Failed to load review data');
    } finally {
      setIsLoading(false);
    }
  };

  const buildPayload = () => {
    const payload = { ...formData };
    
    // Add fallback root IDs if not loaded correctly
    if (!payload.employeeId) payload.employeeId = payload.employee?.id;
    if (!payload.cycleId) payload.cycleId = payload.cycle?.id;
    
    if (payload.goalAchievement) {
      payload.goalAchievement = payload.goalAchievement.map((g: any) => ({
        goalId: g.goalId,
        rating: reviewType === 'self' ? g.employeeRating : g.managerRating,
        comments: reviewType === 'self' ? g.employeeComment : g.managerComment
      }));
    }
    
    if (payload.competencyRatings) {
      payload.competencyRatings = payload.competencyRatings.map((c: any) => ({
        competencyId: c.competencyId,
        rating: reviewType === 'self' ? c.employeeRating : c.managerRating,
        comments: reviewType === 'self' ? c.employeeComment : c.managerComment
      }));
    }
    
    return payload;
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      if (reviewType === 'self') {
        if (id === 'new') {
          await performanceService.createSelfReview(payload, false);
        } else {
          await performanceService.updateSelfReview(id as string, payload, false);
        }
      } else {
        await performanceService.updateManagerReview(id as string, payload, false);
      }
      toast.success('Draft saved successfully');
      navigate(-1);
    } catch (e) {
      toast.error('Error saving draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      if (reviewType === 'self') {
        if (id === 'new') {
          await performanceService.createSelfReview(payload, true);
        } else {
          await performanceService.updateSelfReview(id as string, payload, true);
        }
      } else {
        await performanceService.updateManagerReview(id as string, payload, true);
      }
      
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

  const handleCompetencyRatingChange = (competencyId: string, rating: number) => {
    if(isReadOnly) return;
    const newComps = [...(formData.competencyRatings || [])];
    const index = newComps.findIndex((c: any) => c.competencyId === competencyId);
    
    if (reviewType === 'self') {
      if(index >= 0) newComps[index].employeeRating = rating;
      else newComps.push({ competencyId, employeeRating: rating, employeeComment: '' });
    } else {
      if(index >= 0) newComps[index].managerRating = rating;
      else newComps.push({ competencyId, managerRating: rating, managerComment: '' });
    }
    setFormData({ ...formData, competencyRatings: newComps });
  };

  const handleCompetencyCommentChange = (competencyId: string, comment: string) => {
    if(isReadOnly) return;
    const newComps = [...(formData.competencyRatings || [])];
    const index = newComps.findIndex((c: any) => c.competencyId === competencyId);
    
    if (reviewType === 'self') {
      if(index >= 0) newComps[index].employeeComment = comment;
      else newComps.push({ competencyId, employeeRating: 0, employeeComment: comment });
    } else {
      if(index >= 0) newComps[index].managerComment = comment;
      else newComps.push({ competencyId, managerRating: 0, managerComment: comment });
    }
    setFormData({ ...formData, competencyRatings: newComps });
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
                    
                    {reviewType === 'manager' && ratingData?.employeeComment !== undefined && (
                      <div className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-lg border border-blue-100 dark:border-blue-500/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">Employee's Self Assessment</span>
                          <div className="flex items-center ml-4">
                            <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{ratingData.employeeRating || 0} / 5</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{ratingData.employeeComment || 'No comments provided.'}"</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-lg border border-gray-100 dark:border-white/5">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {reviewType === 'manager' ? 'Manager Rating' : 'Rating'}
                        </label>
                        <RatingStars 
                          value={reviewType === 'self' ? (ratingData?.employeeRating || 0) : (ratingData?.managerRating || 0)} 
                          onChange={(v) => handleGoalRatingChange(goal.id, v)} 
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {reviewType === 'manager' ? 'Manager Comments' : 'Comments'}
                        </label>
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
          
          {/* Competencies Section */}
          <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#181a1f] shadow-sm">
            <div className="bg-gray-50/80 dark:bg-white/[0.02] p-5 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Core Competencies</h3>
              <p className="text-sm text-gray-500">Rate behavioral and professional competencies.</p>
            </div>
            <div className="p-6 space-y-8">
              {competencies.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No competencies assigned.</p>
              ) : competencies.map((comp: Competency) => {
                const ratingData = formData.competencyRatings?.find((c: any) => c.competencyId === comp.id);
                return (
                  <div key={comp.id} className="pb-6 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-base">{comp.name}</h4>
                        <div className="text-sm text-gray-500 flex gap-4 mt-1.5">
                          <span>Category: {comp.category}</span>
                          <span>Weight: {comp.weightage}%</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{comp.description}</p>
                      </div>
                    </div>
                    
                    {reviewType === 'manager' && ratingData?.employeeComment !== undefined && (
                      <div className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-lg border border-blue-100 dark:border-blue-500/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">Employee's Self Assessment</span>
                          <div className="flex items-center ml-4">
                            <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{ratingData.employeeRating || 0} / 5</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{ratingData.employeeComment || 'No comments provided.'}"</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-lg border border-gray-100 dark:border-white/5">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {reviewType === 'manager' ? 'Manager Rating' : 'Rating'}
                        </label>
                        <RatingStars 
                          value={reviewType === 'self' ? (ratingData?.employeeRating || 0) : (ratingData?.managerRating || 0)} 
                          onChange={(v) => handleCompetencyRatingChange(comp.id, v)} 
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {reviewType === 'manager' ? 'Manager Comments' : 'Comments'}
                        </label>
                        <textarea 
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent bg-white dark:bg-[#181a1f] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                          rows={2}
                          value={reviewType === 'self' ? (ratingData?.employeeComment || '') : (ratingData?.managerComment || '')}
                          onChange={(e) => handleCompetencyCommentChange(comp.id, e.target.value)}
                          disabled={isReadOnly}
                          placeholder="Provide behavioral examples..."
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
              {/* Common: Overall Rating */}
              <div className="bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-lg border border-gray-100 dark:border-white/5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Performance Rating</label>
                <RatingStars 
                  value={formData.overallRating || 0} 
                  onChange={(v) => setFormData({...formData, overallRating: v})} 
                />
              </div>

              {reviewType === 'manager' && formData.employeeStrengths !== undefined && (
                <div className="bg-blue-50/50 dark:bg-blue-500/5 p-4 rounded-lg border border-blue-100 dark:border-blue-500/10 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">Employee's Self Summary</span>
                    <div className="flex items-center ml-4">
                      <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formData.employeeOverallRating || 0} / 5</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Key Strengths</h4>
                      <p className="text-sm text-gray-800 dark:text-gray-200 italic">"{formData.employeeStrengths || 'None provided.'}"</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Areas of Improvement</h4>
                      <p className="text-sm text-gray-800 dark:text-gray-200 italic">"{formData.employeeAreasOfImprovement || 'None provided.'}"</p>
                    </div>
                  </div>
                </div>
              )}

              {reviewType === 'self' && (
                <>
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
                </>
              )}

              {reviewType === 'manager' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Promotion Recommendation</label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent bg-gray-50/30 dark:bg-white/[0.01] text-gray-900 dark:text-white text-sm"
                        value={formData.promotionRecommendation || ''}
                        onChange={(e) => setFormData({...formData, promotionRecommendation: e.target.value})}
                        disabled={isReadOnly}
                      >
                        <option value="">Select recommendation...</option>
                        <option value="Yes">Yes, ready for promotion</option>
                        <option value="No">No, not ready yet</option>
                        <option value="Maybe Later">Consider in next cycle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Training & Development Plan</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent bg-gray-50/30 dark:bg-white/[0.01] text-gray-900 dark:text-white text-sm"
                        value={formData.trainingRecommendation || ''}
                        onChange={(e) => setFormData({...formData, trainingRecommendation: e.target.value})}
                        disabled={isReadOnly}
                        placeholder="e.g. Leadership Workshop, AWS Certification..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Performance Improvement Plan (PIP)</label>
                    <textarea 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent bg-gray-50/30 dark:bg-white/[0.01] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                      rows={3}
                      value={formData.improvementPlan || ''}
                      onChange={(e) => setFormData({...formData, improvementPlan: e.target.value})}
                      disabled={isReadOnly}
                      placeholder="Detail any necessary performance improvement steps..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Manager Comments</label>
                    <textarea 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent bg-gray-50/30 dark:bg-white/[0.01] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                      rows={4}
                      value={formData.managerComments || ''}
                      onChange={(e) => setFormData({...formData, managerComments: e.target.value})}
                      disabled={isReadOnly}
                      placeholder="Final comments and summary for the employee..."
                    />
                  </div>
                </>
              )}
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
