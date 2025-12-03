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
  Clock
} from 'lucide-react';

export function StudentDetailDialog({ isOpen, onClose, userId }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      // But first, let's see what the actual ID looks like
      console.log('🔍 Original student ID:', id, 'Type:', typeof id);
      
      // Convert to string first to handle both string and number IDs
      const idString = String(id);
      
      let numericId;
      if (idString.startsWith('ST')) {
        // Remove "ST" prefix and leading zeros: "ST001" → "1"
        numericId = idString.replace('ST', '').replace(/^0+/, '') || '1';
      } else {
        // If it's already numeric, use as-is
        numericId = idString;
      }
      
      console.log('🔢 Converted numeric ID:', numericId);
      
      const baseUrl = 'http://localhost:8000';
      const url = `${baseUrl}/users/${numericId}`;
      
      console.log('📡 API Request:', { 
        url, 
        token: `${token.substring(0, 20)}...`,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token.substring(0, 20)}...`
        }
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

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
          console.log('📋 Trying to fetch all students from:', studentsUrl);
          
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
            } else {
              console.log('❌ Student not found in students list');
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

  // Fetch student when dialog opens or userId changes
  useEffect(() => {
    if (isOpen && userId) {
      fetchStudentDetail(userId);
    }
  }, [isOpen, userId]);

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

                {/* Raw API Data for Debug */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-2">Raw API Data (Dev Only)</div>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(student, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}