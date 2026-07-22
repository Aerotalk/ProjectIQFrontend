import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import FunkyLoader from './ui/FunkyLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermission?: string;
}

export default function ProtectedRoute({ children, allowedRoles, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { can, hasRole } = usePermissions();
  const location = useLocation();

  if (isLoading) {
    return <FunkyLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(role => hasRole(role));
    if (!hasAllowedRole) {
      if (hasRole('ROLE_SUPER_ADMIN')) {
        return <Navigate to="/superadmin/organizations" replace />;
      }
      return <Navigate to="/orgdashboard" replace />;
    }
  }

  if (requiredPermission && !can(requiredPermission)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50 dark:bg-[#0f1115]">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">403 Forbidden</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">You do not have permission to access this page.</p>
        <button 
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-[#792359] text-white rounded-sm hover:bg-[#52173c] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
