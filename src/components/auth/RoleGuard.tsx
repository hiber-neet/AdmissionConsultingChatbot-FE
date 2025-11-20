// src/components/auth/RoleGuard.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, Role } from "@/contexts/Auth";
import { Permission } from "@/constants/permissions";

interface RoleGuardProps {
  children: JSX.Element;
  allowedRoles?: Role[];
  requiredPermission?: Permission;
  fallbackRoute?: string;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  requiredPermission, 
  fallbackRoute = "/" 
}: RoleGuardProps) {
  const { isAuthenticated, user, hasPermission, getDefaultRoute } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate 
      to="/loginforad" 
      replace 
      state={{ from: location.pathname + location.search }} 
    />;
  }

  // If no user data, redirect to login
  if (!user) {
    return <Navigate 
      to="/loginforad" 
      replace 
      state={{ from: location.pathname + location.search }} 
    />;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect to user's default route
      const userDefaultRoute = getDefaultRoute(user.role);
      return <Navigate to={userDefaultRoute} replace />;
    }
  }

  // Check permission-based access
  if (requiredPermission) {
    if (!hasPermission(requiredPermission)) {
      // Redirect to user's default route
      const userDefaultRoute = getDefaultRoute(user.role);
      return <Navigate to={userDefaultRoute} replace />;
    }
  }

  return children;
}

// Convenience components for specific roles
export function AdminGuard({ children, fallbackRoute }: { children: JSX.Element; fallbackRoute?: string }) {
  return (
    <RoleGuard allowedRoles={["SYSTEM_ADMIN"]} fallbackRoute={fallbackRoute}>
      {children}
    </RoleGuard>
  );
}

export function ContentManagerGuard({ children, fallbackRoute }: { children: JSX.Element; fallbackRoute?: string }) {
  return (
    <RoleGuard allowedRoles={["CONTENT_MANAGER", "SYSTEM_ADMIN"]} fallbackRoute={fallbackRoute}>
      {children}
    </RoleGuard>
  );
}

export function ConsultantGuard({ children, fallbackRoute }: { children: JSX.Element; fallbackRoute?: string }) {
  return (
    <RoleGuard allowedRoles={["CONSULTANT", "SYSTEM_ADMIN"]} fallbackRoute={fallbackRoute}>
      {children}
    </RoleGuard>
  );
}

export function AdmissionOfficerGuard({ children, fallbackRoute }: { children: JSX.Element; fallbackRoute?: string }) {
  return (
    <RoleGuard allowedRoles={["ADMISSION_OFFICER", "SYSTEM_ADMIN"]} fallbackRoute={fallbackRoute}>
      {children}
    </RoleGuard>
  );
}

export function StudentGuard({ children, fallbackRoute }: { children: JSX.Element; fallbackRoute?: string }) {
  return (
    <RoleGuard allowedRoles={["STUDENT"]} fallbackRoute={fallbackRoute}>
      {children}
    </RoleGuard>
  );
}

export function StaffGuard({ children, fallbackRoute }: { children: JSX.Element; fallbackRoute?: string }) {
  return (
    <RoleGuard allowedRoles={["SYSTEM_ADMIN", "CONTENT_MANAGER", "CONSULTANT", "ADMISSION_OFFICER"]} fallbackRoute={fallbackRoute}>
      {children}
    </RoleGuard>
  );
}