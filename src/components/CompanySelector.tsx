import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { api } from '../lib/api';
import CustomSelect from './ui/CustomSelect';

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

  const handleAccountChange = (val: string) => {
    setSelectedAccountId(val);
    localStorage.setItem('selectedCompanyId', val);
    window.dispatchEvent(new Event('storage')); // trigger updates in other components
  };

  if (accounts.length === 0) return null;

  return (
    <div className="flex items-center w-48 relative z-50">
      <CustomSelect
        value={selectedAccountId}
        onChange={handleAccountChange}
        options={accounts.map(acc => ({ label: acc.companyName, value: acc.id }))}
      />
    </div>
  );
}
