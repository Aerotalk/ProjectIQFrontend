import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Tabs from '../../../../components/Tabs';

const PendingApprovals = React.lazy(() => import('./PendingApprovals'));
const ApprovalsHistory = React.lazy(() => import('./ApprovalsHistory'));

const ModuleLoader = () => (
  <div className="flex items-center justify-center p-12 w-full h-64">
    <div className="w-8 h-8 border-4 border-[#792359] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function ApprovalsMain() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'pending', label: 'Pending Approvals' },
    { id: 'history', label: 'History' }
  ];

  const pathParts = location.pathname.split('/');
  const activeTabId = pathParts[pathParts.length - 1] === 'approvals' 
    ? 'pending' 
    : pathParts.find(p => tabs.some(t => t.id === p)) || 'pending';

  const handleTabChange = (tabId: string) => {
    navigate(`/companydashboard/hrms/expense-claims/approvals/${tabId}`);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm overflow-hidden flex-shrink-0">
        <Tabs tabs={tabs} activeTab={activeTabId} onChange={handleTabChange} />
      </div>

      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<ModuleLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="pending" replace />} />
            <Route path="pending" element={<PendingApprovals />} />
            <Route path="history" element={<ApprovalsHistory />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
