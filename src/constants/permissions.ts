import type { Role } from "@/contexts/Auth";

/** Các view đang có trong AdminLayout */
export type AdminView =
  | "dashboard" | "templates" | "users" | "activity"
  | "admissions" | "content" | "consultation" | "insights"
  | "overview" | "analytics" | "knowledge" | "optimization"
  | "dashboardcontent" | "articles" | "review" | "editor";

/** Role -> danh sách view được phép */
export const ROLE_VIEWS: Record<Role, AdminView[]> = {
  SYSTEM_ADMIN: [
    "dashboard","templates","users","activity",
    "admissions","content","consultation","insights",
    "overview","analytics","knowledge","optimization",
    "dashboardcontent","articles","review","editor",
  ],
  CONTENT_MANAGER: [
    "dashboardcontent","articles","review","editor","activity", // Added for development
  ],
  CONSULTANT: [
    "overview","analytics","knowledge","optimization","activity", // Added for development
  ],
  ADMISSION_OFFICER: [
    "admissions","content","consultation","insights","activity", // Added for development
  ],
};

export function canAccess(role: Role | null | undefined, view: AdminView) {
  if (!role) return false;
  return ROLE_VIEWS[role]?.includes(view);
}

// ========= NEW PERMISSION SYSTEM =========

/** All possible permissions in the system */
export type Permission = 
  // System Admin permissions
  | "MANAGE_USERS"
  | "MANAGE_ROLES"
  | "VIEW_ACTIVITY_LOG"
  | "MANAGE_SYSTEM_SETTINGS"
  | "ACCESS_ALL_MODULES"
  
  // Content Manager permissions
  | "VIEW_CONTENT_DASHBOARD"
  | "MANAGE_ARTICLES"
  | "CREATE_ARTICLE"
  | "EDIT_ARTICLE"
  | "DELETE_ARTICLE"
  | "PUBLISH_ARTICLE"
  | "REVIEW_CONTENT"
  | "MANAGE_RIASEC"
  | "VIEW_ARTICLE_ANALYTICS"
  
  // Consultant permissions
  | "VIEW_CONSULTANT_OVERVIEW"
  | "VIEW_ANALYTICS"
  | "MANAGE_KNOWLEDGE_BASE"
  | "CREATE_QA_TEMPLATE"
  | "EDIT_QA_TEMPLATE"
  | "DELETE_QA_TEMPLATE"
  | "APPROVE_QA_TEMPLATE"
  | "MANAGE_DOCUMENTS"
  | "OPTIMIZE_CONTENT"
  
  // Admission Officer permissions
  | "VIEW_ADMISSION_DASHBOARD"
  | "MANAGE_STUDENT_QUEUE"
  | "CONDUCT_CONSULTATION"
  | "VIEW_STUDENT_INSIGHTS"
  | "MANAGE_STUDENT_PROFILES"
  | "ACCESS_LIVE_CHAT"
  | "VIEW_KNOWLEDGE_BASE";

/** Base permissions for each role (without leadership) */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SYSTEM_ADMIN: [
    "MANAGE_USERS",
    "MANAGE_ROLES", 
    "VIEW_ACTIVITY_LOG",
    "MANAGE_SYSTEM_SETTINGS",
    "ACCESS_ALL_MODULES",
    // System admin has access to all other permissions as well
    "VIEW_CONTENT_DASHBOARD",
    "MANAGE_ARTICLES",
    "CREATE_ARTICLE",
    "EDIT_ARTICLE",
    "DELETE_ARTICLE",
    "PUBLISH_ARTICLE",
    "REVIEW_CONTENT",
    "MANAGE_RIASEC",
    "VIEW_ARTICLE_ANALYTICS",
    "VIEW_CONSULTANT_OVERVIEW",
    "VIEW_ANALYTICS",
    "MANAGE_KNOWLEDGE_BASE",
    "CREATE_QA_TEMPLATE",
    "EDIT_QA_TEMPLATE",
    "DELETE_QA_TEMPLATE",
    "APPROVE_QA_TEMPLATE",
    "MANAGE_DOCUMENTS",
    "OPTIMIZE_CONTENT",
    "VIEW_ADMISSION_DASHBOARD",
    "MANAGE_STUDENT_QUEUE",
    "CONDUCT_CONSULTATION",
    "VIEW_STUDENT_INSIGHTS",
    "MANAGE_STUDENT_PROFILES",
    "ACCESS_LIVE_CHAT",
    "VIEW_KNOWLEDGE_BASE"
  ],
  
  CONTENT_MANAGER: [
    "VIEW_CONTENT_DASHBOARD",
    "MANAGE_ARTICLES",
    "CREATE_ARTICLE",
    "EDIT_ARTICLE",
    "VIEW_ARTICLE_ANALYTICS"
  ],
  
  CONSULTANT: [
    "VIEW_CONSULTANT_OVERVIEW",
    "VIEW_ANALYTICS",
    "MANAGE_KNOWLEDGE_BASE",
    "CREATE_QA_TEMPLATE",
    "EDIT_QA_TEMPLATE",
    "MANAGE_DOCUMENTS"
  ],
  
  ADMISSION_OFFICER: [
    "VIEW_ADMISSION_DASHBOARD",
    "MANAGE_STUDENT_QUEUE",
    "CONDUCT_CONSULTATION",
    "VIEW_STUDENT_INSIGHTS",
    "MANAGE_STUDENT_PROFILES",
    "ACCESS_LIVE_CHAT",
    "VIEW_KNOWLEDGE_BASE"
  ]
};

/** Additional permissions for leaders */
export const LEADER_PERMISSIONS: Record<Role, Permission[]> = {
  SYSTEM_ADMIN: [], // System admin already has all permissions
  
  CONTENT_MANAGER: [
    "DELETE_ARTICLE",
    "PUBLISH_ARTICLE",
    "REVIEW_CONTENT",
    "MANAGE_RIASEC"
  ],
  
  CONSULTANT: [
    "DELETE_QA_TEMPLATE",
    "APPROVE_QA_TEMPLATE",
    "OPTIMIZE_CONTENT"
  ],
  
  ADMISSION_OFFICER: [] // No additional leader permissions for admission officers yet
};

/** Check if a user has a specific permission */
export function hasPermission(
  role: Role | null | undefined, 
  permission: Permission, 
  isLeader: boolean = false
): boolean {
  if (!role) return false;
  
  const basePermissions = ROLE_PERMISSIONS[role] || [];
  const leaderPermissions = isLeader ? (LEADER_PERMISSIONS[role] || []) : [];
  const allPermissions = [...basePermissions, ...leaderPermissions];
  
  return allPermissions.includes(permission);
}

/** Get all permissions for a role */
export function getRolePermissions(role: Role, isLeader: boolean = false): Permission[] {
  const basePermissions = ROLE_PERMISSIONS[role] || [];
  const leaderPermissions = isLeader ? (LEADER_PERMISSIONS[role] || []) : [];
  return [...basePermissions, ...leaderPermissions];
}
