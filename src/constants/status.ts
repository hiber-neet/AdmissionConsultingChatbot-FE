// Article status constants for filtering
export const ARTICLE_STATUSES = [
  "All Status",
  "Drafted",
  "Rejected",
  "Published"
] as const;

// Type for article status filter
export type ArticleStatusFilter = typeof ARTICLE_STATUSES[number];