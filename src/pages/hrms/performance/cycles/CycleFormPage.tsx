import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FormLayout } from '../../../../components/ui/FormLayout';
import CustomInput from '../../../../components/ui/CustomInput';
import CustomSelect from '../../../../components/ui/CustomSelect';
import CustomDatePicker from '../../../../components/ui/CustomDatePicker';
import { formStyles } from '../../../../components/ui/form-styles';
import type { AppraisalCycle } from '../types';
import { Save, ArrowLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';
import { Skeleton } from '../../../../components/ui/skeleton';

export default function CycleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = id === 'new' ? 'create' : (queryParams.get('mode') === 'view' ? 'view' : 'edit');
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';
  
  const [formData, setFormData] = useState<Partial<AppraisalCycle>>({
    status: 'Draft',
    type: 'Annual'
  });
  const [loading, setLoading] = useState(mode !== 'create');
  
  const isViewMode = mode === 'view';

  useEffect(() => {
    if (mode !== 'create' && id) {
      fetchCycle();
    }
  }, [id, mode]);

  const fetchCycle = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/hrms/performance/cycles/${id}`);
      setFormData(data);
    } catch (e) {
      toast.error('Failed to load cycle details');
      navigate(`${basePath}/hrms/performance/cycles`);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Cycle name is required');
      return;
    }

    try {
      if (mode === 'create') {
        await api.post('/hrms/performance/cycles', formData);
        toast.success('Cycle created successfully');
      } else {
        await api.put(`/hrms/performance/cycles/${id}`, formData);
        toast.success('Cycle updated successfully');
      }
      navigate(`${basePath}/hrms/performance/cycles`);
    } catch (e) {
      toast.error('Error saving cycle');
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
            onClick={() => navigate(`${basePath}/hrms/performance/cycles`)} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Create New Cycle' : isViewMode ? 'View Cycle' : 'Edit Cycle'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure performance review cycle</p>
          </div>
        </div>
        
        {!isViewMode && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(`${basePath}/hrms/performance/cycles`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 shadow-sm transition-colors"
            >
              <Save size={16} />
              {mode === 'create' ? 'Create Cycle' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
              <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
              </div>
            </div>

            <FormLayout>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="Cycle Name"
                  value={formData.name || ''}
                  onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                  required
                  readOnly={isViewMode}
                  placeholder="e.g. Annual Review 2026"
                />
                <div>
                  <label className={formStyles.label}>Review Type</label>
                  <CustomSelect
                    options={[
                      { value: 'Annual', label: 'Annual' },
                      { value: 'Bi-Annual', label: 'Bi-Annual' },
                      { value: 'Quarterly', label: 'Quarterly' },
                      { value: 'Probation', label: 'Probation' }
                    ]}
                    value={formData.type || ''}
                    onChange={(val) => setFormData({ ...formData, type: val as any })}
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className={formStyles.label}>Start Date</label>
                  <CustomDatePicker
                    value={formData.startDate}
                    onChange={(date: string) => setFormData({ ...formData, startDate: date })}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <label className={formStyles.label}>End Date</label>
                  <CustomDatePicker
                    value={formData.endDate}
                    onChange={(date: string) => setFormData({ ...formData, endDate: date })}
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </FormLayout>
          </div>

          <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
              Review Deadlines
            </h3>

            <FormLayout>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={formStyles.label}>Self Review Deadline</label>
                    <CustomDatePicker
                      value={formData.selfReviewDeadline}
                      onChange={(date: string) => setFormData({ ...formData, selfReviewDeadline: date })}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <label className={formStyles.label}>Manager Review Deadline</label>
                    <CustomDatePicker
                      value={formData.managerReviewDeadline}
                      onChange={(date: string) => setFormData({ ...formData, managerReviewDeadline: date })}
                      disabled={isViewMode}
                    />
                  </div>
                </div>
                <div>
                  <label className={formStyles.label}>HR Review Deadline</label>
                  <CustomDatePicker
                    value={formData.hrReviewDeadline}
                    onChange={(val: string) => setFormData({ ...formData, hrReviewDeadline: val })}
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </FormLayout>
          </div>

          <div className="bg-white dark:bg-[#181a1f] rounded-lg border border-gray-200 dark:border-white/10 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
              Eligibility & Scope
            </h3>

            <FormLayout>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={formStyles.label}>Target Departments</label>
                  <CustomSelect
                    options={[
                      { value: 'All', label: 'All Departments' },
                      { value: 'Engineering', label: 'Engineering' },
                      { value: 'Sales', label: 'Sales' }
                    ]}
                    value={(formData as any).targetDepartments?.[0] || 'All'}
                    onChange={(val) => setFormData({ ...formData, targetDepartments: [val] } as any)}
                    disabled={isViewMode}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave as 'All' to include everyone.</p>
                </div>
                <div>
                  <label className={formStyles.label}>Target Locations</label>
                  <CustomSelect
                    options={[
                      { value: 'All', label: 'All Locations' },
                      { value: 'New York', label: 'New York' },
                      { value: 'London', label: 'London' }
                    ]}
                    value={(formData as any).targetLocations?.[0] || 'All'}
                    onChange={(val) => setFormData({ ...formData, targetLocations: [val] } as any)}
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className={formStyles.label}>
                  Description
                </label>
                <textarea
                  className={formStyles.textarea(false, isViewMode)}
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isViewMode}
                  placeholder="Add context or instructions for this appraisal cycle..."
                />
              </div>
            </FormLayout>
          </div>
        </div>
      </div>
    </div>
  );
}
