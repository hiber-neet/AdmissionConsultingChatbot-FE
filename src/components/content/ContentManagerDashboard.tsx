// src/components/content/ContentManagerDashboard.tsx
import { useState, useEffect } from "react";
import {
  Plus,
  CalendarDays,
  Eye,
  PencilLine,
  Clock3,
  Loader2,
  FileText,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/system_users/button";
import { fastAPIContentAnalytics, type ContentStatistics } from "@/services/fastapi";
import { useAuth } from "@/contexts/Auth";

type Props = {
  onCreate?: () => void;    
  onNavigateToEditor?: () => void;
  onNavigateToArticles?: () => void;
};

type Stat = {
  label: string;
  value: number | string;
  sublabel?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
};

type Activity = {
  title: string;
  author: string;
  updatedAt: string;
  status: "draft" | "review" | "published";
  badgeColor?: string; // màu chấm tròn ở đầu dòng
};

// Helper function to get status badge color
const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'published': return 'bg-emerald-500';
    case 'review': return 'bg-amber-500';
    case 'draft': return 'bg-slate-400';
    default: return 'bg-gray-400';
  }
};

function StatusPill({ status }: { status: Activity["status"] }) {
  const map: Record<Activity["status"], string> = {
    draft: "bg-gray-100 text-gray-700",
    review: "bg-amber-100 text-amber-700",
    published: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`px-2.5 py-1 text-xs rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}

export default function ContentManagerDashboard({ onCreate, onNavigateToEditor, onNavigateToArticles }: Props) {
  const { user } = useAuth();
  const [contentData, setContentData] = useState<ContentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch content statistics from backend
  const fetchContentStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching content statistics...');
      
      const response = await fastAPIContentAnalytics.getStatistics();
      console.log('✅ Content statistics received:', response);
      
      if (response.success) {
        setContentData(response.data);
        setLastRefresh(new Date());
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err: any) {
      console.error('❌ Error fetching content statistics:', err);
      setError(err.message || 'Failed to fetch content statistics');
      
      // Set fallback data in case of error
      setContentData({
        overview: {
          total_articles: 0,
          published_articles: 0,
          draft_articles: 0,
          review_articles: 0,
          my_articles: 0
        },
        recent_articles: [],
        popular_articles: [],
        articles_by_major: [],
        monthly_trends: [],
        status_distribution: {},
        generated_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchContentStatistics();
  }, [user?.id]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing content statistics...');
      fetchContentStatistics();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Generate stats array from API data
  const stats: Stat[] = contentData ? [
    { 
      label: "Total Published", 
      value: contentData.overview.published_articles, 
      sublabel: "Live on portal", 
      icon: <Eye className="h-4 w-4 text-emerald-500" />,
      isLoading: loading 
    },
    { 
      label: "Needs Review", 
      value: contentData.overview.review_articles, 
      sublabel: "Awaiting approval", 
      icon: <Clock3 className="h-4 w-4 text-amber-500" />,
      isLoading: loading 
    },
    { 
      label: "My Articles", 
      value: contentData.overview.my_articles, 
      sublabel: "Created by you", 
      icon: <PencilLine className="h-4 w-4 text-sky-500" />,
      isLoading: loading 
    },
    { 
      label: "Total Articles", 
      value: contentData.overview.total_articles, 
      sublabel: "All content", 
      icon: <FileText className="h-4 w-4 text-purple-500" />,
      isLoading: loading 
    },
  ] : [];

  // Convert API data to activities format
  const activities: Activity[] = contentData ? 
    contentData.recent_articles.map(article => ({
      title: article.title,
      author: article.author,
      updatedAt: article.created_at,
      status: article.status as "draft" | "review" | "published",
      badgeColor: getStatusBadgeColor(article.status),
    })) : [];

    const handleCreate = () => {
    if (onCreate) onCreate();
    else if (onNavigateToEditor) onNavigateToEditor();
    else window.location.assign("/content?tab=editor");
  };
  
  const handleViewArticles = () => {
    if (onNavigateToArticles) onNavigateToArticles();
  };

  const handleRefresh = () => {
    fetchContentStatistics();
  };

  if (loading && !contentData) {
    return (
      <div className="h-full w-full overflow-auto">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading content statistics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full w-full overflow-auto">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-800 text-sm">
                Error loading content statistics: {error}
              </span>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="ml-auto">
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Content Overview</h1>
            <p className="text-sm text-gray-500">
              Manage your editorial workflow
              {contentData && (
                <span className="ml-2">
                  • Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Refresh
            </Button>
            <Button onClick={handleCreate} className="bg-black text-white hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Create New Article
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">{s.label}</span>
                {s.icon}
              </div>
              <div className="text-2xl font-semibold">
                {s.isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  s.value
                )}
              </div>
              {s.sublabel && (
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <Clock3 className="h-3.5 w-3.5" />
                  {s.sublabel}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Articles by Major (if available) */}
        {contentData?.articles_by_major && contentData.articles_by_major.length > 0 && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 text-sm font-medium text-gray-800">
              Articles by Major
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentData.articles_by_major.slice(0, 6).map((major, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{major.major_name}</span>
                  <span className="text-sm font-medium text-gray-900">{major.article_count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-3 text-sm font-medium text-gray-800">
            Quick Actions
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button  onClick={handleCreate}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
            >
              <Plus className="mr-2 h-4 w-4" />Bài Viết Mới</Button>
            <Button
              onClick={handleViewArticles}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
            >
              <FileText className="mr-2 h-4 w-4" />
              View All Articles
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4 text-sm font-medium text-gray-800">
            Recent Activity
            {contentData?.recent_articles && (
              <span className="ml-2 text-xs text-gray-500">
                ({contentData.recent_articles.length} articles)
              </span>
            )}
          </div>

          {activities.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {activities.map((a, idx) => (
                <li key={idx} className="flex items-center justify-between p-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${a.badgeColor}`}
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {a.title}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {a.author} • updated • {a.updatedAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusPill status={a.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No recent articles found</p>
              <Button onClick={handleCreate} variant="outline" className="mt-3">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Article
              </Button>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5" />
            Auto-refresh every 5 min
          </div>
          {contentData && (
            <div>
              Data generated: {new Date(contentData.generated_at).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
