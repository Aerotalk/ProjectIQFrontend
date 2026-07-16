import { useEffect, useRef, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { Loader2, Paperclip, X as XIcon } from 'lucide-react';
import { VendorService } from '@/services/vendor.service';
import { MOCK_PROJECTS } from '@/services/po.service';
import type { Vendor } from '@/types/vendor.types';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  readOnly?: boolean;
}

export default function POHeaderSection({ readOnly }: Props) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useFormContext();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { selectedCompanyId: companyId } = useAuth();

  useEffect(() => {
    if (!companyId) return;
    VendorService.getVendors(companyId).then((data) => {
      setVendors(data);
      setIsLoadingVendors(false);
    });
  }, [companyId]);

  // Sync display names when selection changes
  const selectedProjectId = watch('projectId');
  const selectedVendorId = watch('vendorId');
  const attachmentName = watch('attachmentName');

  useEffect(() => {
    const project = MOCK_PROJECTS.find(p => p.id === selectedProjectId);
    if (project) setValue('projectName', project.name, { shouldValidate: false });
  }, [selectedProjectId, setValue]);

  useEffect(() => {
    const vendor = vendors.find(v => v.id === selectedVendorId);
    if (vendor) setValue('vendorName', vendor.displayName, { shouldValidate: false });
  }, [selectedVendorId, vendors, setValue]);

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

  const fieldClass = (hasError: boolean) =>
    `w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white ` +
    `focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors appearance-none ` +
    `disabled:opacity-60 disabled:cursor-not-allowed ` +
    (hasError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-white/10');

  const labelClass = 'block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1';

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-2">
        PO Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── Project ── */}
        <div>
          <label className={labelClass}>
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
                  options={MOCK_PROJECTS.map(p => ({ label: `${p.id} - ${p.name}`, value: p.id }))}
                />
              )}
            />
          </div>
          {errors.projectId && (
            <p className="text-red-500 text-xs mt-1">{errors.projectId.message as string}</p>
          )}
        </div>

        {/* ── Vendor ── */}
        <div>
          <label className={labelClass}>
            Vendor <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <div className="relative">
            <div className={readOnly || isLoadingVendors ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="vendorId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={vendors.map(v => ({ label: v.displayName || v.id, value: v.id }))}
                  />
                )}
              />
            </div>
            {isLoadingVendors && (
              <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-gray-400" />
            )}
          </div>
          {errors.vendorId && (
            <p className="text-red-500 text-xs mt-1">{errors.vendorId.message as string}</p>
          )}
        </div>

        {/* ── PO Date ── */}
        <div>
          <label className={labelClass}>
            PO Date <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <input
            type="date"
            {...register('poDate')}
            disabled={readOnly}
            className={fieldClass(!!errors.poDate)}
          />
          {errors.poDate && (
            <p className="text-red-500 text-xs mt-1">{errors.poDate.message as string}</p>
          )}
        </div>

        {/* ── Expected Delivery Date (TechSpec §4.2 optional field) ── */}
        <div>
          <label className={labelClass}>
            Expected Delivery Date
            <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(optional)</span>
          </label>
          <input
            type="date"
            {...register('expectedDelivery')}
            disabled={readOnly}
            className={fieldClass(false)}
          />
        </div>

        {/* ── Status ── */}
        <div>
          <label className={labelClass}>
            Status <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <div className={readOnly ? 'opacity-80 pointer-events-none' : ''}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  value={field.value || 'Draft'}
                  onChange={field.onChange}
                  options={[
                    'Draft', 'Pending Approval', 'Approved', 'Ordered',
                    'Partially Received', 'Completed', 'Cancelled'
                  ]}
                />
              )}
            />
          </div>
          {errors.status && (
            <p className="text-red-500 text-xs mt-1">{errors.status.message as string}</p>
          )}
        </div>

        {/* ── Attachment (TechSpec §4.2 optional field) ── */}
        <div>
          <label className={labelClass}>
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

        {/* ── Description (TechSpec §4.2 Required textarea) ── */}
        <div className="md:col-span-2">
          <label className={labelClass}>
            Description <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <textarea
            {...register('description')}
            disabled={readOnly}
            placeholder="Specify what is being procured — be clear and specific (e.g. 'Cloud storage infrastructure for Q3 data pipeline')"
            rows={3}
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

      </div>
    </div>
  );
}
