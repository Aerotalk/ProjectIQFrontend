import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { ClientService } from '@/services/client.service';
import type { Client } from '@/types/client.types';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  readOnly?: boolean;
}

export default function HeaderSection({ readOnly }: Props) {
  const { register, control, formState: { errors } } = useFormContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  const { selectedCompanyId: companyId } = useAuth();

  useEffect(() => {
    if (!companyId) return;
    ClientService.getClients(companyId).then((data) => {
      setClients(data);
      setIsLoadingClients(false);
    });
  }, [companyId]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Header Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Select Client *</label>
          <div className={readOnly || isLoadingClients ? 'opacity-80 pointer-events-none relative' : 'relative'}>
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
            {isLoadingClients && <Loader2 className="absolute right-8 top-2.5 w-4 h-4 animate-spin text-gray-400" />}
          </div>
          {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Subject / Reference</label>
          <Input 
            type="text" 
            {...register('subject')} 
            disabled={readOnly}
            placeholder="Brief subject line"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Quotation Date *</label>
          <Input 
            type="date" 
            {...register('date')} 
            disabled={readOnly}
            className={`${errors.date ? 'border-red-500' : ''}`} 
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message as string}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Valid Until *</label>
          <Input 
            type="date" 
            {...register('validUntil')} 
            disabled={readOnly}
            className={`${errors.validUntil ? 'border-red-500' : ''}`} 
          />
          {errors.validUntil && <p className="text-red-500 text-xs mt-1">{errors.validUntil.message as string}</p>}
        </div>
      </div>
    </div>
  );
}
