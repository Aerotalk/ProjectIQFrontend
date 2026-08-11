import { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, Loader2, AlertCircle, RefreshCw, Trash2, Plus as PlusIcon } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';
import Drawer from '../../../ui/Drawer';
import SmartActionMenu from '../../../ui/SmartActionMenu';
import ConfirmModal from '../../../modals/ConfirmModal';
import { FormSection, FormGrid, FormField } from '../../../ui/FormLayout';
import CustomSelect from '../../../ui/CustomSelect';
import { formStyles } from '../../../ui/form-styles';
import { CurrencyInput } from '../../../ui/CurrencyInput';

interface ITDeclarationItem {
  id?: string;
  taxSection: string;
  description: string;
  declaredAmount: string;
}

interface ITDeclaration {
  id: string;
  financialYear: string;
  taxRegime: string;
  items?: ITDeclarationItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  employeeDbId?: string; // the UUID used in DB, not empId code
  readOnly?: boolean;
}

const EMPTY_ITEM: ITDeclarationItem = { taxSection: '', description: '', declaredAmount: '' };

const REGIME_OPTIONS = [
  { value: 'Old Regime', label: 'Old Regime' },
  { value: 'New Regime', label: 'New Regime' },
];

const TAX_SECTIONS = ['80C', '80D', '80E', '80G', '80TTA', 'HRA', 'Home Loan Interest', 'NPS (80CCD)', 'Other'];

export default function ITDeclarationTab({ employeeDbId, readOnly }: Props) {
  const [declarations, setDeclarations] = useState<ITDeclaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDecl, setEditingDecl] = useState<ITDeclaration | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [financialYear, setFinancialYear] = useState('');
  const [taxRegime, setTaxRegime] = useState('New Regime');
  const [items, setItems] = useState<ITDeclarationItem[]>([{ ...EMPTY_ITEM }]);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<ITDeclaration | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Action menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchDeclarations = useCallback(async () => {
    if (!employeeDbId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/hrms/payroll/it-declarations?employeeId=${employeeDbId}`);
      const list = Array.isArray(data) ? data : (data?.data || []);
      // For each declaration, fetch its items count
      const enriched = await Promise.all(list.map(async (d: any) => {
        try {
          const itemsData = await api.get(`/hrms/payroll/it-declarations/${d.id}/items`);
          const itemsList = Array.isArray(itemsData) ? itemsData : (itemsData?.data || []);
          return { ...d, items: itemsList };
        } catch {
          return { ...d, items: [] };
        }
      }));
      setDeclarations(enriched);
    } catch (e: any) {
      setError(e.message || 'Failed to load IT declarations.');
    } finally {
      setLoading(false);
    }
  }, [employeeDbId]);

  useEffect(() => {
    fetchDeclarations();
  }, [fetchDeclarations]);

  const openAdd = () => {
    setEditingDecl(null);
    setFinancialYear('');
    setTaxRegime('New Regime');
    setItems([{ ...EMPTY_ITEM }]);
    setDrawerOpen(true);
  };

  const openEdit = (decl: ITDeclaration) => {
    setEditingDecl(decl);
    setFinancialYear(decl.financialYear);
    setTaxRegime(decl.taxRegime || 'New Regime');
    setItems(
      decl.items && decl.items.length > 0
        ? decl.items.map(i => ({ taxSection: i.taxSection, description: i.description, declaredAmount: String(i.declaredAmount) }))
        : [{ ...EMPTY_ITEM }]
    );
    setDrawerOpen(true);
    setOpenMenuId(null);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingDecl(null);
  };

  const handleSave = async () => {
    if (!financialYear.trim()) { toast.error('Financial Year is required.'); return; }
    if (!taxRegime) { toast.error('Tax Regime is required.'); return; }

    // Uniqueness check: if adding, ensure FY not already taken
    if (!editingDecl) {
      const existing = declarations.find(d => d.financialYear === financialYear.trim());
      if (existing) {
        toast.error(`An IT Declaration already exists for FY ${financialYear.trim()}. Edit the existing record instead.`);
        return;
      }
    }

    setSaving(true);
    try {
      if (editingDecl) {
        // Update header only
        await api.put(`/hrms/payroll/it-declarations/${editingDecl.id}`, {
          financialYear: financialYear.trim(),
          taxRegime,
        });
        // Save items: re-add all non-empty items
        const validItems = items.filter(i => i.taxSection.trim() && i.declaredAmount);
        for (const item of validItems) {
          await api.post(`/hrms/payroll/it-declarations/${editingDecl.id}/items`, {
            taxSection: item.taxSection,
            description: item.description,
            declaredAmount: parseFloat(item.declaredAmount) || 0,
          });
        }
        toast.success('IT Declaration updated.');
      } else {
        // Create declaration
        const created = await api.post('/hrms/payroll/it-declarations', {
          employee: { id: employeeDbId },
          financialYear: financialYear.trim(),
          taxRegime,
        });
        const newId = created?.data?.id || created?.id;
        // Add items
        if (newId) {
          const validItems = items.filter(i => i.taxSection.trim() && i.declaredAmount);
          for (const item of validItems) {
            await api.post(`/hrms/payroll/it-declarations/${newId}/items`, {
              taxSection: item.taxSection,
              description: item.description,
              declaredAmount: parseFloat(item.declaredAmount) || 0,
            });
          }
        }
        toast.success('IT Declaration created.');
      }
      closeDrawer();
      await fetchDeclarations();
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to save.';
      if (msg.toLowerCase().includes('already exists')) {
        toast.error(`An IT Declaration already exists for FY ${financialYear.trim()}.`);
      } else {
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/hrms/payroll/it-declarations/${deleteTarget.id}`);
      toast.success('IT Declaration deleted.');
      setDeleteTarget(null);
      await fetchDeclarations();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete.');
    } finally {
      setDeleting(false);
    }
  };

  const addItem = () => setItems(prev => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof ITDeclarationItem, val: string) =>
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  const formatDate = (d?: string) => {
    if (!d) return '—';
    try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">IT Declarations</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage Income Tax declarations. One per financial year.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-[#5d1944] transition-all shadow-sm active:scale-95"
        >
          <Plus size={14} /> Add Declaration
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
          <Loader2 size={20} className="animate-spin text-primary" />
          <span className="text-sm">Loading declarations...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-500">
          <AlertCircle size={24} />
          <p className="text-sm">{error}</p>
          <button onClick={fetchDeclarations} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      ) : declarations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
          <FileText size={36} className="text-gray-300 dark:text-gray-600" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No IT declarations yet.</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add an IT Declaration for this employee.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-[#5d1944] transition-all"
          >
            <Plus size={14} /> Add Declaration
          </button>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Financial Year</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tax Regime</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {declarations.map(decl => (
                <tr key={decl.id} className="bg-white dark:bg-transparent hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{decl.financialYear}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
                      decl.taxRegime === 'Old Regime'
                        ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'
                        : 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400'
                    }`}>
                      {decl.taxRegime || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {decl.items?.length ?? 0} {decl.items?.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{formatDate(decl.updatedAt || decl.createdAt)}</td>
                  <td className="px-4 py-3">
                    <SmartActionMenu
                      isOpen={openMenuId === decl.id}
                      onToggle={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === decl.id ? null : decl.id); }}
                      onClose={() => setOpenMenuId(null)}
                    >
                      <button onClick={() => openEdit(decl)} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2">
                        Edit
                      </button>
                      <button
                        onClick={() => { setDeleteTarget(decl); setOpenMenuId(null); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2"
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
        title={editingDecl ? 'Edit IT Declaration' : 'New IT Declaration'}
        size="lg"
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
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : (editingDecl ? 'Save Changes' : 'Create Declaration')}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <FormSection title="Declaration Details" description="IT declaration information for this employee.">
            <FormGrid>
              <FormField label="Financial Year" required>
                <input
                  type="text"
                  value={financialYear}
                  onChange={e => setFinancialYear(e.target.value)}
                  placeholder="e.g., 2026-27"
                  className={formStyles.field(false, false)}
                />
              </FormField>
              <FormField label="Tax Regime" required>
                <CustomSelect
                  options={REGIME_OPTIONS}
                  value={taxRegime}
                  onChange={setTaxRegime}
                />
              </FormField>
            </FormGrid>
          </FormSection>

          {/* Declaration Items */}
          <FormSection title="Declaration Items">
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-lg relative group">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mr-6">
                    <div className="space-y-1">
                      <label className={formStyles.label}>Tax Section</label>
                      <CustomSelect
                        options={TAX_SECTIONS.map(s => ({ value: s, label: s }))}
                        value={item.taxSection}
                        onChange={val => updateItem(idx, 'taxSection', val)}
                        placeholder="Select section"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={formStyles.label}>Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={e => updateItem(idx, 'description', e.target.value)}
                        placeholder="e.g., LIC Premium"
                        className={formStyles.field(false, false)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={formStyles.label}>Declared Amount</label>
                      <CurrencyInput
                        value={item.declaredAmount}
                        onChange={e => updateItem(idx, 'declaredAmount', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 text-sm text-primary dark:text-secondary hover:underline font-medium"
              >
                <PlusIcon size={14} /> Add Item
              </button>
            </div>
          </FormSection>
        </div>
      </Drawer>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete IT Declaration"
        message={`Are you sure you want to delete the IT Declaration for FY ${deleteTarget?.financialYear}? This will also remove all declaration items and cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        isDestructive
      />
    </div>
  );
}
