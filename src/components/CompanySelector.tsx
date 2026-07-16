import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { api } from '../lib/api';
import CustomSelect from './ui/CustomSelect';
import { useAuth } from '../contexts/AuthContext';

export default function CompanySelector() {
  const { selectedCompanyId, setSelectedCompanyId } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/admin/companies`)
      .then((res: any) => {
        const data = Array.isArray(res) ? res : (res.content || []);
        setAccounts(data);
        if (selectedCompanyId && data.some((acc: any) => acc.id === selectedCompanyId)) {
          // Keep current
        } else if (data.length > 0) {
          setSelectedCompanyId(data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const handleAccountChange = (val: string) => {
    setSelectedCompanyId(val);
  };

  if (accounts.length === 0) return null;

  return (
    <div className="flex items-center w-48 relative z-50">
      <CustomSelect
        value={selectedCompanyId || ''}
        onChange={handleAccountChange}
        options={accounts.map(acc => ({ label: acc.companyName, value: acc.id }))}
      />
    </div>
  );
}
