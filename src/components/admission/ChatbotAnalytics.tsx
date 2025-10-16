import {
    MessageSquare,
    TrendingUp,
    XCircle,
    CheckCircle,
    Clock,
    Hash,
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

const dailyInteractionsData = [
    { day: 'T2', success: 245, failure: 32, transferred: 18 },
    { day: 'T3', success: 310, failure: 28, transferred: 22 },
    { day: 'T4', success: 278, failure: 35, transferred: 19 },
    { day: 'T5', success: 325, failure: 41, transferred: 25 },
    { day: 'T6', success: 290, failure: 38, transferred: 21 },
    { day: 'T7', success: 180, failure: 22, transferred: 14 },
    { day: 'CN', success: 150, failure: 18, transferred: 12 },
];

const responseTimeData = [
    { hour: '0h', avgTime: 1.8 },
    { hour: '4h', avgTime: 1.5 },
    { hour: '8h', avgTime: 2.3 },
    { hour: '12h', avgTime: 2.8 },
    { hour: '16h', avgTime: 2.5 },
    { hour: '20h', avgTime: 2.1 },
];

const topicDistribution = [
    { name: 'Học bổng', value: 342, color: '#3B82F6' },
    { name: 'Yêu cầu tuyển sinh', value: 289, color: '#10B981' },
    { name: 'Học phí', value: 256, color: '#F59E0B' },
    { name: 'Chương trình', value: 198, color: '#8B5CF6' },
    { name: 'Khác', value: 124, color: '#6B7280' },
];

const failureCases = [
    {
        id: 1,
        question: 'Làm thế nào để hoãn nhập học sang học kỳ sau?',
        count: 12,
        category: 'Tuyển sinh',
    },
    {
        id: 2,
        question: 'Chính sách chuyển tín chỉ từ trường cao đẳng cộng đồng?',
        count: 9,
        category: 'Học tập',
    },
    {
        id: 3,
        question: 'Các lựa chọn nhà ở cho sinh viên quốc tế?',
        count: 8,
        category: 'Đời sống',
    },
    {
        id: 4,
        question: 'Có chương trình MBA bán thời gian không?',
        count: 7,
        category: 'Chương trình',
    },
    {
        id: 5,
        question: 'Cập nhật thông tin liên lạc sau khi nộp hồ sơ?',
        count: 6,
        category: 'Hồ sơ',
    },
];

export function ChatbotAnalytics() {
    return (
        <ScrollArea className="h-full">
            <div className="p-6 pb-8 space-y-6">
                {/* Page Header */}
                <div>
                    <h2>Phân Tích Chatbot</h2>
                    <p className="text-muted-foreground">
                        Theo dõi hiệu suất và tối ưu hóa trải nghiệm người dùng
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm text-muted-foreground">
                                    Tổng Tương Tác
                                </CardTitle>
                                <MessageSquare className="h-4 w-4 text-blue-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl">1,778</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-green-600">↑ 12%</span> so với tuần trước
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm text-muted-foreground">
                                    Tỷ Lệ Thành Công
                                </CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl">92.3%</div>
                            <Progress value={92.3} className="mt-2 h-2" />
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm text-muted-foreground">
                                    Thời Gian Phản Hồi TB
                                </CardTitle>
                                <Clock className="h-4 w-4 text-orange-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl">2.3s</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-green-600">↓ 0.4s</span> cải thiện
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm text-muted-foreground">
                                    Trường Hợp Thất Bại
                                </CardTitle>
                                <XCircle className="h-4 w-4 text-red-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl">137</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                7.7% tổng số tương tác
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <Tabs defaultValue="interactions" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="interactions">Tương Tác Hàng Ngày</TabsTrigger>
                        <TabsTrigger value="topics">Phân Bổ Chủ Đề</TabsTrigger>
                        <TabsTrigger value="performance">Hiệu Suất</TabsTrigger>
                    </TabsList>

                    <TabsContent value="interactions" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tương Tác Chatbot Theo Ngày</CardTitle>
                                <CardDescription>Phân tích kết quả trong 7 ngày qua</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={dailyInteractionsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                                        <YAxis stroke="hsl(var(--muted-foreground))" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="success" fill="#10B981" name="Thành công" />
                                        <Bar dataKey="failure" fill="#EF4444" name="Thất bại" />
                                        <Bar dataKey="transferred" fill="#F59E0B" name="Chuyển cán bộ" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="topics" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Phân Bổ Chủ Đề Câu Hỏi</CardTitle>
                                    <CardDescription>Top danh mục được hỏi nhiều nhất</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={topicDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {topicDistribution.map((entry, index) => (
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
                                    <CardTitle>Chi Tiết Theo Chủ Đề</CardTitle>
                                    <CardDescription>Số lượng câu hỏi theo danh mục</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topicDistribution.map((topic, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="h-3 w-3 rounded-full"
                                                            style={{ backgroundColor: topic.color }}
                                                        />
                                                        <span className="text-sm">{topic.name}</span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {topic.value} câu hỏi
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={(topic.value / topicDistribution[0].value) * 100}
                                                    className="h-2"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thời Gian Phản Hồi Trung Bình</CardTitle>
                                <CardDescription>Xu hướng theo giờ trong ngày</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={responseTimeData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                                        <YAxis stroke="hsl(var(--muted-foreground))" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="avgTime"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dot={{ fill: '#3B82F6', r: 4 }}
                                            name="Thời gian TB (giây)"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Failure Cases */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Trường Hợp Chatbot Không Trả Lời Được</CardTitle>
                                <CardDescription>
                                    Những câu hỏi cần bổ sung vào cơ sở tri thức
                                </CardDescription>
                            </div>
                            <Badge variant="destructive" className="gap-1">
                                <XCircle className="h-3 w-3" />
                                {failureCases.length} câu hỏi phổ biến
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {failureCases.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Hash className="h-4 w-4 text-muted-foreground" />
                                            <p className="font-medium">{item.question}</p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <Badge variant="outline">{item.category}</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {item.count} lần thất bại
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
}
