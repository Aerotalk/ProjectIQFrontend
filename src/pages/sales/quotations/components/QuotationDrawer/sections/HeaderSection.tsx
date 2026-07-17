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
}

export default function HeaderSection({ readOnly }: Props) {
  const { register, control, formState: { errors }, setValue, getValues } = useFormContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  const { selectedCompanyId: companyId, user } = useAuth();

  useEffect(() => {
    if (!companyId) return;
    ClientService.getClients(companyId).then((data) => {
      setClients(data);
      setIsLoadingClients(false);
    });
  }, [companyId]);

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
                    onChange={field.onChange}
                    options={clients.map(client => ({ label: client.displayName, value: client.id }))}
                  />
                )}
              />
            </div>
            {isLoadingClients && <Loader2 className="absolute right-8 top-2.5 w-4 h-4 animate-spin text-gray-400" />}
          </div>
          {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId.message as string}</p>}
        </div>

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
            disabled={true}
            className={fieldClass(!!errors.salesperson)}
          />
          {errors.salesperson && <p className="text-red-500 text-xs mt-1">{errors.salesperson.message as string}</p>}
        </div>
      </div>
    </div>
  );
}
