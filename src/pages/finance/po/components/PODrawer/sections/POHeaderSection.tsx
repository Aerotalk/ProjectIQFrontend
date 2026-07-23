import CustomDatePicker from '@/components/ui/CustomDatePicker';
"use no memo";
import { useEffect, useRef, useMemo } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { Paperclip, X as XIcon, Copy } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useVendors } from '@/hooks/useVendors';
import { useAuth } from '@/contexts/AuthContext';
import { AutoNumberInput } from '@/components/shared/AutoNumberSettings';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { formStyles } from '@/components/ui/form-styles';

interface Props {
  readOnly?: boolean;
  nextNumber?: number;
}

export default function POHeaderSection({ readOnly, nextNumber }: Props) {
  const {
    register,
    formState: { errors },
    setValue,
    control,
    getValues,
  } = useFormContext();

  const { selectedCompanyId } = useAuth();
  const { projects } = useProjects();
  const { vendors, isListLoading: isVendorsLoading } = useVendors({ companyId: selectedCompanyId });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedProjectId = useWatch({ control, name: 'projectId' });
  const attachmentName = useWatch({ control, name: 'attachmentName' });

  const selectedProject = useMemo(() => projects.find(p => p.id === selectedProjectId), [projects, selectedProjectId]);

  const vendorOptions = useMemo(() => {
    if (!selectedProjectId) return [];
    
    const proj = projects.find(p => p.id === selectedProjectId);
    const filteredVendors = proj?.assignedVendors?.length 
      ? vendors.filter(v => proj.assignedVendors!.includes(v.id))
      : [];

    return filteredVendors.map(v => ({ 
      label: v.displayName || v.companyName || v.firstName || v.id, 
      value: v.id 
    }));
  }, [selectedProjectId, vendors, projects]);


  // Sync project name
  useEffect(() => {
    if (selectedProject) setValue('projectName', selectedProject.projectName, { shouldValidate: false });
  }, [selectedProject, setValue]);

  // Clear vendor selection whenever the project changes
  const prevProjectIdRef = useRef<string | undefined>(selectedProjectId);
  useEffect(() => {
    if (prevProjectIdRef.current !== selectedProjectId) {
      prevProjectIdRef.current = selectedProjectId;
      setValue('vendorId', '', { shouldValidate: false });
      setValue('vendorName', '', { shouldValidate: false });
    }
  }, [selectedProjectId, setValue]);

  // Sync vendor name whenever the selected vendor changes
  const selectedVendorId = useWatch({ control, name: 'vendorId' });
  const selectedVendor = useMemo(() => vendors.find(v => v.id === selectedVendorId), [vendors, selectedVendorId]);
  
  useEffect(() => {
    if (selectedVendor) setValue('vendorName', selectedVendor.displayName || selectedVendor.companyName || selectedVendor.firstName || '', { shouldValidate: false });
  }, [selectedVendor, setValue]);

  // File selection handler — stores just the name (no real upload in this mock)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('attachmentName', file.name, { shouldValidate: false });
    }
    // Reset input so the same file can be re-selected after removal
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    setValue('attachmentName', '', { shouldValidate: false });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };



  return (
    <FormSection title="PO Details">
      <FormGrid>

        {/* -- PO Number -- */}
        <div>
          <label className={formStyles.label}>
            PO Number <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <AutoNumberInput
            name="poNumber"
            disabled={readOnly}
            placeholder="e.g. PO-001"
            defaultPrefix="PO-"
            nextNumber={nextNumber}
            className={formStyles.field(!!errors.poNumber, readOnly)}
          />
          {errors.poNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.poNumber.message as string}</p>
          )}
        </div>

        {/* -- Project -- */}
        <div>
          <label className={formStyles.label}>
            Project <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={projects.map(p => ({ label: `${p.projectCode} - ${p.projectName}`, value: p.id }))}
                />
              )}
            />
          </div>
          {errors.projectId && (
            <p className="text-red-500 text-xs mt-1">{errors.projectId.message as string}</p>
          )}
        </div>

        {/* -- Vendor -- */}
        <div>
          <label className={formStyles.label}>
            Vendor <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <div className="relative">
            <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="vendorId"
                control={control}
                render={({ field }) => {
                  return (
                    <CustomSelect
                      value={field.value || ''}
                      onChange={(val) => {
                        field.onChange(val);
                        const vendor = vendors.find(v => v.id === val);
                        if (vendor) {
                          const formatAddress = (v: any, isShipping: boolean) => {
                            if (isShipping && !v.sameAsBillingAddress) {
                              return [
                                v.companyName || v.displayName,
                                v.shippingAddressLine1,
                                v.shippingAddressLine2,
                                `${v.shippingCity || ''}, ${v.shippingState || ''} ${v.shippingPinCode || ''}`.replace(/^, | ,$|^,|,$/g, '').trim(),
                                v.shippingCountry
                              ].filter(Boolean).join('\n');
                            }
                            return [
                              v.companyName || v.displayName,
                              v.billingAddressLine1,
                              v.billingAddressLine2,
                              `${v.billingCity || ''}, ${v.billingState || ''} ${v.billingPinCode || ''}`.replace(/^, | ,$|^,|,$/g, '').trim(),
                              v.billingCountry
                            ].filter(Boolean).join('\n');
                          };
                          setValue('billingAddress', formatAddress(vendor, false), { shouldDirty: true });
                          setValue('shippingAddress', formatAddress(vendor, true), { shouldDirty: true });
                        }
                      }}
                      options={vendorOptions}
                      disabled={readOnly || isVendorsLoading}
                      isLoading={isVendorsLoading}
                      loadingText="Loading assigned vendors..."
                      emptyText="No vendors assigned to this project."
                    />
                  );
                }}
              />
            </div>
          </div>
          {errors.vendorId && (
            <p className="text-red-500 text-xs mt-1">{errors.vendorId.message as string}</p>
          )}
        </div>

        {/* -- PO Date -- */}
        <div>
          <label className={formStyles.label}>
            PO Date <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <CustomDatePicker name="poDate" disabled={readOnly} />
          {errors.poDate && (
            <p className="text-red-500 text-xs mt-1">{errors.poDate.message as string}</p>
          )}
        </div>

        {selectedVendor && (
          <FormRow className="mt-2 p-4 bg-gray-50 dark:bg-white/5 rounded-sm border border-gray-200 dark:border-white/10 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">Billing Address</h4>
                <textarea
                  {...register('billingAddress')}
                  disabled={readOnly}
                  rows={5}
                  className={formStyles.textarea(false, readOnly)}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">Shipping Address</h4>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => setValue('shippingAddress', getValues('billingAddress'), { shouldDirty: true })}
                      className="text-[10px] uppercase tracking-wider font-semibold text-[#792359] hover:text-[#792359]/80 dark:text-pink-400 dark:hover:text-pink-300 flex items-center gap-1 transition-colors"
                      title="Copy from Billing Address"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Billing
                    </button>
                  )}
                </div>
                <textarea
                  {...register('shippingAddress')}
                  disabled={readOnly}
                  rows={5}
                  className={formStyles.textarea(false, readOnly)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-3 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">GST Treatment:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedVendor.gstTreatment === 'business_gst' ? 'Registered Business' : 
                   selectedVendor.gstTreatment === 'business_none' ? 'Unregistered Business' : 
                   selectedVendor.gstTreatment === 'consumer' ? 'Consumer' : 
                   selectedVendor.gstTreatment === 'sez' ? 'SEZ' : 'Overseas'}
                </span>
              </div>
              {selectedVendor.gstin && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">GSTIN:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedVendor.gstin}</span>
                </div>
              )}
            </div>
          </FormRow>
        )}

        {/* -- Expected Delivery Date (TechSpec §4.2 optional field) -- */}
        <div>
          <label className={formStyles.label}>
            Expected Delivery Date
            <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(optional)</span>
          </label>
          <CustomDatePicker name="expectedDelivery" disabled={readOnly} />
        </div>



        {/* -- Attachment (TechSpec §4.2 optional field) -- */}
        <div>
          <label className={formStyles.label}>
            Attachment
            <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(PDF / image, max 10 MB)</span>
          </label>

          {/* Hidden file input — registered in form state via attachmentName */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            disabled={readOnly}
            onChange={handleFileChange}
          />

          {!attachmentName ? (
            /* Upload trigger */
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
              <span>Click to attach signed PO document</span>
            </button>
          ) : (
            /* File pill — shows selected filename */
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

        {/* -- Description (TechSpec §4.2 Required textarea) -- */}
        <FormRow>
          <label className={formStyles.label}>
            Description <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                value={field.value || ''}
                disabled={readOnly}
                placeholder="Specify what is being procured — be clear and specific (e.g. 'Cloud storage infrastructure for Q3 data pipeline')"
                rows={3}
                className={formStyles.textarea(!!errors.description, readOnly)}
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>
          )}
        </FormRow>

      </FormGrid>
    </FormSection>
  );
}
