// src/contexts/auth.tsx
import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { Permission, hasPermission, getRolePermissions } from "@/constants/permissions";
import { authAPI } from '../services/fastapi';
import { getRoleFromToken } from '../pages/login/jwtHelper';

export type Role = "SYSTEM_ADMIN" | "CONSULTANT" | "CONTENT_MANAGER" | "ADMISSION_OFFICER" | "STUDENT";

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
  getDefaultRoute: (role: Role) => string; // Add this new function
};

/** Tài khoản mẫu (có thể đổi sau này) */
type Account = { email: string; password: string; name: string; role: Role; isLeader?: boolean };
const ACCOUNTS: Account[] = [
  { email: "admin@gmail.com",     password: "123",   name: "dat",   role: "SYSTEM_ADMIN", isLeader: true },
  { email: "consultant@gmail.com",password: "123",    name: "hoang",       role: "CONSULTANT", isLeader: false },
  { email: "content@gmail.com",   password: "123", name: "hieu",     role: "CONTENT_MANAGER", isLeader: false },
  { email: "officer@gmail.com",   password: "123", name: "khoa", role: "ADMISSION_OFFICER", isLeader: false },
  { email: "student@gmail.com",   password: "123", name: "student", role: "STUDENT", isLeader: false },
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

      // Decode token to get user_id
      try {
        const payload = JSON.parse(atob(access_token.split(".")[1]));
        const userId = payload.user_id;
        const userEmail = payload.sub;
        
        // Temporary: Map email patterns to roles until backend profile endpoint is fixed
        let appRole: Role = "STUDENT"; // default fallback
        let isLeader = false;
        
        if (userEmail.includes('admin')) {
          appRole = "SYSTEM_ADMIN";
          isLeader = true;
        } else if (userEmail.includes('consultant')) {
          appRole = "CONSULTANT";
          isLeader = false; // Can be updated based on your needs
        } else if (userEmail.includes('content')) {
          appRole = "CONTENT_MANAGER";
          isLeader = false;
        } else if (userEmail.includes('officer')) {
          appRole = "ADMISSION_OFFICER";
          isLeader = false;
        } else {
          appRole = "STUDENT";
        }
        
        if (userId) {
          // Try to fetch user profile (optional - if it fails, we use email-based role)
          try {
            const profileResponse = await fetch(`http://localhost:8000/profile/${userId}`, {
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              console.log('Profile data:', profileData);
              
              // Override with backend role if available
              if (profileData.role_name) {
                const roleMapping: Record<string, Role> = {
                  'SYSTEM_ADMIN': 'SYSTEM_ADMIN',
                  'CONSULTANT': 'CONSULTANT', 
                  'CONTENT_MANAGER': 'CONTENT_MANAGER',
                  'ADMISSION_OFFICER': 'ADMISSION_OFFICER',
                  'STUDENT': 'STUDENT'
                };
                appRole = roleMapping[profileData.role_name] || appRole;
              }

              // Override leadership status if available
              if (profileData.consultant_profile?.is_leader) isLeader = true;
              if (profileData.content_manager_profile?.is_leader) isLeader = true;
              
              console.log('✅ Using backend profile data');
            } else {
              console.log('⚠️ Profile API failed, using email-based role mapping');
            }
          } catch (profileError) {
            console.log('⚠️ Profile fetch failed, using email-based role mapping:', profileError);
          }
            
          const userData: User = {
            id: userId.toString(),
            name: userEmail.split('@')[0],
            role: appRole,
            email: userEmail,
            isLeader: isLeader,
            permissions: getRolePermissions(appRole)
          };

          setUser(userData);
          sessionStorage.setItem("demo_user", JSON.stringify(userData));

          console.log("🎉 LOGIN SUCCESS!");
          console.log("👤 User Info:", {
            name: userData.name,
            role: userData.role,
            email: userData.email,
            isLeader: userData.isLeader
          });

          return { ok: true, token: access_token };
        }
      } catch (tokenError) {
        console.error('Error decoding token:', tokenError);
      }

      // Fallback if profile fetch fails - use basic info from token
      const userData: User = {
        id: email, 
        name: email.split('@')[0],
        role: "STUDENT", // Safe default
        email: email,
        isLeader: false,
        permissions: getRolePermissions("STUDENT")
      };

      setUser(userData);
      sessionStorage.setItem("demo_user", JSON.stringify(userData));

      console.log("⚠️ LOGIN SUCCESS (with fallback role)");
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

  // Helper function to map JWT token roles to app roles
  const mapTokenRoleToAppRole = (tokenRole: string | null): Role | null => {
    if (!tokenRole) return null;
    
    const roleMappings: Record<string, Role> = {
      'admin': 'SYSTEM_ADMIN',
      'system_admin': 'SYSTEM_ADMIN',
      'consultant': 'CONSULTANT', 
      'content_manager': 'CONTENT_MANAGER',
      'content': 'CONTENT_MANAGER',
      'admission_officer': 'ADMISSION_OFFICER',
      'officer': 'ADMISSION_OFFICER',
      'student': 'STUDENT'
    };
    
    return roleMappings[tokenRole.toLowerCase()] || null;
  };

  // Get default route based on user role
  const getDefaultRoute = (role: Role): string => {
    const roleRoutes: Record<Role, string> = {
      'SYSTEM_ADMIN': '/admin/dashboard',
      'CONTENT_MANAGER': '/content/dashboard',
      'CONSULTANT': '/consultant',
      'ADMISSION_OFFICER': '/admission/dashboard',
      'STUDENT': '/profile'
    };
    
    return roleRoutes[role] || '/';
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

    // Log demo login info to console
    console.log("🎭 DEMO LOGIN!");
    console.log("👤 Demo User Info:", {
      name: u.name,
      email: u.email,
      role: u.role,
      isLeader: u.isLeader,
      permissions: u.permissions
    });
    console.log("🚀 Default route:", getDefaultRoute(u.role));
  };

  const logout = () => {
    console.log('🚪 Logging out user...');
    
    // Optional: Notify backend of logout (best practice)
    const token = localStorage.getItem("access_token");
    if (token) {
      authAPI.logout().catch(err => {
        console.warn('Backend logout failed (proceeding anyway):', err);
      });
    }
    
    // Clear user state
    setUser(null);
    
    // Clear authentication tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    
    // Clear user session data
    sessionStorage.removeItem("demo_user");
    sessionStorage.removeItem("token"); // Legacy token storage
    
    // Clear user-specific RIASEC data (if any)
    // Note: We don't clear guest data as that should persist for anonymous users
    const userId = user?.id;
    if (userId) {
      localStorage.removeItem(`riasec_result_${userId}`);
    }
    
    // Clear any other user-specific cached data
    const userProfileKey = user?.id ? `user_profile_${user.id}` : null;
    if (userProfileKey) {
      localStorage.removeItem(userProfileKey);
    }
    
    // Optional: Clear any application cache if using service workers
    if ('serviceWorker' in navigator && 'caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('auth') || cacheName.includes('user')) {
            caches.delete(cacheName);
          }
        });
      }).catch(err => console.warn('Cache cleanup failed:', err));
    }
    
    // Force reload to clear any remaining application state
    // Optional: Only if you want to completely refresh the app
    setTimeout(() => {
      window.location.href = '/loginforad';
    }, 100);
    
    console.log('✅ Logout complete - all user data cleared');
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
      setUserLeadership,
      getDefaultRoute
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