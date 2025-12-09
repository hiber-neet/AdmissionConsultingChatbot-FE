import { Button } from '../ui/system_users/button';
import { Input } from '../ui/system_users/input';
import { Label } from '../ui/system_users/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/system_users/dialog';
import { RoleSelector } from './RoleSelector';
import { PermissionSelector } from './PermissionSelector';
import PropTypes from 'prop-types';

export function UserFormDialog({
  isOpen,
  onClose,
  editingUser,
  formData,
  onFormChange,
  onSubmit
}) {
  const handleNameChange = (e) => {
    onFormChange({ ...formData, name: e.target.value });
  };

  const handleEmailChange = (e) => {
    onFormChange({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    onFormChange({ ...formData, password: e.target.value });
  };

  const handlePhoneChange = (e) => {
    onFormChange({ ...formData, phone_number: e.target.value });
  };

  const handleInterestMajorChange = (e) => {
    onFormChange({ ...formData, interest_desired_major: e.target.value });
  };

  const handleInterestRegionChange = (e) => {
    onFormChange({ ...formData, interest_region: e.target.value });
  };

  const handleRoleChange = (role) => {
    onFormChange({ ...formData, role, permissions: [] }); // Reset permissions when role changes
  };

  const handlePermissionsChange = (permissions) => {
    onFormChange({ ...formData, permissions });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingUser ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}</DialogTitle>
          <DialogDescription>
            {editingUser ? 'Update user information and role' : 'Create a new user account'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và Tên</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleEmailChange}
              placeholder="user@university.edu"
            />
          </div>

          {!editingUser && (
            <div className="space-y-2">
              <Label htmlFor="password">Mật Khẩu</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
              />
            </div>
          )}

          {editingUser && (
            <div className="space-y-2">
              <Label htmlFor="password">New Password (leave blank to keep current)</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handlePasswordChange}
                placeholder="Enter new password or leave blank"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Số Điện Thoại</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone_number || ''}
              onChange={handlePhoneChange}
              placeholder="Enter phone number"
            />
          </div>

          {!editingUser && (
            <>
              <div className="space-y-2">
                <Label htmlFor="interest_major">Interest - Desired Major (Optional)</Label>
                <Input
                  id="interest_major"
                  value={formData.interest_desired_major || ''}
                  onChange={handleInterestMajorChange}
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest_region">Interest - Region (Optional)</Label>
                <Input
                  id="interest_region"
                  value={formData.interest_region || ''}
                  onChange={handleInterestRegionChange}
                  placeholder="e.g. Hanoi"
                />
              </div>
            </>
          )}

          <div className="space-y-6">
            {/* Role Selection */}
            <RoleSelector
              selectedRole={formData.role}
              onRoleChange={handleRoleChange}
              isEditing={!!editingUser}
            />

            {/* Permission Management */}
            {formData.role && (
              <PermissionSelector
                role={formData.role}
                selectedPermissions={formData.permissions || []}
                onPermissionsChange={handlePermissionsChange}
                isEditing={!!editingUser}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={onSubmit}>
            {editingUser ? 'Update' : 'Tạo Mới'} User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

UserFormDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editingUser: PropTypes.object,
  formData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.string),
    phone_number: PropTypes.string,
    interest_desired_major: PropTypes.string,
    interest_region: PropTypes.string,
  }).isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};