import { useState, useEffect } from 'react';
import Drawer from '../../../../components/ui/Drawer';
import { FormLayout } from '../../../../components/ui/FormLayout';
import CustomInput from '../../../../components/ui/CustomInput';
import CustomSelect from '../../../../components/ui/CustomSelect';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import type { AppraisalCycle } from '../types';

interface CycleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cycle: AppraisalCycle | null;
}

export default function CycleDrawer({ isOpen, onClose, cycle }: CycleDrawerProps) {
  const [formData, setFormData] = useState<Partial<AppraisalCycle>>({
    status: 'Draft'
  });

  useEffect(() => {
    if (cycle) {
      setFormData(cycle);
    } else {
      setFormData({
        status: 'Draft',
        type: 'Annual'
      });
    }
  }, [cycle, isOpen]);

  const handleSave = () => {
    // Mock save
    console.log('Saving cycle:', formData);
    onClose();
  };

  const isViewMode = cycle?.status === 'Completed' || cycle?.status === 'Archived';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={cycle ? (isViewMode ? 'View Cycle' : 'Edit Cycle') : 'Create New Cycle'}
      size="lg"
      footer={
        !isViewMode ? (
          <div className="flex justify-end gap-3 w-full">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-[#792359] rounded-sm hover:bg-[#b8458f]">
              {cycle ? 'Save Changes' : 'Create Cycle'}
            </button>
          </div>
        ) : null
      }
    >
      <FormLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput 
            label="Cycle Name" 
            value={formData.name || ''} 
            onChange={(e: any) => setFormData({...formData, name: e.target.value})} 
            required 
            readOnly={isViewMode}
            placeholder="e.g. Annual Review 2026"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Review Type</label>
            <CustomSelect 
              options={[
                { value: 'Annual', label: 'Annual' },
                { value: 'Bi-Annual', label: 'Bi-Annual' },
                { value: 'Quarterly', label: 'Quarterly' },
                { value: 'Probation', label: 'Probation' }
              ]}
              value={formData.type || ''}
              onChange={(val) => setFormData({...formData, type: val as any})}
              disabled={isViewMode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <CustomDatePicker 
              value={formData.startDate}
              onChange={(date: string) => setFormData({...formData, startDate: date})}
              disabled={isViewMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <CustomDatePicker 
              value={formData.endDate}
              onChange={(date: string) => setFormData({...formData, endDate: date})}
              disabled={isViewMode}
            />
          </div>
        </div>

        <h3 className="text-md font-semibold text-gray-900 dark:text-white mt-8 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Review Deadlines
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Self Review Deadline</label>
            <CustomDatePicker 
              value={formData.selfReviewDeadline}
              onChange={(date: string) => setFormData({...formData, selfReviewDeadline: date})}
              disabled={isViewMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manager Review Deadline</label>
            <CustomDatePicker 
              value={formData.managerReviewDeadline}
              onChange={(date: string) => setFormData({...formData, managerReviewDeadline: date})}
              disabled={isViewMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HR Review Deadline</label>
            <CustomDatePicker 
              value={formData.hrReviewDeadline}
              onChange={(val: string) => setFormData({...formData, hrReviewDeadline: val})}
              disabled={isViewMode}
            />
          </div>
        </div>

        <h3 className="text-md font-semibold text-gray-900 dark:text-white mt-8 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Eligibility & Scope
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Departments</label>
            <CustomSelect 
              options={[
                {value: 'All', label: 'All Departments'},
                {value: 'Engineering', label: 'Engineering'},
                {value: 'Sales', label: 'Sales'}
              ]}
              value={(formData as any).targetDepartments?.[0] || 'All'}
              onChange={(val) => setFormData({...formData, targetDepartments: [val]} as any)}
              disabled={isViewMode}
            />
            <p className="text-xs text-gray-500 mt-1">Leave as 'All' to include everyone.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Locations</label>
            <CustomSelect 
              options={[
                {value: 'All', label: 'All Locations'},
                {value: 'New York', label: 'New York'},
                {value: 'London', label: 'London'}
              ]}
              value={(formData as any).targetLocations?.[0] || 'All'}
              onChange={(val) => setFormData({...formData, targetLocations: [val]} as any)}
              disabled={isViewMode}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:ring-1 focus:ring-[#792359] focus:border-transparent bg-white dark:bg-[#1f2229] text-gray-900 dark:text-white text-sm custom-scrollbar resize-y"
            rows={4}
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            disabled={isViewMode}
            placeholder="Add context or instructions for this appraisal cycle..."
          />
        </div>

      </FormLayout>
    </Drawer>
  );
}
