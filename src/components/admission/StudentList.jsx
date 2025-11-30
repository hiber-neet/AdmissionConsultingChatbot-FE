import { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';

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
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');

  // Function to transform API student data to component format
  const transformStudentData = (apiStudent) => {
    return {
      id: `ST${String(apiStudent.user_id || 0).padStart(3, '0')}`,
      name: apiStudent.full_name || 'Unknown Name',
      email: apiStudent.email || '',
      phone: apiStudent.phone_number || 'N/A',
      location: 'N/A', // API doesn't provide location
      appliedDate: new Date().toISOString().split('T')[0], // API doesn't provide applied date, use current date
      program: 'Chưa xác định', // API doesn't provide program
      status: apiStudent.status ? 'approved' : 'pending', // Map status boolean to string
      gpa: 0, // API doesn't provide GPA
      uploadedFiles: 0, // API doesn't provide uploaded files count
      testScore: null // API doesn't provide test score
    };
  };

  // Fetch students from API
  const fetchStudents = async () => {
    console.log('🔄 Fetching students from API...');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('No authentication token found. Please login again.');
        setStudents(mockStudents); // Fallback to mock data
        return;
      }

      const baseUrl = 'http://localhost:8000';
      console.log('📋 Request details:', {
        url: `${baseUrl}/users/students`,
        token: token ? `${token.substring(0, 20)}...` : 'No token'
      });

      const response = await fetch(`${baseUrl}/users/students`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.detail || `HTTP ${response.status}: ${response.statusText}`;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${errorData || response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ API Success:', {
        dataType: typeof data,
        dataLength: Array.isArray(data) ? data.length : 'Not array',
        data
      });

      // Transform API data to component format
      if (Array.isArray(data)) {
        console.log('📊 Response is array with', data.length, 'students');
        const transformedStudents = data.map(transformStudentData);
        console.log('🔄 Transformed students:', transformedStudents);
        setStudents(transformedStudents);
      } else {
        console.log('🤷 Unexpected response format, using fallback data');
        setStudents(mockStudents);
      }

    } catch (err) {
      console.error('💥 Fetch error:', err);
      toast.error(`Failed to fetch students: ${err.message}`);
      // Use fallback data when API fails
      console.log('🔄 Using fallback data due to API error');
      setStudents(mockStudents);
    } finally {
      setLoading(false);
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

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

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesProgram = programFilter === 'all' || student.program === programFilter;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const stats = {
    total: students.length,
    approved: students.filter(s => s.status === 'approved').length,
    reviewing: students.filter(s => s.status === 'reviewing').length,
    pending: students.filter(s => s.status === 'pending').length,
  };

  const programs = Array.from(new Set(students.map(s => s.program)));

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
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={fetchStudents}
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
              ) : (
                <Download className="h-4 w-4" />
              )}
              {loading ? 'Đang tải...' : 'Tải lại danh sách'}
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm">Đang tải danh sách học sinh từ API...</span>
          </div>
        )}

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
              {loading && <span className="text-sm font-normal text-muted-foreground ml-2">- Đang tải...</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                  <div className="text-muted-foreground">Đang tải danh sách học sinh...</div>
                </div>
              ) : filteredStudents.length === 0 ? (
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
                            <span className="truncate">{student.email || 'Chưa có email'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{student.phone || 'Chưa có SĐT'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{student.location || 'Chưa xác định'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(student.appliedDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm">
                            <GraduationCap className="h-3 w-3 text-muted-foreground" />
                            <span>{student.program || 'Chưa xác định'}</span>
                          </div>
                          {student.gpa > 0 && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">GPA:</span>{' '}
                              <span className="font-medium">{student.gpa.toFixed(2)}</span>
                            </div>
                          )}
                          {student.testScore && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Điểm Test:</span>{' '}
                              <span className="font-medium">{student.testScore}</span>
                            </div>
                          )}
                          {student.uploadedFiles > 0 && (
                            <div className="flex items-center gap-1 text-sm">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span>{student.uploadedFiles} tài liệu</span>
                            </div>
                          )}
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
