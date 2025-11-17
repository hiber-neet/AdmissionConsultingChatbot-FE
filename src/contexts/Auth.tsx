// src/contexts/auth.tsx
import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { Permission, hasPermission, getRolePermissions } from "@/constants/permissions";

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
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
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
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async (email: string, password: string) => {
    // giả lập độ trễ
    await new Promise((r) => setTimeout(r, 400));

    const acc = ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!acc) return { ok: false, message: "Email không tồn tại." };
    if (acc.password !== password) return { ok: false, message: "Mật khẩu không đúng." };

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
    return { ok: true };
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
  };

  // Check if current user has a permission
  const checkPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission, user.isLeader);
  };

  // Function to toggle leadership for testing
  const setUserLeadership = (isLeader: boolean) => {
    if (!user) return;
    const updatedPermissions = getRolePermissions(user.role, isLeader);
    const updatedUser = { 
      ...user, 
      isLeader, 
      permissions: updatedPermissions 
    };
    setUser(updatedUser);
    sessionStorage.setItem("demo_user", JSON.stringify(updatedUser));
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
