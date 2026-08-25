import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers } from '../data/users';
import { initialInstitutions } from '../data/institutions';
import { STORAGE_KEYS, USER_ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return saved ? JSON.parse(saved) : initialUsers[0]; // Default to Institution Admin (Prof. Rajesh Sharma)
    } catch {
      return initialUsers[0];
    }
  });

  const [institution, setInstitution] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
      if (currentUser.institutionId) {
        const found = initialInstitutions.find(i => i.id === currentUser.institutionId);
        setInstitution(found || null);
      } else {
        setInstitution(null);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      setInstitution(null);
    }
  }, [currentUser]);

  const login = (email, role = USER_ROLES.INSTITUTION) => {
    const user = initialUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0].toUpperCase(),
      role,
      institutionId: role === USER_ROLES.INSTITUTION ? 'inst-nitr-001' : null,
      institutionName: role === USER_ROLES.INSTITUTION ? 'National Institute of Technology Rourkela' : 'VeriChain Network',
      designation: 'Authorized Representative',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setCurrentUser(user);
    return user;
  };

  const switchRole = (role) => {
    const matched = initialUsers.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        institution,
        login,
        switchRole,
        logout,
        isAuthenticated: !!currentUser,
        isInstitution: currentUser?.role === USER_ROLES.INSTITUTION,
        isAdmin: currentUser?.role === USER_ROLES.ADMIN,
        isVerifier: currentUser?.role === USER_ROLES.VERIFIER,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
