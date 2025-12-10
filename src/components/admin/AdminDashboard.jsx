import React, { useState, useEffect } from 'react';
import { Activity, Users, MessageSquare, Database, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Button } from '../ui/system_users/button';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { dashboardAnalyticsAPI } from '../../services/fastapi';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function AdminDashboard() {
  // State for API data
  const [metrics, setMetrics] = useState({
    active_chatbot_sessions: 0,
    total_customers: 0,
    active_live_sessions: 0
  });
  const [conversationData, setConversationData] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    total_users: 0,
    total_articles: 0,
    total_qa_pairs: 0,
    total_kb_docs: 0,
    recent_errors: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      console.log('Starting to fetch dashboard data...');
      
      // Fetch all data in parallel
      const [
        metricsResponse,
        chatbotRequestsResponse,
        healthResponse
      ] = await Promise.all([
        dashboardAnalyticsAPI.getMetrics(7).catch(err => {
          console.error('Metrics API error:', err);
          return null;
        }),
        dashboardAnalyticsAPI.getChatbotRequests(30).catch(err => {
          console.error('Chatbot requests API error:', err);
          return [];
        }),
        dashboardAnalyticsAPI.getSystemHealth().catch(err => {
          console.error('System health API error:', err);
          return null;
        })
      ]);

      console.log('API Responses:', {
        metricsResponse,
        chatbotRequestsResponse,
        healthResponse
      });

      // Update state with API data - handle potential null/undefined responses
      if (metricsResponse) {
        setMetrics(metricsResponse);
      } else {
        console.warn('No metrics data received, using defaults');
        setMetrics({
          active_chatbot_sessions: 0,
          total_customers: 0,
          active_live_sessions: 0
        });
      }
      
      if (chatbotRequestsResponse && Array.isArray(chatbotRequestsResponse)) {
        setConversationData(chatbotRequestsResponse);
      }
      
      if (healthResponse) {
        setSystemHealth(healthResponse);
      } else {
        console.warn('No system health data received, using defaults');
        setSystemHealth({
          total_users: 0,
          total_articles: 0,
          total_qa_pairs: 0,
          total_kb_docs: 0,
          recent_errors: 0
        });
      }
      
      console.log('Dashboard data loaded successfully', {
        metrics: metricsResponse,
        chatbotRequests: chatbotRequestsResponse,
        health: healthResponse
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu bảng điều khiển');
      
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
          <p className="text-gray-600">Đang tải bảng điều khiển...</p>
        </div>
      </div>
    );
  }
  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1>Bảng Điều Khiển Hệ Thống</h1>
            <p className="text-muted-foreground">Phân tích và giám sát chatbot tuyển sinh theo thời gian thực</p>
          </div>
          <Button 
            variant="outline"
            onClick={fetchDashboardData}
            disabled={loading}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />Làm Mới Dữ Liệu</Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Phiên Chatbot Đang Hoạt Động</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{metrics?.active_chatbot_sessions || 0}</div>
              <p className="text-xs text-muted-foreground">Cuộc trò chuyện được hỗ trợ bởi AI</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Tổng Số Khách Hàng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{metrics?.total_customers || 0}</div>
              <p className="text-xs text-muted-foreground">Học sinh và phụ huynh duy nhất</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Phiên Trực Tiếp Đang Hoạt Động</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{metrics?.active_live_sessions || 0}</div>
              <p className="text-xs text-muted-foreground">Trò chuyện với nhân viên</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Yêu Cầu Chatbot (7 Ngày Qua)</CardTitle>
            <CardDescription>Tin nhắn khách hàng so với phản hồi chatbot</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="customer" fill="#3B82F6" name="Tin Nhắn Khách Hàng" />
                <Bar dataKey="chatbot" fill="#10B981" name="Phản Hồi Chatbot" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Thống Kê Hệ Thống</CardTitle>
            <CardDescription>Số liệu cơ sở tri thức và nội dung</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Bài Viết Đã Xuất Bản</span>
              </div>
              <span className="text-2xl font-bold">{systemHealth?.total_articles || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-500" />
                <span className="text-sm">Tài Liệu Cơ Sở Tri Thức</span>
              </div>
              <span className="text-2xl font-bold">{systemHealth?.total_kb_docs || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Cặp Câu Hỏi & Trả Lời Huấn Luyện</span>
              </div>
              <span className="text-2xl font-bold">{systemHealth?.total_qa_pairs || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Tổng Số Người Dùng</span>
              </div>
              <span className="text-2xl font-bold">{systemHealth?.total_users || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}