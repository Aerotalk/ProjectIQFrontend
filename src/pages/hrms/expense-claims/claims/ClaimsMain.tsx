import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Tabs from '../../../../components/Tabs';

const ClaimsList = React.lazy(() => import('./ClaimsList'));
const ReceiptsList = React.lazy(() => import('./ReceiptsList'));
const AuditTrail = React.lazy(() => import('./AuditTrail'));

const ModuleLoader = () => (
  <div className="flex items-center justify-center p-12 w-full h-64">
    <div className="w-8 h-8 border-4 border-[#792359] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function ClaimsMain() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'list', label: 'Claims' },
    { id: 'receipts', label: 'Receipts' },
    { id: 'audit', label: 'Audit Trail' }
  ];

  const pathParts = location.pathname.split('/');
  const activeTabId = pathParts[pathParts.length - 1] === 'claims' 
    ? 'list' 
    : pathParts.find(p => tabs.some(t => t.id === p)) || 'list';

  const handleTabChange = (tabId: string) => {
    navigate(`/companydashboard/hrms/expense-claims/claims/${tabId}`);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm overflow-hidden flex-shrink-0">
        <Tabs tabs={tabs} activeTab={activeTabId} onChange={handleTabChange} />
      </div>

      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<ModuleLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="list" replace />} />
            <Route path="list" element={<ClaimsList />} />
            <Route path="receipts" element={<ReceiptsList />} />
            <Route path="audit" element={<AuditTrail />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
