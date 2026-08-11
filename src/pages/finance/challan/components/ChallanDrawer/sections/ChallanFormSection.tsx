import CustomDatePicker from '@/components/ui/CustomDatePicker';
"use no memo";
import { useEffect, useRef, useState, useMemo } from 'react';
import { useFormContext, useWatch, Controller, useFieldArray } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { Loader2, Paperclip, X as XIcon } from 'lucide-react';
import { AutoNumberInput } from '@/components/shared/AutoNumberSettings';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { cn } from '@/lib/utils';
import { ClientService } from '@/services/client.service';
import { useProjects } from '@/hooks/useProjects';
import CustomSelect from '@/components/ui/CustomSelect';
import type { Client } from '@/types/client.types';
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

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { projects } = useProjects();

  // Watch for dependent fields
  const selectedProjectId = useWatch({ control, name: 'projectId' });
  const selectedClientId = useWatch({ control, name: 'clientId' });
  const attachmentName = useWatch({ control, name: 'attachmentName' });

  const { selectedCompanyId: companyId } = useAuth();

  useEffect(() => {
    if (!companyId) return;
    Promise.all([
      ClientService.getClients(companyId),
      ProductService.getProducts(companyId)
    ]).then(([clientData, productData]) => {
      setClients(clientData);
      setProducts(productData);
      setIsLoadingData(false);
    });

    import('@/lib/api').then(({ api }) => {
      api.get('/admin/templates?type=challan').then((res: any) => {
        const templatesData = Array.isArray(res) ? res : (res.data || []);
        setTemplates(templatesData);
        setIsLoadingTemplates(false);
      }).catch(() => setIsLoadingTemplates(false));
    });
  }, [companyId]);

  const filteredClients = useMemo(() => {
    if (!selectedProjectId) return [];
    
    const proj = projects.find(p => p.id === selectedProjectId);
    if (!proj) return [];

    if (proj.client) {
      const matched = clients.filter(c => c.id === proj.client || c.displayName === proj.client || c.companyName === proj.client);
      if (matched.length > 0) return matched;
    }
    return clients;
  }, [selectedProjectId, clients, projects]);

  // Sync display names when selection changes
  useEffect(() => {
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) {
      setValue('projectName', project.projectName, { shouldValidate: false });
      if (project.client && clients.length > 0) {
        const matchedClient = clients.find(c => c.id === project.client || c.displayName === project.client || c.companyName === project.client);
        if (matchedClient) {
          setValue('clientId', matchedClient.id, { shouldValidate: true });
          setValue('clientName', matchedClient.displayName || matchedClient.companyName || '', { shouldValidate: false });
        }
      }
    }
    
    // If project changes, clear client if it doesn't match the new project
    if (selectedProjectId) {
      if (selectedClientId && !filteredClients.find(c => c.id === selectedClientId)) {
        setValue('clientId', '');
        setValue('clientName', '');
      }
    }
  }, [selectedProjectId, filteredClients, clients, setValue, selectedClientId, projects]);

  const getClientDeliveryLocation = (client?: Client): string => {
    if (!client) return '';
    const parts = [];
    if (client.shippingAddressLine1 || client.shippingCity) {
      if (client.shippingAddressLine1) parts.push(client.shippingAddressLine1);
      if (client.shippingAddressLine2) parts.push(client.shippingAddressLine2);
      if (client.shippingCity) parts.push(client.shippingCity);
      if (client.shippingState) parts.push(client.shippingState);
      if (client.shippingPinCode) parts.push(client.shippingPinCode);
      if (client.shippingCountry) parts.push(client.shippingCountry);
    } else if (client.billingAddressLine1 || client.billingCity) {
      if (client.billingAddressLine1) parts.push(client.billingAddressLine1);
      if (client.billingAddressLine2) parts.push(client.billingAddressLine2);
      if (client.billingCity) parts.push(client.billingCity);
      if (client.billingState) parts.push(client.billingState);
      if (client.billingPinCode) parts.push(client.billingPinCode);
      if (client.billingCountry) parts.push(client.billingCountry);
    }
    return parts.filter(Boolean).join(', ');
  };

  const getClientPlaceOfSupply = (client?: Client): string => {
    if (!client) return '';
    return client.shippingState || client.billingState || client.placeOfSupply || '';
  };

  const getFormattedClientAddress = (client: Client | undefined, isShipping: boolean): string => {
    if (!client) return '';
    if (isShipping && !client.sameAsBillingAddress && client.shippingAddressLine1) {
      return [
        client.shippingAttention || client.displayName || client.companyName,
        client.shippingAddressLine1,
        client.shippingAddressLine2,
        [client.shippingCity, client.shippingState, client.shippingPinCode].filter(Boolean).join(', '),
        client.shippingCountry
      ].filter(Boolean).join('\n');
    }
    return [
      client.billingAttention || client.displayName || client.companyName,
      client.billingAddressLine1,
      client.billingAddressLine2,
      [client.billingCity, client.billingState, client.billingPinCode].filter(Boolean).join(', '),
      client.billingCountry
    ].filter(Boolean).join('\n');
  };

  useEffect(() => {
    const client = clients.find(c => c.id === selectedClientId);
    if (client) {
      setValue('clientName', client.displayName || client.companyName || '', { shouldValidate: false });

      const deliveryLoc = getClientDeliveryLocation(client);
      const placeOfSupply = getClientPlaceOfSupply(client);
      const contactName = client.primaryContactPerson || client.displayName || '';
      const contactEmail = client.email || '';
      const contactMobile = client.phone || '';
      const billingAddr = getFormattedClientAddress(client, false);
      const shippingAddr = getFormattedClientAddress(client, true);

      if (deliveryLoc) setValue('deliveryLocation', deliveryLoc, { shouldDirty: true });
      if (placeOfSupply) setValue('placeOfSupply', placeOfSupply, { shouldDirty: true });
      if (contactName) setValue('contactName', contactName, { shouldDirty: true });
      if (contactEmail) setValue('contactEmail', contactEmail, { shouldDirty: true });
      if (contactMobile) setValue('contactMobile', contactMobile, { shouldDirty: true });
      if (billingAddr) setValue('billingAddress', billingAddr, { shouldDirty: true });
      if (shippingAddr) setValue('shippingAddress', shippingAddr, { shouldDirty: true });
    }
  }, [selectedClientId, clients, setValue]);

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

  const PROJECT_OPTIONS = useMemo(() => {
    return projects.map(p => ({ label: `${p.projectCode} – ${p.projectName}`, value: p.id }));
  }, [projects]);

  const CLIENT_OPTIONS = useMemo(() => {
    return filteredClients.map(c => ({ label: c.displayName || c.companyName || c.id, value: c.id }));
  }, [filteredClients]);

  return (
    <div className="space-y-6">
      
      {/* ── Document Details ── */}
      <FormSection title="Document Details">
        <FormGrid>
          
          {/* Challan Number */}
          <div>
            <label className={formStyles.label}>
              Challan Number <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <AutoNumberInput
              name="challanNumber"
              disabled={readOnly}
              placeholder="e.g. DC/2026/001"
              defaultPrefix="DC/2026/"
              nextNumber={nextNumber}
              className={formStyles.field(!!errors.challanNumber, readOnly)}
            />
            {errors.challanNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.challanNumber.message as string}</p>
            )}
          </div>
          
          {/* Challan Date */}
          <div>
            <label className={formStyles.label}>
              Challan Date <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <CustomDatePicker name="challanDate" disabled={readOnly} />
            {errors.challanDate && (
              <p className="text-red-500 text-xs mt-1">{errors.challanDate.message as string}</p>
            )}
          </div>

          {/* Document Template */}
          <div>
            <label className={formStyles.label}>
              Document Template <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <div className="relative">
              <div className={readOnly || isLoadingTemplates ? 'opacity-80 pointer-events-none' : ''}>
                <Controller
                  name="templateName"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      value={field.value || ''}
                      onChange={field.onChange}
                      options={templates.map(t => typeof t === 'string' 
                        ? { label: t.replace('.html', '').replace(/[-_]/g, ' '), value: t } 
                        : { label: t.name, value: t.filename })}
                    />
                  )}
                />
              </div>
              {isLoadingTemplates && <Loader2 className="absolute right-8 top-2.5 w-4 h-4 animate-spin text-gray-400" />}
            </div>
            {errors.templateName && (
              <p className="text-red-500 text-xs mt-1">{errors.templateName.message as string}</p>
            )}
          </div>
          
          {/* Project */}
          <div>
            <label className={formStyles.label}>
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

          {/* Client */}
          <div>
            <label className={formStyles.label}>
              Client <span className="text-red-500 normal-case font-normal">*</span>
            </label>
            <div className="relative">
              <div className={readOnly || isLoadingData || !selectedProjectId ? 'opacity-80 pointer-events-none' : ''}>
                <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      value={field.value || ''}
                      onChange={field.onChange}
                      options={CLIENT_OPTIONS}
                    />
                  )}
                />
              </div>
              {isLoadingData && (
                <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-gray-400" />
              )}
            </div>
            {errors.clientId && (
              <p className="text-red-500 text-xs mt-1">{errors.clientId.message as string}</p>
            )}
          </div>

          {/* E-Way Bill Number */}
          <div>
            <label className={formStyles.label}>
              E-Way Bill Number
              <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(optional)</span>
            </label>
            <input
              type="text"
              {...register('ewayBillNo')}
              disabled={readOnly}
              placeholder="e.g. 123456789012"
              className={formStyles.field(!!errors.ewayBillNo, readOnly)}
            />
          </div>
          
          {/* Attachment */}
          <div>
            <label className={formStyles.label}>
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
                      'hover:border-primary hover:text-primary dark:hover:border-[#c44997] dark:hover:text-[#c44997] cursor-pointer')
                }
              >
                <Paperclip size={14} />
                <span>Upload Additional Attachments</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-white/10 rounded-sm bg-gray-50 dark:bg-white/[0.02]">
                <Paperclip size={14} className="text-primary dark:text-[#c44997] shrink-0" />
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
          
        </FormGrid>
      </FormSection>
      
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
              className="flex items-center gap-1 text-xs font-semibold text-primary dark:text-[#c44997] hover:underline"
            >
              <Plus size={14} /> Add Line Item
            </button>
          )}
        </div>

        <div className="rounded-sm border border-gray-200 dark:border-white/10">
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
                        className={cn(formStyles.field(false, readOnly), "resize-y min-h-[40px] text-xs py-1.5")}
                      />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      placeholder="e.g. 998313"
                      {...register(`lineItems.${index}.hsnSac`)}
                      disabled={readOnly}
                      className={cn(formStyles.field(false, readOnly), "py-1.5")}
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register(`lineItems.${index}.dispatchedQuantity`, { setValueAs: (v: any) => v === "" || isNaN(v) ? undefined : Number(v) })}
                      disabled={readOnly}
                      className={cn(formStyles.field(false, readOnly), "py-1.5")}
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      placeholder="e.g. Box, Nos, Lot"
                      {...register(`lineItems.${index}.unit`)}
                      disabled={readOnly}
                      className={cn(formStyles.field(false, readOnly), "py-1.5")}
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
      <FormSection title="Content & Remarks">
        
        <FormGrid>
          {/* Description */}
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
                  placeholder="Specify what was delivered or what milestone was completed..."
                  rows={4}
                  className={formStyles.textarea(!!errors.description, readOnly)}
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>
            )}
          </FormRow>
          
          {/* Remarks */}
          <FormRow>
            <label className={formStyles.label}>
              Remarks
              <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(optional)</span>
            </label>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  value={field.value || ''}
                  disabled={readOnly}
                  placeholder="Any internal remarks or additional notes..."
                  rows={3}
                  className={formStyles.textarea(false, readOnly)}
                />
              )}
            />
          </FormRow>
        </FormGrid>
      </FormSection>
      
    </div>
  );
}

