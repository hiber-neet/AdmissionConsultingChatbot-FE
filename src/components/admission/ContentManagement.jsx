import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Input } from '../ui/system_users/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/system_users/card';
import { Badge } from '../ui/system_users/badge';
import { ScrollArea } from '../ui/system_users/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/system_users/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/system_users/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/system_users/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/system_users/tabs';

const articles = [
  {
    id: 1,
    title: 'Hướng Dẫn Xin Visa Du Học Mỹ 2025',
    status: 'published',
    views: 3420,
    growth: 15,
    publishedDate: '2024-10-05',
    category: 'Visa & Du Học',
  },
  {
    id: 2,
    title: 'Học Bổng Toàn Phần Cho Sinh Viên Quốc Tế',
    status: 'published',
    views: 2890,
    growth: 22,
    publishedDate: '2024-10-03',
    category: 'Học Bổng',
  },
  {
    id: 3,
    title: 'Quy Trình Đăng Ký Học Kỳ Mùa Xuân 2025',
    status: 'draft',
    views: 0,
    growth: 0,
    publishedDate: '-',
    category: 'Tuyển Sinh',
  },
  {
    id: 4,
    title: 'Chi Phí Sinh Hoạt Tại Khuôn Viên Trường',
    status: 'published',
    views: 2310,
    growth: -5,
    publishedDate: '2024-09-28',
    category: 'Chi Phí',
  },
  {
    id: 5,
    title: 'Chương Trình MBA Executive - Giới Thiệu',
    status: 'draft',
    views: 0,
    growth: 0,
    publishedDate: '-',
    category: 'Chương Trình',
  },
  {
    id: 6,
    title: 'Hướng Dẫn Nộp Hồ Sơ Trực Tuyến',
    status: 'published',
    views: 1890,
    growth: 8,
    publishedDate: '2024-09-25',
    category: 'Tuyển Sinh',
  },
];

export function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'published' && article.status === 'published') ||
      (activeTab === 'draft' && article.status === 'draft') ||
      (activeTab === 'archived' && article.status === 'archived');
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = {
    all: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    archived: articles.filter(a => a.status === 'archived').length,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2>Quản Lý Nội Dung</h2>
            <p className="text-muted-foreground">
              Tạo, chỉnh sửa và theo dõi hiệu suất bài viết
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tạo Bài Viết Mới
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="archived">Lưu trữ</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Lịch Xuất Bản
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Tất Cả</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.all}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Đã Xuất Bản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-600">{stats.published}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Bản Nháp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-orange-600">{stats.draft}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Lưu Trữ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-muted-foreground">{stats.archived}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Table */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Tất Cả ({stats.all})</TabsTrigger>
              <TabsTrigger value="published">Đã Xuất Bản ({stats.published})</TabsTrigger>
              <TabsTrigger value="draft">Bản Nháp ({stats.draft})</TabsTrigger>
              <TabsTrigger value="archived">Lưu Trữ ({stats.archived})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tiêu Đề</TableHead>
                      <TableHead>Danh Mục</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Lượt Xem</TableHead>
                      <TableHead>Tăng Trưởng</TableHead>
                      <TableHead>Ngày Xuất Bản</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.map((article) => (
                      <TableRow key={article.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{article.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{article.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={article.status === 'published' ? 'default' : 'secondary'}
                          >
                            {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            {article.views.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {article.growth !== 0 && (
                            <div className={`flex items-center gap-1 ${article.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              <TrendingUp className="h-3 w-3" />
                              {article.growth >= 0 ? '+' : ''}{article.growth}%
                            </div>
                          )}
                          {article.growth === 0 && <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {article.publishedDate}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Xem Phân Tích
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
