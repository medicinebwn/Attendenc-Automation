import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/client';

interface UserProfile {
  username: string;
  name: string;
  role: 'Super Admin' | 'HR Admin' | 'Company Admin';
  email: string;
  companyName: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isSupabaseLive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('attendance_auth_user');
    return saved ? JSON.parse(saved) : {
      username: 'admin',
      name: 'System Super Admin',
      role: 'Super Admin',
      email: 'admin@enterprise-hrms.com',
      companyName: 'Global Enterprise HQ',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('attendance_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('attendance_auth_user');
    }
  }, [user]);

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    // 1. Check development temporary admin credentials
    if (usernameInput.trim().toLowerCase() === 'admin' && passwordInput === 'admin@1234') {
      setUser({
        username: 'admin',
        name: 'System Super Admin',
        role: 'Super Admin',
        email: 'admin@enterprise-hrms.com',
        companyName: 'Global Enterprise HQ',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
      return true;
    }

    // 2. Try Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: usernameInput,
          password: passwordInput,
        });
        if (!error && data.user) {
          setUser({
            username: data.user.email?.split('@')[0] || 'admin',
            name: data.user.user_metadata?.full_name || 'Enterprise Admin',
            role: 'Super Admin',
            email: data.user.email || 'admin@enterprise-hrms.com',
            companyName: 'Apex Technology Systems',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          });
          return true;
        }
      } catch (err) {
        console.warn('Supabase Auth attempt failed', err);
      }
    }

    return false;
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isSupabaseLive: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
