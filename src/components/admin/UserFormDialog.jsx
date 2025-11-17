import { Button } from '../ui/system_users/button';
import { Input } from '../ui/system_users/input';
import { Label } from '../ui/system_users/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/system_users/dialog';
import { RoleSelector } from './RoleSelector';
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

  const handleUsernameChange = (e) => {
    onFormChange({ ...formData, username: e.target.value });
  };

  const handleEmailChange = (e) => {
    onFormChange({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    onFormChange({ ...formData, password: e.target.value });
  };

  const handleRolesChange = (roles) => {
    onFormChange({ ...formData, roles });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {editingUser ? 'Update user information and role' : 'Create a new user account'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={handleUsernameChange}
              placeholder="Enter username"
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

          <RoleSelector
            selectedRoles={formData.roles}
            onRolesChange={handleRolesChange}
            isEditing={!!editingUser}
          />
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
    username: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};