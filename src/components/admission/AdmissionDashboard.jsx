import { 
  FileText, 
  Eye, 
  MessageSquare, 
  TrendingUp,
  Clock,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Badge } from '../ui/system_users/badge';
import { Progress } from '../ui/system_users/progress';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Button } from '../ui/system_users/button';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const viewTrendsData = [
  { date: 'T2', views: 1240 },
  { date: 'T3', views: 1580 },
  { date: 'T4', views: 1420 },
  { date: 'T5', views: 1890 },
  { date: 'T6', views: 2100 },
  { date: 'T7', views: 1650 },
  { date: 'CN', views: 1380 },
];

const chatbotPerformanceData = [
  { name: 'Thành công', value: 856, color: '#10B981' },
  { name: 'Thất bại', value: 124, color: '#EF4444' },
  { name: 'Chuyển cán bộ', value: 89, color: '#F59E0B' },
];

const popularArticles = [
  { id: 1, title: 'Hướng Dẫn Xin Visa Du Học Mỹ 2025', views: 3420, growth: 15 },
  { id: 2, title: 'Học Bổng Toàn Phần Cho Sinh Viên Quốc Tế', views: 2890, growth: 22 },
  { id: 3, title: 'Top 10 Ngành Học Hot Nhất 2025', views: 2650, growth: 8 },
  { id: 4, title: 'Quy Trình Nộp Hồ Sơ Trực Tuyến', views: 2310, growth: -5 },
  { id: 5, title: 'Chi Phí Du Học Và Cách Tiết Kiệm', views: 2180, growth: 12 },
];

const trendingTopics = [
  { topic: 'Học bổng', count: 342 },
  { topic: 'Yêu cầu tuyển sinh', count: 289 },
  { topic: 'Học phí', count: 256 },
  { topic: 'Hạn nộp hồ sơ', count: 234 },
  { topic: 'Chương trình MBA', count: 198 },
];

export function AdmissionDashboard() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1>Tổng Quan Hôm Nay</h1>
          <p className="text-muted-foreground">
            Theo dõi hiệu suất và tương tác của sinh viên
          </p>
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
              <div className="text-3xl">1,069</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={92} className="h-2" />
                <span className="text-xs text-green-600">92% thành công</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Lượt Xem Bài Viết
                </CardTitle>
                <Eye className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">12,450</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">↑ 18%</span> so với tuần trước
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
              <div className="text-3xl">5</div>
              <p className="text-xs text-muted-foreground mt-1">
                Thời gian chờ TB: <span className="text-orange-600">3.5 phút</span>
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
              <div className="text-3xl">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Chờ xuất bản
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* View Trends Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Xu Hướng Lượt Xem</CardTitle>
              <CardDescription>Lượt xem bài viết trong 7 ngày qua</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={viewTrendsData}>
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
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    name="Lượt xem"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Chatbot Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Hiệu Suất Chatbot</CardTitle>
              <CardDescription>Phân bổ kết quả hôm nay</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chatbotPerformanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chatbotPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Popular Articles and Trending Topics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bài Viết Phổ Biến Tuần Này</CardTitle>
                  <CardDescription>Top 5 bài viết được xem nhiều nhất</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  Xem Tất Cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <div key={article.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm truncate">{article.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.views.toLocaleString()}
                        </span>
                        <span className={`text-xs ${article.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {article.growth >= 0 ? '↑' : '↓'} {Math.abs(article.growth)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chủ Đề Thịnh Hành</CardTitle>
                  <CardDescription>Câu hỏi phổ biến từ sinh viên</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  Xem Chi Tiết
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trendingTopics.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">{item.topic}</span>
                        <span className="text-xs text-muted-foreground">{item.count} câu hỏi</span>
                      </div>
                      <Progress 
                        value={(item.count / trendingTopics[0].count) * 100} 
                        className="h-2" 
                      />
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
            <CardTitle>Hành Động Nhanh</CardTitle>
            <CardDescription>Các tác vụ thường dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <FileText className="h-5 w-5" />
                <span className="text-sm">Tạo Bài Viết Mới</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Lịch Xuất Bản</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm">Báo Cáo Chi Tiết</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm">Bắt Đầu Tư Vấn</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
