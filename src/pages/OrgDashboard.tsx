import DashboardLayout from '../components/layout/DashboardLayout';
import { LayoutGrid } from 'lucide-react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

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
  useEffect(() => {
    // Left empty or can be removed completely.
  }, []);

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
