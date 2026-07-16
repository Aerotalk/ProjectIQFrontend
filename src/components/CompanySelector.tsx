import { useState, useEffect } from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { api } from '../lib/api';

export default function CompanySelector() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  useEffect(() => {
    api.get(`/admin/companies`)
      .then((res: any) => {
        const data = Array.isArray(res) ? res : (res.content || []);
        setAccounts(data);
        const storedId = localStorage.getItem('selectedCompanyId');
        if (storedId && data.some((acc: any) => acc.id === storedId)) {
          setSelectedAccountId(storedId);
        } else if (data.length > 0) {
          setSelectedAccountId(data[0].id);
          localStorage.setItem('selectedCompanyId', data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccountId(e.target.value);
    localStorage.setItem('selectedCompanyId', e.target.value);
    window.dispatchEvent(new Event('storage')); // trigger updates in other components
  };

  if (accounts.length === 0) return null;

  return (
    <div className="flex items-center bg-gray-50 dark:bg-black/20 rounded-sm pl-3 pr-8 py-1.5 border border-gray-200 dark:border-white/10 focus-within:border-[#792359] dark:focus-within:border-[#792359] transition-all relative">
      <Building2 size={14} className="text-gray-400 mr-2" />
      <select
        value={selectedAccountId}
        onChange={handleAccountChange}
        className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 outline-none cursor-pointer appearance-none w-32 xl:w-48 truncate"
      >
        {accounts.map(acc => (
          <option key={acc.id} value={acc.id} className="bg-white dark:bg-[#181a1f] text-gray-900 dark:text-white">
            {acc.companyName}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
    </div>
  );
}
