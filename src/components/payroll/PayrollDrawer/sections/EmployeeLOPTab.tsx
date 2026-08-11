import { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';
import Drawer from '../../../ui/Drawer';
import SmartActionMenu from '../../../ui/SmartActionMenu';
import ConfirmModal from '../../../modals/ConfirmModal';
import { FormSection, FormGrid, FormField } from '../../../ui/FormLayout';
import CustomSelect from '../../../ui/CustomSelect';
import { formStyles } from '../../../ui/form-styles';
import CustomMonthPicker from '../../../ui/CustomMonthPicker';

interface EmployeeLOP {
  id: string;
  payrollPeriod: string;
  lopDays: number;
  source?: string;
  reason?: string;
  updatedAt?: string;
  createdAt?: string;
}

interface Props {
  employeeDbId?: string;
  readOnly?: boolean;
}

const SOURCE_OPTIONS = [
  { value: 'Attendance', label: 'Attendance' },
  { value: 'Manual', label: 'Manual' },
  { value: 'Leave System', label: 'Leave System' },
];

export default function EmployeeLOPTab({ employeeDbId }: Props) {
  const [lops, setLops] = useState<EmployeeLOP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingLop, setEditingLop] = useState<EmployeeLOP | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [payrollPeriod, setPayrollPeriod] = useState('');
  const [lopDays, setLopDays] = useState('');
  const [source, setSource] = useState('Attendance');
  const [reason, setReason] = useState('');

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<EmployeeLOP | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Action menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchLops = useCallback(async () => {
    if (!employeeDbId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/hrms/payroll/employee-lop?employeeId=${employeeDbId}`);
      setLops(Array.isArray(data) ? data : (data?.data || []));
    } catch (e: any) {
      setError(e.message || 'Failed to load LOP records.');
    } finally {
      setLoading(false);
    }
  }, [employeeDbId]);

  useEffect(() => {
    fetchLops();
  }, [fetchLops]);

  const openAdd = () => {
    setEditingLop(null);
    setPayrollPeriod('');
    setLopDays('');
    setSource('Attendance');
    setReason('');
    setDrawerOpen(true);
  };

  const openEdit = (lop: EmployeeLOP) => {
    setEditingLop(lop);
    setPayrollPeriod(lop.payrollPeriod || '');
    setLopDays(String(lop.lopDays || ''));
    setSource(lop.source || 'Attendance');
    setReason(lop.reason || '');
    setDrawerOpen(true);
    setOpenMenuId(null);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingLop(null);
  };

  const handleSave = async () => {
    if (!payrollPeriod) { toast.error('Payroll Period is required.'); return; }
    if (!lopDays || isNaN(Number(lopDays))) { toast.error('LOP Days must be a valid number.'); return; }

    setSaving(true);
    try {
      const payload = {
        employee: { id: employeeDbId },
        payrollPeriod,
        lopDays: Number(lopDays),
        source,
        reason,
      };
      if (editingLop) {
        await api.put(`/hrms/payroll/employee-lop/${editingLop.id}`, payload);
        toast.success('LOP entry updated.');
      } else {
        await api.post('/hrms/payroll/employee-lop', payload);
        toast.success('LOP entry created.');
      }
      closeDrawer();
      await fetchLops();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save LOP entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/hrms/payroll/employee-lop/${deleteTarget.id}`);
      toast.success('LOP entry deleted.');
      setDeleteTarget(null);
      await fetchLops();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete LOP entry.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return '—';
    try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Loss of Pay (LOP) & Attendance</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage unpaid leave / LOP records for this employee.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-[#5d1944] transition-all shadow-sm active:scale-95"
        >
          <Plus size={14} /> Add LOP
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
          <Loader2 size={20} className="animate-spin text-primary" />
          <span className="text-sm">Loading LOP records...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-500">
          <AlertCircle size={24} />
          <p className="text-sm">{error}</p>
          <button onClick={fetchLops} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      ) : lops.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
          <FileText size={36} className="text-gray-300 dark:text-gray-600" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No LOP records found for this employee.</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add an LOP entry to track unpaid leave.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-[#5d1944] transition-all"
          >
            <Plus size={14} /> Add LOP
          </button>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payroll Period</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">LOP Days</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {lops.map(lop => (
                <tr key={lop.id} className="bg-white dark:bg-transparent hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{lop.payrollPeriod}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-md">
                      {lop.lopDays} {lop.lopDays === 1 ? 'day' : 'days'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lop.source || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{lop.reason || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{formatDate(lop.updatedAt || lop.createdAt)}</td>
                  <td className="px-4 py-3">
                    <SmartActionMenu
                      isOpen={openMenuId === lop.id}
                      onToggle={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === lop.id ? null : lop.id); }}
                      onClose={() => setOpenMenuId(null)}
                    >
                      <button onClick={() => openEdit(lop)} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => { setDeleteTarget(lop); setOpenMenuId(null); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        Delete
                      </button>
                    </SmartActionMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        title={editingLop ? 'Edit LOP Entry' : 'New LOP Entry'}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button onClick={closeDrawer} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-[#5d1944] transition-all disabled:opacity-50 active:scale-95"
            >
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : (editingLop ? 'Save Changes' : 'Create Entry')}
            </button>
          </div>
        }
      >
        <FormSection title="LOP Details" description="Record unpaid leave or LOP days. The selected employee is the context.">
          <FormGrid>
            <FormField label="Payroll Period" required>
              <CustomMonthPicker
                value={payrollPeriod}
                onChange={setPayrollPeriod}
                placeholder="Select Month & Year"
                hasError={false}
              />
            </FormField>

            <FormField label="LOP Days" required>
              <input
                type="number"
                step="0.5"
                min="0"
                value={lopDays}
                onChange={e => setLopDays(e.target.value)}
                placeholder="e.g., 1.5"
                className={formStyles.field(false, false)}
              />
            </FormField>

            <FormField label="Source" required>
              <CustomSelect
                options={SOURCE_OPTIONS}
                value={source}
                onChange={setSource}
              />
            </FormField>

            <div className="col-span-full space-y-1">
              <label className={formStyles.label}>Reason</label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Enter reason for LOP..."
                rows={3}
                className={formStyles.textarea(false, false)}
              />
            </div>
          </FormGrid>
        </FormSection>
      </Drawer>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete LOP Entry"
        message={`Are you sure you want to delete the LOP entry for ${deleteTarget?.payrollPeriod} (${deleteTarget?.lopDays} days)? This cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        isDestructive
      />
    </div>
  );
}
