import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Tabs from '../../../../components/Tabs';

const CategoriesList = React.lazy(() => import('./CategoriesList'));
const TemplatesList = React.lazy(() => import('./TemplatesList'));
const PoliciesList = React.lazy(() => import('./PoliciesList'));
const ReviewerAssignment = React.lazy(() => import('./ReviewerAssignment'));
const TemplateFormPage = React.lazy(() => import('./TemplateFormPage'));
const CategoryFormPage = React.lazy(() => import('./CategoryFormPage'));
const PolicyFormPage = React.lazy(() => import('./PolicyFormPage'));
const ReviewerAssignmentFormPage = React.lazy(() => import('./ReviewerAssignmentFormPage'));

const ModuleLoader = () => (
  <div className="flex items-center justify-center p-12 w-full h-64">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function ConfigMain() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'categories', label: 'Expense Categories' },
    { id: 'templates', label: 'Templates' },
    { id: 'policies', label: 'Policies' },
    { id: 'reviewer-assignment', label: 'Reviewer Assignment' }
  ];

  const pathParts = location.pathname.split('/');
  const activeTabId = pathParts[pathParts.length - 1] === 'configuration' 
    ? 'categories' 
    : pathParts.find(p => tabs.some(t => t.id === p)) || 'categories';

  const handleTabChange = (tabId: string) => {
    navigate(`/companydashboard/hrms/expense-claims/configuration/${tabId}`);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm overflow-hidden flex-shrink-0">
        <Tabs tabs={tabs} activeTab={activeTabId} onChange={handleTabChange} />
      </div>

      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<ModuleLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="categories" replace />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="category/:id" element={<CategoryFormPage />} />
            <Route path="templates" element={<TemplatesList />} />
            <Route path="template/:id" element={<TemplateFormPage />} />
            <Route path="policies" element={<PoliciesList />} />
            <Route path="policy/:id" element={<PolicyFormPage />} />
            <Route path="reviewer-assignment" element={<ReviewerAssignment />} />
            <Route path="reviewer-assignment/:id" element={<ReviewerAssignmentFormPage />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
