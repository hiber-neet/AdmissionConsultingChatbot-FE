import { useState } from 'react';
import { Settings, Crown, Plus, Minus, Check, X } from 'lucide-react';
import { Label } from '../ui/system_users/label';
import { Checkbox } from '../ui/system_users/checkbox';
import { Button } from '../ui/system_users/button';
import { Badge } from '../ui/system_users/badge';
import { Separator } from '../ui/system_users/separator';
import { ROLE_PERMISSIONS, LEADER_PERMISSIONS, getRolePermissions } from '../../constants/permissions';
import PropTypes from 'prop-types';

export function PermissionSelector({ role, selectedPermissions, onPermissionsChange, isEditing = false }) {
  const [isLeaderMode, setIsLeaderMode] = useState(false);

  // Get base permissions for the role
  const basePermissions = ROLE_PERMISSIONS[role] || [];
  const leaderPermissions = LEADER_PERMISSIONS[role] || [];
  const allRolePermissions = getRolePermissions(role, true); // Include leader permissions

  // Permission categories for better organization
  const permissionCategories = {
    'System Management': [
      'MANAGE_USERS',
      'MANAGE_ROLES', 
      'VIEW_ACTIVITY_LOG',
      'MANAGE_SYSTEM_SETTINGS',
      'ACCESS_ALL_MODULES'
    ],
    'Content Management': [
      'VIEW_CONTENT_DASHBOARD',
      'MANAGE_ARTICLES',
      'CREATE_ARTICLE',
      'EDIT_ARTICLE',
      'DELETE_ARTICLE',
      'PUBLISH_ARTICLE',
      'REVIEW_CONTENT',
      'MANAGE_RIASEC',
      'VIEW_ARTICLE_ANALYTICS'
    ],
    'Consultation Services': [
      'VIEW_CONSULTANT_OVERVIEW',
      'VIEW_ANALYTICS',
      'MANAGE_KNOWLEDGE_BASE',
      'CREATE_QA_TEMPLATE',
      'EDIT_QA_TEMPLATE',
      'DELETE_QA_TEMPLATE',
      'APPROVE_QA_TEMPLATE',
      'MANAGE_DOCUMENTS',
      'OPTIMIZE_CONTENT'
    ],
    'Admission Management': [
      'VIEW_ADMISSION_DASHBOARD',
      'MANAGE_STUDENT_QUEUE',
      'CONDUCT_CONSULTATION',
      'VIEW_STUDENT_INSIGHTS',
      'MANAGE_STUDENT_PROFILES',
      'ACCESS_LIVE_CHAT',
      'VIEW_KNOWLEDGE_BASE'
    ],
    'Student Services': [
      'VIEW_PROFILE',
      'EDIT_PROFILE',
      'TAKE_RIASEC_TEST',
      'VIEW_RIASEC_RESULTS',
      'ACCESS_CHATBOT',
      'VIEW_ARTICLES',
      'REQUEST_CONSULTATION'
    ]
  };

  // Get permissions that are available for this role
  const availablePermissions = allRolePermissions;
  
  // Filter categories to only show relevant permissions
  const relevantCategories = Object.entries(permissionCategories)
    .filter(([category, perms]) => perms.some(perm => availablePermissions.includes(perm)))
    .reduce((acc, [category, perms]) => {
      acc[category] = perms.filter(perm => availablePermissions.includes(perm));
      return acc;
    }, {});

  const handlePermissionToggle = (permission, checked) => {
    const newPermissions = checked 
      ? [...selectedPermissions, permission]
      : selectedPermissions.filter(p => p !== permission);
    onPermissionsChange(newPermissions);
  };

  const handleToggleLeaderMode = () => {
    const newIsLeader = !isLeaderMode;
    setIsLeaderMode(newIsLeader);
    
    if (newIsLeader) {
      // Add all leader permissions
      const newPermissions = [...new Set([...selectedPermissions, ...leaderPermissions])];
      onPermissionsChange(newPermissions);
    } else {
      // Remove leader permissions
      const newPermissions = selectedPermissions.filter(p => !leaderPermissions.includes(p));
      onPermissionsChange(newPermissions);
    }
  };

  const handleSelectAllBase = () => {
    const newPermissions = [...new Set([...selectedPermissions, ...basePermissions])];
    onPermissionsChange(newPermissions);
  };

  const handleClearAll = () => {
    onPermissionsChange([]);
    setIsLeaderMode(false);
  };

  const formatPermissionName = (permission) => {
    return permission
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const isBasePermission = (permission) => basePermissions.includes(permission);
  const isLeaderPermission = (permission) => leaderPermissions.includes(permission);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Permissions Management</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Grant or revoke specific permissions for this user
          </p>
        </div>
        
        {/* Leader Mode Toggle */}
        {leaderPermissions.length > 0 && (
          <Button
            type="button"
            variant={isLeaderMode ? "default" : "outline"}
            size="sm"
            onClick={handleToggleLeaderMode}
            className="gap-2"
          >
            <Crown className="h-4 w-4" />
            {isLeaderMode ? 'Leader Mode' : 'Regular Mode'}
          </Button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectAllBase}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Base Permissions
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          className="gap-2"
        >
          <Minus className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      {/* Permission Categories */}
      <div className="space-y-4 border rounded-lg p-4">
        {Object.entries(relevantCategories).map(([category, permissions]) => (
          <div key={category}>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block">
              {category}
            </Label>
            <div className="grid grid-cols-1 gap-2 ml-4">
              {permissions.map((permission) => {
                const isSelected = selectedPermissions.includes(permission);
                const isBase = isBasePermission(permission);
                const isLeader = isLeaderPermission(permission);
                
                return (
                  <div key={permission} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`perm-${permission}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => handlePermissionToggle(permission, checked)}
                    />
                    <Label 
                      htmlFor={`perm-${permission}`} 
                      className="flex-1 cursor-pointer text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{formatPermissionName(permission)}</span>
                        {isBase && (
                          <Badge variant="secondary" className="text-xs">
                            Base
                          </Badge>
                        )}
                        {isLeader && (
                          <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                            Leader
                          </Badge>
                        )}
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
            {Object.keys(relevantCategories).indexOf(category) < Object.keys(relevantCategories).length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </div>

      {/* Permission Summary */}
      <div className="rounded-lg bg-muted p-3">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-4 w-4" />
          <span className="font-medium text-sm">Permission Summary</span>
        </div>
        <div className="text-sm space-y-1">
          <p>
            <strong>Selected:</strong> {selectedPermissions.length} permissions
          </p>
          <p>
            <strong>Role:</strong> {role?.replace('_', ' ')} 
            {isLeaderMode && <span className="text-amber-600 ml-1">(Leader)</span>}
          </p>
          <p className="text-xs text-muted-foreground">
            Base permissions are automatically included for this role type.
            Leader mode adds advanced permissions for team management.
          </p>
        </div>
        
        {selectedPermissions.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs font-medium mb-2">Active Permissions:</p>
            <div className="flex flex-wrap gap-1">
              {selectedPermissions.slice(0, 6).map((perm) => (
                <Badge key={perm} variant="outline" className="text-xs">
                  {formatPermissionName(perm)}
                </Badge>
              ))}
              {selectedPermissions.length > 6 && (
                <Badge variant="secondary" className="text-xs">
                  +{selectedPermissions.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

PermissionSelector.propTypes = {
  role: PropTypes.string.isRequired,
  selectedPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPermissionsChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};