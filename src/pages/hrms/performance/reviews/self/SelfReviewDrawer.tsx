import { useState } from 'react';
import Drawer from '../../../../../components/ui/Drawer';
import { FormLayout } from '../../../../../components/ui/FormLayout';
import type { SelfReview, Goal, Competency, RatingScale } from '../../types';
import { Star } from 'lucide-react';

interface SelfReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, submit: boolean) => Promise<void>;
  initialData?: SelfReview;
  goals: Goal[];
  competencies: Competency[];
  ratingScale: RatingScale;
}

export default function SelfReviewDrawer({ isOpen, onClose, onSave: _onSave, initialData, goals, competencies, ratingScale: _ratingScale }: SelfReviewDrawerProps) {
  const [formData, setFormData] = useState<SelfReview>(initialData || {} as SelfReview);
  
  // Use passed goals and competencies
  const employeeGoals = goals;
  const isReadOnly = initialData?.status === 'Submitted' || initialData?.status === 'Finalized';

  const handleSaveDraft = () => {
    console.log('Saving Draft:', formData);
    onClose();
  };

  const handleSubmit = () => {
    console.log('Submitting Review:', { ...formData, status: 'Submitted', submittedOn: new Date().toISOString().split('T')[0] });
    onClose();
  };

  const handleGoalRatingChange = (goalId: string, rating: number) => {
    if(isReadOnly) return;
    const newGoals = [...formData.goalAchievement];
    const index = newGoals.findIndex(g => g.goalId === goalId);
    if(index >= 0) newGoals[index].employeeRating = rating;
    else newGoals.push({ goalId, employeeRating: rating, employeeComment: '' });
    setFormData({ ...formData, goalAchievement: newGoals });
  };

  const handleGoalCommentChange = (goalId: string, comment: string) => {
    if(isReadOnly) return;
    const newGoals = [...formData.goalAchievement];
    const index = newGoals.findIndex(g => g.goalId === goalId);
    if(index >= 0) newGoals[index].employeeComment = comment;
    else newGoals.push({ goalId, employeeRating: 0, employeeComment: comment });
    setFormData({ ...formData, goalAchievement: newGoals });
  };

  const handleCompetencyRatingChange = (compId: string, rating: number) => {
    if(isReadOnly) return;
    const newComps = [...formData.competencyRatings];
    const index = newComps.findIndex(c => c.competencyId === compId);
    if(index >= 0) newComps[index].employeeRating = rating;
    else newComps.push({ competencyId: compId, employeeRating: rating, employeeComment: '' });
    setFormData({ ...formData, competencyRatings: newComps });
  };

  const handleCompetencyCommentChange = (compId: string, comment: string) => {
    if(isReadOnly) return;
    const newComps = [...formData.competencyRatings];
    const index = newComps.findIndex(c => c.competencyId === compId);
    if(index >= 0) newComps[index].employeeComment = comment;
    else newComps.push({ competencyId: compId, employeeRating: 0, employeeComment: comment });
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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isReadOnly ? `View Self Review` : `Self Assessment`}
      size="xl"
      footer={
        !isReadOnly ? (
          <div className="flex justify-end gap-3 w-full">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button onClick={handleSaveDraft} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
              Save Draft
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-sm hover:bg-[#b8458f]">
              Submit Review
            </button>
          </div>
        ) : null
      }
    >
      <FormLayout>
        
        {/* Goals Section */}
        <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-sm overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goal Achievement</h3>
            <p className="text-sm text-gray-500">Rate your performance against your assigned goals.</p>
          </div>
          <div className="p-4 space-y-6">
            {employeeGoals.map((goal: Goal) => {
              const ratingData = formData.goalAchievement?.find(g => g.goalId === goal.id);
              return (
                <div key={goal.id} className="pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-md">{goal.title}</h4>
                      <div className="text-sm text-gray-500 flex gap-4 mt-1">
                        <span>Target: {goal.targetValue} {goal.unit}</span>
                        <span>Actual: {goal.currentValue} {goal.unit}</span>
                        <span>Weight: {goal.weightage}%</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                      {goal.progress}% Complete
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Self Rating</label>
                      <RatingStars 
                        value={ratingData?.employeeRating || 0} 
                        onChange={(v) => handleGoalRatingChange(goal.id, v)} 
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comments on Achievement</label>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:ring-1 focus:ring-primary focus:border-transparent bg-white dark:bg-[#1f2229] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                        rows={2}
                        value={ratingData?.employeeComment || ''}
                        onChange={(e) => handleGoalCommentChange(goal.id, e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Detail your achievements for this goal..."
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Competencies Section */}
        <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-sm overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Core Competencies</h3>
            <p className="text-sm text-gray-500">Evaluate yourself against the organizational core competencies.</p>
          </div>
          <div className="p-4 space-y-6">
            {competencies.map((comp: Competency) => {
              const ratingData = formData.competencyRatings?.find(c => c.competencyId === comp.id);
              return (
                <div key={comp.id} className="pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white text-md">{comp.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{comp.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Self Rating</label>
                      <RatingStars 
                        value={ratingData?.employeeRating || 0} 
                        onChange={(v) => handleCompetencyRatingChange(comp.id, v)} 
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Examples / Comments</label>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:ring-1 focus:ring-primary focus:border-transparent bg-white dark:bg-[#1f2229] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                        rows={2}
                        value={ratingData?.employeeComment || ''}
                        onChange={(e) => handleCompetencyCommentChange(comp.id, e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Provide examples demonstrating this competency..."
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Summary Section */}
        <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-sm overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Summary</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Strengths & Achievements</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:ring-1 focus:ring-primary focus:border-transparent bg-white dark:bg-[#1f2229] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                rows={4}
                value={formData.strengths || ''}
                onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                disabled={isReadOnly}
                placeholder="Highlight your major contributions during this period..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Areas for Improvement & Development Needs</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:ring-1 focus:ring-primary focus:border-transparent bg-white dark:bg-[#1f2229] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                rows={4}
                value={formData.areasOfImprovement || ''}
                onChange={(e) => setFormData({...formData, areasOfImprovement: e.target.value})}
                disabled={isReadOnly}
                placeholder="What skills or areas do you want to focus on next?"
              />
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/30 p-4 rounded-sm">
              <span className="font-semibold text-gray-900 dark:text-white">Calculated Overall Self Rating</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary dark:text-secondary">{formData.overallRating || '0.0'}</span>
                <span className="text-sm text-gray-500">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>

      </FormLayout>
    </Drawer>
  );
}
