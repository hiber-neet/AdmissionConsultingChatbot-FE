import { Button } from '../../ui/system_users/button';
import { Input } from '../../ui/system_users/input';
import { Label } from '../../ui/system_users/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/system_users/dialog';
import { RoleSelector } from '../RoleSelector';
import { PermissionSelector } from '../PermissionSelector';
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

  const handleConsultantLeaderChange = (e) => {
    onFormChange({ ...formData, consultant_is_leader: e.target.checked });
  };

  const handleContentManagerLeaderChange = (e) => {
    onFormChange({ ...formData, content_manager_is_leader: e.target.checked });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {editingUser 
              ? 'Update user information and permissions.' 
              : 'Create a new user account. Please provide a secure password for the user.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ''}
                onChange={handlePasswordChange}
                placeholder="Enter initial password"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
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

            {/* Leadership Flags */}
            {formData.role && (formData.role === 'CONSULTANT' || formData.role === 'CONTENT_MANAGER') && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Leadership Settings</label>
                <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                  {formData.role === 'CONSULTANT' && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="consultant_leader"
                        checked={formData.consultant_is_leader || false}
                        onChange={handleConsultantLeaderChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="consultant_leader" className="text-sm font-normal text-gray-700">
                        Consultant Leader
                      </label>
                    </div>
                  )}
                  {formData.role === 'CONTENT_MANAGER' && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="content_manager_leader"
                        checked={formData.content_manager_is_leader || false}
                        onChange={handleContentManagerLeaderChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="content_manager_leader" className="text-sm font-normal text-gray-700">
                        Content Manager Leader
                      </label>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Leadership roles grant additional permissions and access to specialized features.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {editingUser ? 'Update' : 'Create'} User
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
    consultant_is_leader: PropTypes.bool,
    content_manager_is_leader: PropTypes.bool,
  }).isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};