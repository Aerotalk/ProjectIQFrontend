import { useState, useEffect } from 'react';
import { X, Save, FolderKanban } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useVendors } from '../../../hooks/useVendors';
import { api } from '../../../lib/api';
import { ClientService } from '../../../services/client.service';
import type { Client } from '../../../types/client.types';
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
  const { selectedCompanyId } = useAuth();
  const { vendors } = useVendors({ companyId: selectedCompanyId || null });
  const [users, setUsers] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [formData, setFormData] = useState<ProjectFormValues>({
    projectCode: '',
    projectName: '',
    linkedQuotation: '',
    client: '',
    assignedVendors: [],
    projectManager: '',
    startDate: '',
    expectedEndDate: '',
    description: '',
    status: 'Pending Approval',
    assignedEntities: [],
    linkedIncidents: [],
    linkedQuotations: [],
    linkedPOs: [],
    linkedExpenses: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchUsers = async () => {
      try {
        const response: any = await api.get('/admin/users');
        const data = Array.isArray(response) ? response : (response.content || []);
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };
    const fetchClients = async () => {
      if (!selectedCompanyId) return;
      try {
        const data = await ClientService.getClients(selectedCompanyId);
        setClients(data);
      } catch (err) {
        console.error('Failed to load clients', err);
      }
    };
    fetchUsers();
    fetchClients();
  }, [isOpen, selectedCompanyId]);

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'view')) {
        setFormData({
          projectCode: initialData.projectCode || '',
          projectName: initialData.projectName || '',
          linkedQuotation: initialData.linkedQuotation || '',
          client: initialData.client || '',
          assignedVendors: initialData.assignedVendors || [],
          projectManager: initialData.projectManager || '',
          startDate: initialData.startDate || '',
          expectedEndDate: initialData.expectedEndDate || '',
          description: initialData.description || '',
          status: initialData.status || 'Pending Approval',
          assignedEntities: initialData.assignedEntities || [],
          linkedIncidents: initialData.linkedIncidents || [],
          linkedQuotations: initialData.linkedQuotations || [],
          linkedPOs: initialData.linkedPOs || [],
          linkedExpenses: initialData.linkedExpenses || []
        });
      } else {
        setFormData({
          projectCode: '',
          projectName: '',
          linkedQuotation: '',
          client: '',
          assignedVendors: [],
          projectManager: '',
          startDate: '',
          expectedEndDate: '',
          description: '',
          status: 'Pending Approval',
          assignedEntities: [],
          linkedIncidents: [],
          linkedQuotations: [],
          linkedPOs: [],
          linkedExpenses: []
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Code</label>
                  <input
                    type="text"
                    disabled={true}
                    value={formData.projectCode}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder={mode === 'create' ? "Auto-generated upon save" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  {isReadOnly ? (
                    <CustomSelect
                      value={formData.status}
                      onChange={(val) => {
                        const newData = { ...formData, status: val };
                        setFormData(newData);
                        onSave(newData); // quick save in view mode
                      }}
                      options={[
                        { label: 'Pending Approval', value: 'Pending Approval' },
                        { label: 'Active', value: 'Active' },
                        { label: 'In Progress', value: 'In Progress' },
                        { label: 'On Hold', value: 'On Hold' },
                        { label: 'Completed', value: 'Completed' },
                        { label: 'Cancelled', value: 'Cancelled' }
                      ]}
                    />
                  ) : (
                    <div className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm text-gray-700 dark:text-gray-300">
                      {formData.status}
                    </div>
                  )}
                </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Linked Quotation</label>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={formData.linkedQuotation}
                    onChange={(e) => setFormData({ ...formData, linkedQuotation: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white disabled:opacity-70"
                    placeholder="Quotation number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Client *
                    <span className="ml-1 text-[10px] text-gray-400 normal-case font-normal tracking-normal">(required)</span>
                  </label>
                  <CustomSelect
                    disabled={isReadOnly}
                    value={formData.client || ''}
                    onChange={(val) => setFormData({ ...formData, client: val })}
                    options={[
                      { label: 'Select a client...', value: '' },
                      ...clients.map(c => ({
                        label: c.displayName || c.companyName || `${c.firstName || ''} ${c.lastName || ''}`.trim(),
                        value: c.id
                      }))
                    ]}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                  <input
                    required
                    type="date"
                    disabled={isReadOnly}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white disabled:opacity-70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected End Date</label>
                  <input
                    type="date"
                    disabled={isReadOnly}
                    value={formData.expectedEndDate}
                    onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white disabled:opacity-70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Manager *</label>
                <CustomSelect
                  disabled={isReadOnly}
                  value={formData.projectManager || ''}
                  onChange={(val) => setFormData({ ...formData, projectManager: val })}
                  options={[
                    { label: 'Select Manager...', value: '' },
                    ...users.map(u => ({ label: u.username || u.email, value: u.id }))
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Vendors</label>
                <div className="w-full max-h-32 overflow-y-auto px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm custom-scrollbar space-y-1">
                  {vendors.length === 0 ? (
                    <span className="text-gray-400 italic">No vendors found</span>
                  ) : (
                    vendors.map(vendor => (
                      <label key={vendor.id} className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 p-1 rounded-sm">
                        <input 
                          type="checkbox"
                          disabled={isReadOnly}
                          checked={(formData.assignedVendors || []).includes(vendor.id)}
                          onChange={(e) => {
                            const current = formData.assignedVendors || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, assignedVendors: [...current, vendor.id] });
                            } else {
                              setFormData({ ...formData, assignedVendors: current.filter(id => id !== vendor.id) });
                            }
                          }}
                          className="rounded-sm border-gray-300 text-[#792359] focus:ring-[#792359]"
                        />
                        {vendor.displayName}
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Entities (Employees)</label>
                <div className="w-full max-h-32 overflow-y-auto px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm custom-scrollbar space-y-1">
                  {users.length === 0 ? (
                    <span className="text-gray-400 italic">No employees found</span>
                  ) : (
                    users.map(user => (
                      <label key={user.id} className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 p-1 rounded-sm">
                        <input 
                          type="checkbox"
                          disabled={isReadOnly}
                          checked={(formData.assignedEntities || []).includes(user.id)}
                          onChange={(e) => {
                            const current = formData.assignedEntities || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, assignedEntities: [...current, user.id] });
                            } else {
                              setFormData({ ...formData, assignedEntities: current.filter(id => id !== user.id) });
                            }
                          }}
                          className="rounded-sm border-gray-300 text-[#792359] focus:ring-[#792359]"
                        />
                        {user.firstName} {user.lastName} ({user.email})
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Linked Incidents, Quotations, POs and Expenses are managed from inside the project profile */}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  disabled={isReadOnly}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:border-[#792359] focus:ring-1 focus:ring-[#792359] outline-none transition-all dark:text-white resize-none disabled:opacity-70"
                  placeholder="Project details and scope..."
                  rows={3}
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
