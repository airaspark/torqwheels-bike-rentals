import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { AuthService } from '../services/auth.service';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  drivingLicenceNumber: string;
  password?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthenticating: boolean;
  login: (email: string, password?: string) => Promise<User | null>;
  register: (
    dataOrName: RegisterPayload | string,
    email?: string,
    phone?: string,
    licenceNumber?: string,
    password?: string
  ) => Promise<User | null>;
  logout: () => Promise<void>;
  loginAsDemoCustomer: () => Promise<User>;
  loginAsAdmin: () => Promise<User>;
  loginAsDemo: (role: 'customer' | 'admin') => Promise<User>;
  switchUserRole: (targetRole?: 'customer' | 'admin') => Promise<User | null>;
  updateProfile: (data: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  useEffect(() => {
    AuthService.init();
    const unsubscribe = AuthService.subscribe((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password?: string) => {
    setIsAuthenticating(true);
    try {
      const u = await AuthService.login(email, password);
      return u;
    } catch {
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async (
    dataOrName: RegisterPayload | string,
    email?: string,
    phone?: string,
    licence?: string,
    pass?: string
  ) => {
    setIsAuthenticating(true);
    try {
      if (typeof dataOrName === 'object') {
        const u = await AuthService.register(
          dataOrName.name,
          dataOrName.email,
          dataOrName.phone,
          dataOrName.drivingLicenceNumber,
          dataOrName.password
        );
        return u;
      } else {
        const u = await AuthService.register(dataOrName, email || '', phone || '', licence || '', pass);
        return u;
      }
    } catch {
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
  };

  const loginAsDemoCustomer = async () => {
    return AuthService.loginAsDemoCustomer();
  };

  const loginAsAdmin = async () => {
    return AuthService.loginAsAdmin();
  };

  const loginAsDemo = async (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      return AuthService.loginAsAdmin();
    }
    return AuthService.loginAsDemoCustomer();
  };

  const switchUserRole = async (targetRole?: 'customer' | 'admin') => {
    if (!currentUser) return null;
    const newRole = targetRole || (currentUser.role === 'admin' ? 'customer' : 'admin');
    const updated = await AuthService.updateProfile({ role: newRole });
    setCurrentUser(updated);
    return updated;
  };

  const updateProfile = async (data: Partial<User>) => {
    const updated = await AuthService.updateProfile(data);
    setCurrentUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        isLoading,
        isAuthenticating,
        login,
        register,
        logout,
        loginAsDemoCustomer,
        loginAsAdmin,
        loginAsDemo,
        switchUserRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
