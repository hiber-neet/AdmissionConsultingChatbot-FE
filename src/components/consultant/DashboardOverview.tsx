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
import { analyticsAPI, KnowledgeGap } from '../../services/fastapi';

const questionsOverTimeData = [
  { date: 'Oct 1', queries: 245 },
  { date: 'Oct 2', queries: 310 },
  { date: 'Oct 3', queries: 278 },
  { date: 'Oct 4', queries: 325 },
  { date: 'Oct 5', queries: 290 },
  { date: 'Oct 6', queries: 180 },
  { date: 'Oct 7', queries: 150 },
];

const categoryData = [
  { name: 'Tuition Fees', value: 420, color: '#3B82F6' },
  { name: 'Programs', value: 280, color: '#10B981' },
  { name: 'Admission Requirements', value: 210, color: '#F59E0B' },
  { name: 'Financial Aid', value: 180, color: '#8B5CF6' },
  { name: 'Other', value: 90, color: '#6B7280' },
];

interface DashboardOverviewProps {
  onNavigateToTemplates?: (question: string, action: 'add') => void;
}

export function DashboardOverview({ onNavigateToTemplates }: DashboardOverviewProps = {}) {
  const [timeRange, setTimeRange] = useState<'today' | 'week'>('week');
  
  // API state for unanswered questions
  const [unansweredQuestions, setUnansweredQuestions] = useState<KnowledgeGap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch unanswered questions (knowledge gaps)
  useEffect(() => {
    const fetchUnansweredQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        // Get knowledge gaps from last 7 days, minimum frequency 1 to get more recent questions
        const response = await analyticsAPI.getKnowledgeGaps(7, 1);
        // Sort by last_asked date (most recent first) and take only 5
        const sortedGaps = (response || [])
          .filter(gap => gap.last_asked) // Only include items with last_asked date
          .sort((a, b) => new Date(b.last_asked!).getTime() - new Date(a.last_asked!).getTime())
          .slice(0, 5);
        setUnansweredQuestions(sortedGaps);
      } catch (err: any) {
        console.error('Error fetching unanswered questions:', err);
        setError(err.response?.data?.detail || 'Failed to fetch unanswered questions');
      } finally {
        setLoading(false);
      }
    };

    fetchUnansweredQuestions();
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
              <div className="text-3xl">1,778</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-[#10B981]">↑ 12%</span> from last {timeRange === 'today' ? 'hour' : 'week'}
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
              <div className="text-3xl">94%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-[#10B981]">↑ 2%</span> improvement
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#F59E0B]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Most Active Time
                </CardTitle>
                <Clock className="h-4 w-4 text-[#F59E0B]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">2-4 PM</div>
              <p className="text-xs text-muted-foreground mt-1">
                Peak engagement hours
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
              <div className="text-3xl">23</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions Over Time Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Questions Over Time</CardTitle>
              <CardDescription>Daily query volume for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={questionsOverTimeData}>
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

          {/* Top Question Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Question Categories</CardTitle>
              <CardDescription>Distribution by topic</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Unanswered Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Unanswered Questions</CardTitle>
                <CardDescription>
                  Questions the chatbot couldn't answer - add them to improve coverage
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading unanswered questions...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>Error: {error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : unansweredQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent unanswered questions found.</p>
                <p className="text-sm">Great job! Your knowledge base seems comprehensive.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unansweredQuestions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{item.question}</p>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge 
                          variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'} 
                          className="text-xs"
                        >
                          {item.priority} priority
                        </Badge>
                        {item.in_grace_period && (
                          <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                            Monitoring
                          </Badge>
                        )}
                        {item.match_score !== undefined && item.match_score > 0.3 && item.match_score < 0.6 && (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                            Partial Match
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Asked {item.frequency} times</span>
                        {item.last_asked && (
                          <>
                            <span>•</span>
                            <span>{formatRelativeTime(item.last_asked)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className={`flex-shrink-0 ${
                        item.in_grace_period 
                          ? 'bg-yellow-600 hover:bg-yellow-700' 
                          : item.match_score !== undefined && item.match_score > 0.3 
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-[#3B82F6] hover:bg-[#2563EB]'
                      }`}
                      onClick={() => onNavigateToTemplates?.(item.question, 'add')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {item.in_grace_period 
                        ? 'Monitor' 
                        : item.match_score !== undefined && item.match_score > 0.3 
                          ? 'Improve' 
                          : 'Add to KB'
                      }
                    </Button>
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
