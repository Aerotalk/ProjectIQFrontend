import CustomDatePicker from '@/components/ui/CustomDatePicker';
"use no memo";
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { Loader2, Copy } from 'lucide-react';
import { ClientService } from '@/services/client.service';
import type { Client } from '@/types/client.types';
import { useAuth } from '@/contexts/AuthContext';
import { AutoNumberInput } from '@/components/shared/AutoNumberSettings';
import { formStyles } from '@/components/ui/form-styles';
import { FormSection, FormGrid, FormRow } from '@/components/ui/FormLayout';
import { cn } from '@/lib/utils';

interface Props {
  readOnly?: boolean;
  nextNumber?: number;
}

export default function HeaderSection({ readOnly, nextNumber }: Props) {
  const { register, control, formState: { errors }, setValue, getValues, watch } = useFormContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  const { selectedCompanyId: companyId, user } = useAuth();

  useEffect(() => {
    if (!companyId) return;
    ClientService.getClients(companyId).then((data) => {
      setClients(data);
      setIsLoadingClients(false);
    });
    
    import('@/lib/api').then(({ api }) => {
      api.get('/admin/templates').then((res: any) => {
        const templatesData = Array.isArray(res) ? res : (res.data || []);
        setTemplates(templatesData);
        setIsLoadingTemplates(false);
        if (templatesData.length > 0 && !getValues('templateName')) {
          const firstTemplate = templatesData[0];
          setValue('templateName', typeof firstTemplate === 'string' ? firstTemplate : firstTemplate.filename);
        }
      }).catch(() => setIsLoadingTemplates(false));
    });
  }, [companyId, setValue, getValues]);

  useEffect(() => {
    if (user && !getValues('salesperson')) {
      setValue('salesperson', user.username || user.email, { shouldValidate: true, shouldDirty: true });
    }
  }, [user, setValue, getValues]);



  const selectedClientId = watch('clientId');
  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <FormSection title="Header Information">
      <FormGrid>
        <div>
          <label className={formStyles.label}>
            Quotation Number <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <AutoNumberInput
            name="quotationNo"
            disabled={readOnly}
            placeholder="e.g. QT/2026/001"
            defaultPrefix="QT/2026/"
            nextNumber={nextNumber}
            className={formStyles.field(!!errors.quotationNo, readOnly)}
          />
          {errors.quotationNo && <p className="text-red-500 text-xs mt-1">{errors.quotationNo.message as string}</p>}
        </div>

        <div>
          <label className={formStyles.label}>
            Select Client <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <div className="relative">
            <div className={readOnly || isLoadingClients ? 'opacity-80 pointer-events-none' : ''}>
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={(val) => {
                      field.onChange(val);
                      const client = clients.find(c => c.id === val);
                      if (client) {
                        const formatAddress = (c: any, isShipping: boolean) => {
                          if (isShipping && !c.sameAsBillingAddress) {
                            return [
                              c.companyName || c.displayName,
                              c.shippingAddressLine1,
                              c.shippingAddressLine2,
                              `${c.shippingCity || ''}, ${c.shippingState || ''} ${c.shippingPinCode || ''}`.replace(/^, | ,$|^,|,$/g, '').trim(),
                              c.shippingCountry
                            ].filter(Boolean).join('\n');
                          }
                          return [
                            c.companyName || c.displayName,
                            c.billingAddressLine1,
                            c.billingAddressLine2,
                            `${c.billingCity || ''}, ${c.billingState || ''} ${c.billingPinCode || ''}`.replace(/^, | ,$|^,|,$/g, '').trim(),
                            c.billingCountry
                          ].filter(Boolean).join('\n');
                        };
                        setValue('billingAddress', formatAddress(client, false), { shouldDirty: true });
                        setValue('shippingAddress', formatAddress(client, true), { shouldDirty: true });
                      }
                    }}
                    options={clients.map(client => ({ label: client.displayName, value: client.id }))}
                  />
                )}
              />
            </div>
            {isLoadingClients && <Loader2 className="absolute right-8 top-2.5 w-4 h-4 animate-spin text-gray-400" />}
          </div>
          {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId.message as string}</p>}
        </div>

        {selectedClient && (
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
                  {selectedClient.gstTreatment === 'business_gst' ? 'Registered Business' : 
                   selectedClient.gstTreatment === 'business_none' ? 'Unregistered Business' : 
                   selectedClient.gstTreatment === 'consumer' ? 'Consumer' : 
                   selectedClient.gstTreatment === 'sez' ? 'SEZ' : 'Overseas'}
                </span>
              </div>
              {selectedClient.gstin && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">GSTIN:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedClient.gstin}</span>
                </div>
              )}
            </div>
          </FormRow>
        )}

        <div>
          <label className={formStyles.label}>
            Subject / Reference <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(optional)</span>
          </label>
          <input 
            type="text" 
            {...register('subject')} 
            disabled={readOnly}
            placeholder="Brief subject line"
            className={formStyles.field(!!errors.subject, readOnly)}
          />
        </div>

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
        </div>

        <div>
          <label className={formStyles.label}>
            Quotation Date <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <CustomDatePicker name="date" disabled={readOnly} />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message as string}</p>}
        </div>

        <div>
          <label className={formStyles.label}>
            Valid Until <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <CustomDatePicker name="validUntil" disabled={readOnly} />
          {errors.validUntil && <p className="text-red-500 text-xs mt-1">{errors.validUntil.message as string}</p>}
        </div>

        <div>
          <label className={formStyles.label}>
            Salesperson <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <input 
            type="text" 
            {...register('salesperson')} 
            readOnly={true}
            className={cn(formStyles.field(!!errors.salesperson, readOnly), "bg-gray-50 dark:bg-white/5 text-gray-500 cursor-not-allowed")}
          />
          {errors.salesperson && <p className="text-red-500 text-xs mt-1">{errors.salesperson.message as string}</p>}
        </div>
      </FormGrid>
    </FormSection>
  );
}
