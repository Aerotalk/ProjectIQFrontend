import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Tabs from '../../../components/Tabs';

// Lazy load the sub-modules
const ExpenseClaimsDashboard = React.lazy(() => import('./dashboard/ExpenseClaimsDashboard'));
const ClaimsMain = React.lazy(() => import('./claims/ClaimsMain'));
const AdvancesMain = React.lazy(() => import('./advances/AdvancesMain'));
const ConfigMain = React.lazy(() => import('./configuration/ConfigMain'));
const ApprovalsMain = React.lazy(() => import('./approvals/ApprovalsMain'));
const BatchProcessingMain = React.lazy(() => import('./batch-processing/BatchProcessingMain'));
const ExpenseClaimPage = React.lazy(() => import('./claims/ExpenseClaimPage'));
const AdvanceFormPage = React.lazy(() => import('./advances/AdvanceFormPage'));
const BatchFormPage = React.lazy(() => import('./batch-processing/BatchFormPage'));

// Fallback loader for lazy-loaded modules
const ModuleLoader = () => (
  <div className="flex items-center justify-center p-12 w-full h-64">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Loading module...</p>
    </div>
  </div>
);

export default function ExpenseClaimsMain() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'claims', label: 'Claims' },
    { id: 'advances', label: 'Advances' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'approvals', label: 'Approvals' },
    { id: 'batch-processing', label: 'Batch Processing' },
  ];

  // Determine active tab from URL
  const pathParts = location.pathname.split('/');
  const activeTabId = pathParts[pathParts.length - 1] === 'expense-claims' 
    ? 'dashboard' 
    : pathParts.find(p => tabs.some(t => t.id === p)) || 'dashboard';

  const handleTabChange = (tabId: string) => {
    navigate(`/companydashboard/hrms/expense-claims/${tabId}`);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm overflow-hidden flex-shrink-0">
        <Tabs tabs={tabs} activeTab={activeTabId} onChange={handleTabChange} />
      </div>

      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<ModuleLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ExpenseClaimsDashboard />} />
            <Route path="claims/*" element={<ClaimsMain />} />
            <Route path="claim/:id" element={<ExpenseClaimPage />} />
            <Route path="advances/*" element={<AdvancesMain />} />
            <Route path="advance/:id" element={<AdvanceFormPage />} />
            <Route path="configuration/*" element={<ConfigMain />} />
            <Route path="approvals/*" element={<ApprovalsMain />} />
            <Route path="batch-processing/*" element={<BatchProcessingMain />} />
            <Route path="batch/:id" element={<BatchFormPage />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
