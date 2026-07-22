"use no memo";
import { useEffect, useRef, useState, useMemo } from 'react';
import { useFormContext, useWatch, Controller, useFieldArray } from 'react-hook-form';
import { Loader2, Paperclip, X as XIcon, Plus } from 'lucide-react';
import { AutoNumberInput } from '@/components/shared/AutoNumberSettings';
import { VendorService } from '@/services/vendor.service';
import { POService } from '@/services/po.service';
import { useProjects } from '@/hooks/useProjects';
import CustomSelect from '@/components/ui/CustomSelect';
import type { Vendor } from '@/types/vendor.types';
import type { PurchaseOrder } from '@/types/po.types';
import { ProductService } from '@/services/product.service';
import type { Product } from '@/types/product.types';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  readOnly?: boolean;
  nextNumber?: number;
}

export default function ChallanFormSection({ readOnly, nextNumber }: Props) {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems'
  });

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { projects } = useProjects();

  // Watch for dependent fields
  const selectedProjectId = useWatch({ control, name: 'projectId' });
  const selectedVendorId = useWatch({ control, name: 'vendorId' });
  const selectedPoId = useWatch({ control, name: 'linkedVendorPoId' });
  const attachmentName = useWatch({ control, name: 'attachmentName' });

  const { selectedCompanyId: companyId } = useAuth();

  useEffect(() => {
    if (!companyId) return;
    Promise.all([
      VendorService.getVendors(companyId),
      POService.getAll(companyId),
      ProductService.getProducts(companyId)
    ]).then(([vendorData, poData, productData]) => {
      setVendors(vendorData);
      setPurchaseOrders(poData);
      setProducts(productData);
      setIsLoadingData(false);
    });
  }, [companyId]);

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

  // Filter POs based on selected vendor
  const filteredPOs = purchaseOrders.filter(po => {
    if (selectedVendorId && po.vendorId !== selectedVendorId) return false;
    return true;
  });

  // Sync display names when selection changes
  useEffect(() => {
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) setValue('projectName', project.projectName, { shouldValidate: false });
    
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

  const PROJECT_OPTIONS = useMemo(() => {
    return projects.map(p => ({ label: `${p.projectCode} – ${p.projectName}`, value: p.id }));
  }, [projects]);

  const VENDOR_OPTIONS = useMemo(() => {
    return filteredVendors.map(v => ({ label: v.displayName, value: v.id }));
  }, [filteredVendors]);

  const PO_OPTIONS = useMemo(() => {
    return filteredPOs.map(po => ({ label: po.poNumber, value: po.id }));
  }, [filteredPOs]);

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
            <AutoNumberInput
              name="challanNumber"
              disabled={readOnly}
              placeholder="e.g. DC/2026/001"
              defaultPrefix="DC/2026/"
              nextNumber={nextNumber}
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
              Project / Reference # <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={PROJECT_OPTIONS}
                  />
                )}
              />
            </div>
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
              <div className={readOnly || isLoadingData || !selectedProjectId ? 'opacity-80 pointer-events-none' : ''}>
                <Controller
                  name="vendorId"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      value={field.value || ''}
                      onChange={field.onChange}
                      options={VENDOR_OPTIONS}
                    />
                  )}
                />
              </div>
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
              <div className={readOnly || isLoadingData || !selectedProjectId || !selectedVendorId ? 'opacity-80 pointer-events-none' : ''}>
                <Controller
                  name="linkedVendorPoId"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      value={field.value || ''}
                      onChange={field.onChange}
                      options={PO_OPTIONS}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* E-Way Bill Number */}
          <div>
            <label className={labelClass}>
              E-Way Bill Number
              <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(optional)</span>
            </label>
            <input
              type="text"
              {...register('ewayBillNo')}
              disabled={readOnly}
              placeholder="e.g. 123456789012"
              className={fieldClass(!!errors.ewayBillNo)}
            />
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
                <span>Upload Additional Attachments</span>
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
      
      {/* ── Line Items ── */}
      <div>
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Delivered Line Items
          </h3>
          {!readOnly && (
            <button
              type="button"
              onClick={() => append({ productId: '', itemName: '', hsnSac: '', description: '', dispatchedQuantity: 1, unit: 'Unit' })}
              className="flex items-center gap-1 text-xs font-semibold text-[#792359] dark:text-[#c44997] hover:underline"
            >
              <Plus size={14} /> Add Line Item
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-sm border border-gray-200 dark:border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-[35%]">Item Name / Description</th>
                <th className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-[20%]">HSN/SAC</th>
                <th className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-[20%]">Quantity</th>
                <th className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-[20%]">Unit</th>
                {!readOnly && <th className="px-3 py-2 w-10"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="px-3 py-2 space-y-2 align-top w-[35%]">
                    <div className="relative">
                      <Controller
                        name={`lineItems.${index}.itemName`}
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            value={field.value || ''}
                            onChange={(val) => {
                              field.onChange(val);
                              const product = products.find(p => p.itemName === val);
                              if (product) {
                                setValue(`lineItems.${index}.hsnSac`, product.hsnSac || '');
                                setValue(`lineItems.${index}.description`, product.description || '');
                                setValue(`lineItems.${index}.unit`, product.unit);
                                setValue(`lineItems.${index}.dispatchedQuantity`, 1);
                              }
                            }}
                            options={products.map(p => ({ 
                              label: p.itemName, 
                              value: p.itemName,
                              subLabel: p.description ? p.description : ''
                            }))}
                          />
                        )}
                      />
                      {isLoadingData && <Loader2 className="absolute right-8 top-2 w-3.5 h-3.5 animate-spin text-gray-400" />}
                    </div>
                    <textarea
                      placeholder="Item specification / description..."
                      {...register(`lineItems.${index}.description`)}
                      disabled={readOnly}
                      rows={2}
                      className={fieldClass(false) + " resize-y min-h-[40px] text-xs"}
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      placeholder="e.g. 998313"
                      {...register(`lineItems.${index}.hsnSac`)}
                      disabled={readOnly}
                      className={fieldClass(false)}
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register(`lineItems.${index}.dispatchedQuantity`, { valueAsNumber: true })}
                      disabled={readOnly}
                      className={fieldClass(false)}
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      placeholder="e.g. Box, Nos, Lot"
                      {...register(`lineItems.${index}.unit`)}
                      disabled={readOnly}
                      className={fieldClass(false)}
                    />
                  </td>
                  {!readOnly && (
                    <td className="px-3 py-2 align-top text-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                        title="Remove item"
                      >
                        <XIcon size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {fields.length === 0 && (
                <tr>
                  <td colSpan={readOnly ? 4 : 5} className="px-3 py-6 text-center text-xs text-gray-500">
                    No individual line items added. Total quantity will default to description summary.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

