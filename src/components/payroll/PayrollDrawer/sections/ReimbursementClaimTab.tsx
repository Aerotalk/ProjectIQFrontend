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
import { CurrencyInput } from '../../../ui/CurrencyInput';
import CustomDatePicker from '../../../ui/CustomDatePicker';
import CustomMonthPicker from '../../../ui/CustomMonthPicker';
import { formStyles } from '../../../ui/form-styles';

interface ReimbursementClaim {
  id: string;
  reimbursementType: string;
  claimPeriod?: string;
  claimedAmount: number;
  billDate?: string;
  billNumber?: string;
  remarks?: string;
  status?: string;
  updatedAt?: string;
  createdAt?: string;
}

interface Props {
  employeeDbId: string;
}

const TYPE_OPTIONS = [
  { value: 'Travel', label: 'Travel & Commute' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Internet', label: 'Internet / Phone' },
  { value: 'Meals', label: 'Meals / Entertainment' },
  { value: 'Other', label: 'Other' },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400',
  Approved: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400',
  Rejected: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400',
};

export default function ReimbursementClaimTab({ employeeDbId }: Props) {
  const [claims, setClaims] = useState<ReimbursementClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingClaim, setEditingClaim] = useState<ReimbursementClaim | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [reimbursementType, setReimbursementType] = useState('Travel');
  const [claimPeriod, setClaimPeriod] = useState('');
  const [claimedAmount, setClaimedAmount] = useState('');
  const [billDate, setBillDate] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [remarks, setRemarks] = useState('');

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<ReimbursementClaim | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Action menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    if (!employeeDbId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/hrms/payroll/reimbursements?employeeId=${employeeDbId}`);
      setClaims(Array.isArray(data) ? data : (data?.data || []));
    } catch (e: any) {
      setError(e.message || 'Failed to load reimbursement claims.');
    } finally {
      setLoading(false);
    }
  }, [employeeDbId]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const openAdd = () => {
    setEditingClaim(null);
    setReimbursementType('Travel');
    setClaimPeriod('');
    setClaimedAmount('');
    setBillDate('');
    setBillNumber('');
    setRemarks('');
    setDrawerOpen(true);
  };

  const openEdit = (claim: ReimbursementClaim) => {
    setEditingClaim(claim);
    setReimbursementType(claim.reimbursementType || 'Travel');
    setClaimPeriod(claim.claimPeriod || '');
    setClaimedAmount(String(claim.claimedAmount || ''));
    setBillDate(claim.billDate || '');
    setBillNumber(claim.billNumber || '');
    setRemarks(claim.remarks || '');
    setDrawerOpen(true);
    setOpenMenuId(null);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingClaim(null);
  };

  const handleSave = async () => {
    if (!reimbursementType) { toast.error('Reimbursement type is required.'); return; }
    if (!claimedAmount || isNaN(Number(claimedAmount.replace(/[^0-9.-]/g, '')))) {
      toast.error('Claimed amount is required.'); return;
    }
    if (!billDate) { toast.error('Bill date is required.'); return; }
    if (!billNumber.trim()) { toast.error('Bill number is required.'); return; }

    setSaving(true);
    try {
      const payload: any = {
        employee: { id: employeeDbId },
        reimbursementType,
        claimPeriod: claimPeriod || null,
        claimedAmount: parseFloat(claimedAmount.replace(/[^0-9.-]/g, '')) || 0,
        billDate,
        billNumber: billNumber.trim(),
        remarks: remarks.trim() || null,
      };

      if (editingClaim) {
        await api.put(`/hrms/payroll/reimbursements/${editingClaim.id}`, payload);
        toast.success('Reimbursement updated.');
      } else {
        await api.post('/hrms/payroll/reimbursements', payload);
        toast.success('Reimbursement claim created.');
      }
      closeDrawer();
      await fetchClaims();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save reimbursement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/hrms/payroll/reimbursements/${deleteTarget.id}`);
      toast.success('Reimbursement deleted.');
      setDeleteTarget(null);
      await fetchClaims();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete reimbursement.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return '—';
    try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
  };

  const formatCurrency = (amount: number) =>
    `₹${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Reimbursements</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage employee reimbursement claims.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-[#5d1944] transition-all shadow-sm active:scale-95"
        >
          <Plus size={14} /> Add Reimbursement
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
          <Loader2 size={20} className="animate-spin text-primary" />
          <span className="text-sm">Loading reimbursements...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-500">
          <AlertCircle size={24} />
          <p className="text-sm">{error}</p>
          <button onClick={fetchClaims} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      ) : claims.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
          <FileText size={36} className="text-gray-300 dark:text-gray-600" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No reimbursement records found for this employee.</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add a reimbursement claim to get started.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-[#5d1944] transition-all"
          >
            <Plus size={14} /> Add Reimbursement
          </button>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Claim Period</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bill No.</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {claims.map(claim => (
                <tr key={claim.id} className="bg-white dark:bg-transparent hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {TYPE_OPTIONS.find(t => t.value === claim.reimbursementType)?.label || claim.reimbursementType}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{claim.claimPeriod || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatCurrency(claim.claimedAmount)}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{claim.billNumber || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${STATUS_STYLES[claim.status || 'Pending'] || STATUS_STYLES.Pending}`}>
                      {claim.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{formatDate(claim.updatedAt || claim.createdAt)}</td>
                  <td className="px-4 py-3">
                    <SmartActionMenu
                      isOpen={openMenuId === claim.id}
                      onToggle={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === claim.id ? null : claim.id); }}
                      onClose={() => setOpenMenuId(null)}
                    >
                      <button onClick={() => openEdit(claim)} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => { setDeleteTarget(claim); setOpenMenuId(null); }}
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
        title={editingClaim ? 'Edit Reimbursement' : 'New Reimbursement'}
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
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : (editingClaim ? 'Save Changes' : 'Submit Claim')}
            </button>
          </div>
        }
      >
        <FormSection title="Claim Details" description="Submit details for out-of-pocket expense claims.">
          <FormGrid>
            <FormField label="Reimbursement Type" required>
              <CustomSelect
                options={TYPE_OPTIONS}
                value={reimbursementType}
                onChange={setReimbursementType}
              />
            </FormField>

            <FormField label="Claim Period">
              <CustomMonthPicker
                value={claimPeriod}
                onChange={setClaimPeriod}
                placeholder="Select Month & Year"
              />
            </FormField>

            <FormField label="Claimed Amount" required>
              <CurrencyInput
                value={claimedAmount}
                onChange={e => setClaimedAmount(e.target.value)}
                placeholder="0.00"
              />
            </FormField>

            <FormField label="Bill Date" required>
              <CustomDatePicker
                value={billDate}
                onChange={setBillDate}
                placeholder="Pick a date"
              />
            </FormField>

            <FormField label="Bill Number" required>
              <input
                type="text"
                value={billNumber}
                onChange={e => setBillNumber(e.target.value)}
                placeholder="e.g., INV-001"
                className={formStyles.field(false, false)}
              />
            </FormField>

            <div className="col-span-full space-y-1">
              <label className={formStyles.label}>Remarks</label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Enter remarks..."
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
        title="Delete Reimbursement"
        message={`Are you sure you want to delete this ${deleteTarget?.reimbursementType} reimbursement claim of ${deleteTarget ? `₹${deleteTarget.claimedAmount}` : ''}? This cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        isDestructive
      />
    </div>
  );
}
