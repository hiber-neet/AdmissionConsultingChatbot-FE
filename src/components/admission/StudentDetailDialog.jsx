import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/system_users/dialog';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { Badge } from '../ui/system_users/badge';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { 
  Mail, 
  Phone, 
  User, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Brain,
  BarChart3
} from 'lucide-react';
import { riasecAPI } from '../../services/fastapi';

export function StudentDetailDialog({ isOpen, onClose, userId }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [riasecResults, setRiasecResults] = useState([]);
  const [riasecLoading, setRiasecLoading] = useState(false);
  const [riasecError, setRiasecError] = useState(null);

  // Fetch student details from API
  const fetchStudentDetail = async (id) => {
    if (!id) return;
    
    console.log('👤 Fetching student details for ID:', id);
    setLoading(true);
    setError(null);
    setStudent(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Extract numeric ID from student ID (e.g., "ST001" → "1")
      const idString = String(id);
      let numericId;
      if (idString.startsWith('ST')) {
        numericId = idString.replace('ST', '').replace(/^0+/, '') || '1';
      } else {
        numericId = idString;
      }
      
      console.log('🔢 Converted numeric ID:', numericId);
      
      const baseUrl = 'http://localhost:8000';
      const url = `${baseUrl}/users/${numericId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url: url
        });
        
        // If 404, try alternative approaches
        if (response.status === 404) {
          console.log('🔄 User not found, checking available endpoints...');
          
          // Try fetching all students first to see what IDs exist
          const studentsUrl = `${baseUrl}/users/students`;
          const studentsResponse = await fetch(studentsUrl, {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (studentsResponse.ok) {
            const studentsData = await studentsResponse.json();
            console.log('📊 Available students:', studentsData);
            
            // Try to find the student in the list
            const foundStudent = studentsData.find(s => 
              s.user_id == numericId || 
              `ST${String(s.user_id).padStart(3, '0')}` === id
            );
            
            if (foundStudent) {
              console.log('✅ Found student in students list:', foundStudent);
              setStudent(foundStudent);
              return;
            }
          }
        }
        
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
      console.log('✅ Student detail received:', data);
      setStudent(data);

    } catch (err) {
      console.error('💥 Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch RIASEC results for the student
  const fetchRiasecResults = async (id) => {
    if (!id) return;
    
    console.log('🧠 Fetching RIASEC results for user ID:', id);
    setRiasecLoading(true);
    setRiasecError(null);
    setRiasecResults([]);

    try {
      // Convert ID to numeric if needed
      const idString = String(id);
      let numericId;
      if (idString.startsWith('ST')) {
        numericId = parseInt(idString.replace('ST', '').replace(/^0+/, '') || '1');
      } else {
        numericId = parseInt(idString);
      }
      
      console.log('🔢 Fetching RIASEC for numeric ID:', numericId);
      console.log('📞 Calling riasecAPI.getUserResults with ID:', numericId);
      
      const response = await riasecAPI.getUserResults(numericId);
      console.log('✅ RIASEC results received:', response);
      console.log('📦 Response type:', typeof response);
      console.log('📊 Response is array?:', Array.isArray(response));
      console.log('📏 Response length:', response?.length);
      
      setRiasecResults(response || []);

    } catch (err) {
      console.error('💥 RIASEC fetch error:', err);
      
      // Check different types of errors
      if (err.response?.status === 404) {
        console.log('ℹ️ No RIASEC results found for user - this is normal if they haven\'t taken the test');
        setRiasecResults([]);  // Empty array for no results
        setRiasecError(null);  // Clear error since 404 is expected
      } else if (err.response?.status === 500) {
        // Server error - usually means backend issue
        console.error('🔥 RIASEC API server error (500):', err.response?.data);
        setRiasecError('Lỗi máy chủ khi tải kết quả RIASEC. Vui lòng thử lại sau.');
      } else if (err.message === 'Internal Server Error') {
        // Generic server error without response object
        console.error('🔥 RIASEC API internal server error:', err.message);
        setRiasecError('Lỗi máy chủ nội bộ khi tải kết quả RIASEC. Vui lòng thử lại sau.');
      } else {
        // Other errors (network, etc.)
        console.error('💥 Real RIASEC API error:', err.response?.data || err.message);
        setRiasecError(err.response?.data?.detail || err.message || 'Không thể tải kết quả RIASEC');
      }
    } finally {
      setRiasecLoading(false);
    }
  };

  // Fetch student when dialog opens or userId changes
  useEffect(() => {
    if (isOpen && userId) {
      const fetchData = async () => {
        await fetchStudentDetail(userId);
        
        // Only fetch RIASEC results if student exists
        // Check if student was successfully loaded before fetching RIASEC
        if (student && !error) {
          fetchRiasecResults(userId);
        } else {
          console.log('ℹ️ Skipping RIASEC fetch - student not found or error occurred');
          setRiasecResults([]);
          setRiasecError(null);
          setRiasecLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isOpen, userId]);

  // Separate effect to fetch RIASEC after student is loaded
  useEffect(() => {
    if (student && !error && isOpen) {
      fetchRiasecResults(userId);
    }
  }, [student, error, isOpen, userId]);

  // Get status badge configuration
  const getStatusConfig = (status) => {
    if (status === true) {
      return { 
        label: 'Đã Kích Hoạt', 
        variant: 'default', 
        icon: CheckCircle2, 
        className: 'text-green-600' 
      };
    } else if (status === false) {
      return { 
        label: 'Chưa Kích Hoạt', 
        variant: 'secondary', 
        icon: XCircle, 
        className: 'text-orange-600' 
      };
    } else {
      return { 
        label: 'Không xác định', 
        variant: 'outline', 
        icon: AlertCircle, 
        className: 'text-gray-600' 
      };
    }
  };

  // Render field if it has a value
  const renderField = (label, value, IconComponent) => {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    return (
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <IconComponent className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground mb-1">{label}</div>
          <div className="text-sm font-medium break-words">{String(value)}</div>
        </div>
      </div>
    );
  };

  // Render RIASEC Results Section
  const renderRiasecSection = () => {
    return (
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-base">Kết Quả Trắc Nghiệm RIASEC</h4>
        </div>

        {riasecLoading && (
          <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
              <div className="text-sm text-muted-foreground">Đang tải kết quả RIASEC...</div>
            </div>
          </div>
        )}

        {riasecError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium">Không thể tải kết quả</div>
              <div className="text-xs mt-1">{riasecError}</div>
            </div>
          </div>
        )}

        {!riasecLoading && !riasecError && riasecResults.length === 0 && (
          <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            <BarChart3 className="h-4 w-4 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium">Chưa có kết quả trắc nghiệm</div>
              <div className="text-xs mt-1">Học sinh chưa thực hiện bài trắc nghiệm RIASEC</div>
            </div>
          </div>
        )}

        {!riasecLoading && !riasecError && riasecResults.length > 0 && (
          <div className="space-y-4">
            {riasecResults.map((result, index) => (
              <div key={index} className="p-4 bg-primary/5 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium">
                    Kết quả #{riasecResults.length - index}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {result.result_id || index + 1}
                  </div>
                </div>

                {/* Personality Type Result */}
                {result.result && (
                  <div className="mb-4 p-3 bg-white rounded border">
                    <div className="text-xs text-muted-foreground mb-1">Loại tính cách</div>
                    <div className="text-sm font-medium">{result.result}</div>
                  </div>
                )}

                {/* RIASEC Scores */}
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground mb-2">Điểm số các khía cạnh:</div>
                  
                  {[
                    { key: 'realistic', label: 'Thực tế (Realistic)', color: 'bg-green-500' },
                    { key: 'investigative', label: 'Nghiên cứu (Investigative)', color: 'bg-blue-500' },
                    { key: 'artistic', label: 'Nghệ thuật (Artistic)', color: 'bg-purple-500' },
                    { key: 'social', label: 'Xã hội (Social)', color: 'bg-orange-500' },
                    { key: 'enterprising', label: 'Kinh doanh (Enterprising)', color: 'bg-red-500' },
                    { key: 'conventional', label: 'Quy ước (Conventional)', color: 'bg-gray-500' }
                  ].map(({ key, label, color }) => {
                    const score = result[key] || 0;
                    const percentage = (score / 5.0) * 100;
                    
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium">{score.toFixed(1)}/5.0</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi Tiết Học Sinh</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 pr-4">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                  <div className="text-sm text-muted-foreground">Đang tải thông tin...</div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">Lỗi khi tải thông tin</div>
                  <div className="text-xs mt-1">{error}</div>
                </div>
              </div>
            )}

            {student && (
              <>
                {/* Avatar and Name */}
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {student.full_name 
                        ? student.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)
                        : 'NA'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">
                      {student.full_name || 'Không có tên'}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      ID: {student.user_id || 'N/A'}
                    </div>
                    {student.status !== null && student.status !== undefined && (
                      <div className="mt-2">
                        {(() => {
                          const StatusIcon = getStatusConfig(student.status).icon;
                          return (
                            <Badge 
                              variant={getStatusConfig(student.status).variant}
                              className={`gap-1 ${getStatusConfig(student.status).className}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {getStatusConfig(student.status).label}
                            </Badge>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Student Information */}
                <div className="space-y-3">
                  {renderField('Email', student.email, Mail)}
                  {renderField('Số Điện Thoại', student.phone_number, Phone)}
                  {renderField('Họ và Tên', student.full_name, User)}
                  {renderField('Ngày Tạo', 
                    student.created_at ? new Date(student.created_at).toLocaleDateString('vi-VN') : null, 
                    Calendar
                  )}
                  {renderField('Ngày Cập Nhật', 
                    student.updated_at ? new Date(student.updated_at).toLocaleDateString('vi-VN') : null, 
                    Calendar
                  )}
                  {student.role_id && renderField('Role ID', student.role_id, User)}
                </div>

                {/* RIASEC Results Section */}
                {renderRiasecSection()}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}