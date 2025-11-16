import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  ChevronRight,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/system_users/card';
import { Input } from '../ui/system_users/input';
import { Button } from '../ui/system_users/button';
import { Badge } from '../ui/system_users/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/system_users/avatar';
import { ScrollArea } from '../ui/system_users/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/system_users/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/system_users/tabs';

// Student object structure:
// {
//   id: string,
//   name: string,
//   email: string,
//   phone: string,
//   location: string,
//   appliedDate: string,
//   program: string,
//   status: 'pending' | 'approved' | 'rejected' | 'reviewing',
//   gpa: number,
//   uploadedFiles: number,
//   avatar?: string,
//   testScore?: number
// }

const mockStudents = [
  {
    id: 'ST001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone: '+84 912 345 678',
    location: 'Hà Nội, Việt Nam',
    appliedDate: '2024-11-10',
    program: 'Khoa học Máy tính',
    status: 'approved',
    gpa: 3.8,
    uploadedFiles: 5,
    testScore: 95,
  },
  {
    id: 'ST002',
    name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    phone: '+84 987 654 321',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    appliedDate: '2024-11-12',
    program: 'Quản trị Kinh doanh',
    status: 'reviewing',
    gpa: 3.6,
    uploadedFiles: 4,
    testScore: 88,
  },
  {
    id: 'ST003',
    name: 'Lê Minh Cường',
    email: 'cuong.le@email.com',
    phone: '+84 901 234 567',
    location: 'Đà Nẵng, Việt Nam',
    appliedDate: '2024-11-08',
    program: 'Kỹ thuật Phần mềm',
    status: 'pending',
    gpa: 3.9,
    uploadedFiles: 6,
    testScore: 92,
  },
  {
    id: 'ST004',
    name: 'Phạm Thu Hà',
    email: 'ha.pham@email.com',
    phone: '+84 913 456 789',
    location: 'Hà Nội, Việt Nam',
    appliedDate: '2024-11-15',
    program: 'Khoa học Dữ liệu',
    status: 'reviewing',
    gpa: 3.7,
    uploadedFiles: 5,
    testScore: 90,
  },
  {
    id: 'ST005',
    name: 'Hoàng Đức Long',
    email: 'long.hoang@email.com',
    phone: '+84 902 345 678',
    location: 'Hải Phòng, Việt Nam',
    appliedDate: '2024-11-05',
    program: 'MBA',
    status: 'approved',
    gpa: 3.5,
    uploadedFiles: 7,
    testScore: 85,
  },
  {
    id: 'ST006',
    name: 'Vũ Thị Mai',
    email: 'mai.vu@email.com',
    phone: '+84 914 567 890',
    location: 'Cần Thơ, Việt Nam',
    appliedDate: '2024-11-14',
    program: 'Tài chính',
    status: 'pending',
    gpa: 3.4,
    uploadedFiles: 3,
    testScore: 82,
  },
  {
    id: 'ST007',
    name: 'Đỗ Văn Nam',
    email: 'nam.do@email.com',
    phone: '+84 903 456 789',
    location: 'Hà Nội, Việt Nam',
    appliedDate: '2024-11-03',
    program: 'Kỹ thuật',
    status: 'rejected',
    gpa: 3.0,
    uploadedFiles: 4,
    testScore: 70,
  },
  {
    id: 'ST008',
    name: 'Bùi Thanh Tùng',
    email: 'tung.bui@email.com',
    phone: '+84 915 678 901',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    appliedDate: '2024-11-11',
    program: 'Khoa học Máy tính',
    status: 'reviewing',
    gpa: 3.85,
    uploadedFiles: 5,
    testScore: 94,
  },
];

// Props: { onSelectStudent: (studentId: string) => void }
export function StudentList({ onSelectStudent }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { label: 'Đã Duyệt', variant: 'default', icon: CheckCircle2, color: 'text-green-600' },
      rejected: { label: 'Từ Chối', variant: 'destructive', icon: XCircle, color: 'text-red-600' },
      reviewing: { label: 'Đang Xét', variant: 'secondary', icon: Clock, color: 'text-blue-600' },
      pending: { label: 'Chờ Xử Lý', variant: 'outline', icon: Clock, color: 'text-orange-600' },
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesProgram = programFilter === 'all' || student.program === programFilter;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const stats = {
    total: mockStudents.length,
    approved: mockStudents.filter(s => s.status === 'approved').length,
    reviewing: mockStudents.filter(s => s.status === 'reviewing').length,
    pending: mockStudents.filter(s => s.status === 'pending').length,
  };

  const programs = Array.from(new Set(mockStudents.map(s => s.program)));

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2>Danh Sách Học Sinh</h2>
            <p className="text-muted-foreground">
              Quản lý và xem chi tiết hồ sơ của học sinh đã đăng ký
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Xuất Danh Sách
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                Tổng Học Sinh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                Đã Duyệt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                Đang Xét
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.reviewing}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                Chờ Xử Lý
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.pending}</div>
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
                  placeholder="Tìm kiếm theo tên, email, hoặc mã số..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Trạng Thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả Trạng Thái</SelectItem>
                  <SelectItem value="pending">Chờ Xử Lý</SelectItem>
                  <SelectItem value="reviewing">Đang Xét</SelectItem>
                  <SelectItem value="approved">Đã Duyệt</SelectItem>
                  <SelectItem value="rejected">Từ Chối</SelectItem>
                </SelectContent>
              </Select>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Chương Trình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả Chương Trình</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Danh Sách ({filteredStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Không tìm thấy học sinh nào phù hợp với bộ lọc
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => onSelectStudent(student.id)}
                    className="w-full p-4 hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{student.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {student.id}
                          </Badge>
                          {getStatusBadge(student.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{student.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{student.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(student.appliedDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm">
                            <GraduationCap className="h-3 w-3 text-muted-foreground" />
                            <span>{student.program}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">GPA:</span>{' '}
                            <span className="font-medium">{student.gpa.toFixed(2)}</span>
                          </div>
                          {student.testScore && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Điểm Test:</span>{' '}
                              <span className="font-medium">{student.testScore}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm">
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            <span>{student.uploadedFiles} tài liệu</span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
