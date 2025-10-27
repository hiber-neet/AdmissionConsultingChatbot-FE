import type { Role } from "@/contexts/Auth";

/** Các view đang có trong AdminLayout */
export type AdminView =
  | "dashboard" | "templates" | "users" | "activity_log"
  | "admissions" | "content" | "chatbot" | "consultation" | "insights"
  | "overview" | "analytics" | "knowledge" | "optimization"
  | "dashboardcontent" | "articles" | "review" | "editor";

/** Role -> danh sách view được phép */
export const ROLE_VIEWS: Record<Role, AdminView[]> = {
  SYSTEM_ADMIN: [
    "dashboard","templates","users","activity_log",
    "admissions","content","chatbot","consultation","insights",
    "overview","analytics","knowledge","optimization",
    "dashboardcontent","articles","review","editor",
  ],
  CONTENT_MANAGER: [
    "dashboardcontent","articles","review","editor",
  ],
  CONSULTANT: [
    "overview","analytics","knowledge","optimization",
  ],
  ADMISSION_OFFICER: [
    "admissions","content","chatbot","consultation","insights",
  ],
};

export function canAccess(role: Role | null | undefined, view: AdminView) {
  if (!role) return false;
  return ROLE_VIEWS[role]?.includes(view);
}
