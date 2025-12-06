import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/system_users/button';
import { Input } from '../../ui/system_users/input';
import { Label } from '../../ui/system_users/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/system_users/dialog';
import { RoleSelector } from '../RoleSelector';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

// Available permissions
const AVAILABLE_PERMISSIONS = [
  'admin',
  'consultant', 
  'content_manager',
  'admission_officer'
];

// Permissions available for editing (excludes admin)
const EDITABLE_PERMISSIONS = [
  'consultant', 
  'content_manager',
  'admission_officer'
];

const PERMISSION_LABELS = {
  'admin': 'Admin',
  'consultant': 'Consultant',
  'content_manager': 'Content Manager', 
  'admission_officer': 'Admission Officer'
};

// Permission name to ID mapping (should match backend)
const PERMISSION_NAME_TO_ID = {
  'admin': 1,
  'consultant': 2,
  'content_manager': 3,
  'admission_officer': 4
};

export function UserFormDialog({
  isOpen,
  onClose,
  editingUser,
  formData,
  onFormChange,
  onSubmit,
  onUserUpdated // New prop to refresh user list after changes
}) {
  const [permissionsToRevoke, setPermissionsToRevoke] = useState([]);
  const [permissionsToGrant, setPermissionsToGrant] = useState([]);
  const [consultantIsLeader, setConsultantIsLeader] = useState(false);
  const [contentManagerIsLeader, setContentManagerIsLeader] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [availableToGrant, setAvailableToGrant] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  // Helper function to get permissions available for editing
  // Excludes admin permission when editing existing users
  const getEditablePermissions = (isEditing = false) => {
    return isEditing ? EDITABLE_PERMISSIONS : AVAILABLE_PERMISSIONS;
  };

  // Helper function to filter permissions that can be revoked
  // Admin permission cannot be revoked through edit interface
  const getRevokablePermissions = (permissions) => {
    return permissions.filter(perm => perm !== 'admin');
  };

  // Function to determine user permissions from profile fields
  const derivePermissionsFromProfiles = (user) => {
    const permissions = [];
    
    // Check for admin permission (role_id === 1)
    if (user.role_id === 1) {
      permissions.push('admin');
    }
    
    // Check for consultant permission (has consultant_profile or role_id === 2)
    if (user.consultant_profile || user.role_id === 2) {
      permissions.push('consultant');
    }
    
    // Check for content_manager permission (has content_manager_profile or role_id === 3)
    if (user.content_manager_profile || user.role_id === 3) {
      permissions.push('content_manager');
    }
    
    // Check for admission_officer permission (has admission_official_profile or role_id === 4)
    if (user.admission_official_profile || user.role_id === 4) {
      permissions.push('admission_officer');
    }
    
    // Remove duplicates and return
    return Array.from(new Set(permissions));
  };

  // Fetch user's current permissions from the backend
  const fetchUserPermissions = async (userId) => {
    if (!userId) return;
    
    try {
      setLoadingPermissions(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/users/staffs`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const staffUsers = await response.json();
      
      console.log('All staff users:', staffUsers);
      console.log('Looking for user ID:', userId);
      
      // Find the specific user - try both id and user_id fields
      const user = staffUsers.find(u => 
        u.user_id?.toString() === userId?.toString() || 
        u.id?.toString() === userId?.toString()
      );
      
      console.log('Found user:', user);
      
      if (user) {
        console.log('User permissions from API:', user.permissions);
        console.log('Permissions array length:', user.permissions?.length);
        
        let permissionNames = [];
        
        if (user.permissions && Array.isArray(user.permissions) && user.permissions.length > 0) {
          // Extract permission names from the user's permissions
          permissionNames = user.permissions.map(p => {
            const name = p.permission_name?.toLowerCase();
            console.log('Processing permission:', p, 'normalized name:', name);
            // Normalize permission names to match our constants
            if (name === 'admin' || name === 'system_admin') return 'admin';
            if (name === 'consultant') return 'consultant';
            if (name === 'content_manager' || name === 'contentmanager') return 'content_manager';
            if (name === 'admission_officer') return 'admission_officer';
            if (name === 'admission_official') return 'admission_officer'; // Handle alternative name
            return name;
          }).filter(Boolean);
          
          console.log('Final permission names from API:', permissionNames);
        } else {
          // No permissions array available, derive from profile fields
          console.log('No permissions array found, deriving from profile fields');
          permissionNames = derivePermissionsFromProfiles(user);
          console.log('Derived permissions from profiles:', permissionNames);
        }
        
        // Ensure we have at least one permission
        if (permissionNames.length === 0) {
          console.log('No permissions found, falling back to role-based permission');
          // Fall back to role-based permission
          if (user.role_id === 1) permissionNames = ['admin'];
          else if (user.role_id === 2) permissionNames = ['consultant'];
          else if (user.role_id === 3) permissionNames = ['content_manager'];
          else if (user.role_id === 4) permissionNames = ['admission_officer'];
          else permissionNames = ['admission_officer']; // Default fallback
        }
        
        setCurrentPermissions(permissionNames);
        
        // Calculate available permissions (not currently held)
        // For editing, exclude admin permission
        const editablePerms = getEditablePermissions(!!editingUser);
        const available = editablePerms.filter(
          perm => !permissionNames.includes(perm)
        );
        setAvailableToGrant(available);
        
        // Set leadership flags
        setConsultantIsLeader(user.consultant_is_leader || false);
        setContentManagerIsLeader(user.content_manager_is_leader || false);
        
        console.log('Current permissions set to:', permissionNames);
        console.log('Available to grant:', available);
      } else {
        console.log('User not found in staff list');
        // User not found - try fallback to static data
        const fallbackPermissions = editingUser?.permissions || [];
        console.log('Using fallback permissions from editingUser:', fallbackPermissions);
        
        // If editingUser permissions are also empty, derive from profiles
        if (fallbackPermissions.length === 0 && editingUser) {
          const derivedPermissions = derivePermissionsFromProfiles(editingUser);
          console.log('Derived fallback permissions:', derivedPermissions);
          setCurrentPermissions(derivedPermissions);
          const editablePerms = getEditablePermissions(!!editingUser);
          setAvailableToGrant(editablePerms.filter(perm => !derivedPermissions.includes(perm)));
        } else {
          setCurrentPermissions(fallbackPermissions);
          const editablePerms = getEditablePermissions(!!editingUser);
          setAvailableToGrant(editablePerms.filter(perm => !fallbackPermissions.includes(perm)));
        }
      }
      
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      toast.error(`Failed to fetch user permissions: ${error.message}`);
      // Fallback to static data if fetch fails
      const fallbackPermissions = editingUser?.permissions || [];
      console.log('Using fallback permissions due to error:', fallbackPermissions);
      
      // If editingUser permissions are also empty, derive from profiles
      if (fallbackPermissions.length === 0 && editingUser) {
        const derivedPermissions = derivePermissionsFromProfiles(editingUser);
        console.log('Derived error fallback permissions:', derivedPermissions);
        setCurrentPermissions(derivedPermissions);
        const editablePerms = getEditablePermissions(!!editingUser);
        setAvailableToGrant(editablePerms.filter(perm => !derivedPermissions.includes(perm)));
      } else {
        setCurrentPermissions(fallbackPermissions);
        const editablePerms = getEditablePermissions(!!editingUser);
        setAvailableToGrant(editablePerms.filter(perm => !fallbackPermissions.includes(perm)));
      }
    } finally {
      setLoadingPermissions(false);
    }
  };

  // Reset when dialog opens/closes or editingUser changes
  useEffect(() => {
    if (isOpen && editingUser) {
      console.log('Dialog opened with editingUser:', editingUser);
      console.log('editingUser.id:', editingUser.id);
      console.log('editingUser.permissions:', editingUser.permissions);
      
      setPermissionsToRevoke([]);
      setPermissionsToGrant([]);
      
      // Fetch fresh permissions data
      fetchUserPermissions(editingUser.id);
    } else {
      setPermissionsToRevoke([]);
      setPermissionsToGrant([]);
      setCurrentPermissions([]);
      setAvailableToGrant([]);
      setConsultantIsLeader(false);
      setContentManagerIsLeader(false);
    }
  }, [isOpen, editingUser]);

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
    onFormChange({ ...formData, role });
  };

  const handleRevokePermissionToggle = (permission) => {
    // Prevent admin permission from being revoked through edit interface
    if (permission === 'admin') {
      console.warn('Admin permission cannot be revoked through edit interface');
      return;
    }
    
    setPermissionsToRevoke(prev => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleGrantPermissionToggle = (permission) => {
    setPermissionsToGrant(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)  
        : [...prev, permission]
    );
  };

  const callGrantAPI = async (userId, permissions, consultantLeader, contentManagerLeader) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = 'http://localhost:8000';
      const permissionIds = permissions
        .map(permName => PERMISSION_NAME_TO_ID[permName])
        .filter(id => id !== undefined);

      if (permissionIds.length === 0) {
        console.warn('No valid permission IDs found for grant:', permissions);
        return { added: [], skipped: [] };
      }

      const requestBody = {
        user_id: parseInt(userId),
        permission_ids: permissionIds,
        consultant_is_leader: consultantLeader,
        content_manager_is_leader: contentManagerLeader
      };

      console.log('Grant API request:', requestBody);

      const response = await fetch(`${baseUrl}/users/permissions/grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.detail || `Grant failed: HTTP ${response.status}`;
        } catch (parseError) {
          errorMessage = `Grant failed: HTTP ${response.status}: ${errorData}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Grant API response:', data);
      return data;

    } catch (error) {
      console.error('Grant API error:', error);
      throw error;
    }
  };

  const callRevokeAPI = async (userId, permissions) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = 'http://localhost:8000';
      const permissionIds = permissions
        .map(permName => PERMISSION_NAME_TO_ID[permName])
        .filter(id => id !== undefined);

      if (permissionIds.length === 0) {
        console.warn('No valid permission IDs found for revoke:', permissions);
        return { removed: [], skipped: [] };
      }

      const requestBody = {
        user_id: parseInt(userId),
        permission_ids: permissionIds
      };

      console.log('Revoke API request:', requestBody);

      const response = await fetch(`${baseUrl}/users/permissions/revoke`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.detail || `Revoke failed: HTTP ${response.status}`;
        } catch (parseError) {
          errorMessage = `Revoke failed: HTTP ${response.status}: ${errorData}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Revoke API response:', data);
      return data;

    } catch (error) {
      console.error('Revoke API error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingUser) {
      // For new users, use the original onSubmit
      onSubmit(e);
      return;
    }

    try {
      const userId = editingUser.id; // Use 'id' field, not 'user_id'
      let results = [];

      // 1. Revoke permissions first
      if (permissionsToRevoke.length > 0) {
        console.log('Revoking permissions:', permissionsToRevoke);
        const revokeResult = await callRevokeAPI(userId, permissionsToRevoke);
        results.push(`Revoked: ${revokeResult.removed?.length || 0} permissions`);
        if (revokeResult.skipped?.length > 0) {
          results.push(`Skipped revoke: ${revokeResult.skipped.length} permissions`);
        }
      }

      // 2. Grant permissions second
      if (permissionsToGrant.length > 0) {
        console.log('Granting permissions:', permissionsToGrant);
        const grantResult = await callGrantAPI(userId, permissionsToGrant, consultantIsLeader, contentManagerIsLeader);
        results.push(`Granted: ${grantResult.added?.length || 0} permissions`);
        if (grantResult.skipped?.length > 0) {
          results.push(`Skipped grant: ${grantResult.skipped.length} permissions`);
        }
      }

      // 3. Update basic user info if needed
      const hasBasicChanges = 
        formData.name !== editingUser.name ||
        formData.email !== editingUser.email ||
        formData.phone_number !== editingUser.phone_number ||
        formData.interest_desired_major !== editingUser.interest_desired_major ||
        formData.interest_region !== editingUser.interest_region ||
        (formData.password && formData.password.trim() !== '');

      if (hasBasicChanges) {
        // Call the original onSubmit for basic user data update
        await onSubmit(e);
        results.push('Updated basic user information');
      }

      // Show success message
      if (results.length > 0) {
        toast.success(`User updated successfully! ${results.join(', ')}`);
      } else {
        toast.info('No changes made');
      }

      // Refresh the user list if callback provided
      if (onUserUpdated) {
        await onUserUpdated();
      }

      // Close dialog
      onClose();

    } catch (error) {
      console.error('Failed to update user permissions:', error);
      toast.error(`Failed to update user: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogDescription>
            {editingUser 
              ? 'Update user information and manage permissions separately'
              : 'Fill out the information to create a new user'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic User Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={handleNameChange}
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={handleEmailChange}
                placeholder="Enter email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                {editingUser ? 'New Password (optional)' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ''}
                onChange={handlePasswordChange}
                placeholder={editingUser ? 'Leave blank to keep current password' : 'Enter password'}
                required={!editingUser}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone_number || ''}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="major">Interest Desired Major</Label>
              <Input
                id="major"
                value={formData.interest_desired_major || ''}
                onChange={handleInterestMajorChange}
                placeholder="Enter desired major"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Interest Region</Label>
              <Input
                id="region"
                value={formData.interest_region || ''}
                onChange={handleInterestRegionChange}
                placeholder="Enter interest region"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label>Role</Label>
            <RoleSelector
              selectedRole={formData.role || ''}
              onRoleChange={handleRoleChange}
            />
          </div>

          {/* Permission Management - Only for editing existing users */}
          {editingUser && (
            <div className="space-y-6 border-t pt-6">
              <h3 className="text-lg font-semibold">Permission Management</h3>
              
              {loadingPermissions ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading user permissions...</p>
                </div>
              ) : (
                <>
                  {/* Current Permissions Display */}
                  {currentPermissions.length > 0 ? (
                    <div className="space-y-3">
                      {/* Admin Permissions (Read-only) */}
                      {currentPermissions.includes('admin') && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-blue-600">
                            Admin Permission (Cannot be revoked through edit):
                          </Label>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <span className="text-sm text-blue-800 flex items-center">
                              <span className="mr-2">🔒</span>
                              {PERMISSION_LABELS['admin']}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Other Permissions (Revokable) */}
                      {getRevokablePermissions(currentPermissions).length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-red-600">
                            Current Permissions (select to revoke):
                          </Label>
                          <div className="grid grid-cols-2 gap-2 p-3 bg-red-50 border border-red-200 rounded">
                            {getRevokablePermissions(currentPermissions).map(permission => (
                              <label key={permission} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={permissionsToRevoke.includes(permission)}
                                  onChange={() => handleRevokePermissionToggle(permission)}
                                  className="rounded border-red-300"
                                />
                                <span className="text-sm text-red-800">
                                  {PERMISSION_LABELS[permission] || permission}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No current permissions found for this user.
                    </div>
                  )}

                  {/* Available Permissions - For Grant */}
                  {availableToGrant.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-green-600">
                        Available Permissions (select to grant)
                        {editingUser && <span className="text-xs text-gray-500"> - Admin permissions only available during creation</span>}:
                      </Label>
                      <div className="grid grid-cols-2 gap-2 p-3 bg-green-50 border border-green-200 rounded">
                        {availableToGrant.map(permission => (
                          <label key={permission} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={permissionsToGrant.includes(permission)}
                              onChange={() => handleGrantPermissionToggle(permission)}
                              className="rounded border-green-300"
                            />
                            <span className="text-sm text-green-800">
                              {PERMISSION_LABELS[permission] || permission}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Leadership Options */}
                  {(permissionsToGrant.includes('consultant') || (currentPermissions.includes('consultant') && !permissionsToRevoke.includes('consultant'))) && (
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={consultantIsLeader}
                      onChange={(e) => setConsultantIsLeader(e.target.checked)}
                    />
                    <span className="text-sm">Consultant Leader</span>
                  </label>
                </div>
              )}

              {(permissionsToGrant.includes('content_manager') || (currentPermissions.includes('content_manager') && !permissionsToRevoke.includes('content_manager'))) && (
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={contentManagerIsLeader}
                      onChange={(e) => setContentManagerIsLeader(e.target.checked)}
                    />
                    <span className="text-sm">Content Manager Leader</span>
                  </label>
                </div>
              )}

                  {/* Summary */}
                  <div className="text-sm text-gray-600">
                    {permissionsToRevoke.length > 0 && (
                      <p>Will revoke: {permissionsToRevoke.map(p => PERMISSION_LABELS[p]).join(', ')}</p>
                    )}
                    {permissionsToGrant.length > 0 && (
                      <p>Will grant: {permissionsToGrant.map(p => PERMISSION_LABELS[p]).join(', ')}</p>
                    )}
                    {permissionsToRevoke.length === 0 && permissionsToGrant.length === 0 && (
                      <p>No permission changes selected</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {editingUser ? 'Update User' : 'Create User'}
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
  formData: PropTypes.object.isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUserUpdated: PropTypes.func,
};

export default UserFormDialog;