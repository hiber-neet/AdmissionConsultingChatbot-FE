import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Mail,
  Phone,
  GraduationCap,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/system_users/card';
import { Input } from '../ui/system_users/input';
import { Badge } from '../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { ScrollArea } from '../ui/system_users/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/system_users/select';
import { toast } from 'react-toastify';
import { StudentDetailDialog } from './StudentDetailDialog';
import { API_CONFIG } from '../../config/api.js';

// Props: { onSelectStudent: (studentId: string) => void }
export function StudentList({ onSelectStudent }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Handle student selection
  const handleStudentClick = (studentId) => {
    console.log('Selected student:', studentId);
    setSelectedStudentId(studentId); // Use actual user_id
    setIsDetailDialogOpen(true);
    
    // Also call the parent callback if provided
    if (onSelectStudent && typeof onSelectStudent === 'function') {
      onSelectStudent(studentId);
    }
  };

  // Function to transform API student data to component format
  const transformStudentData = (apiStudent) => {
    return {
      id: apiStudent.user_id, // Use actual user_id directly
      name: apiStudent.full_name || 'Chưa có tên',
      email: apiStudent.email || 'Chưa có email',
      phone: apiStudent.phone_number || 'Chưa có SĐT',
      status: apiStudent.status, // Boolean: true = active, false = inactive
      role_name: apiStudent.role_name || 'Student',
    };
  };

  // Fetch students from API
  const fetchStudents = async () => {
    console.log('Fetching students from API...');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('No authentication token found. Please login again.');
        setStudents([]);
        return;
      }

      const baseUrl = API_CONFIG.FASTAPI_BASE_URL;
      const response = await fetch(`${baseUrl}/users/students`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
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

      // Transform API data to component format
      if (Array.isArray(data)) {
        const transformedStudents = data.map(transformStudentData);
        setStudents(transformedStudents);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(`Failed to load students: ${error.message}`);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Get status badge based on status value
  const getStatusBadge = (status) => {
    if (status) {
      return (
        <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Hoạt động
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" />
          Không hoạt động
        </Badge>
      );
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && student.status === true) ||
      (statusFilter === 'inactive' && student.status === false);

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: students.length,
    active: students.filter(s => s.status === true).length,
    inactive: students.filter(s => s.status === false).length,
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-6 pb-24">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Tổng số
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Hoạt động
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.active}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Không hoạt động
                </CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stats.inactive}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
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
                  Không tìm thấy học sinh nào
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleStudentClick(student.id)}
                    className="w-full p-4 hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{student.name}</span>
                          {student.role_name && (
                            <Badge variant="outline" className="text-xs">
                              {student.role_name}
                            </Badge>
                          )}
                          {getStatusBadge(student.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{student.phone}</span>
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

        {/* Student Detail Dialog */}
        <StudentDetailDialog
          isOpen={isDetailDialogOpen}
          onClose={() => setIsDetailDialogOpen(false)}
          userId={selectedStudentId}
        />
      </div>
    </ScrollArea>
  );
}
