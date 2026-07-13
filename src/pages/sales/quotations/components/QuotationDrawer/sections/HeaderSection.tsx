import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { ClientService } from '@/services/client.service';
import type { Client } from '@/types/client.types';

interface Props {
  readOnly?: boolean;
}

export default function HeaderSection({ readOnly }: Props) {
  const { register, formState: { errors } } = useFormContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  useEffect(() => {
    ClientService.getClients().then((data) => {
      setClients(data);
      setIsLoadingClients(false);
    });
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-200 dark:border-white/10 pb-2">
        Header Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Select Client *</label>
          <div className="relative">
            <select 
              {...register('clientId')} 
              disabled={readOnly || isLoadingClients}
              className={`w-full px-3 py-2 bg-white dark:bg-[#0f1115] border rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#792359]/50 transition-colors appearance-none ${errors.clientId ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}`}
            >
              <option value="">Select a Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.displayName}</option>
              ))}
            </select>
            {isLoadingClients && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-gray-400" />}
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
