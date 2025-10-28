import { useState } from 'react';
import { 
  MessageSquare, 
  Target, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Plus
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

const unansweredQuestions = [
  {
    id: 1,
    question: 'What are the housing options for international students?',
    timestamp: '2 hours ago',
    category: 'Campus Life',
  },
  {
    id: 2,
    question: 'Can I defer my admission to next semester?',
    timestamp: '4 hours ago',
    category: 'Admissions',
  },
  {
    id: 3,
    question: 'What is the policy for transfer credits from community colleges?',
    timestamp: '5 hours ago',
    category: 'Academic',
  },
  {
    id: 4,
    question: 'Are there part-time MBA programs available?',
    timestamp: '6 hours ago',
    category: 'Programs',
  },
  {
    id: 5,
    question: 'How do I update my contact information after applying?',
    timestamp: '8 hours ago',
    category: 'Applications',
  },
];

export function DashboardOverview() {
  const [timeRange, setTimeRange] = useState<'today' | 'week'>('week');

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
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {unansweredQuestions.length} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
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
                    </div>
                    <p className="text-sm text-muted-foreground">{item.timestamp}</p>
                  </div>
                  <Button size="sm" className="bg-[#3B82F6] hover:bg-[#2563EB] flex-shrink-0">
                    <Plus className="h-4 w-4 mr-1" />
                    Add to KB
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
