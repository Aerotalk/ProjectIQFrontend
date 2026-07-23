import React, { useState } from 'react';
import { X, Plus, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import FunkyLoader from '@/components/ui/FunkyLoader';
import { POService } from '@/services/po.service';
import type { PurchaseOrder } from '@/types/po.types';

export interface PoEntry {
  id: string;
  file: File | null;
  workOrderNumber: string;
  woDate: string;
  woValue: number;
  existingPoId?: string;
  existingAttachmentName?: string;
}

interface PoUploadModalProps {
  isOpen: boolean;
  companyId: string | null;
  onClose: () => void;
  onSubmit: (entries: PoEntry[]) => Promise<void>;
}

export default function PoUploadModal({ isOpen, companyId, onClose, onSubmit }: PoUploadModalProps) {
  const [entries, setEntries] = useState<PoEntry[]>([
    { id: '1', file: null, workOrderNumber: '', woDate: '', woValue: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingPos, setExistingPos] = useState<PurchaseOrder[]>([]);

  React.useEffect(() => {
    if (isOpen && companyId) {
      POService.getAll(companyId).then(setExistingPos).catch(console.error);
    }
  }, [isOpen, companyId]);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setEntries([
      ...entries,
      { id: Math.random().toString(36).substring(7), file: null, workOrderNumber: '', woDate: '', woValue: 0 }
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (entries.length === 1) return;
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof PoEntry, value: any) => {
    setEntries(entries.map(e => {
      if (e.id === id) {
        const updatedEntry = { ...e, [field]: value };
        
        // Auto-fetch PO Date and Value if a matching PO number is entered/selected
        if (field === 'workOrderNumber') {
          const matchingPo = existingPos.find(po => po.poNumber === value);
          if (matchingPo) {
            updatedEntry.existingPoId = matchingPo.id;
            updatedEntry.existingAttachmentName = matchingPo.attachmentName || `Document for ${matchingPo.poNumber}`;
            if (matchingPo.poDate) {
              // Extract just the YYYY-MM-DD part from ISO string
              updatedEntry.woDate = matchingPo.poDate.split('T')[0];
            }
            if (matchingPo.grandTotal !== undefined) {
              updatedEntry.woValue = matchingPo.grandTotal;
            }
          } else {
            updatedEntry.existingPoId = undefined;
            updatedEntry.existingAttachmentName = undefined;
          }
        }
        
        return updatedEntry;
      }
      return e;
    }));
  };

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpdateRow(id, 'file', e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const invalid = entries.some(e => (!e.file && !e.existingPoId) || !e.workOrderNumber || !e.woDate || e.woValue <= 0);
    if (invalid) {
      toast.error('Please fill all fields and upload a file (or select an existing PO) for each row');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(entries);
      onClose(); // Optional, assuming onSubmit completes successfully
    } catch (err) {
      // Error handled by parent usually
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <datalist id="existing-pos">
        {existingPos.map(po => (
          <option key={po.id} value={po.poNumber}>
            {po.projectName ? `${po.projectName}` : ''}
          </option>
        ))}
      </datalist>
      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        <div className="p-5 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upload PO</h2>
            <p className="text-xs text-gray-500 mt-1">Upload Purchase Orders to confirm the lead.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="grid grid-cols-12 gap-4 items-end bg-gray-50 dark:bg-[#0f1115] p-4 rounded-lg border border-gray-200 dark:border-white/5 relative group">
              <div className="col-span-12 md:col-span-4">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Upload File</label>
                <div className="relative">
                  <input
                    type="file"
                    id={`file-${entry.id}`}
                    onChange={(e) => handleFileChange(entry.id, e)}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor={`file-${entry.id}`}
                    className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 dark:border-white/20 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <Upload size={16} className="text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {entry.file ? entry.file.name : (entry.existingAttachmentName ? `Auto-linked: ${entry.existingAttachmentName}` : 'Choose File...')}
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="col-span-12 md:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Purchase Order Number</label>
                <input
                  type="text"
                  list="existing-pos"
                  value={entry.workOrderNumber}
                  onChange={(e) => handleUpdateRow(entry.id, 'workOrderNumber', e.target.value)}
                  placeholder="e.g. PO-2024-001"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 rounded-md focus:ring-1 focus:ring-[#792359] focus:outline-none"
                />
              </div>

              <div className="col-span-12 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">PO Date</label>
                <input
                  type="date"
                  value={entry.woDate}
                  onChange={(e) => handleUpdateRow(entry.id, 'woDate', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 rounded-md focus:ring-1 focus:ring-[#792359] focus:outline-none"
                />
              </div>

              <div className="col-span-12 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">PO Value</label>
                <input
                  type="number"
                  min="0"
                  value={entry.woValue || ''}
                  onChange={(e) => handleUpdateRow(entry.id, 'woValue', Number(e.target.value))}
                  placeholder="Value"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 rounded-md focus:ring-1 focus:ring-[#792359] focus:outline-none"
                />
              </div>

              <div className="col-span-12 md:col-span-1 flex justify-end">
                {entries.length > 1 && (
                  <button
                    onClick={() => handleRemoveRow(entry.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                    title="Remove row"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={handleAddRow}
            className="flex items-center gap-2 text-sm font-medium text-[#792359] dark:text-[#e6a8d0] hover:bg-[#792359]/5 px-4 py-2 rounded-md transition-colors border border-dashed border-[#792359]/30 w-full justify-center"
          >
            <Plus size={16} /> Add Row
          </button>
        </div>

        <div className="p-5 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50/50 dark:bg-white/[0.02] rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#181a1f] border border-gray-300 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#792359] hover:bg-[#52173c] rounded-md transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <FunkyLoader variant="inline" className="mr-2" /> : <CheckCircle2 size={16} />}
            {isSubmitting ? 'Uploading...' : 'Submit PO'}
          </button>
        </div>
      </div>
    </div>
  );
}
