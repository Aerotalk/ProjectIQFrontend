import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FormLayout } from '../../../../components/ui/FormLayout';
import CustomInput from '../../../../components/ui/CustomInput';
import CustomSelect from '../../../../components/ui/CustomSelect';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import { formStyles } from '../../../../components/ui/form-styles';
import type { Goal } from '../types';
import { Target, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';
import { Skeleton } from '../../../../components/ui/skeleton';

export default function GoalFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  
  const [formData, setFormData] = useState<Partial<Goal>>({});
  const [loading, setLoading] = useState(mode !== 'create');
  
  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (mode !== 'create' && id) {
      fetchGoal();
    }
  }, [id, mode]);

  const fetchGoal = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/hrms/performance/goals/${id}`);
      setFormData({
        id: data.id,
        title: data.title,
        description: data.description || '',
        category: data.category || 'Strategic',
        weightage: data.weightage || 20,
        kpi: data.kpi || '',
        targetValue: data.targetValue || 100,
        currentValue: data.currentValue || 0,
        unit: data.unit || '%',
        dueDate: data.dueDate || '',
        priority: data.priority || 'Medium',
        status: data.status || 'In Progress'
      });
    } catch (e) {
      toast.error('Failed to load goal details');
      navigate(`${basePath}/hrms/performance/goals`);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Goal title is required');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        weightage: formData.weightage,
        kpi: formData.kpi,
        targetValue: formData.targetValue,
        currentValue: formData.currentValue,
        unit: formData.unit,
        dueDate: formData.dueDate,
        priority: formData.priority,
        status: formData.status || 'In Progress',
        employee: { id: '00000000-0000-0000-0000-000000000001' }, 
        cycle: { id: '00000000-0000-0000-0000-000000000002' }
      };

      if (mode === 'create') {
        await api.post('/hrms/performance/goals', payload);
        toast.success('Goal created successfully');
      } else {
        await api.put(`/hrms/performance/goals/${id}`, payload);
        toast.success('Goal updated successfully');
      }
      navigate(`${basePath}/hrms/performance/goals`);
    } catch (e) {
      toast.error('Error saving goal');
    }
  };

  if (loading) {
    return <div className="p-6"><Skeleton className="w-full h-[600px] rounded-lg" /></div>;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
      <div className="bg-white dark:bg-[#181a1f] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`${basePath}/hrms/performance/goals`)} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Create New Goal' : mode === 'edit' ? 'Edit Goal' : 'Goal Details'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Define the objective and metrics</p>
          </div>
        </div>
        
        {!isReadOnly && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(`${basePath}/hrms/performance/goals`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 shadow-sm transition-colors"
            >
              <Save size={16} />
              Save Goal
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="w-full space-y-6">
          <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
              <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="text-indigo-600 dark:text-indigo-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
              </div>
            </div>

            <FormLayout>
              <CustomInput 
                label="Goal Title" 
                value={formData.title || ''}
                onChange={(e: any) => setFormData({...formData, title: e.target.value})}
                disabled={isReadOnly}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={formStyles.label}>Category</label>
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
                  <label className={formStyles.label}>Priority</label>
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
            </FormLayout>
          </div>

          <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
              Measurement & Tracking
            </h3>
            
            <FormLayout>
              <div className="grid grid-cols-1 gap-4">
                <CustomInput 
                  label="Key Performance Indicator (KPI)" 
                  value={formData.kpi || ''}
                  onChange={(e: any) => setFormData({...formData, kpi: e.target.value})}
                  disabled={isReadOnly}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomInput 
                  label="Weightage (%)" 
                  type="number"
                  value={formData.weightage || 0}
                  onChange={(e: any) => setFormData({...formData, weightage: Number(e.target.value)})}
                  disabled={isReadOnly}
                />
                <div>
                  <label className={formStyles.label}>Due Date</label>
                  <CustomDatePicker 
                    value={formData.dueDate}
                    onChange={(val: string) => setFormData({...formData, dueDate: val})}
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className={formStyles.label}>Status</label>
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
          </div>
        </div>
      </div>
    </div>
  );
}
