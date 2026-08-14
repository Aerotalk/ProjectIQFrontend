import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../../../lib/api';
import { Loader2 } from 'lucide-react';

interface SalaryComponent {
  componentName: string;
  type: string;
  percentage?: number;
  amount?: number;
}

interface SalaryRevision {
  id: string;
  revisionType: string;
  effectiveDate: string;
  annualCTC: number;
  incrementPercentage: number;
  salaryComponents: string; // JSON string
  reason: string;
}

interface Props {
  employeeDbId?: string;
}

export default function FixedSalaryTab({ employeeDbId }: Props) {
  const [revision, setRevision] = useState<SalaryRevision | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRevision = useCallback(async () => {
    if (!employeeDbId) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/employees/${employeeDbId}/salary-revision`);
      const all: SalaryRevision[] = Array.isArray(res) ? res : (res.data || []);
      if (all.length > 0) {
        // Assume the first one is the most recent because backend returns newest first
        setRevision(all[0]);
      } else {
        setRevision(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [employeeDbId]);

  useEffect(() => {
    fetchRevision();
  }, [fetchRevision]);

  const components: SalaryComponent[] = useMemo(() => {
    if (!revision?.salaryComponents) return [];
    try {
      return JSON.parse(revision.salaryComponents);
    } catch (e) {
      return [];
    }
  }, [revision?.salaryComponents]);

  const { totalEarnings, totalDeductions, totalReimbursements } = useMemo(() => {
    let e = 0, d = 0, r = 0;
    const ctc = revision?.annualCTC || 0;
    components.forEach((c) => {
      let annualAmount = 0;
      if (c.percentage) {
        annualAmount = (ctc * c.percentage) / 100;
      } else if (c.amount) {
        annualAmount = c.amount;
      }
      
      if (c.type === 'EARNING') e += annualAmount;
      else if (c.type === 'DEDUCTION') d += annualAmount;
      else if (c.type === 'REIMBURSEMENT') r += annualAmount;
    });
    return { totalEarnings: e, totalDeductions: d, totalReimbursements: r };
  }, [revision?.annualCTC, components]);

  const monthlyGross = totalEarnings / 12;
  const monthlyNet = (totalEarnings - totalDeductions) / 12;

  if (loading) {
    return (
      <div className="p-8 flex justify-center text-gray-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!revision) {
    return (
      <div className="p-8 text-center text-gray-500">
        No fixed salary structure found for this employee.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Fixed Salary Structure</h2>
          <p className="text-sm text-gray-500">Current active salary components for this employee.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-sm">
          <p className="text-sm text-gray-500 mb-1">Annual CTC</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">₹{revision.annualCTC?.toLocaleString() || 0}</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-sm">
          <p className="text-sm text-gray-500 mb-1">Monthly Gross</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">₹{monthlyGross.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-sm">
          <p className="text-sm text-gray-500 mb-1">Effective Date</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{revision.effectiveDate || '—'}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden mt-6">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10 text-gray-500 font-medium">
            <tr>
              <th className="px-5 py-3">Component</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3 text-right">Calculation</th>
              <th className="px-5 py-3 text-right">Annual Amount</th>
              <th className="px-5 py-3 text-right">Monthly Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {components.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">No components defined.</td></tr>
            ) : (
              components.map((item, idx) => {
                let annualAmount = 0;
                if (item.percentage) {
                  annualAmount = (revision.annualCTC * item.percentage) / 100;
                } else if (item.amount) {
                  annualAmount = item.amount;
                }
                const monthlyAmount = annualAmount / 12;

                return (
                  <tr key={idx}>
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{item.componentName}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.type === 'EARNING' ? 'bg-green-50 text-green-700' : 
                        item.type === 'DEDUCTION' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-500">
                      {item.percentage ? `${item.percentage}% of CTC` : 'Flat Amount'}
                    </td>
                    <td className="px-5 py-3 text-right font-medium">₹{annualAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="px-5 py-3 text-right font-medium">₹{monthlyAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
