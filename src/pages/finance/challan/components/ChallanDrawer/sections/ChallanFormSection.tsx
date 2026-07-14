import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Loader2, Paperclip, X as XIcon } from 'lucide-react';
import { VendorService } from '@/services/vendor.service';
import { POService, MOCK_PROJECTS } from '@/services/po.service';
import type { Vendor } from '@/types/vendor.types';
import type { PurchaseOrder } from '@/types/po.types';

interface Props {
  readOnly?: boolean;
}

export default function ChallanFormSection({ readOnly }: Props) {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Watch for dependent fields
  const selectedProjectId = useWatch({ control, name: 'projectId' });
  const selectedVendorId = useWatch({ control, name: 'vendorId' });
  const selectedPoId = useWatch({ control, name: 'linkedVendorPoId' });
  const attachmentName = useWatch({ control, name: 'attachmentName' });

  useEffect(() => {
    const companyId = localStorage.getItem('selectedCompanyId') || '';
    Promise.all([
      VendorService.getVendors(companyId),
      POService.getAll()
    ]).then(([vendorData, poData]) => {
      setVendors(vendorData);
      setPurchaseOrders(poData);
      setIsLoadingData(false);
    });
  }, []);

  // Filter vendors based on selected project
  // Note: Since vendors aren't formally linked to projects in the mock MOCK_PROJECTS array, 
  // we simulate this by either returning all or filtering if we had a mapping.
  // For the sake of this mock, if project is selected, we'll just show all active vendors
  // to prevent an empty dropdown, but in a real app, this would filter by project assignments.
  // The user requested: "Load only vendors assigned to that project."
  // Since we don't have project assignments in the mock, we will just use the full list, 
  // but we enforce that project must be selected first.
  const filteredVendors = selectedProjectId 
    ? vendors 
    : [];

  // Filter POs based on selected project and vendor
  const filteredPOs = purchaseOrders.filter(po => {
    if (selectedProjectId && po.projectId !== selectedProjectId) return false;
    if (selectedVendorId && po.vendorId !== selectedVendorId) return false;
    return true;
  });

  // Sync display names when selection changes
  useEffect(() => {
    const project = MOCK_PROJECTS.find(p => p.id === selectedProjectId);
    if (project) setValue('projectName', project.name, { shouldValidate: false });
    
    // If project changes, clear dependent fields if they don't match the new filters
    if (selectedProjectId) {
      if (selectedVendorId && !filteredVendors.find(v => v.id === selectedVendorId)) {
        setValue('vendorId', '');
        setValue('vendorName', '');
      }
      if (selectedPoId && !filteredPOs.find(po => po.id === selectedPoId)) {
        setValue('linkedVendorPoId', '');
        setValue('linkedVendorPoNumber', '');
      }
    }
  }, [selectedProjectId, filteredVendors, filteredPOs, setValue, selectedVendorId, selectedPoId]);

  useEffect(() => {
    const vendor = vendors.find(v => v.id === selectedVendorId);
    if (vendor) setValue('vendorName', vendor.displayName, { shouldValidate: false });
    
    // If vendor changes, clear linked PO if it doesn't match
    if (selectedVendorId) {
      if (selectedPoId && !filteredPOs.find(po => po.id === selectedPoId)) {
        setValue('linkedVendorPoId', '');
        setValue('linkedVendorPoNumber', '');
      }
    }
  }, [selectedVendorId, vendors, filteredPOs, setValue, selectedPoId]);

  useEffect(() => {
    const po = purchaseOrders.find(p => p.id === selectedPoId);
    if (po) setValue('linkedVendorPoNumber', po.poNumber, { shouldValidate: false });
  }, [selectedPoId, purchaseOrders, setValue]);

  // File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('attachmentName', file.name, { shouldValidate: false });
    }
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    setValue('attachmentName', '', { shouldValidate: false });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fieldClass = (hasError: boolean) =>
    `w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white ` +
    `focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors appearance-none ` +
    `disabled:opacity-60 disabled:cursor-not-allowed ` +
    (hasError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-white/10');

  const labelClass = 'block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1';

  return (
    <div className="space-y-6">
      
      {/* ── Document Details ── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2 mb-4">
          Document Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Challan Number */}
          <div>
            <label className={labelClass}>
              Challan Number <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <input
              type="text"
              {...register('challanNumber')}
              disabled={readOnly}
              placeholder="e.g. DC/2026/001"
              className={fieldClass(!!errors.challanNumber)}
            />
            {errors.challanNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.challanNumber.message as string}</p>
            )}
          </div>
          
          {/* Challan Date */}
          <div>
            <label className={labelClass}>
              Challan Date <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <input
              type="date"
              {...register('challanDate')}
              disabled={readOnly}
              className={fieldClass(!!errors.challanDate)}
            />
            {errors.challanDate && (
              <p className="text-red-500 text-xs mt-1">{errors.challanDate.message as string}</p>
            )}
          </div>
          
          {/* Project */}
          <div>
            <label className={labelClass}>
              Project <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <select
              {...register('projectId')}
              disabled={readOnly}
              className={fieldClass(!!errors.projectId)}
            >
              <option value="">Select a Project</option>
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.id} – {p.name}</option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-red-500 text-xs mt-1">{errors.projectId.message as string}</p>
            )}
          </div>

          {/* Vendor */}
          <div>
            <label className={labelClass}>
              Vendor <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <div className="relative">
              <select
                {...register('vendorId')}
                disabled={readOnly || isLoadingData || !selectedProjectId}
                className={fieldClass(!!errors.vendorId)}
              >
                <option value="">
                  {!selectedProjectId ? 'Select a project first' : 'Select a Vendor'}
                </option>
                {filteredVendors.map(v => (
                  <option key={v.id} value={v.id}>{v.displayName}</option>
                ))}
              </select>
              {isLoadingData && (
                <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-gray-400" />
              )}
            </div>
            {errors.vendorId && (
              <p className="text-red-500 text-xs mt-1">{errors.vendorId.message as string}</p>
            )}
          </div>
          
          {/* Linked Vendor PO */}
          <div>
            <label className={labelClass}>
              Linked Vendor PO
              <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(optional)</span>
            </label>
            <div className="relative">
              <select
                {...register('linkedVendorPoId')}
                disabled={readOnly || isLoadingData || !selectedProjectId || !selectedVendorId}
                className={fieldClass(false)}
              >
                <option value="">
                  {!selectedVendorId ? 'Select a vendor first' : 'Select PO (Optional)'}
                </option>
                {filteredPOs.map(po => (
                  <option key={po.id} value={po.id}>{po.poNumber}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Attachment */}
          <div>
            <label className={labelClass}>
              Attachment
              <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(PDF / image, max 10 MB)</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              disabled={readOnly}
              onChange={handleFileChange}
            />

            {!attachmentName ? (
              <button
                type="button"
                disabled={readOnly}
                onClick={() => fileInputRef.current?.click()}
                className={
                  `w-full flex items-center gap-2 px-3 py-2 border border-dashed rounded-sm text-sm transition-colors ` +
                  (readOnly
                    ? 'border-gray-200 dark:border-white/5 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 ' +
                      'hover:border-[#792359] hover:text-[#792359] dark:hover:border-[#c44997] dark:hover:text-[#c44997] cursor-pointer')
                }
              >
                <Paperclip size={14} />
                <span>Upload physical challan scan</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-white/10 rounded-sm bg-gray-50 dark:bg-white/[0.02]">
                <Paperclip size={14} className="text-[#792359] dark:text-[#c44997] shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1" title={attachmentName}>
                  {attachmentName}
                </span>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    title="Remove attachment"
                  >
                    <XIcon size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
      
      {/* ── Content & Remarks ── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2 mb-4">
          Content & Remarks
        </h3>
        
        <div className="space-y-4">
          {/* Description */}
          <div>
            <label className={labelClass}>
              Description <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <textarea
              {...register('description')}
              disabled={readOnly}
              placeholder="Specify what was delivered or what milestone was completed..."
              rows={4}
              className={
                `w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white ` +
                `focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors resize-none ` +
                `disabled:opacity-60 disabled:cursor-not-allowed ` +
                (errors.description ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-white/10')
              }
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>
            )}
          </div>
          
          {/* Remarks */}
          <div>
            <label className={labelClass}>
              Remarks
              <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(optional)</span>
            </label>
            <textarea
              {...register('remarks')}
              disabled={readOnly}
              placeholder="Any internal remarks or additional notes..."
              rows={3}
              className={fieldClass(false) + " resize-none"}
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}
