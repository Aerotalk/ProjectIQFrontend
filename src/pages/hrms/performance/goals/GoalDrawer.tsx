import { useState, useEffect } from 'react';
import Drawer from '../../../../components/ui/Drawer';
import { FormLayout } from '../../../../components/ui/FormLayout';
import CustomInput from '../../../../components/ui/CustomInput';
import CustomSelect from '../../../../components/ui/CustomSelect';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import type { Goal } from '../types';
import { Target } from 'lucide-react';

interface GoalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: Goal | null;
  mode?: 'create' | 'view' | 'edit';
  onSave?: (data: Partial<Goal>) => void;
}

export default function GoalDrawer({ isOpen, onClose, goal, mode = 'create', onSave }: GoalDrawerProps) {
  const [formData, setFormData] = useState<Partial<Goal>>({});

  useEffect(() => {
    if (goal && isOpen) {
      setFormData(goal);
    } else if (isOpen) {
      setFormData({});
    }
  }, [goal, isOpen]);

  const isReadOnly = mode === 'view';

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === 'create' ? 'Create New Goal' : mode === 'edit' ? 'Edit Goal' : 'Goal Details'}
      size="md"
      onSave={isReadOnly ? undefined : () => {
        onSave && onSave(formData);
        onClose();
      }}
    >
      <FormLayout>
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-white/5">
          <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Target className="text-indigo-600 dark:text-indigo-400" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Goal Details</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Define the objective and metrics</p>
          </div>
        </div>

        <CustomInput 
          label="Goal Title" 
          value={formData.title || ''}
          onChange={(e: any) => setFormData({...formData, title: e.target.value})}
          disabled={isReadOnly}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <CustomSelect 
              options={[
                { value: 'Strategic', label: 'Strategic' },
                { value: 'Departmental', label: 'Departmental' },
                { value: 'Individual', label: 'Individual' }
              ]}
              value={formData.category || 'Strategic'}
              onChange={(val) => setFormData({...formData, category: val as any})}
              disabled={isReadOnly}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
            <CustomSelect 
              options={[
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' }
              ]}
              value={formData.priority || 'Medium'}
              onChange={(val) => setFormData({...formData, priority: val as any})}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Measurement</h3>
          
          <div className="grid grid-cols-1 gap-4 mb-4">
            <CustomInput 
              label="Key Performance Indicator (KPI)" 
              value={formData.kpi || ''}
              onChange={(e: any) => setFormData({...formData, kpi: e.target.value})}
              disabled={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <CustomInput 
              label="Target" 
              type="number"
              value={formData.targetValue || 0}
              onChange={(e: any) => setFormData({...formData, targetValue: Number(e.target.value)})}
              disabled={isReadOnly}
            />
            <CustomInput 
              label="Current" 
              type="number"
              value={formData.currentValue || 0}
              onChange={(e: any) => setFormData({...formData, currentValue: Number(e.target.value)})}
              disabled={isReadOnly}
            />
            <CustomInput 
              label="Unit" 
              placeholder="e.g. %, $, hr"
              value={formData.unit || ''}
              onChange={(e: any) => setFormData({...formData, unit: e.target.value})}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <CustomInput 
            label="Weightage (%)" 
            type="number"
            value={formData.weightage || 0}
            onChange={(e: any) => setFormData({...formData, weightage: Number(e.target.value)})}
            disabled={isReadOnly}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
            <CustomDatePicker 
              value={formData.dueDate}
              onChange={(val: string) => setFormData({...formData, dueDate: val})}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <CustomSelect 
            options={[
              { value: 'On Track', label: 'On Track' },
              { value: 'At Risk', label: 'At Risk' },
              { value: 'Behind', label: 'Behind' },
              { value: 'Completed', label: 'Completed' }
            ]}
            value={formData.status || 'On Track'}
            onChange={(val) => setFormData({...formData, status: val as any})}
            disabled={isReadOnly}
          />
        </div>
      </FormLayout>
    </Drawer>
  );
}
