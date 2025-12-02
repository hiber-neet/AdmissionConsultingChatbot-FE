// Define Role type to match backend roles (with spaces as they appear in backend)
export type Role = "Admin" | "Consultant" | "Content Manager" | "Admission Official" | "Student" | "Parent";

/** All possible permissions in the system - matching backend permission names exactly */
export type Permission = 
  | "Admin"
  | "Consultant" 
  | "Content Manager"
  | "Admission Official"
  | "Student"
  | "Parent";

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
  "dashboard": "Admin",
  "templates": "Admin", 
  "users": "Admin",
  "activity": "Admin",
  
  // Admission Official pages
  "admissions": "Admission Official",
  "content": "Admission Official", 
  "consultation": "Admission Official",
  "insights": "Admission Official",
  
  // Consultant pages
  "overview": "Consultant",
  "analytics": "Consultant",
  "knowledge": "Consultant", 
  "optimization": "Consultant",
  
  // Content Manager pages
  "dashboardcontent": "Content Manager",
  "articles": "Content Manager",
  "review": "Content Manager", 
  "editor": "Content Manager",
  
  // Shared pages (accessible by all roles - no specific permission required)
  "profile": "Admission Official", // Minimum staff permission level
  "riasec": "Admission Official",
  "chatbot": "Admission Official"
};

/** Base permissions for each role */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  Admin: ["Admin", "Content Manager", "Admission Official", "Consultant"],
  "Content Manager": ["Content Manager"],
  "Admission Official": ["Admission Official"], 
  Consultant: ["Consultant"],
  Student: [], // Students don't have staff permissions (kept for auth, but not for sidebar switching)
  Parent: [] // Parents don't have staff permissions
};

/** Permission hierarchy - higher levels include lower levels */
export const PERMISSION_HIERARCHY: Record<Permission, Permission[]> = {
  "Admin": ["Admin", "Content Manager", "Admission Official", "Consultant"],
  "Content Manager": ["Content Manager"],
  "Admission Official": ["Admission Official"],
  "Consultant": ["Consultant"],
  "Student": ["Student"], // Kept for auth, but not for sidebar switching
  "Parent": ["Parent"]
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
  return ROLE_PERMISSIONS[role] || [];
}

// Legacy function for backward compatibility with existing code that checks roles
export function canAccess(role: Role | null | undefined, pageId: string): boolean {
  if (!role) return false;
  
  const userPermissions = getRolePermissions(role);
  return canAccessPage(userPermissions, pageId as PagePermission);
}