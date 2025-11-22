import type { Role } from "@/contexts/Auth";

/** Các view đang có trong AdminLayout */
export type AdminView =
  | "dashboard" | "templates" | "users" | "activity"
  | "admissions" | "content" | "consultation" | "insights"
  | "overview" | "analytics" | "knowledge" | "optimization"
  | "dashboardcontent" | "articles" | "review" | "editor" | "profile";

/** Role -> danh sách view được phép */
export const ROLE_VIEWS: Record<Role, AdminView[]> = {
  SYSTEM_ADMIN: [
    "dashboard","templates","users","activity",
    "admissions","content","consultation","insights",
    "overview","analytics","knowledge","optimization",
    "dashboardcontent","articles","review","editor","profile",
  ],
  CONTENT_MANAGER: [
    "dashboardcontent","articles","review","editor","activity","profile", // Added for development
  ],
  CONSULTANT: [
    "overview","analytics","knowledge","optimization","activity","profile", // Added for development
  ],
  ADMISSION_OFFICER: [
    "admissions","content","consultation","insights","activity","profile", // Added for development
  ],
  STUDENT: [], // Students don't access admin views
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
  | "VIEW_KNOWLEDGE_BASE"
  
  // Student permissions
  | "VIEW_PROFILE"
  | "EDIT_PROFILE"
  | "TAKE_RIASEC_TEST"
  | "VIEW_RIASEC_RESULTS"
  | "ACCESS_CHATBOT"
  | "VIEW_ARTICLES"
  | "REQUEST_CONSULTATION";

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
    "MANAGE_DOCUMENTS",
    "OPTIMIZE_CONTENT"
  ],
  
  ADMISSION_OFFICER: [
    "VIEW_ADMISSION_DASHBOARD",
    "MANAGE_STUDENT_QUEUE",
    "CONDUCT_CONSULTATION",
    "VIEW_STUDENT_INSIGHTS",
    "MANAGE_STUDENT_PROFILES",
    "ACCESS_LIVE_CHAT",
    "VIEW_KNOWLEDGE_BASE"
  ],
  
  STUDENT: [
    "VIEW_PROFILE",
    "EDIT_PROFILE",
    "TAKE_RIASEC_TEST",
    "VIEW_RIASEC_RESULTS",
    "ACCESS_CHATBOT",
    "VIEW_ARTICLES",
    "REQUEST_CONSULTATION"
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
    "APPROVE_QA_TEMPLATE"
  ],
  
  ADMISSION_OFFICER: [], // No additional leader permissions for admission officers yet
  
  STUDENT: [] // Students don't have leadership roles
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
