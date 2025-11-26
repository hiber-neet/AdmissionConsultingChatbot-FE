// Define Role type locally to avoid circular dependency
export type Role = "SYSTEM_ADMIN" | "CONSULTANT" | "CONTENT_MANAGER" | "ADMISSION_OFFICER" | "STUDENT";

/** All possible permissions in the system - simplified to match roles */
export type Permission = 
  | "admin"
  | "content_manager" 
  | "admission_officer"
  | "consultant"
  | "student";

/** Page/Component identifiers that need permission checks */
export type PagePermission = 
  // Admin-only pages
  | "dashboard" | "templates" | "users" | "activity"
  // Admission Officer pages  
  | "admissions" | "content" | "consultation" | "insights"
  // Consultant pages
  | "overview" | "analytics" | "knowledge" | "optimization"
  // Content Manager pages
  | "dashboardcontent" | "articles" | "review" | "editor"
  // Shared/Student pages
  | "profile" | "riasec" | "chatbot";

/** Map each page to its required permission */
export const PAGE_PERMISSIONS: Record<PagePermission, Permission> = {
  // Admin-only pages
  "dashboard": "admin",
  "templates": "admin", 
  "users": "admin",
  "activity": "admin",
  
  // Admission Officer pages
  "admissions": "admission_officer",
  "content": "admission_officer", 
  "consultation": "admission_officer",
  "insights": "admission_officer",
  
  // Consultant pages
  "overview": "consultant",
  "analytics": "consultant",
  "knowledge": "consultant", 
  "optimization": "consultant",
  
  // Content Manager pages
  "dashboardcontent": "content_manager",
  "articles": "content_manager",
  "review": "content_manager", 
  "editor": "content_manager",
  
  // Shared pages (accessible by all roles)
  "profile": "student", // Minimum permission level
  "riasec": "student",
  "chatbot": "student"
};

/** Base permissions for each role */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SYSTEM_ADMIN: ["admin", "content_manager", "admission_officer", "consultant", "student"],
  CONTENT_MANAGER: ["content_manager", "student"],
  ADMISSION_OFFICER: ["admission_officer", "student"], 
  CONSULTANT: ["consultant", "student"],
  STUDENT: ["student"]
};

/** Permission hierarchy - higher levels include lower levels */
export const PERMISSION_HIERARCHY: Record<Permission, Permission[]> = {
  "admin": ["admin", "content_manager", "admission_officer", "consultant", "student"],
  "content_manager": ["content_manager", "student"],
  "admission_officer": ["admission_officer", "student"],
  "consultant": ["consultant", "student"], 
  "student": ["student"]
};

/** Check if a user has access to a specific page */
export function canAccessPage(
  userPermissions: Permission[] | undefined,
  pageId: PagePermission
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  
  const requiredPermission = PAGE_PERMISSIONS[pageId];
  if (!requiredPermission) return false;
  
  // Check if user has the required permission or a higher one
  return userPermissions.some(permission => 
    PERMISSION_HIERARCHY[permission]?.includes(requiredPermission) || permission === requiredPermission
  );
}

/** Check if a user has a specific permission */
export function hasPermission(
  userPermissions: Permission[] | undefined,
  requiredPermission: Permission
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  
  return userPermissions.some(permission => 
    PERMISSION_HIERARCHY[permission]?.includes(requiredPermission) || permission === requiredPermission
  );
}

/** Get all permissions for a role */
export function getRolePermissions(role: Role, isLeader: boolean = false): Permission[] {
  return ROLE_PERMISSIONS[role] || ["student"];
}

// Legacy function for backward compatibility with existing code that checks roles
export function canAccess(role: Role | null | undefined, pageId: string): boolean {
  if (!role) return false;
  
  const userPermissions = getRolePermissions(role);
  return canAccessPage(userPermissions, pageId as PagePermission);
}