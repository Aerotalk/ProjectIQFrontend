import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OrgDashboard from './pages/OrgDashboard';
import Profile from './pages/Profile';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/superadmin/*" element={<SuperAdminDashboard />} />
        <Route path="/orgdashboard/profile" element={<Profile />} />
        <Route path="/orgdashboard/*" element={<OrgDashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

