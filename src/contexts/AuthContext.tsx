'use client'

import { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初期認証状態の確認
  useEffect(() => {
    const authToken = Cookies.get('auth-token');
    setIsAuthenticated(!!authToken);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const expectedUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
      const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

      if (!expectedUsername || !expectedPassword) {
        console.error('Authentication credentials are not properly configured');
        return false;
      }

      if (username === expectedUsername && password === expectedPassword) {
        // 認証トークンを生成（実際のプロジェクトではより安全な方法を使用）
        const token = btoa(`${username}:${Date.now()}`);
        
        // Cookieに保存（7日間有効）
        Cookies.set('auth-token', token, { expires: 7, secure: true });
        
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('auth-token');
    setIsAuthenticated(false);
    router.push('/admin/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};