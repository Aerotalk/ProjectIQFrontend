import { useAuth } from '../contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  const can = (permissionString: string): boolean => {
    if (!user) {
      return false;
    }
    
    // Temporarily hardcode roles for menu visibility until backend permissions are ready
    if (user.roles?.includes('ROLE_SUPER_ADMIN') || user.roles?.includes('ROLE_ORG_ADMIN')) {
      return true;
    }

    if (user.roles?.includes('ROLE_COMPANY_ADMIN')) {
      if (permissionString.startsWith('ticket.') || permissionString.startsWith('finance.') || permissionString.startsWith('sales.')) {
        return true;
      }
    }

    return user.effectivePermissions?.includes(permissionString) || false;
  };

  const hasRole = (roleName: string): boolean => {
    if (!user || !user.roles) {
      return false;
    }
    return user.roles.includes(roleName);
  };

  return { can, hasRole };
}
