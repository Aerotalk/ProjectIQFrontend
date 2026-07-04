import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const rolesString = localStorage.getItem('roles');
  const roles = rolesString ? JSON.parse(rolesString) : [];
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = roles.some((role: string) => allowedRoles.includes(role));
    if (!hasRole) {
      if (roles.includes('ROLE_SUPER_ADMIN')) {
        return <Navigate to="/superadmin/organizations" replace />;
      }
      return <Navigate to="/orgdashboard" replace />;
    }
  }

  return <>{children}</>;
}
