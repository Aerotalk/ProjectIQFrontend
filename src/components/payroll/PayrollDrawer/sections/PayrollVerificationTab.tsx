import { FileText, ArrowRightLeft, AlertTriangle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../../../lib/api';

interface Props {
  readOnly?: boolean;
  runId?: string | null;
}

export default function PayrollVerificationTab({ readOnly, runId }: Props) {
  const [variances, setVariances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (runId) {
      setLoading(true);
      api.get(`/hrms/payroll/runs/${runId}/variances`)
        .then(res => setVariances(res.data || res))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [runId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Payroll Verification</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review the generated statements and variances before approval.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1f2229] p-5 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors mb-3">
            <FileText size={24} />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white">Payroll Statement</h3>
          <p className="text-xs text-gray-500 mt-1">View full breakdown</p>
        </div>
        
        <div className="bg-white dark:bg-[#1f2229] p-5 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group ring-1 ring-primary/20">
          <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 transition-colors mb-3">
            <ArrowRightLeft size={24} />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white">Difference Report</h3>
          <p className="text-xs text-gray-500 mt-1">Compare with last month</p>
        </div>

        <div className="bg-white dark:bg-[#1f2229] p-5 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 transition-colors mb-3">
            <AlertTriangle size={24} />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white">Variance Summary</h3>
          <p className="text-xs text-gray-500 mt-1">Exceptions & Alerts</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Key Variances Detected</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-medium">
            <tr>
              <th className="px-5 py-3">Component</th>
              <th className="px-5 py-3 text-right">Previous (Jun)</th>
              <th className="px-5 py-3 text-right">Current (Jul)</th>
              <th className="px-5 py-3 text-right">Difference</th>
              <th className="px-5 py-3">Reason / Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">Loading variances...</td>
              </tr>
            ) : variances.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">No variances detected.</td>
              </tr>
            ) : (
              variances.map((v, i) => (
                <tr key={i}>
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{v.component}</td>
                  <td className="px-5 py-3 text-right text-gray-500">{v.previous}</td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">{v.current}</td>
                  <td className={`px-5 py-3 text-right font-bold ${(v.difference || '').startsWith('+') ? 'text-green-500' : 'text-orange-500'}`}>
                    {v.difference}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{v.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex flex-wrap items-center justify-end gap-3">
          <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium text-sm">
            <XCircle size={16} />
            Return for Corrections
          </button>
          <button 
            type="button" 
            onClick={() => {
              if (runId) {
                api.post(`/hrms/payroll/runs/${runId}/reprocess`).then(() => {
                  window.location.reload();
                }).catch(err => console.error(err));
              }
            }}
            className="flex items-center gap-2 px-4 py-2 border border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded-sm hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors font-medium text-sm">
            <RotateCcw size={16} />
            Reprocess
          </button>
          <button 
            type="button" 
            onClick={() => {
              if (runId) {
                api.put(`/hrms/payroll/runs/${runId}/approve`).then(() => {
                  window.location.reload();
                }).catch(err => console.error(err));
              }
            }}
            className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-sm shadow-sm transition-colors font-medium text-sm">
            <CheckCircle size={16} />
            Approve Payroll
          </button>
        </div>
      )}
    </div>
  );
}
