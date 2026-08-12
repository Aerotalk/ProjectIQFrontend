import { CheckCircle2, Circle, Send, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../../../lib/api';

interface Props {
  readOnly?: boolean;
  runId?: string | null;
}

export default function PayoutTab({ readOnly, runId }: Props) {
  const [totalNet, setTotalNet] = useState(0);

  useEffect(() => {
    if (runId) {
      api.get(`/hrms/payroll/runs/${runId}`)
        .then(res => {
          const data = res.data || res;
          setTotalNet(data.totalNet || 0);
        })
        .catch(err => console.error(err));
    }
  }, [runId]);

  // Visual representation of the payout workflow
  const steps = [
    { id: 1, title: 'Payroll Batch Created', desc: 'Batch ID: ' + (runId ? runId.split('-')[0].toUpperCase() : 'N/A'), status: 'completed', date: new Date().toLocaleDateString() },
    { id: 2, title: 'Bank Transfer File Generated', desc: 'Ready for upload to corporate banking portal', status: 'completed', date: 'Now' },
    { id: 3, title: 'Bank Transfer Status', desc: 'Awaiting confirmation from bank', status: 'current', date: '--' },
    { id: 4, title: 'Payslip Generation', desc: 'Generate PDF payslips for all processed employees', status: 'pending', date: '--' },
    { id: 5, title: 'Publish Payslips', desc: 'Send email notifications and publish to employee portal', status: 'pending', date: '--' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Payout Workflow</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track the status of the final payout and payslip publishing.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500">Total Payout</p>
          <p className="text-xl font-bold text-primary dark:text-secondary">₹{totalNet.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm p-6">
        <div className="relative">
          <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-white/10"></div>
          
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.id} className="relative pl-10">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1">
                  {step.status === 'completed' ? (
                    <CheckCircle2 size={28} className="text-green-500 bg-white dark:bg-[#181a1f]" />
                  ) : step.status === 'current' ? (
                    <div className="w-7 h-7 rounded-full border-4 border-primary bg-white dark:bg-[#181a1f] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    </div>
                  ) : (
                    <Circle size={28} className="text-gray-300 dark:text-gray-600 bg-white dark:bg-[#181a1f]" />
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className={`font-semibold ${step.status === 'pending' ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm mt-1 ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {step.desc}
                    </p>
                  </div>
                  <div className="text-xs font-medium text-gray-500 shrink-0">
                    {step.date}
                  </div>
                </div>

                {/* Actions for current step */}
                {step.status === 'current' && !readOnly && step.id === 3 && (
                  <div className="mt-4 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => {
                        if (runId) {
                          api.put(`/hrms/payroll/runs/${runId}/payout`, { payoutStatus: 'Failed' }).then(() => {
                            window.location.reload();
                          }).catch(err => console.error(err));
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-sm text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                      Mark as Failed
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (runId) {
                          api.put(`/hrms/payroll/runs/${runId}/payout`, { payoutStatus: 'Paid' }).then(() => {
                            window.location.reload();
                          }).catch(err => console.error(err));
                        }
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-sm text-sm font-medium hover:bg-primary-dark transition-colors">
                      Confirm Transfer Success
                    </button>
                  </div>
                )}
                
                {/* Actions for step 2 */}
                {step.id === 2 && (
                  <div className="mt-3">
                    <button 
                      type="button" 
                      onClick={() => {
                        if (runId) {
                          window.open(`http://localhost:8080/api/hrms/payroll/runs/${runId}/bank-export`, '_blank');
                        }
                      }}
                      className="flex items-center gap-2 text-sm text-primary dark:text-secondary font-medium hover:underline">
                      <Download size={14} /> Download Bank File (.csv)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end">
          <button type="button" disabled className="flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-600 rounded-sm font-medium text-sm cursor-not-allowed">
            <Send size={16} />
            Publish All Payslips
          </button>
        </div>
      )}
    </div>
  );
}
