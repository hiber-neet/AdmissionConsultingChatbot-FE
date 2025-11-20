// src/contexts/auth.tsx
import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { Permission, hasPermission, getRolePermissions } from "@/constants/permissions";
import { authAPI } from '../services/fastapi';

export type Role = "SYSTEM_ADMIN" | "CONSULTANT" | "CONTENT_MANAGER" | "ADMISSION_OFFICER";

export type User = {
  id: string;
  name: string;
  role: Role;
  email: string;
  isLeader?: boolean;
  permissions?: Permission[];
};

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string; token?: string }>;
  loginAs: (role: Role) => void; // demo switch nhanh (giữ lại)
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  setUserLeadership: (isLeader: boolean) => void; // for testing leadership
};

/** Tài khoản mẫu (có thể đổi sau này) */
type Account = { email: string; password: string; name: string; role: Role; isLeader?: boolean };
const ACCOUNTS: Account[] = [
  { email: "admin@gmail.com",     password: "123",   name: "dat",   role: "SYSTEM_ADMIN", isLeader: true },
  { email: "consultant@gmail.com",password: "123",    name: "hoang",       role: "CONSULTANT", isLeader: false },
  { email: "content@gmail.com",   password: "123", name: "hieu",     role: "CONTENT_MANAGER", isLeader: false },
  { email: "officer@gmail.com",   password: "123", name: "khoa", role: "ADMISSION_OFFICER", isLeader: false },
];

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // khôi phục từ sessionStorage cho demo
  useEffect(() => {
    const raw = sessionStorage.getItem("demo_user");
    if (raw) {
      const storedUser = JSON.parse(raw);
      console.log('Loading user from sessionStorage:', storedUser);
      setUser(storedUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with FastAPI...');
      
      // Call FastAPI login endpoint
      const response = await authAPI.login({ 
        email: email.trim(), 
        password 
      });

      console.log('Login response:', response);
      
      // Extract token from response
      const { access_token, token_type } = response as any;
      
      if (!access_token) {
        return { ok: false, message: "No access token received" };
      }

      // Store token in localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("token_type", token_type || "bearer");

      // Create user object based on email (simplified approach)
      const userData: User = {
        id: email, // Use email as ID for now
        name: email.split('@')[0], // Extract name from email
        role: "CONTENT_MANAGER", // Default role, can be enhanced later
        email: email,
        isLeader: false,
        permissions: getRolePermissions("CONTENT_MANAGER")
      };

      setUser(userData);
      sessionStorage.setItem("demo_user", JSON.stringify(userData));

      return { ok: true, token: access_token };

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle FastAPI error responses
      if (error.message) {
        return { ok: false, message: error.message };
      }
      
      return { ok: false, message: "Login failed. Please check your credentials." };
    }
  };

  // Giữ lại tiện ích "loginAs(role)" để test nhanh
  const loginAs = (role: Role) => {
    const acc = ACCOUNTS.find((a) => a.role === role)!;
    
    const userPermissions = getRolePermissions(acc.role, acc.isLeader);
    
    const u: User = { 
      id: crypto.randomUUID(), 
      name: acc.name, 
      role: acc.role, 
      email: acc.email,
      isLeader: acc.isLeader,
      permissions: userPermissions
    };
    setUser(u);
    sessionStorage.setItem("demo_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("demo_user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
  };

  // Check if current user has a permission
  const checkPermission = (permission: Permission): boolean => {
    if (!user || !user.permissions) return false;
    const hasPermissionResult = user.permissions.includes(permission);
    console.log(`Checking permission ${permission}:`, hasPermissionResult, 'Available:', user.permissions);
    return hasPermissionResult;
  };

  // Function to toggle leadership for testing
  const setUserLeadership = (isLeader: boolean) => {
    console.log('setUserLeadership called with:', isLeader);
    console.log('Current user before update:', user);
    
    if (!user) {
      console.log('No user found, cannot toggle leadership');
      return;
    }
    
    // Fixed permission sets for testing
    let updatedPermissions: Permission[];
    
    if (user.role === 'CONSULTANT') {
      if (isLeader) {
        updatedPermissions = [
          "VIEW_CONSULTANT_OVERVIEW",
          "VIEW_ANALYTICS", 
          "MANAGE_KNOWLEDGE_BASE",
          "CREATE_QA_TEMPLATE",
          "EDIT_QA_TEMPLATE",
          "DELETE_QA_TEMPLATE",
          "APPROVE_QA_TEMPLATE",
          "MANAGE_DOCUMENTS",
          "OPTIMIZE_CONTENT"
        ];
      } else {
        updatedPermissions = [
          "VIEW_CONSULTANT_OVERVIEW",
          "VIEW_ANALYTICS",
          "MANAGE_KNOWLEDGE_BASE", 
          "CREATE_QA_TEMPLATE",
          "EDIT_QA_TEMPLATE",
          "MANAGE_DOCUMENTS",
          "OPTIMIZE_CONTENT"
        ];
      }
    } else if (user.role === 'CONTENT_MANAGER') {
      if (isLeader) {
        updatedPermissions = [
          "VIEW_CONTENT_DASHBOARD",
          "MANAGE_ARTICLES",
          "CREATE_ARTICLE",
          "EDIT_ARTICLE",
          "DELETE_ARTICLE",
          "PUBLISH_ARTICLE",
          "REVIEW_CONTENT",
          "MANAGE_RIASEC",
          "VIEW_ARTICLE_ANALYTICS"
        ];
      } else {
        updatedPermissions = [
          "VIEW_CONTENT_DASHBOARD",
          "MANAGE_ARTICLES",
          "CREATE_ARTICLE",
          "EDIT_ARTICLE",
          "VIEW_ARTICLE_ANALYTICS"
        ];
      }
    } else {
      // For other roles, use the existing function
      updatedPermissions = getRolePermissions(user.role, isLeader);
    }
    
    const updatedUser = { 
      ...user, 
      isLeader, 
      permissions: updatedPermissions 
    };
    
    console.log('Toggling role:', { 
      from: { isLeader: user.isLeader, permissions: user.permissions?.length || 0 },
      to: { isLeader, permissions: updatedPermissions.length }
    });
    
    console.log('Setting updated user:', updatedUser);
    setUser(updatedUser);
    sessionStorage.setItem("demo_user", JSON.stringify(updatedUser));
    console.log('User updated and saved to sessionStorage');
  };

  const value = useMemo(
    () => ({ 
      user, 
      isAuthenticated: !!user, 
      login, 
      loginAs, 
      logout, 
      hasPermission: checkPermission,
      setUserLeadership
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}