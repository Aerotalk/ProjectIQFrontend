import DashboardLayout from '../components/layout/DashboardLayout';
import { LayoutGrid, Building2, ChevronDown } from 'lucide-react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import MyAccounts from './MyAccounts';
import EmployeeDirectory from './EmployeeDirectory';
import DepartmentDirectory from './DepartmentDirectory';
import DesignationDirectory from './DesignationDirectory';
import RolesList from './RolesList';
import AdminUsersList from './AdminUsersList';
import PermissionGate from '../components/PermissionGate';
import ClientsList from './sales/ClientsList';

function DefaultView() {
  const location = useLocation();
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
    window.dispatchEvent(new Event('storage'));
  };

  let title = 'Profile Dashboard';
  let description = 'The profile module is currently being configured. Select an option from the sidebar menu to navigate, or check back later to view your analytics and data.';
  
  if (location.pathname.includes('/account')) {
    title = 'Profile Dashboard';
    description = 'The profile module is currently being configured. Select an option from the sidebar menu to navigate, or check back later to view your analytics and data.';
  } else if (location.pathname.includes('/sales')) {
    title = 'Sales Dashboard';
    description = 'The sales module is currently being configured. Select an option from the sidebar menu to navigate, or check back later to view your analytics and data.';
  } else if (location.pathname.includes('/finance')) {
    title = 'Finance Dashboard';
    description = 'The finance module is currently being configured. Select an option from the sidebar menu to navigate, or check back later to view your analytics and data.';
  }

  return (
    <div className="w-full h-[calc(100vh-8rem)] bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/5 rounded-sm shadow-sm flex flex-col items-center justify-center p-8 text-center relative">
      
      {/* Account Dropdown in top right corner */}
      <div className="absolute top-6 right-6">
        <div className="flex items-center bg-gray-50 dark:bg-black/20 rounded-sm pl-3 pr-8 py-1.5 border border-gray-200 dark:border-white/10 focus-within:border-[#792359] dark:focus-within:border-[#792359] transition-all relative">
          <Building2 size={14} className="text-gray-400 mr-2" />
          <select
            value={selectedAccountId}
            onChange={handleAccountChange}
            disabled={accounts.length === 0}
            className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 outline-none cursor-pointer appearance-none w-48 truncate"
          >
            {accounts.length > 0 ? (
              accounts.map(acc => (
                <option key={acc.id} value={acc.id} className="bg-white dark:bg-[#181a1f] text-gray-900 dark:text-white">
                  {acc.companyName}
                </option>
              ))
            ) : (
              <option value="" disabled className="bg-white dark:bg-[#181a1f] text-gray-500">
                No accounts available
              </option>
            )}
          </select>
          <ChevronDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
        </div>
      </div>

      <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
        <LayoutGrid size={28} className="text-[#792359] dark:text-[#e6a8d0]" />
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight mb-2">
        {title}
      </h2>
      
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
        {description}
      </p>
      
    </div>
  );
}

export default function OrgDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DefaultView />} />
        <Route path="/my-accounts" element={<MyAccounts />} />
        <Route path="/employees" element={<EmployeeDirectory />} />
        <Route path="/departments" element={<DepartmentDirectory />} />
        <Route path="/designations" element={<DesignationDirectory />} />
        <Route path="/roles" element={
          <PermissionGate permission="role.view">
            <RolesList />
          </PermissionGate>
        } />
        <Route path="/users" element={
          <PermissionGate permission="user.view">
            <AdminUsersList />
          </PermissionGate>
        } />
        <Route path="/sales/clients" element={
          <PermissionGate permission="sales.clients.view">
            <ClientsList />
          </PermissionGate>
        } />
        <Route path="*" element={<DefaultView />} />
      </Routes>
    </DashboardLayout>
  );
}
