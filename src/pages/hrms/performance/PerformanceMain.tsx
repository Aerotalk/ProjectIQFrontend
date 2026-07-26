import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Tabs from '../../../components/Tabs';

// Lazy load the sub-modules
const PerformanceDashboard = lazy(() => import('./dashboard/PerformanceDashboard'));
const AppraisalCycles = lazy(() => import('./cycles/AppraisalCycles'));
const GoalsList = lazy(() => import('./goals/GoalsList'));
const SelfReviewsList = lazy(() => import('./reviews/self/SelfReviewsList'));
const ManagerReviewsQueue = lazy(() => import('./reviews/manager/ManagerReviewsQueue'));
const CalibrationDashboard = lazy(() => import('./calibration/CalibrationDashboard'));
const TemplatesMain = lazy(() => import('./templates/TemplatesMain'));
const PerformanceReports = lazy(() => import('./reports/PerformanceReports'));

// Fallback loader for lazy-loaded modules
const ModuleLoader = () => (
  <div className="flex items-center justify-center p-12 w-full h-64">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-[#792359] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Loading module...</p>
    </div>
  </div>
);

export default function PerformanceMain() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cycles', label: 'Appraisal Cycles' },
    { id: 'goals', label: 'Goals & KRAs' },
    { id: 'employee-reviews', label: 'Employee Reviews' },
    { id: 'manager-reviews', label: 'Manager Reviews' },
    { id: 'calibration', label: 'Calibration' },
    { id: 'templates', label: 'Templates' },
    { id: 'reports', label: 'Reports' },
  ];

  // Determine active tab from URL
  const pathParts = location.pathname.split('/');
  const activeTabId = pathParts[pathParts.length - 1] === 'performance' 
    ? 'dashboard' 
    : pathParts.find(p => tabs.some(t => t.id === p)) || 'dashboard';

  const handleTabChange = (tabId: string) => {
    navigate(`/companydashboard/hrms/performance/${tabId}`);
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
            <Route path="dashboard" element={<PerformanceDashboard />} />
            <Route path="cycles/*" element={<AppraisalCycles />} />
            <Route path="goals/*" element={<GoalsList />} />
            <Route path="employee-reviews/*" element={<SelfReviewsList />} />
            <Route path="manager-reviews/*" element={<ManagerReviewsQueue />} />
            <Route path="calibration/*" element={<CalibrationDashboard />} />
            <Route path="templates/*" element={<TemplatesMain />} />
            <Route path="reports/*" element={<PerformanceReports />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
