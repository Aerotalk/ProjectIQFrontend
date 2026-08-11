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
const ShiftFormPage = React.lazy(() => import('./shifts/ShiftFormPage'));
const ShiftRotationFormPage = React.lazy(() => import('./shifts/ShiftRotationFormPage'));
const LeaveTypeFormPage = React.lazy(() => import('./leave/LeaveTypeFormPage'));
const LeaveSchemeFormPage = React.lazy(() => import('./leave/LeaveSchemeFormPage'));
const LeaveApplicationFormPage = React.lazy(() => import('./leave/LeaveApplicationFormPage'));
const HolidayFormPage = React.lazy(() => import('./configuration/HolidayFormPage'));
const AttendanceSchemeFormPage = React.lazy(() => import('./configuration/AttendanceSchemeFormPage'));
const IPMappingFormPage = React.lazy(() => import('./configuration/IPMappingFormPage'));
const LockConfigFormPage = React.lazy(() => import('./processing/LockConfigFormPage'));
const PermissionFormPage = React.lazy(() => import('./attendance/PermissionFormPage'));
const RegularizationFormPage = React.lazy(() => import('./attendance/RegularizationFormPage'));
const AttendanceFormPage = React.lazy(() => import('./attendance/AttendanceFormPage'));

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
  const basePath = location.pathname.split('/hrms')[0] || '/companydashboard';

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
    navigate(`${basePath}/hrms/workforce/${tabId}`);
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
            <Route path="leave-type/:id" element={<LeaveTypeFormPage />} />
            <Route path="leave-scheme/:id" element={<LeaveSchemeFormPage />} />
            <Route path="leave-application/:id" element={<LeaveApplicationFormPage />} />
            <Route path="attendance/*" element={<AttendanceMain />} />
            <Route path="shifts/*" element={<ShiftsMain />} />
            <Route path="shift/:id" element={<ShiftFormPage />} />
            <Route path="shift-rotation/:id" element={<ShiftRotationFormPage />} />
            <Route path="holiday/:id" element={<HolidayFormPage />} />
            <Route path="attendance-scheme/:id" element={<AttendanceSchemeFormPage />} />
            <Route path="ip-mapping/:id" element={<IPMappingFormPage />} />
            <Route path="lock-config/:id" element={<LockConfigFormPage />} />
            <Route path="permission/:id" element={<PermissionFormPage />} />
            <Route path="regularization/:id" element={<RegularizationFormPage />} />
            <Route path="attendance/record/:id" element={<AttendanceFormPage />} />
            <Route path="configuration/*" element={<ConfigMain />} />
            <Route path="processing/*" element={<ProcessingMain />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
