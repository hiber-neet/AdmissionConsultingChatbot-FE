import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Progress } from '../ui/system_users/progress';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Button } from '../ui/system_users/button';
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
      console.log('Admission dashboard data:', response);
      setStats(response);
    } catch (error) {
      console.error('Error fetching admission dashboard data:', error);
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
        <div className="flex justify-between items-start">
          <div>
            <h1>Tổng Quan Hôm Nay</h1>
            <p className="text-muted-foreground">
              Theo dõi hiệu suất và tương tác của sinh viên
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={fetchDashboardData}
            disabled={loading}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Làm Mới Dữ Liệu
          </Button>
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
              <p className="text-xs text-muted-foreground mt-1">
                Phiên kết thúc trong 30 ngày
              </p>
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
              <p className="text-xs text-muted-foreground mt-1">
                Tổng số bài viết công khai
              </p>
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
              <p className="text-xs text-muted-foreground mt-1">
                Yêu cầu đang chờ của bạn
              </p>
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
              <p className="text-xs text-muted-foreground mt-1">
                Bản nháp chờ xuất bản
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Weekly Articles Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Thống Kê Bài Viết Trong Tuần</CardTitle>
              <CardDescription>Số lượng bài viết được xuất bản trong 7 ngày qua</CardDescription>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Xu Hướng Cơ Sở Tri Thức</CardTitle>
                  <CardDescription>Phân bổ Intent từ câu hỏi huấn luyện</CardDescription>
                </div>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {stats.intent_distribution.length > 0 ? (
                <div className="space-y-3">
                  {stats.intent_distribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{item.topic}</span>
                          <span className="text-xs text-muted-foreground">{item.count} câu hỏi</span>
                        </div>
                        <Progress 
                          value={stats.intent_distribution.length > 0 
                            ? (item.count / stats.intent_distribution[0].count) * 100 
                            : 0
                          } 
                          className="h-2" 
                        />
                      </div>
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
