import React, { useState, useEffect } from 'react';
import {
  FileText,
  MessageSquare,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/system_users/card';
import { ScrollArea } from '../ui/system_users/scroll-area';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { dashboardAnalyticsAPI } from '../../services/fastapi';
import { toast } from 'react-toastify';

export function AdmissionDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    chatbot_interactions: 0,
    published_articles: 0,
    queue_count: 0,
    drafted_articles: 0,
    weekly_articles: [],
    intent_distribution: []
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAnalyticsAPI.getAdmissionStats(30);
      setStats(response);
    } catch (error) {
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Tổng Quan Tuyển Sinh</h1>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Tương Tác Chatbot
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.chatbot_interactions}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Bài Viết Đã Xuất Bản
                </CardTitle>
                <FileText className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.published_articles}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Hàng Đợi Tư Vấn
                </CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.queue_count}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Nội Dung Mới
                </CardTitle>
                <FileText className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.drafted_articles}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Weekly Articles Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Thống Kê Bài Viết Trong Tuần</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.weekly_articles.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.weekly_articles}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                      domain={[0, 'dataMax']}        // Set range from 0 to max data value
                      tickCount={5}                  // Number of ticks to show
                      interval={0}                   // Show all ticks (no skipping)
                      ticks={[0, 1, 2, 3, 4, 5]}
                    />
                    <Bar
                      dataKey="articles"
                      fill="#3B82F6"
                      name="Bài viết"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <p>Chưa có dữ liệu bài viết trong tuần này</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Intent Distribution */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Xu Hướng Cơ Sở Tri Thức</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.intent_distribution.length > 0 ? (
                <div className="space-y-4">
                  {stats.intent_distribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.topic}</span>
                      <span className="text-2xl font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <p>Chưa có dữ liệu Intent trong hệ thống</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
