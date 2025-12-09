import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/Auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Label } from '../ui/system_users/label';
import { Badge } from '../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { Separator } from '../ui/system_users/separator';
import { 
  User, 
  Mail, 
  Shield, 
  UserCheck,
  Settings,
  Phone
} from 'lucide-react';
import { fastAPIProfile } from '../../services/fastapi';

interface UserProfile {
  user_id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  permission?: string[];
  role_name?: string;
  consultant_profile?: {
    status: boolean;
    is_leader: boolean;
  };
  content_manager_profile?: {
    is_leader: boolean;
  };
  admission_official_profile?: {
    rating: number;
    current_sessions: number;
    max_sessions: number;
    status: string;
  };
  consultant_is_leader?: boolean;
  content_manager_is_leader?: boolean;
}

export function ManagerProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fastAPIProfile.getUserById(parseInt(user.id));
        console.log('Profile data fetched:', response);
        setProfileData(response as UserProfile);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Không thể tải dữ liệu hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      'SYSTEM_ADMIN': 'System Administrator',
      'CONSULTANT': 'Consultant',
      'CONTENT_MANAGER': 'Content Manager',
      'ADMISSION_OFFICER': 'Admission Officer'
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'admin': 'destructive',
      'SYSTEM_ADMIN': 'destructive',
      'consultant': 'default',
      'CONSULTANT': 'default',
      'content_manager': 'secondary',
      'CONTENT_MANAGER': 'secondary',
      'admission_officer': 'outline',
      'ADMISSION_OFFICER': 'outline'
    };
    return variantMap[role] || 'default';
  };

  const getDisplayRole = (): string => {
    if (!profileData) return user?.role || 'Người dùng';
    
    // Check permissions to determine role
    if (profileData.permission?.includes('Admin')) return 'Quản trị viên hệ thống';
    if (profileData.permission?.includes('Consultant')) return 'Tư vấn viên';
    if (profileData.permission?.includes('Content Manager')) return 'Quản lý nội dung';
    if (profileData.permission?.includes('Admission Official')) return 'Nhân viên tuyển sinh';
    
    return profileData.role_name || user?.role || 'Người dùng';
  };

  const isLeader = (): boolean => {
    if (!profileData) return false;
    return profileData.consultant_is_leader || profileData.content_manager_is_leader || false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Không có dữ liệu hồ sơ</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hồ Sơ Người Dùng</h1>
          <p className="text-muted-foreground">Xem thông tin tài khoản của bạn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông Tin Cá Nhân
            </CardTitle>
            <CardDescription>
              Thông tin tài khoản cơ bản và chi tiết liên hệ của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {profileData.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{profileData.full_name}</h3>
                <p className="text-muted-foreground">{profileData.email}</p>
                <Badge variant={getRoleBadgeVariant(getDisplayRole())} className="mt-2">
                  <Shield className="h-3 w-3 mr-1" />
                  {getDisplayRole()}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và Tên</Label>
                <div className="p-3 bg-muted rounded-md">
                  {profileData.full_name || 'Chưa cung cấp'}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Địa Chỉ Email</Label>
                <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {profileData.email || 'Chưa cung cấp'}
                </div>
              </div>

              {profileData.phone_number && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Số Điện Thoại</Label>
                  <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {profileData.phone_number}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Permissions & Role Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Vai Trò & Quyền Hạn
            </CardTitle>
            <CardDescription>
              Cấp độ truy cập và quyền hạn của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Vai Trò</Label>
              <Badge variant={getRoleBadgeVariant(getDisplayRole())} className="text-sm px-3 py-1">
                <Shield className="h-3 w-3 mr-1" />
                {getDisplayRole()}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label>Trạng Thái Lãnh Đạo</Label>
              <div className="flex items-center gap-2">
                {isLeader() ? (
                  <Badge variant="default" className="text-xs">
                    👑 Trưởng nhóm
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    👤 Thành viên
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Quyền Hạn ({profileData.permission?.length || 0})</Label>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {profileData.permission && profileData.permission.length > 0 ? (
                  profileData.permission.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                      {permission}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Chưa có quyền hạn nào được gán</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Thông Tin Tài Khoản
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Mã Người Dùng</Label>
                <p className="text-sm text-muted-foreground">{profileData.user_id}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sm font-medium">Loại Vai Trò</Label>
                <p className="text-sm text-muted-foreground">{getDisplayRole()}</p>
              </div>
            </div>

            {/* Profile-specific information */}
            {profileData.consultant_profile && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Hồ Sơ Tư Vấn Viên</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Trạng Thái</Label>
                      <Badge variant={profileData.consultant_profile.status ? "default" : "secondary"} className="text-xs">
                        {profileData.consultant_profile.status ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Lãnh Đạo</Label>
                      <Badge variant={profileData.consultant_profile.is_leader ? "default" : "outline"} className="text-xs">
                        {profileData.consultant_profile.is_leader ? "👑 Trưởng nhóm" : "👤 Thành viên"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            )}

            {profileData.content_manager_profile && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Hồ Sơ Quản Lý Nội Dung</Label>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Lãnh Đạo</Label>
                    <Badge variant={profileData.content_manager_profile.is_leader ? "default" : "outline"} className="text-xs">
                      {profileData.content_manager_profile.is_leader ? "👑 Trưởng nhóm" : "👤 Thành viên"}
                    </Badge>
                  </div>
                </div>
              </>
            )}

            {profileData.admission_official_profile && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Hồ Sơ Nhân Viên Tuyển Sinh</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Đánh Giá</Label>
                      <p className="text-sm">⭐ {profileData.admission_official_profile.rating || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Phiên Tư Vấn</Label>
                      <p className="text-sm">{profileData.admission_official_profile.current_sessions || 0} / {profileData.admission_official_profile.max_sessions || 10}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Trạng Thái</Label>
                      <Badge variant={profileData.admission_official_profile.status === "available" ? "default" : "secondary"} className="text-xs">
                        {profileData.admission_official_profile.status === "available" ? "Sẵn sàng" : profileData.admission_official_profile.status || "N/A"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}