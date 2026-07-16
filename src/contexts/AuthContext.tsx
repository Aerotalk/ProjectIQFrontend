import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../lib/api';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  organizationId: string | null;
  organizationName: string | null;
  companyId: string | null;
  companyName: string | null;
  effectivePermissions: string[];
  profilePhotoId: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const userData = await api.get('/auth/me');
      setUser(userData);
      if (userData.companyId) {
        setSelectedCompanyId(userData.companyId);
      }
    } catch (error) {
      setUser(null);
      setSelectedCompanyId(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await fetchUser();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    if (userData.companyId) {
      setSelectedCompanyId(userData.companyId);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      setSelectedCompanyId(null);
      window.location.href = '/login';
    }
  };

  const refetchUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refetchUser,
      selectedCompanyId,
      setSelectedCompanyId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
