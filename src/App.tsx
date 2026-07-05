import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OrgDashboard from './pages/OrgDashboard';
import Profile from './pages/Profile';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CompanyDashboard from './pages/CompanyDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeProfile from './pages/EmployeeProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/superadmin/*" element={
          <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
            <SuperAdminDashboard />
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
    </BrowserRouter>
  );
}

export default App;

