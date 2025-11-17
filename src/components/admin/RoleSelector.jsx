import { Shield, Edit, User } from 'lucide-react';
import { Label } from '../ui/system_users/label';
import { Checkbox } from '../ui/system_users/checkbox';
import PropTypes from 'prop-types';

export function RoleSelector({ selectedRoles, onRolesChange, isEditing = false }) {
  const handleRoleToggle = (role, checked) => {
    const newRoles = checked 
      ? [...(selectedRoles || []), role]
      : (selectedRoles || []).filter(r => r !== role);
    onRolesChange(newRoles);
  };

  const isAdminDisabled = isEditing && !selectedRoles?.includes('admin');

  return (
    <div className="space-y-4">
      <Label>Roles</Label>
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="role-admin"
            checked={selectedRoles?.includes('admin')}
            disabled={isAdminDisabled}
            onCheckedChange={() => {}}
          />
          <Label 
            htmlFor="role-admin" 
            className={`font-normal w-full ${isAdminDisabled ? 'text-muted-foreground' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              System Admin (Full Access)
              {isAdminDisabled && (
                <span className="text-xs text-muted-foreground ml-2">(Reserved Role)</span>
              )}
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="role-content-manager"
            checked={selectedRoles?.includes('content_manager')}
            onCheckedChange={(checked) => handleRoleToggle('content_manager', checked)}
          />
          <Label htmlFor="role-content-manager" className="font-normal w-full">
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Content Manager (KB Management)
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="role-consultant"
            checked={selectedRoles?.includes('consultant')}
            onCheckedChange={(checked) => handleRoleToggle('consultant', checked)}
          />
          <Label htmlFor="role-consultant" className="font-normal w-full">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Consultant (Analytics Only)
            </div>
          </Label>
        </div>
      </div>

      <div className="rounded-lg bg-muted p-3 text-sm">
        <p><strong>Selected Role Permissions:</strong></p>
        <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
          {selectedRoles?.includes('admin') && (
            <>
              <li>Full system control</li>
              <li>User and role management</li>
              <li>System configuration</li>
            </>
          )}
          {selectedRoles?.includes('content_manager') && (
            <>
              <li>Knowledge base management</li>
              <li>Content approval workflow</li>
              <li>Q&A template editing</li>
            </>
          )}
          {selectedRoles?.includes('consultant') && (
            <>
              <li>View analytics dashboard</li>
              <li>Generate reports</li>
              <li>Monitor performance metrics</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

RoleSelector.propTypes = {
  selectedRoles: PropTypes.arrayOf(PropTypes.string),
  onRolesChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};