import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { useState, useEffect } from 'react';
import { X, Save, FolderKanban } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useVendors } from '../../../hooks/useVendors';
import { api } from '../../../lib/api';
import { POService } from '../../../services/po.service';
import { QuotationService } from '../../../services/quotation.service';
import { ExpenseService } from '../../../services/expense.service';
import { TicketService } from '../../../services/ticket.service';
import type { Project, ProjectFormValues } from '../../../types/project.types';
import CustomSelect from '@/components/ui/CustomSelect';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { cn } from '@/lib/utils';

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
  const [incidents, setIncidents] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [pos, setPos] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

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
    const fetchUsers = async () => {
      try {
        const response: any = await api.get('/admin/users');
        const data = Array.isArray(response) ? response : (response.content || []);
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };
    const fetchRelations = async () => {
      if (!selectedCompanyId) return;
      try {
        const [allPos, allQuotations, allExpenses, allTickets] = await Promise.all([
          POService.getAll(selectedCompanyId).catch(() => []),
          QuotationService.getQuotations(selectedCompanyId).catch(() => []),
          ExpenseService.getAll(selectedCompanyId).catch(() => []),
          TicketService.getAll(selectedCompanyId).catch(() => [])
        ]);
        setPos(allPos);
        setQuotations(allQuotations);
        setExpenses(allExpenses);
        setIncidents(allTickets.filter((t: any) => t.type?.toLowerCase() === 'incident' || !t.type));
      } catch (err) {
        console.error('Failed to load relations', err);
      }
    };
    
    if (isOpen) {
      fetchUsers();
      fetchRelations();
    }
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
            
            <FormSection title="Project Details" className="pt-0 border-t-0">
              <FormGrid>
                <FormRow>
                  <label className={formStyles.label}>Project Code</label>
                  <input
                    type="text"
                    disabled={true}
                    value={formData.projectCode}
                    className={formStyles.field(false, true)}
                    placeholder={mode === 'create' ? "Auto-generated upon save" : ""}
                  />
                </FormRow>

                <FormRow>
                  <label className={formStyles.label}>Status</label>
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
                    <div className={cn(formStyles.field(false, true), "flex items-center")}>
                      {formData.status}
                    </div>
                  )}
                </FormRow>

              <FormRow className="md:col-span-2">
                <label className={formStyles.label}>Project Name *</label>
                <input
                  required
                  type="text"
                  disabled={isReadOnly}
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className={formStyles.field(false, isReadOnly)}
                  placeholder="e.g. ERP Implementation"
                />
              </FormRow>

              <FormRow>
                <label className={formStyles.label}>Linked Quotation</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.linkedQuotation}
                  onChange={(e) => setFormData({ ...formData, linkedQuotation: e.target.value })}
                  className={formStyles.field(false, isReadOnly)}
                  placeholder="Quotation number"
                />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Client</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className={formStyles.field(false, isReadOnly)}
                  placeholder="Client name"
                />
              </FormRow>
              
              <FormRow>
                <label className={formStyles.label}>Start Date *</label>
                <CustomDatePicker value={formData.startDate} onChange={(val) => setFormData({ ...formData, startDate: val })} disabled={isReadOnly} />
              </FormRow>
              <FormRow>
                <label className={formStyles.label}>Expected End Date</label>
                <CustomDatePicker value={formData.expectedEndDate} onChange={(val) => setFormData({ ...formData, expectedEndDate: val })} disabled={isReadOnly} />
              </FormRow>

              <FormRow>
                <label className={formStyles.label}>Project Manager *</label>
                <div className={isReadOnly ? 'opacity-80 pointer-events-none' : ''}>
                  <CustomSelect
                    value={formData.projectManager || ''}
                    onChange={(val) => setFormData({ ...formData, projectManager: val })}
                    options={[
                      { label: 'Select Manager...', value: '' },
                      ...users.map(u => ({ label: u.username || u.email, value: u.id }))
                    ]}
                  />
                </div>
              </FormRow>

              <FormRow>
                <label className={formStyles.label}>Assigned Vendors</label>
                <div className={cn(formStyles.field(false, isReadOnly), "max-h-32 overflow-y-auto custom-scrollbar space-y-1 block h-auto py-2")}>
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
              </FormRow>

              <FormRow>
                <label className={formStyles.label}>Assigned Entities (Employees)</label>
                <div className={cn(formStyles.field(false, isReadOnly), "max-h-32 overflow-y-auto custom-scrollbar space-y-1 block h-auto py-2")}>
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
              </FormRow>

              <FormRow>
                <label className={formStyles.label}>Linked Incidents</label>
                <div className={cn(formStyles.field(false, isReadOnly), "max-h-32 overflow-y-auto custom-scrollbar space-y-1 block h-auto py-2")}>
                  {incidents.length === 0 ? (
                    <span className="text-gray-400 italic">No incidents found</span>
                  ) : (
                    incidents.map(inc => (
                      <label key={inc.id} className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 p-1 rounded-sm">
                        <input 
                          type="checkbox"
                          disabled={isReadOnly}
                          checked={(formData.linkedIncidents || []).includes(inc.id)}
                          onChange={(e) => {
                            const current = formData.linkedIncidents || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, linkedIncidents: [...current, inc.id] });
                            } else {
                              setFormData({ ...formData, linkedIncidents: current.filter(id => id !== inc.id) });
                            }
                          }}
                          className="rounded-sm border-gray-300 text-[#792359] focus:ring-[#792359]"
                        />
                        {inc.ticketNumber || inc.subject}
                      </label>
                    ))
                  )}
                </div>
              </FormRow>

              <FormRow>
                <label className={formStyles.label}>Linked Quotations</label>
                <div className={cn(formStyles.field(false, isReadOnly), "max-h-32 overflow-y-auto custom-scrollbar space-y-1 block h-auto py-2")}>
                  {quotations.length === 0 ? (
                    <span className="text-gray-400 italic">No quotations found</span>
                  ) : (
                    quotations.map(q => (
                      <label key={q.id} className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 p-1 rounded-sm">
                        <input 
                          type="checkbox"
                          disabled={isReadOnly}
                          checked={(formData.linkedQuotations || []).includes(q.id)}
                          onChange={(e) => {
                            const current = formData.linkedQuotations || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, linkedQuotations: [...current, q.id] });
                            } else {
                              setFormData({ ...formData, linkedQuotations: current.filter(id => id !== q.id) });
                            }
                          }}
                          className="rounded-sm border-gray-300 text-[#792359] focus:ring-[#792359]"
                        />
                        {q.quotationNo}
                      </label>
                    ))
                  )}
                </div>
              </FormRow>

              <FormRow>
                <label className={formStyles.label}>Linked POs</label>
                <div className={cn(formStyles.field(false, isReadOnly), "max-h-32 overflow-y-auto custom-scrollbar space-y-1 block h-auto py-2")}>
                  {pos.length === 0 ? (
                    <span className="text-gray-400 italic">No POs found</span>
                  ) : (
                    pos.map(po => (
                      <label key={po.id} className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 p-1 rounded-sm">
                        <input 
                          type="checkbox"
                          disabled={isReadOnly}
                          checked={(formData.linkedPOs || []).includes(po.id)}
                          onChange={(e) => {
                            const current = formData.linkedPOs || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, linkedPOs: [...current, po.id] });
                            } else {
                              setFormData({ ...formData, linkedPOs: current.filter(id => id !== po.id) });
                            }
                          }}
                          className="rounded-sm border-gray-300 text-[#792359] focus:ring-[#792359]"
                        />
                        {po.poNumber || 'Draft PO'}
                      </label>
                    ))
                  )}
                </div>
              </FormRow>

              <FormRow>
                <label className={formStyles.label}>Linked Expenses</label>
                <div className={cn(formStyles.field(false, isReadOnly), "max-h-32 overflow-y-auto custom-scrollbar space-y-1 block h-auto py-2")}>
                  {expenses.length === 0 ? (
                    <span className="text-gray-400 italic">No expenses found</span>
                  ) : (
                    expenses.map(ex => (
                      <label key={ex.id} className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 p-1 rounded-sm">
                        <input 
                          type="checkbox"
                          disabled={isReadOnly}
                          checked={(formData.linkedExpenses || []).includes(ex.id)}
                          onChange={(e) => {
                            const current = formData.linkedExpenses || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, linkedExpenses: [...current, ex.id] });
                            } else {
                              setFormData({ ...formData, linkedExpenses: current.filter(id => id !== ex.id) });
                            }
                          }}
                          className="rounded-sm border-gray-300 text-[#792359] focus:ring-[#792359]"
                        />
                        {ex.description} (₹{ex.amount})
                      </label>
                    ))
                  )}
                </div>
              </FormRow>

              <FormRow className="md:col-span-2">
                <label className={formStyles.label}>Description</label>
                <textarea
                  disabled={isReadOnly}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={formStyles.textarea(false, isReadOnly)}
                  placeholder="Project details and scope..."
                  rows={3}
                />
              </FormRow>
            </FormGrid>
          </FormSection>
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
