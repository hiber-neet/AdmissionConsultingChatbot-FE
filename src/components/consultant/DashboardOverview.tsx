import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Target, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Plus,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Button } from '../ui/system_users/button';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Badge } from '../ui/system_users/badge';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { consultantAnalyticsAPI, ConsultantStatistics, RecentQuestion } from '../../services/fastapi';

interface DashboardOverviewProps {
  onNavigateToTemplates?: (question: string, action: 'add') => void;
}

export function DashboardOverview({ onNavigateToTemplates }: DashboardOverviewProps = {}) {
  const [timeRange, setTimeRange] = useState<'today' | 'week'>('week');
  
  // API state for dashboard statistics
  const [stats, setStats] = useState<ConsultantStatistics | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard statistics and recent questions
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both statistics and recent questions in parallel
        const [statsResponse, questionsResponse] = await Promise.all([
          consultantAnalyticsAPI.getStatistics(),
          consultantAnalyticsAPI.getRecentQuestions(5)
        ]);
        
        console.log('Dashboard statistics:', statsResponse);
        console.log('Recent questions:', questionsResponse);
        
        setStats(statsResponse.data);
        // Handle case where questionsResponse might be an array directly or have .data property
        const questionsData = Array.isArray(questionsResponse) ? questionsResponse : questionsResponse?.data || [];
        setRecentQuestions(questionsData);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.detail || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Less than 1 hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <ScrollArea className="min-h-screen h-full">
        <div className="p-6 pb-8 space-y-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading dashboard data...</span>
          </div>
        </div>
      </ScrollArea>
    );
  }

  // Show error state
  if (error) {
    return (
      <ScrollArea className="min-h-screen h-full">
        <div className="p-6 pb-8 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive font-medium">Failed to load dashboard data</p>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  // No data state
  if (!stats) {
    return (
      <ScrollArea className="min-h-screen h-full">
        <div className="p-6 pb-8 space-y-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No dashboard data available</p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="min-h-screen h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1>Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Monitor chatbot performance and user engagement at a glance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-[#3B82F6]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Total User Queries
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-[#3B82F6]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.overview_stats.total_queries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={stats.overview_stats.queries_growth >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}>
                  {stats.overview_stats.queries_growth >= 0 ? '↑' : '↓'} {Math.abs(stats.overview_stats.queries_growth)}%
                </span> from last {timeRange === 'today' ? 'hour' : 'week'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#10B981]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Accuracy Rate
                </CardTitle>
                <Target className="h-4 w-4 text-[#10B981]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.overview_stats.accuracy_rate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-[#10B981]">↑ {stats.overview_stats.accuracy_improvement}%</span> improvement
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#F59E0B]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Most Active Day
                </CardTitle>
                <Clock className="h-4 w-4 text-[#F59E0B]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.overview_stats.most_active_time}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Peak engagement day
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#EF4444]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Unanswered Queries
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-[#EF4444]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.overview_stats.unanswered_queries}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions Over Time Chart */}
          <Card className="lg:col-span-full">
            <CardHeader>
              <CardTitle>Questions Over Time</CardTitle>
              <CardDescription>Daily query volume for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.questions_over_time}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6B7280"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="queries" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Questions</CardTitle>
                <CardDescription>
                  The 5 most recent questions asked in the system
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!recentQuestions || recentQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent questions found.</p>
                <p className="text-sm">Questions will appear here as users interact with the chatbot.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentQuestions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{item.question}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Asked by {item.user_name}</span>
                        {item.timestamp && (
                          <>
                            <span>•</span>
                            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                          </>
                        )}
                        {item.rating && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span>⭐</span>
                              <span>{item.rating}/5</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
