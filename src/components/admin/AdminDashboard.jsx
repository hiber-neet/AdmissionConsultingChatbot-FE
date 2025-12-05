import React from 'react';
import { Activity, Users, MessageSquare, Database, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Progress } from '../ui/system_users/progress';
import { Badge } from '../ui/system_users/badge';
import { Button } from '../ui/system_users/button';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const conversationData = [
  { name: 'Mon', conversations: 245, resolved: 220 },
  { name: 'Tue', conversations: 310, resolved: 285 },
  { name: 'Wed', conversations: 278, resolved: 265 },
  { name: 'Thu', conversations: 325, resolved: 310 },
  { name: 'Fri', conversations: 290, resolved: 275 },
  { name: 'Sat', conversations: 180, resolved: 170 },
  { name: 'Sun', conversations: 150, resolved: 145 },
];

const responseTimeData = [
  { time: '00:00', avgResponse: 2.1 },
  { time: '04:00', avgResponse: 1.8 },
  { time: '08:00', avgResponse: 2.5 },
  { time: '12:00', avgResponse: 2.8 },
  { time: '16:00', avgResponse: 2.6 },
  { time: '20:00', avgResponse: 2.2 },
];

const recentActivity = [
  { id: 1, type: 'conversation', user: 'Sarah Johnson', action: 'Started chat about MBA programs', time: '2 min ago', status: 'active' },
  { id: 2, type: 'kb_update', user: 'Admin User', action: 'Updated Financial Aid KB article', time: '15 min ago', status: 'completed' },
  { id: 3, type: 'conversation', user: 'Michael Chen', action: 'Asked about admission deadlines', time: '23 min ago', status: 'resolved' },
  { id: 4, type: 'alert', user: 'System', action: 'High response time detected', time: '1 hour ago', status: 'warning' },
  { id: 5, type: 'conversation', user: 'Emily Rodriguez', action: 'Inquired about scholarships', time: '1 hour ago', status: 'resolved' },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Header */}
        <div>
          <h1>System Dashboard</h1>
          <p className="text-muted-foreground">Real-time admission chatbot analytics and monitoring</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Active Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">24</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">2.4s</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-0.3s</span> from yesterday
              </p>
              <Progress value={80} className="mt-2 h-2 bg-[#3B82F6]/20" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Users Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">1,234</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+18%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">94.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.1%</span> from last week
              </p>
              <Progress value={94.2} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Conversation Volume</CardTitle>
              <CardDescription>Daily conversations and resolution rate</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="conversations" fill="#3B82F6" name="Total" />
                  <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Time Trend</CardTitle>
              <CardDescription>Average response time throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="avgResponse" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Avg Response (s)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* System Status & Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Real-time system performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>RAG Model Performance</span>
                  <Badge variant="default">Excellent</Badge>
                </div>
                <Progress value={96} className="h-2 bg-[#3B82F6]/20" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Database Query Speed</span>
                  <Badge variant="default">Good</Badge>
                </div>
                <Progress value={87} className="h-2 bg-[#10B981]/20" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>API Response Rate</span>
                  <Badge variant="default">Excellent</Badge>
                </div>
                <Progress value={99} className="h-2 bg-[#8B5CF6]/20" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Knowledge Base Coverage</span>
                  <Badge variant="outline">Moderate</Badge>
                </div>
                <Progress value={72} className="h-2 bg-[#F59E0B]/20" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Concurrent Users</span>
                  <span className="text-muted-foreground">24 / 100</span>
                </div>
                <Progress value={24} className="h-2 bg-[#EF4444]/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events and user interactions</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/admin/activity')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="mt-1">
                      {activity.type === 'conversation' && (
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                      )}
                      {activity.type === 'kb_update' && (
                        <Database className="h-4 w-4 text-green-500" />
                      )}
                      {activity.type === 'alert' && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{activity.action}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <div>
                      {activity.status === 'active' && (
                        <Badge variant="default" className="text-xs">Active</Badge>
                      )}
                      {activity.status === 'completed' && (
                        <Badge variant="outline" className="text-xs">Done</Badge>
                      )}
                      {activity.status === 'resolved' && (
                        <Badge variant="secondary" className="text-xs">Resolved</Badge>
                      )}
                      {activity.status === 'warning' && (
                        <Badge variant="destructive" className="text-xs">Warning</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <button className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                <Database className="h-4 w-4" />
                <span className="text-sm">Update KB</span>
              </button>
              <button className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                <Users className="h-4 w-4" />
                <span className="text-sm">Manage Users</span>
              </button>
              <button className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                <Activity className="h-4 w-4" />
                <span className="text-sm">View Analytics</span>
              </button>
              <button className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Export Report</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}