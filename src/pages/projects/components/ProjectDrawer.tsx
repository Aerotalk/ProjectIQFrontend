import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { useState, useEffect, useRef } from 'react';
import { X, Save, FolderKanban, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useVendors } from '../../../hooks/useVendors';
import { useClients } from '../../../hooks/useClients';
import { api } from '../../../lib/api';
import { POService } from '../../../services/po.service';
import { QuotationService } from '../../../services/quotation.service';
import { ExpenseService } from '../../../services/expense.service';
import { TicketService } from '../../../services/ticket.service';
import type { Project, ProjectFormValues } from '../../../types/project.types';
import type { Vendor } from '../../../types/vendor.types';
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

// ── Inline multi-select dropdown for Vendors ─────────────────────────────────
function VendorMultiSelect({
  vendors,
  selected,
  disabled,
  onChange,
}: {
  vendors: Vendor[];
  selected: string[];
  disabled?: boolean;
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  const label =
    selected.length === 0
      ? 'Select Vendors'
      : vendors
          .filter((v) => selected.includes(v.id))
          .map((v) => v.displayName)
          .join(', ');

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          formStyles.field(false, disabled),
          'flex items-center justify-between cursor-pointer text-left w-full'
        )}
      >
        <span className={selected.length === 0 ? 'text-gray-400' : ''}>{label}</span>
        <ChevronDown
          size={14}
          className={cn('shrink-0 text-gray-400 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-[#1e2028] border border-gray-200 dark:border-white/10 rounded-sm shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
          {vendors.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-400 italic">No vendors found</p>
          ) : (
            vendors.map((vendor) => {
              const isSelected = selected.includes(vendor.id);
              return (
                <button
                  key={vendor.id}
                  type="button"
                  onClick={() => toggle(vendor.id)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-200"
                >
                  <span
                    className={cn(
                      'w-4 h-4 rounded-sm border flex items-center justify-center shrink-0',
                      isSelected
                        ? 'bg-[#792359] border-[#792359]'
                        : 'border-gray-300 dark:border-white/20'
                    )}
                  >
                    {isSelected && <Check size={10} className="text-white" />}
                  </span>
                  {vendor.displayName}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function ProjectDrawer({ isOpen, onClose, onSave, mode, initialData }: ProjectDrawerProps) {
  const { selectedCompanyId } = useAuth();
  const { vendors } = useVendors({ companyId: selectedCompanyId || null });
  const { clients } = useClients({ companyId: selectedCompanyId || null });
  const [_users, setUsers] = useState<any[]>([]);
  const [_incidents, setIncidents] = useState<any[]>([]);
  const [_quotations, setQuotations] = useState<any[]>([]);
  const [_pos, setPos] = useState<any[]>([]);
  const [_expenses, setExpenses] = useState<any[]>([]);

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
    linkedExpenses: [],
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
          TicketService.getAll(selectedCompanyId).catch(() => []),
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
          linkedExpenses: initialData.linkedExpenses || [],
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
          linkedExpenses: [],
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

  const statusOptions = [
    { label: 'Planning', value: 'Planning' },
    { label: 'Pending Approval', value: 'Pending Approval' },
    { label: 'Active', value: 'Active' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'On Hold', value: 'On Hold' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  const clientOptions = [
    { label: 'Select Client', value: '' },
    ...clients.map((c) => ({ label: c.displayName || c.id, value: c.id })),
  ];

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
              {mode === 'create' ? 'Add New Project' : mode === 'edit' ? 'Edit Project' : 'Project Details'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {mode === 'create' ? 'Fill in the project details below' : initialData?.projectCode}
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
        <form id="project-form" onSubmit={handleSubmit} className="space-y-5">

          <FormSection title="" className="pt-0 border-t-0">
            <FormGrid>

              {/* Project Name — full width */}
              <FormRow>
                <label className={formStyles.label}>PROJECT NAME *</label>
                <input
                  required
                  type="text"
                  disabled={isReadOnly}
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className={formStyles.field(false, isReadOnly)}
                  placeholder="e.g. Website Redesign"
                />
              </FormRow>

              {/* Description — full width */}
              <FormRow>
                <label className={formStyles.label}>DESCRIPTION</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={formStyles.field(false, isReadOnly)}
                  placeholder="Brief project scope (optional)"
                />
              </FormRow>

              {/* Row: Client dropdown | Vendors multi-select dropdown */}
              <div>
                <label className={formStyles.label}>CLIENT *</label>
                <CustomSelect
                  value={formData.client}
                  onChange={(val) => setFormData({ ...formData, client: val })}
                  options={clientOptions}
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className={formStyles.label}>VENDORS *</label>
                <VendorMultiSelect
                  vendors={vendors}
                  selected={formData.assignedVendors || []}
                  disabled={isReadOnly}
                  onChange={(updated) => setFormData({ ...formData, assignedVendors: updated })}
                />
              </div>

              {/* Row: Due Date | Initial Status */}
              <div>
                <label className={formStyles.label}>DUE DATE *</label>
                <CustomDatePicker
                  value={formData.expectedEndDate}
                  onChange={(val) => setFormData({ ...formData, expectedEndDate: val })}
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className={formStyles.label}>INITIAL STATUS</label>
                <CustomSelect
                  value={formData.status}
                  onChange={(val) => {
                    const newData = { ...formData, status: val };
                    setFormData(newData);
                    if (isReadOnly) onSave(newData);
                  }}
                  options={statusOptions}
                />
              </div>

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
