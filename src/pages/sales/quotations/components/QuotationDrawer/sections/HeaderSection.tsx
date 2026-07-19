"use no memo";
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { Loader2 } from 'lucide-react';
import { ClientService } from '@/services/client.service';
import type { Client } from '@/types/client.types';
import { useAuth } from '@/contexts/AuthContext';
import { AutoNumberInput } from '@/components/shared/AutoNumberSettings';

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

  const fieldClass = (hasError: boolean) =>
    `w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white ` +
    `focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] transition-colors appearance-none ` +
    `disabled:opacity-60 disabled:cursor-not-allowed ` +
    (hasError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-white/10');

  const labelClass = 'block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1';

  const selectedClientId = watch('clientId');
  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Header Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Quotation Number <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <AutoNumberInput
            name="quotationNo"
            disabled={readOnly}
            placeholder="e.g. QT/2026/001"
            defaultPrefix="QT/2026/"
            nextNumber={nextNumber}
            className={fieldClass(!!errors.quotationNo)}
          />
          {errors.quotationNo && <p className="text-red-500 text-xs mt-1">{errors.quotationNo.message as string}</p>}
        </div>

        <div>
          <label className={labelClass}>
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
          <div className="md:col-span-2 mt-2 p-4 bg-gray-50 dark:bg-white/5 rounded-sm border border-gray-200 dark:border-white/10 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">Billing Address</h4>
                <textarea
                  {...register('billingAddress')}
                  disabled={readOnly}
                  rows={5}
                  className="w-full bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm p-2 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] resize-none"
                />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">Shipping Address</h4>
                <textarea
                  {...register('shippingAddress')}
                  disabled={readOnly}
                  rows={5}
                  className="w-full bg-white dark:bg-[#0f1115] border border-gray-300 dark:border-white/10 rounded-sm p-2 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#792359]/50 focus:border-[#792359] resize-none"
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
          </div>
        )}

        <div>
          <label className={labelClass}>
            Subject / Reference <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500 normal-case font-normal tracking-normal">(optional)</span>
          </label>
          <input 
            type="text" 
            {...register('subject')} 
            disabled={readOnly}
            placeholder="Brief subject line"
            className={fieldClass(!!errors.subject)}
          />
        </div>

        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
            Quotation Date <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <input 
            type="date" 
            {...register('date')} 
            disabled={readOnly}
            className={fieldClass(!!errors.date)}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message as string}</p>}
        </div>

        <div>
          <label className={labelClass}>
            Valid Until <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <input 
            type="date" 
            {...register('validUntil')} 
            disabled={readOnly}
            className={fieldClass(!!errors.validUntil)}
          />
          {errors.validUntil && <p className="text-red-500 text-xs mt-1">{errors.validUntil.message as string}</p>}
        </div>

        <div>
          <label className={labelClass}>
            Salesperson <span className="text-red-500 normal-case font-normal">*</span>
          </label>
          <input 
            type="text" 
            {...register('salesperson')} 
            readOnly={true}
            className={`${fieldClass(!!errors.salesperson)} bg-gray-50 dark:bg-white/5 text-gray-500 cursor-not-allowed`}
          />
          {errors.salesperson && <p className="text-red-500 text-xs mt-1">{errors.salesperson.message as string}</p>}
        </div>
      </div>
    </div>
  );
}
