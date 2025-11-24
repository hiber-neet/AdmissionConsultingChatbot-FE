import { useState } from 'react';
import { Settings, Crown, Plus, Minus, Check, X, Users, FileText, MessageCircle, GraduationCap, User } from 'lucide-react';
import { Label } from '../ui/system_users/label';
import { Checkbox } from '../ui/system_users/checkbox';
import { Button } from '../ui/system_users/button';
import { Badge } from '../ui/system_users/badge';
import { Separator } from '../ui/system_users/separator';
import PropTypes from 'prop-types';

export function PermissionSelector({ role, selectedPermissions, onPermissionsChange, isEditing = false }) {
  // Available role permissions - each permission grants full access to that role's capabilities
  const availableRolePermissions = [
    {
      id: 'SYSTEM_ADMIN',
      name: 'System Admin',
      description: 'Full system administration access - user management, system settings, all modules',
      icon: Crown,
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'CONTENT_MANAGER', 
      name: 'Content Manager',
      description: 'Content creation and management - articles, reviews, publishing',
      icon: FileText,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'CONSULTANT',
      name: 'Consultant', 
      description: 'Consultation services - analytics, knowledge base, Q&A templates',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      id: 'ADMISSION_OFFICER',
      name: 'Admission Officer',
      description: 'Student admission management - consultations, queue management, insights',
      icon: GraduationCap,
      color: 'bg-orange-100 text-orange-800 border-orange-200'
    },
    {
      id: 'STUDENT',
      name: 'Student Access',
      description: 'Basic student privileges - profile access, limited features',
      icon: User,
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  ];

  const handlePermissionToggle = (permissionId) => {
    const currentPermissions = selectedPermissions || [];
    const isSelected = currentPermissions.includes(permissionId);
    
    let newPermissions;
    if (isSelected) {
      // Remove permission
      newPermissions = currentPermissions.filter(p => p !== permissionId);
    } else {
      // Add permission
      newPermissions = [...currentPermissions, permissionId];
    }
    
    onPermissionsChange(newPermissions);
  };

  const selectAllPermissions = () => {
    const allPermissions = availableRolePermissions.map(p => p.id);
    onPermissionsChange(allPermissions);
  };

  const clearAllPermissions = () => {
    onPermissionsChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Role Permissions
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectAllPermissions}
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            All
          </Button>
          <Button
            type="button"
            variant="outline" 
            size="sm"
            onClick={clearAllPermissions}
            className="text-xs"
          >
            <Minus className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <div className="font-medium mb-1">Role-Based Permissions</div>
        <div>Each permission grants full access to that role's capabilities. Users can have multiple role permissions to access different areas of the system.</div>
      </div>

      <Separator />

      {/* Current user's primary role */}
      {role && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Primary Role</div>
          <div className="text-xs text-gray-600">
            This user's primary role is <span className="font-medium">{role}</span>. 
            Additional permissions below grant access to other role capabilities.
          </div>
        </div>
      )}

      {/* Permission Grid */}
      <div className="grid gap-3">
        {availableRolePermissions.map((permission) => {
          const isSelected = selectedPermissions?.includes(permission.id);
          const Icon = permission.icon;
          const isPrimaryRole = role === permission.id;

          return (
            <div
              key={permission.id}
              className={`border rounded-lg p-4 transition-all ${
                isSelected 
                  ? `${permission.color} border-2` 
                  : 'border-gray-200 hover:border-gray-300'
              } ${isPrimaryRole ? 'ring-2 ring-blue-200' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{permission.name}</span>
                    {isPrimaryRole && (
                      <Badge variant="outline" className="text-xs">
                        Primary Role
                      </Badge>
                    )}
                    {isSelected && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {permission.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected permissions summary */}
      {selectedPermissions && selectedPermissions.length > 0 && (
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
          <div className="text-sm font-medium text-green-800 mb-2">
            Selected Permissions ({selectedPermissions.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedPermissions.map((permId) => {
              const permission = availableRolePermissions.find(p => p.id === permId);
              return permission ? (
                <Badge key={permId} variant="secondary" className="text-xs">
                  {permission.name}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Warning for no permissions */}
      {(!selectedPermissions || selectedPermissions.length === 0) && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
          <div className="text-sm text-amber-800">
            <X className="h-4 w-4 inline mr-1" />
            No additional permissions selected. User will only have access to their primary role capabilities.
          </div>
        </div>
      )}
    </div>
  );
}

PermissionSelector.propTypes = {
  role: PropTypes.string,
  selectedPermissions: PropTypes.arrayOf(PropTypes.string),
  onPermissionsChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};
