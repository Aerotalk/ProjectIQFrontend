import { usePermissions } from '../hooks/usePermissions';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  role?: string;
  fallback?: React.ReactNode;
}

export default function PermissionGate({ children, permission, role, fallback = null }: PermissionGateProps) {
  const { can, hasRole } = usePermissions();

  let hasAccess = true;

  if (permission && !can(permission)) {
    hasAccess = false;
  }

  if (role && !hasRole(role)) {
    hasAccess = false;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
