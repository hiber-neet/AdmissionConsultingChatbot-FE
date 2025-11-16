import { useState } from 'react';
import {
  Clock,
  User,
  MessageCircle,
  Search,
  Filter,
  UserPlus,
  AlertCircle,
  Globe,
  MapPin,
  Calendar,
  Tag,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Button } from '../ui/system_users/button';
import { Badge } from '../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Input } from '../ui/system_users/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/system_users/select';
import { Separator } from '../ui/system_users/separator';

// QueueRequest object structure:
// {
//   id: string,
//   name: string,
//   email: string,
//   phone: string,
//   studentType: 'international' | 'domestic',
//   topic: string,
//   message: string,
//   priority: 'high' | 'normal' | 'low',
//   waitTime: number (in minutes),
//   requestedAt: string,
//   avatar: string,
//   location?: string
// }

// RequestQueue component props:
// {
//   requests: QueueRequest[],
//   onTakeRequest: (requestId: string) => void
// }

export function RequestQueue({ requests, onTakeRequest }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === 'all' || request.studentType === filterType;
    const matchesPriority =
      filterPriority === 'all' || request.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { label: 'Cao', variant: 'destructive', color: 'text-red-600' },
      normal: { label: 'Trung Bình', variant: 'secondary', color: 'text-blue-600' },
      low: { label: 'Thấp', variant: 'outline', color: 'text-gray-600' },
    };
    return configs[priority];
  };

  const getWaitTimeColor = (minutes) => {
    if (minutes > 15) return 'text-red-600';
    if (minutes > 10) return 'text-orange-600';
    return 'text-green-600';
  };

  const stats = {
    total: requests.length,
    high: requests.filter(r => r.priority === 'high').length,
    avgWaitTime: Math.round(requests.reduce((sum, r) => sum + r.waitTime, 0) / requests.length) || 0,
    international: requests.filter(r => r.studentType === 'international').length,
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h2>Hàng Đợi Yêu Cầu Tư Vấn</h2>
          <p className="text-muted-foreground">
            Quản lý và nhận yêu cầu tư vấn từ học sinh và phụ huynh
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Tổng Yêu Cầu
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Đang chờ xử lý
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Ưu Tiên Cao
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.high}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Cần xử lý ngay
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Thời Gian Chờ TB
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.avgWaitTime}p</div>
              <p className="text-xs text-muted-foreground mt-1">
                Trung bình
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Sinh Viên Quốc Tế
                </CardTitle>
                <Globe className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.international}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Trong hàng đợi
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, email hoặc chủ đề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Loại Sinh Viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả</SelectItem>
                  <SelectItem value="international">Quốc Tế</SelectItem>
                  <SelectItem value="domestic">Trong Nước</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Mức Ưu Tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả Mức</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="normal">Trung Bình</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Request Queue List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Danh Sách Yêu Cầu ({filteredRequests.length})
            </h3>
            {filteredRequests.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Sắp xếp theo thời gian chờ
              </p>
            )}
          </div>

          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Không có yêu cầu nào trong hàng đợi.</p>
                  <p className="text-sm">
                    {searchQuery || filterType !== 'all' || filterPriority !== 'all'
                      ? 'Thử điều chỉnh bộ lọc của bạn.'
                      : 'Các yêu cầu mới sẽ hiển thị ở đây.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => {
              const priorityConfig = getPriorityConfig(request.priority);
              const waitTimeColor = getWaitTimeColor(request.waitTime);

              return (
                <Card
                  key={request.id}
                  className={`hover:shadow-md transition-all ${
                    request.priority === 'high' ? 'border-l-4 border-l-red-500' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback
                          className={`${
                            request.studentType === 'international'
                              ? 'bg-purple-500'
                              : 'bg-blue-500'
                          } text-white`}
                        >
                          {request.avatar}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base mb-1">
                              {request.name}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  request.studentType === 'international'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className="gap-1"
                              >
                                <Globe className="h-3 w-3" />
                                {request.studentType === 'international'
                                  ? 'Sinh viên Quốc tế'
                                  : 'Sinh viên Trong nước'}
                              </Badge>
                              <Badge variant={priorityConfig.variant} className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {priorityConfig.label}
                              </Badge>
                              <Badge variant="outline" className={`gap-1 ${waitTimeColor}`}>
                                <Clock className="h-3 w-3" />
                                Chờ {request.waitTime} phút
                              </Badge>
                            </div>
                          </div>
                          <Button
                            onClick={() => onTakeRequest(request.id)}
                            className="gap-2 flex-shrink-0"
                          >
                            <UserPlus className="h-4 w-4" />
                            Nhận Yêu Cầu
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-medium">Chủ đề: </span>
                              <span className="text-sm">{request.topic}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {request.message}
                            </div>
                          </div>

                          <Separator className="my-3" />

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              <span className="truncate">{request.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-3 w-3" />
                              <span>{request.phone}</span>
                            </div>
                            {request.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{request.location}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Yêu cầu lúc:{' '}
                              {new Date(request.requestedAt).toLocaleString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
