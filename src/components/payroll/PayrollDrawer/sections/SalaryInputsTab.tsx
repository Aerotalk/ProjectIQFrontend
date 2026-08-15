import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/api';
import Drawer from '../../../ui/Drawer';
import { FormGrid } from '../../../ui/FormLayout';
import { Input } from '../../../ui/input';
import { formStyles } from '../../../ui/form-styles';

interface SalaryInput {
  id: string;
  payrollPeriod: string;
  payComponent: string;
  amount: number;
  inputType: string;
  reason: string;
  recurring: boolean;
}

interface Props {
  employeeDbId?: string;
  readOnly?: boolean;
}

export default function SalaryInputsTab({ employeeDbId, readOnly }: Props) {
  const [inputs, setInputs] = useState<SalaryInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form
  const [period, setPeriod] = useState('');
  const [component, setComponent] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Addition');
  const [reason] = useState('');

  const fetchInputs = useCallback(async () => {
    if (!employeeDbId) return;
    setLoading(true);
    try {
      // We don't have a specific endpoint for employee inputs yet, fetch all and filter
      const res = await api.get('/hrms/payroll/salary-inputs');
      const all = Array.isArray(res) ? res : (res.data || []);
      setInputs(all.filter((x: any) => x.employee?.id === employeeDbId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [employeeDbId]);

  useEffect(() => {
    fetchInputs();
  }, [fetchInputs]);

  const handleSave = async () => {
    if (!employeeDbId) return;
    if (!period || !component || !amount) {
      toast.error('Please fill in all required fields (Period, Component, Amount).');
      return;
    }
    setSaving(true);
    try {
      await api.post('/hrms/payroll/salary-inputs', {
        employee: { id: employeeDbId },
        payrollPeriod: period,
        payComponent: component,
        amount: Number(amount.replace(/[^0-9.-]+/g, '')),
        inputType: type,
        reason: reason,
        recurring: false
      });
      toast.success('Salary input added');
      setDrawerOpen(false);
      fetchInputs();
    } catch (err) {
      toast.error('Failed to add salary input');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/hrms/payroll/salary-inputs/${id}`);
      toast.success('Deleted successfully');
      fetchInputs();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Salary Inputs</h2>
          <p className="text-sm text-gray-500">Manage custom additions or deductions for this employee.</p>
        </div>
        {!readOnly && employeeDbId && (
          <div className="flex items-center gap-3">
            <button type="button" onClick={fetchInputs} className="p-2 text-gray-500 hover:text-primary transition-colors">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button type="button" onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-sm text-sm font-medium hover:bg-primary-dark transition-colors">
              <Plus size={16} /> Add Input
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10 text-gray-500 font-medium">
            <tr>
              <th className="px-5 py-3">Period</th>
              <th className="px-5 py-3">Component</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : inputs.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">No salary inputs found.</td></tr>
            ) : (
              inputs.map(item => (
                <tr key={item.id}>
                  <td className="px-5 py-3">{item.payrollPeriod}</td>
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{item.payComponent}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${item.inputType === 'Addition' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {item.inputType}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">₹{item.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    {!readOnly && (
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Salary Input" size="md">
        <div className="p-6">
          <FormGrid>
            <div className="space-y-2">
              <label className={formStyles.label}>Payroll Period *</label>
              <input 
                type="month" 
                className="w-full p-2 border rounded-sm dark:bg-[#121212] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:block [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                value={period} 
                onChange={e => setPeriod(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className={formStyles.label}>Pay Component *</label>
              <Input placeholder="e.g. Bonus" value={component} onChange={e => setComponent(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={formStyles.label}>Amount *</label>
              <Input placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className={formStyles.label}>Input Type *</label>
              <select className="w-full p-2 border rounded-sm dark:bg-[#121212]" value={type} onChange={e => setType(e.target.value)}>
                <option value="Addition">Addition</option>
                <option value="Deduction">Deduction</option>
                <option value="Override">Override</option>
              </select>
            </div>
          </FormGrid>
          <div className="mt-8 flex justify-end gap-3">
            <button onClick={() => setDrawerOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-sm">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary text-white rounded-sm flex items-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />} Save Input
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
