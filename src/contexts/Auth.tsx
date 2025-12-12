// src/contexts/auth.tsx
import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { Permission, hasPermission as checkPermission, initializePermissions, type Role } from "@/constants/permissions";
import { authAPI } from '../services/fastapi';
import { API_CONFIG } from '../config/api.js';
import { getRoleFromToken } from '../pages/login/jwtHelper';

// Re-export Role type for backward compatibility
export type { Role };

export type User = {
  id: string;
  name: string;
  role: Role;
  email: string;
  isLeader?: boolean;
  consultantIsLeader?: boolean; // Specific consultant leadership flag
  contentManagerIsLeader?: boolean; // Specific content manager leadership flag
  permissions?: Permission[];
};

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeRole: Role | null;
  //THÊM `role?: Role` vào kiểu trả về
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; message?: string; token?: string; role?: Role }>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  isContentManagerLeader: () => boolean;
  isConsultantLeader: () => boolean;
  getDefaultRoute: (role: Role) => string;
  switchToRole: (role: Role) => void;
  getAccessibleRoles: () => Role[];
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as loading during restoration

  // Function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return true;
      }
      return false;
    } catch {
      return true; // If token can't be decoded, consider it expired
    }
  };

  // Function to logout user
  const performLogout = () => {
    console.log('🚪 Logging out user - clearing session');
    setUser(null);
    setActiveRole(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    
    // Redirect to login page
    window.location.href = '/login';
  };

  // Active token validation - check every minute
  useEffect(() => {
    if (!user) return; // Don't check if user isn't logged in

    const checkTokenValidity = () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        console.log('⚠️ Token missing - logging out');
        performLogout();
        return;
      }

      if (isTokenExpired(token)) {
        console.log('⏰ Token expired - logging out');
        performLogout();
        return;
      }
    };

    // Check immediately
    checkTokenValidity();

    // Set up interval to check every minute (60000ms)
    const intervalId = setInterval(checkTokenValidity, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [user]);

  // Restore user session from localStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        console.log('🔓 No token found in localStorage - user not logged in');
        setIsLoading(false);
        return;
      }

      console.log('🔄 Restoring user session from localStorage...');

      try {
        // Decode token to get user information
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log('🔍 JWT Payload decoded:', payload);
        
        const userId = payload.user_id;
        const userEmail = payload.sub;
        
        if (!userId || !userEmail) {
          console.error('❌ Invalid token in localStorage - clearing session');
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          console.log('⏰ Token expired - clearing session');
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");
          setIsLoading(false);
          return;
        }

        console.log('👤 Restoring user info from token:', { userId, userEmail });
        
        // Fetch user profile to restore full user data
        try {
          const profileResponse = await fetch(`${API_CONFIG.FASTAPI_BASE_URL}/profile/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log('✅ Profile restored:', profileData);
            
            // Map backend permissions to frontend permissions
            const mapBackendPermissionToFrontend = (backendPermission: string): Permission[] => {
              const permissionMap: Record<string, Permission[]> = {
                'Admin': ['Admin', 'Content Manager', 'Admission Official', 'Consultant', 'Student'],
                'Content Manager': ['Content Manager', 'Student'],
                'Admission Official': ['Admission Official', 'Student'],
                'Consultant': ['Consultant', 'Student'],
                'Student': ['Student']
              };
              
              return permissionMap[backendPermission] || ['Student'];
            };
            
            // Get permissions from profile
            let userPermissions: Permission[] = ['Student'];
            if (profileData.permission && Array.isArray(profileData.permission)) {
              userPermissions = profileData.permission.flatMap((perm: string) => 
                mapBackendPermissionToFrontend(perm)
              );
              userPermissions = Array.from(new Set(userPermissions));
            }
            
            // Determine role from permissions
            let appRole: Role = "Student";
            if (userPermissions.includes('Admin')) {
              appRole = "Admin";
            } else if (userPermissions.includes('Content Manager')) {
              appRole = "Content Manager";
            } else if (userPermissions.includes('Admission Official')) {
              appRole = "Admission Official";
            } else if (userPermissions.includes('Consultant')) {
              appRole = "Consultant";
            }
            
            // Get leadership status
            let isLeader = false;
            if (profileData.consultant_is_leader === true) {
              isLeader = true;
            }
            if (profileData.content_manager_is_leader === true) {
              isLeader = true;
            }
            if (profileData.role_name === 'admin') {
              isLeader = true;
            }
            
            const userData: User = {
              id: userId.toString(),
              name: profileData.full_name || userEmail.split('@')[0],
              role: appRole,
              email: profileData.email || userEmail,
              isLeader: isLeader,
              consultantIsLeader: profileData.consultant_is_leader === true,
              contentManagerIsLeader: profileData.content_manager_is_leader === true,
              permissions: userPermissions
            };

            setUser(userData);
            setActiveRole(userData.role);
            console.log('✅ Session restored successfully!');
            
          } else {
            console.log('❌ Profile API failed during restore - token may be invalid');
            localStorage.removeItem("access_token");
            localStorage.removeItem("token_type");
          }
        } catch (error) {
          console.error('❌ Error restoring session:', error);
          // Keep user logged out on error
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");
        }
      } catch (error) {
        console.error('❌ Error decoding token:', error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login with FastAPI...');
      console.log('📧 Email:', email.trim());
      
      // Call FastAPI login endpoint
      const response = await authAPI.login({ 
        email: email.trim(), 
        password 
      });

      console.log('✅ Login response received:', response);
      
      // Extract token from response
      const { access_token, token_type } = response as any;
      
      if (!access_token) {
        console.error('❌ No access token in response');
        return { ok: false, message: "No access token received" };
      }

      console.log('🎫 Token received:', {
        token_preview: access_token.substring(0, 20) + '...',
        token_type: token_type || 'bearer'
      });

      // Store token in localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("token_type", token_type || "bearer");
      
      console.log('💾 Token stored in localStorage');

      // Decode token to get user information
      try {
        const payload = JSON.parse(atob(access_token.split(".")[1]));
        console.log('🔍 JWT Payload decoded:', payload);
        
        const userId = payload.user_id;
        const userEmail = payload.sub;
        
        if (!userId || !userEmail) {
          console.error('❌ Invalid token payload - missing user_id or email');
          return { ok: false, message: "Invalid token format" };
        }
        
        console.log('👤 User info from token:', {
          userId,
          userEmail
        });
        
        // Temporary: Map email patterns to roles until backend profile endpoint is fixed
        let appRole: Role = "Student"; // default fallback
        let isLeader = false;
        
        if (userEmail.includes('admin')) {
          appRole = "Admin";
          isLeader = true;
        } else if (userEmail.includes('consultant')) {
          appRole = "Consultant";
          isLeader = false; // Can be updated based on your needs
        } else if (userEmail.includes('content')) {
          appRole = "Content Manager";
          isLeader = false;
        } else if (userEmail.includes('officer')) {
          appRole = "Admission Official";
          isLeader = false;
        } else {
          appRole = "Student";
        }
        
        if (userId) {
          // Fetch user profile to get dynamic permissions
          try {
            console.log('🔍 Fetching user profile for dynamic permissions...');
            const profileResponse = await fetch(`${API_CONFIG.FASTAPI_BASE_URL}/profile/${userId}`, {
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              console.log('✅ Profile data received:', profileData);
              
              // Map backend permissions to frontend permissions
              const mapBackendPermissionToFrontend = (backendPermission: string): Permission[] => {
                const permissionMap: Record<string, Permission[]> = {
                  'Admin': ['Admin', 'Content Manager', 'Admission Official', 'Consultant', 'Student'],
                  'Content Manager': ['Content Manager', 'Student'],
                  'Admission Official': ['Admission Official', 'Student'],
                  'Consultant': ['Consultant', 'Student'],
                  'Student': ['Student']
                };
                
                return permissionMap[backendPermission] || ['Student'];
              };
              
              // Get permissions from profile
              let userPermissions: Permission[] = ['Student']; // default
              if (profileData.permission && Array.isArray(profileData.permission)) {
                userPermissions = profileData.permission.flatMap((perm: string) => 
                  mapBackendPermissionToFrontend(perm)
                );
                // Remove duplicates
                userPermissions = Array.from(new Set(userPermissions));
              }
              
              console.log('🔑 Mapped permissions:', userPermissions);
              
              // Determine role from permissions (highest permission becomes primary role)
              if (userPermissions.includes('Admin')) {
                appRole = "Admin";
              } else if (userPermissions.includes('Content Manager')) {
                appRole = "Content Manager";
              } else if (userPermissions.includes('Admission Official')) {
                appRole = "Admission Official";
              } else if (userPermissions.includes('Consultant')) {
                appRole = "Consultant";
              } else {
                appRole = "Student";
              }
              
              // Get leadership status from explicit flags
              if (profileData.consultant_is_leader === true) {
                isLeader = true;
              }
              if (profileData.content_manager_is_leader === true) {
                isLeader = true;
              }
              if (profileData.role_name === 'admin') {
                isLeader = true; // Admins are always leaders
              }
              
              const userData: User = {
                id: userId.toString(),
                name: profileData.full_name || userEmail.split('@')[0],
                role: appRole,
                email: profileData.email || userEmail,
                isLeader: isLeader,
                consultantIsLeader: profileData.consultant_is_leader === true,
                contentManagerIsLeader: profileData.content_manager_is_leader === true,
                permissions: userPermissions // Use dynamic permissions from backend
              };

              setUser(userData);
              setActiveRole(userData.role); // Set active role to primary role

              console.log("LOGIN SUCCESS with dynamic permissions!");
              console.log("User Info:", {
                name: userData.name,
                role: userData.role,
                email: userData.email,
                isLeader: userData.isLeader,
                permissions: userData.permissions
              });

              return { ok: true, token: access_token, role: userData.role };
              
            } else {
              console.log('Profile API failed, using email-based role mapping');
              throw new Error('Profile API failed');
            }
          } catch (profileError) {
            console.log('Profile fetch failed, falling back to email-based role mapping:', profileError);
            
            // Create fallback permissions based on role
            const getFallbackPermissions = (role: Role): Permission[] => {
              switch (role) {
                case "Admin":
                  return ["Admin", "Content Manager", "Admission Official", "Consultant", "Student"];
                case "Content Manager":
                  return ["Content Manager", "Student"];
                case "Admission Official":
                  return ["Admission Official", "Student"];
                case "Consultant":
                  return ["Consultant", "Student"];
                case "Student":
                case "Parent":
                default:
                  return ["Student"];
              }
            };
            
            const userData: User = {
              id: userId.toString(),
              name: userEmail.split('@')[0],
              role: appRole,
              email: userEmail,
              isLeader: isLeader,
              consultantIsLeader: false, // Default to false when profile fails
              contentManagerIsLeader: false, // Default to false when profile fails
              permissions: getFallbackPermissions(appRole) // Fallback to role-based permissions
            };

            setUser(userData);
            setActiveRole(userData.role); // Set active role to primary role

            console.log("⚠️ LOGIN SUCCESS with fallback permissions!");
            return { ok: true, token: access_token, role: userData.role };
          }
        }
      } catch (tokenError) {
        console.error('Error decoding token:', tokenError);
      }

      // Fallback if profile fetch fails - use basic info from token
      const userData: User = {
        id: email, 
        name: email.split('@')[0],
        role: "Student", // Safe default
        email: email,
        isLeader: false,
        permissions: ["Student"] // Safe fallback
      };

      setUser(userData);
      setActiveRole(userData.role); // Set active role to primary role

      console.log("⚠️ LOGIN SUCCESS (with fallback role)");
return { ok: true, token: access_token, role: userData.role };

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle FastAPI error responses
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (error.message) {
        errorMessage = error.message;
        // Check if it's a ban/deactivation error
        if (error.message.includes('deactivated') || error.message.includes('Inactive')) {
          errorMessage = "⚠️ Your account has been deactivated. Please contact the administrator.";
        }
      }
      
      return { ok: false, message: errorMessage };
    }
  };

  // Helper function to map JWT token roles to app roles
  const mapTokenRoleToAppRole = (tokenRole: string | null): Role | null => {
    if (!tokenRole) return null;
    
    const roleMappings: Record<string, Role> = {
      'admin': 'Admin',
      'system_admin': 'Admin',
      'consultantleader': 'ConsultantLeader',
      'consultant_leader': 'ConsultantLeader',
      'consultant': 'Consultant', 
      'content_manager': 'Content Manager',
      'content': 'Content Manager',
      'admission_officer': 'Admission Official',
      'officer': 'Admission Official',
      'student': 'Student'
    };
    
    return roleMappings[tokenRole.toLowerCase()] || null;
  };

  // Get default route based on user role
  const getDefaultRoute = (role: Role): string => {
    const roleRoutes: Record<Role, string> = {
      'Admin': '/admin/dashboard',
      'ConsultantLeader': '/consultant',
      'Content Manager': '/content/dashboard',
      'Consultant': '/consultant',
      'Admission Official': '/admission/dashboard',
      'Student': '/profile',
      'Parent': '/profile'
    };
    
    return roleRoutes[role] || '/';
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
    setActiveRole(null); // Clear active role
    
    // Clear authentication tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    
    // Clear user session data
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

    // Determine redirect URL based on user role
    const staffRoles = ['Admin', 'Consultant', 'Content Manager', 'Admission Official'];
    const redirectUrl = user?.role && staffRoles.includes(user.role) ? '/loginforad' : '/loginprivate';
    
    // Force reload to clear any remaining application state
    // Optional: Only if you want to completely refresh the app
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 100);
    
    console.log('Logout complete - all user data cleared');
  };

  // Check if current user has a permission
  const checkUserPermission = (permission: Permission): boolean => {
    if (!user || !user.permissions) return false;
    return checkPermission(user.permissions, permission);
  };

  // Check if user is Content Manager Leader
  const isContentManagerLeader = (): boolean => {
    if (!user) return false;
    
    // Admin bypasses leader check (same as backend)
    if (checkUserPermission('Admin')) return true;
    
    // Must be Content Manager AND have content manager leadership status
    return checkUserPermission('Content Manager') && user.contentManagerIsLeader === true;
  };

  // Check if user is Consultant Leader
  const isConsultantLeader = (): boolean => {
    if (!user) return false;
    
    // Admin bypasses leader check (same as backend)
    if (checkUserPermission('Admin')) return true;
    
    // Must be Consultant AND have consultant leadership status
    return checkUserPermission('Consultant') && user.consultantIsLeader === true;
  };

  // Function to switch active role for navigation
  const switchToRole = (role: Role) => {
    if (!user?.permissions) return;
    
    // Check if user has permission for this role
    const accessibleRoles = getAccessibleRoles();
    if (accessibleRoles.includes(role)) {
      setActiveRole(role);
      console.log('Switched active role to:', role);
    } else {
      console.warn('User does not have permission for role:', role);
    }
  };

  // Function to get all roles user can access based on permissions
  const getAccessibleRoles = (): Role[] => {
    if (!user?.permissions) return [];
    
    const roles: Role[] = [];
    
    // Map permissions to roles
    if (user.permissions.includes('Admin')) roles.push('Admin');
    if (user.permissions.includes('Content Manager')) roles.push('Content Manager');
    if (user.permissions.includes('Admission Official')) roles.push('Admission Official');
    if (user.permissions.includes('Consultant')) roles.push('Consultant');
    // NOTE: we intentionally do NOT add 'Student' here because
    // the sidebar role-switch should not allow switching into Student.
    
    return roles;
  };

  const value = useMemo(
    () => ({ 
      user, 
      isAuthenticated: !!user,
      isLoading, // Expose loading state
      activeRole,
      login, 
      logout, 
      hasPermission: checkUserPermission,
      isContentManagerLeader,
      isConsultantLeader,
      getDefaultRoute,
      switchToRole,
      getAccessibleRoles
    }),
    [user, activeRole, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}