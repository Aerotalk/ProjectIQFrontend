import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Tabs from '../../../components/Tabs';

// Lazy load the sub-modules
const WorkforceDashboard = React.lazy(() => import('./dashboard/WorkforceDashboard'));
const LeaveMain = React.lazy(() => import('./leave/LeaveMain'));
const AttendanceMain = React.lazy(() => import('./attendance/AttendanceMain'));
const ShiftsMain = React.lazy(() => import('./shifts/ShiftsMain'));
const ConfigMain = React.lazy(() => import('./configuration/ConfigMain'));
const ProcessingMain = React.lazy(() => import('./processing/ProcessingMain'));

// Fallback loader for lazy-loaded modules
const ModuleLoader = () => (
  <div className="flex items-center justify-center p-12 w-full h-64">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Loading module...</p>
    </div>
  </div>
);

export default function WorkforceMain() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'leave', label: 'Leave' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'shifts', label: 'Shifts' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'processing', label: 'Processing' },
  ];

  // Determine active tab from URL
  const pathParts = location.pathname.split('/');
  const activeTabId = pathParts[pathParts.length - 1] === 'workforce' 
    ? 'dashboard' 
    : pathParts.find(p => tabs.some(t => t.id === p)) || 'dashboard';

  const handleTabChange = (tabId: string) => {
    navigate(`/companydashboard/hrms/workforce/${tabId}`);
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
            <Route path="dashboard" element={<WorkforceDashboard />} />
            <Route path="leave/*" element={<LeaveMain />} />
            <Route path="attendance/*" element={<AttendanceMain />} />
            <Route path="shifts/*" element={<ShiftsMain />} />
            <Route path="configuration/*" element={<ConfigMain />} />
            <Route path="processing/*" element={<ProcessingMain />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
