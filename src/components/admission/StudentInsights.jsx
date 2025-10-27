import {
  TrendingUp,
  Globe,
  Users,
  BookOpen,
  Target,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Badge } from '../ui/system_users/badge';
import { Progress } from '../ui/system_users/progress';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/system_users/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

const interestTrendsData = [
  { month: 'T6', 'Học bổng': 420, 'Chương trình': 280, 'Tuyển sinh': 310, 'Chi phí': 250 },
  { month: 'T7', 'Học bổng': 450, 'Chương trình': 320, 'Tuyển sinh': 340, 'Chi phí': 270 },
  { month: 'T8', 'Học bổng': 580, 'Chương trình': 380, 'Tuyển sinh': 420, 'Chi phí': 310 },
  { month: 'T9', 'Học bổng': 620, 'Chương trình': 420, 'Tuyển sinh': 480, 'Chi phí': 340 },
  { month: 'T10', 'Học bổng': 680, 'Chương trình': 450, 'Tuyển sinh': 520, 'Chi phí': 380 },
];

const geographicData = [
  { country: 'Việt Nam', visitors: 4520, percentage: 45, color: '#3B82F6' },
  { country: 'Hoa Kỳ', visitors: 2180, percentage: 22, color: '#10B981' },
  { country: 'Trung Quốc', visitors: 1340, percentage: 13, color: '#F59E0B' },
  { country: 'Hàn Quốc', visitors: 980, percentage: 10, color: '#8B5CF6' },
  { country: 'Khác', visitors: 1020, percentage: 10, color: '#6B7280' },
];

const demographicData = [
  { age: '18-22', count: 3420 },
  { age: '23-25', count: 2890 },
  { age: '26-30', count: 1650 },
  { age: '31-35', count: 820 },
  { age: '36+', count: 560 },
];

const programInterests = [
  { program: 'Khoa học Máy tính', count: 1240, growth: 18 },
  { program: 'Quản trị Kinh doanh', count: 980, growth: 12 },
  { program: 'Kỹ thuật', count: 850, growth: 15 },
  { program: 'Khoa học Dữ liệu', count: 720, growth: 25 },
  { program: 'MBA', count: 650, growth: 8 },
  { program: 'Tài chính', count: 540, growth: -3 },
];

const topPages = [
  { page: 'Học Bổng Toàn Phần', views: 8420, avgTime: '4:32' },
  { page: 'Yêu Cầu Tuyển Sinh', views: 7280, avgTime: '3:45' },
  { page: 'Hướng Dẫn Visa', views: 6890, avgTime: '5:18' },
  { page: 'Chi Phí & Học Phí', views: 6120, avgTime: '3:22' },
  { page: 'Chương Trình MBA', views: 5680, avgTime: '4:05' },
];

export function StudentInsights() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h2>Thông Tin Học Sinh</h2>
          <p className="text-muted-foreground">
            Phân tích xu hướng quan tâm và hành vi của sinh viên
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Tổng Lượt Truy Cập
                </CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">10,040</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">↑ 24%</span> so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Lượt Truy Cập Duy Nhất
                </CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">7,234</div>
              <p className="text-xs text-muted-foreground mt-1">
                72% tổng số lượt truy cập
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Thời Gian TB / Phiên
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">4:18</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">↑ 12%</span> mức độ tương tác
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Quốc Gia
                </CardTitle>
                <Globe className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">45+</div>
              <p className="text-xs text-muted-foreground mt-1">
                Phạm vi toàn cầu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Different Insights */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Xu Hướng Quan Tâm</TabsTrigger>
            <TabsTrigger value="geographic">Phân Bố Địa Lý</TabsTrigger>
            <TabsTrigger value="demographic">Nhân Khẩu Học</TabsTrigger>
            <TabsTrigger value="programs">Chương Trình</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Xu Hướng Chủ Đề Quan Tâm</CardTitle>
                <CardDescription>
                  Theo dõi sự thay đổi quan tâm của sinh viên theo thời gian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={interestTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Học bổng" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Chương trình" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="Tuyển sinh" stroke="#F59E0B" strokeWidth={2} />
                    <Line type="monotone" dataKey="Chi phí" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Trang Được Xem Nhiều Nhất</CardTitle>
                <CardDescription>Top 5 nội dung hút sinh viên</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPages.map((page, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{page.page}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {page.views.toLocaleString()} lượt xem
                            </span>
                            <span className="text-sm text-muted-foreground">
                              TB: {page.avgTime}
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={(page.views / topPages[0].views) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geographic" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phân Bố Địa Lý</CardTitle>
                  <CardDescription>Lượt truy cập theo quốc gia</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={geographicData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="visitors"
                      >
                        {geographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chi Tiết Theo Quốc Gia</CardTitle>
                  <CardDescription>Số lượng lượt truy cập từ mỗi khu vực</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {geographicData.map((country, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{country.country}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {country.visitors.toLocaleString()}
                            </span>
                            <Badge variant="outline">{country.percentage}%</Badge>
                          </div>
                        </div>
                        <Progress value={country.percentage * 10} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Phân Bố Độ Tuổi</CardTitle>
                <CardDescription>Nhân khẩu học của người truy cập</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={demographicData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="age" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" name="Số lượng" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Chương Trình Được Quan Tâm</CardTitle>
                <CardDescription>
                  Mức độ quan tâm và xu hướng tăng trưởng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programInterests.map((program, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{program.program}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {program.count} quan tâm
                            </span>
                            <Badge 
                              variant={program.growth >= 0 ? "default" : "destructive"}
                              className="gap-1"
                            >
                              <TrendingUp className="h-3 w-3" />
                              {program.growth >= 0 ? '+' : ''}{program.growth}%
                            </Badge>
                          </div>
                        </div>
                        <Progress 
                          value={(program.count / programInterests[0].count) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
