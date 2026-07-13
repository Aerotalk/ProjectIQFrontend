import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OrgDashboard from './pages/OrgDashboard';
import Profile from './pages/Profile';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CompanyDashboard from './pages/CompanyDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeProfile from './pages/EmployeeProfile';
import { AuthProvider } from './contexts/AuthContext';
import RolesList from './pages/RolesList';
import SuperAdminLayout from './components/layout/SuperAdminLayout';
import PermissionGate from './components/PermissionGate';
import ErrorBoundary from './components/ErrorBoundary';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/superadmin/*" element={
              <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/roles" element={
              <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
                <SuperAdminLayout>
                  <PermissionGate permission="role.view">
                    <RolesList />
                  </PermissionGate>
                </SuperAdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/companydashboard/*" element={
              <ProtectedRoute>
                <CompanyDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employeedashboard/*" element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employeedashboard/profile" element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            } />
            <Route path="/orgdashboard/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/orgdashboard/*" element={
              <ProtectedRoute>
                <OrgDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
