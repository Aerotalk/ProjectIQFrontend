import { useFormContext, useWatch } from 'react-hook-form';
import { CheckCircle2, XCircle, UploadCloud, Clock } from 'lucide-react';
import type { QuotationStatus } from '../../../../../../types/quotation.types';

interface Props {
  readOnly?: boolean;
}

export default function WorkflowSection({ readOnly }: Props) {
  const { control, setValue } = useFormContext();

  const status = useWatch({ control, name: 'status', defaultValue: 'Draft' }) as QuotationStatus;

  const handleApprove = () => {
    setValue('status', 'Approved', { shouldDirty: true });
    setValue('approvalDate', new Date().toISOString(), { shouldDirty: true });
    setValue('approvedBy', 'Current User', { shouldDirty: true });
  };

  const handleSendToClient = () => {
    setValue('status', 'Sent to Client', { shouldDirty: true });
  };

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Workflow & Approval
      </h3>

      <div className="bg-gray-50 dark:bg-white/[0.02] p-4 rounded-sm border border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Status:</div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border
            ${status === 'Draft' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
            ${status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
            ${status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
            ${status === 'Sent to Client' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
            ${status === 'Confirmed Lead' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
          `}>
            {status === 'Pending Approval' && <Clock size={14} />}
            {status === 'Approved' && <CheckCircle2 size={14} />}
            {status}
          </span>
        </div>

        {/* Workflow Actions */}
        {!readOnly && (
          <div className="flex gap-2">
            {status === 'Draft' && (
              <button 
                type="button" 
                onClick={() => setValue('status', 'Pending Approval', { shouldDirty: true })}
                className="px-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 rounded-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Request Approval
              </button>
            )}

            {status === 'Pending Approval' && (
              <>
                <button 
                  type="button" 
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-sm font-medium transition-colors"
                >
                  <CheckCircle2 size={16} /> Approve
                </button>
                <button 
                  type="button" 
                  onClick={() => setValue('status', 'Draft', { shouldDirty: true })}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-sm text-sm font-medium transition-colors"
                >
                  <XCircle size={16} /> Reject
                </button>
              </>
            )}

            {status === 'Approved' && (
              <button 
                type="button" 
                onClick={handleSendToClient}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-sm font-medium transition-colors"
              >
                Mark as Sent to Client
              </button>
            )}
          </div>
        )}
      </div>

      {/* WO/PO Upload (Visible only if Sent to Client or Confirmed Lead) */}
      {(status === 'Sent to Client' || status === 'Confirmed Lead') && (
        <div className="mt-4 p-4 border border-dashed border-gray-300 dark:border-white/20 rounded-sm bg-gray-50/50 dark:bg-white/[0.01]">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Work Order / Purchase Order Upload</h4>
          <p className="text-xs text-gray-500 mb-4">Upload the client's official PO to confirm this lead.</p>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 rounded-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
              <UploadCloud size={16} />
              <span>Choose File</span>
              <input 
                type="file" 
                className="hidden" 
                disabled={readOnly}
                onChange={(e) => {
                  if (e.target.files?.length) {
                    setValue('woPoDocumentUrl', e.target.files[0].name, { shouldDirty: true });
                    setValue('status', 'Confirmed Lead', { shouldDirty: true });
                  }
                }}
              />
            </label>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {useWatch({ control, name: 'woPoDocumentUrl' }) || 'No file chosen'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
