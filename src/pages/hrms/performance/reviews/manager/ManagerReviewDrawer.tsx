import { useState } from 'react';
import Drawer from '../../../../../components/ui/Drawer';
import { FormLayout } from '../../../../../components/ui/FormLayout';
import CustomSelect from '../../../../../components/ui/CustomSelect';
import type { ManagerReview, SelfReview } from '../../types';
import { mockGoals, mockSelfReviews } from '../../mock/mockPerformanceData';
import { Star, User, AlertCircle } from 'lucide-react';

interface ManagerReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  review: ManagerReview;
}

export default function ManagerReviewDrawer({ isOpen, onClose, review }: ManagerReviewDrawerProps) {
  const [formData, setFormData] = useState<ManagerReview>(review);
  
  // Find associated self review
  const selfReview: SelfReview | undefined = mockSelfReviews.find(sr => sr.id === review.selfReviewId);
  const employeeGoals = mockGoals.filter(g => g.employee.id === review.employee.id);
  
  const isReadOnly = review.status === 'Submitted' || review.status === 'Finalized';

  const handleSaveDraft = () => {
    onClose();
  };

  const handleSubmit = () => {
    onClose();
  };

  const handleGoalRatingChange = (goalId: string, rating: number) => {
    if(isReadOnly) return;
    const newGoals = [...formData.goalAssessment];
    const index = newGoals.findIndex(g => g.goalId === goalId);
    if(index >= 0) newGoals[index].managerRating = rating;
    else newGoals.push({ goalId, managerRating: rating, managerComment: '' });
    setFormData({ ...formData, goalAssessment: newGoals });
  };

  const handleGoalCommentChange = (goalId: string, comment: string) => {
    if(isReadOnly) return;
    const newGoals = [...formData.goalAssessment];
    const index = newGoals.findIndex(g => g.goalId === goalId);
    if(index >= 0) newGoals[index].managerComment = comment;
    else newGoals.push({ goalId, managerRating: 0, managerComment: comment });
    setFormData({ ...formData, goalAssessment: newGoals });
  };

  const RatingStars = ({ value, onChange, disabled = false, size = 20 }: { value: number, onChange?: (v: number) => void, disabled?: boolean, size?: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            disabled={disabled || !onChange}
            className={`${disabled || !onChange ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <Star 
              size={size} 
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
      title={isReadOnly ? `View Review - ${review.employee.name}` : `Manager Assessment - ${review.employee.name}`}
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
            <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-[#792359] rounded-sm hover:bg-[#b8458f]">
              Submit Assessment
            </button>
          </div>
        ) : null
      }
    >
      <FormLayout>
        
        {/* Employee Info Header */}
        <div className="bg-gray-50 dark:bg-gray-800/30 p-4 border border-gray-200 dark:border-gray-700 rounded-sm mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f0e4ec] dark:bg-[#792359]/20 flex items-center justify-center text-[#792359] dark:text-[#e6a8d0]">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{review.employee.name}</h3>
              <p className="text-sm text-gray-500">{review.employee.designation} • {review.employee.department}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Self Review Rating</p>
            <div className="flex items-center gap-2 justify-end">
              <RatingStars value={selfReview?.overallRating || 0} disabled size={16} />
              <span className="font-bold text-gray-900 dark:text-white">{selfReview?.overallRating || '-'}</span>
            </div>
          </div>
        </div>

        {/* Goals Assessment */}
        <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-sm overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goal Assessment</h3>
            <p className="text-sm text-gray-500">Review employee's self-assessment and provide your rating.</p>
          </div>
          <div className="p-4 space-y-6">
            {employeeGoals.map(goal => {
              const srRating = selfReview?.goalAchievement.find(g => g.goalId === goal.id);
              const mgrRating = formData.goalAssessment.find(g => g.goalId === goal.id);
              
              return (
                <div key={goal.id} className="pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-md">{goal.title}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{goal.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Self Review Column */}
                    <div className="bg-gray-50 dark:bg-[#1a1c23] p-4 rounded-sm border border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee Self Review</span>
                        <RatingStars value={srRating?.employeeRating || 0} disabled size={14} />
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{srRating?.employeeComment || 'No comment provided.'}"
                      </p>
                    </div>

                    {/* Manager Assessment Column */}
                    <div className="p-4 rounded-sm border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-semibold text-[#792359] dark:text-[#e6a8d0] uppercase tracking-wider">Manager Assessment</span>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Rating</label>
                        <RatingStars 
                          value={mgrRating?.managerRating || 0} 
                          onChange={(v) => handleGoalRatingChange(goal.id, v)} 
                          disabled={isReadOnly}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Comments</label>
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:ring-1 focus:ring-[#792359] focus:border-transparent bg-white dark:bg-[#1f2229] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                          rows={2}
                          value={mgrRating?.managerComment || ''}
                          onChange={(e) => handleGoalCommentChange(goal.id, e.target.value)}
                          disabled={isReadOnly}
                          placeholder="Provide constructive feedback..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Manager Summary Section */}
        <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-sm overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommendations & Summary</h3>
          </div>
          <div className="p-4 space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Promotion Recommendation</label>
                <CustomSelect 
                  options={[
                    { value: 'Yes', label: 'Highly Recommended for Promotion' },
                    { value: 'Maybe Later', label: 'Developing - Consider next cycle' },
                    { value: 'No', label: 'Not Recommended at this time' }
                  ]}
                  value={formData.promotionRecommendation || ''}
                  onChange={(val: string) => setFormData({...formData, promotionRecommendation: val as any})}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Training Recommendations</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:ring-1 focus:ring-[#792359] focus:border-transparent bg-white dark:bg-[#1f2229] text-gray-900 dark:text-white text-sm"
                  value={formData.trainingRecommendation || ''}
                  onChange={(e) => setFormData({...formData, trainingRecommendation: e.target.value})}
                  disabled={isReadOnly}
                  placeholder="e.g. Leadership Workshop, AWS Certification"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                Performance Improvement Plan (PIP) <AlertCircle size={14} className="text-orange-500" />
              </label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:ring-1 focus:ring-[#792359] focus:border-transparent bg-white dark:bg-[#1f2229] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                rows={2}
                value={formData.improvementPlan || ''}
                onChange={(e) => setFormData({...formData, improvementPlan: e.target.value})}
                disabled={isReadOnly}
                placeholder="Only required if performance is below expectations..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-4">Final Manager Comments</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:ring-1 focus:ring-[#792359] focus:border-transparent bg-white dark:bg-[#1f2229] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
                rows={4}
                value={formData.managerComments || ''}
                onChange={(e) => setFormData({...formData, managerComments: e.target.value})}
                disabled={isReadOnly}
                placeholder="Summarize the overall performance for this cycle..."
              />
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center bg-[#792359]/5 border border-[#792359]/20 p-4 rounded-sm">
              <span className="font-semibold text-[#792359] dark:text-[#e6a8d0]">Final Manager Rating</span>
              <div className="flex items-center gap-4">
                <RatingStars 
                  value={formData.overallRating || 0} 
                  onChange={(v) => setFormData({...formData, overallRating: v})}
                  disabled={isReadOnly}
                  size={24}
                />
                <span className="text-xl font-bold text-[#792359] dark:text-[#e6a8d0] bg-white dark:bg-[#1f2229] px-3 py-1 rounded-sm border border-[#792359]/20">
                  {formData.overallRating ? formData.overallRating.toFixed(1) : '0.0'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </FormLayout>
    </Drawer>
  );
}
