import { useState, useEffect } from 'react';
import { X, Save, FolderKanban } from 'lucide-react';
import type { Project, ProjectFormValues } from '../../../types/project.types';
import CustomSelect from '@/components/ui/CustomSelect';

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  initialData?: Project;
}

export default function ProjectDrawer({ isOpen, onClose, onSave, mode, initialData }: ProjectDrawerProps) {
  const [formData, setFormData] = useState<ProjectFormValues>({
    projectCode: '',
    projectName: '',
    description: '',
    status: 'In Progress'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        setFormData({
          projectCode: initialData.projectCode || '',
          projectName: initialData.projectName || '',
          description: initialData.description || '',
          status: initialData.status || 'In Progress'
        });
      } else {
        setFormData({
          projectCode: '',
          projectName: '',
          description: '',
          status: 'In Progress'
        });
      }
    }
  }, [isOpen, initialData, mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') {
      onClose();
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="w-full bg-white dark:bg-[#181a1f] rounded-sm shadow-sm border border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-8rem)]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-[#792359] dark:text-[#e6a8d0]">
              <FolderKanban size={16} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {mode === 'create' ? 'Create Project' : mode === 'edit' ? 'Edit Project' : 'Project Details'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mode === 'create' ? 'Add a new project' : initialData?.projectCode}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Code *</label>
                <input
                  required
                  type="text"
                  disabled={isReadOnly}
                  value={formData.projectCode}
                  onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white disabled:opacity-70"
                  placeholder="e.g. PRJ-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name *</label>
                <input
                  required
                  type="text"
                  disabled={isReadOnly}
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white disabled:opacity-70"
                  placeholder="e.g. ERP Implementation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                {isReadOnly ? (
                  <div className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300">
                    {formData.status}
                  </div>
                ) : (
                  <CustomSelect
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                    options={[
                      { label: 'In Progress', value: 'In Progress' },
                      { label: 'Completed', value: 'Completed' },
                      { label: 'On Hold', value: 'On Hold' }
                    ]}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  disabled={isReadOnly}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white resize-none disabled:opacity-70"
                  placeholder="Project details and scope..."
                  rows={4}
                />
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm transition-colors"
          >
            {mode === 'view' ? 'Close' : 'Cancel'}
          </button>
          {mode !== 'view' && (
            <button
              type="submit"
              form="project-form"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#792359] hover:bg-[#52173c] rounded-sm shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {mode === 'create' ? 'Create Project' : 'Save Changes'}
                </>
              )}
            </button>
          )}
      </div>
    </div>
  );
}
