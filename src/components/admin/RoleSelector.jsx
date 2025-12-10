import { Shield, Edit, User, GraduationCap } from 'lucide-react';
import { Label } from '../ui/system_users/label';
import PropTypes from 'prop-types';

export function RoleSelector({ selectedRole, onRoleChange, isEditing = false }) {
  const roles = [
    {
      id: 'SYSTEM_ADMIN',
      label: 'Quản Trị Hệ Thống',
      description: 'Toàn quyền kiểm soát và quản lý hệ thống',
      icon: Shield,
      color: 'text-red-500'
    },
    {
      id: 'CONTENT_MANAGER',
      label: 'Quản Lý Nội Dung',
      description: 'Quản lý bài viết, cơ sở tri thức và nội dung',
      icon: Edit,
      color: 'text-blue-500'
    },
    {
      id: 'CONSULTANT',
      label: 'Tư Vấn Viên',
      description: 'Cung cấp dịch vụ tư vấn và phân tích',
      icon: User,
      color: 'text-green-500'
    },
    {
      id: 'ADMISSION_OFFICER',
      label: 'Nhân Viên Tuyển Sinh',
      description: 'Quản lý tuyển sinh và hồ sơ học sinh',
      icon: GraduationCap,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Vai Trò Tài Khoản</Label>
        <p className="text-xs text-muted-foreground mt-1">
          {isEditing 
            ? "Vai trò không thể thay đổi sau khi tạo" 
            : "Chọn vai trò chính cho tài khoản này (vĩnh viễn sau khi tạo)"
          }
        </p>
      </div>
      
      <div className="space-y-3">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div key={role.id} className="flex items-start space-x-3">
              <input
                type="radio"
                id={`role-${role.id}`}
                name="role"
                value={role.id}
                checked={selectedRole === role.id}
                onChange={(e) => onRoleChange(e.target.value)}
                disabled={isEditing}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
              />
              <Label 
                htmlFor={`role-${role.id}`} 
                className={`flex-1 cursor-pointer ${isEditing ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${role.color}`} />
                  <span className="font-medium">{role.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {role.description}
                </p>
              </Label>
            </div>
          );
        })}
      </div>
      
      {isEditing && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> User role is permanent and cannot be changed. 
            You can only modify permissions below.
          </p>
        </div>
      )}
    </div>
  );
}

RoleSelector.propTypes = {
  selectedRole: PropTypes.string,
  onRoleChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};