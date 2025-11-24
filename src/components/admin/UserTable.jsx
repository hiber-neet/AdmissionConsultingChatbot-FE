import { MoreVertical, Edit, Shield, Trash2, Mail, User, GraduationCap, Crown, Users } from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Badge } from '../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/system_users/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/system_users/dropdown-menu';
import { Card } from '../ui/system_users/card';
import PropTypes from 'prop-types';

const roleColors = {
  SYSTEM_ADMIN: 'destructive',
  CONTENT_MANAGER: 'default',
  ADMISSION_OFFICER: 'outline',
  CONSULTANT: 'secondary',
};

const roleLabels = {
  SYSTEM_ADMIN: 'System Admin',
  CONTENT_MANAGER: 'Content Manager',
  ADMISSION_OFFICER: 'Admission Officer',
  CONSULTANT: 'Consultant',
};

export function UserTable({ 
  users, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) {
  const getRoleIcon = (role) => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return <Shield className="h-4 w-4" />;
      case 'CONTENT_MANAGER':
        return <Edit className="h-4 w-4" />;
      case 'ADMISSION_OFFICER':
        return <GraduationCap className="h-4 w-4" />;
      case 'CONSULTANT':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const hasMultipleRoles = (permissions) => {
    // In the role-based system, users with multiple role permissions are considered "advanced users"
    return permissions && permissions.length > 1;
  };

  const getPermissionsBadgeColor = (permissions) => {
    if (!permissions || permissions.length === 0) return 'secondary';
    if (permissions.includes('SYSTEM_ADMIN')) return 'destructive';
    if (permissions.length > 1) return 'default';
    return 'secondary';
  };

  if (users.length === 0) {
    return (
      <Card>
        <div className="text-center py-12 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No users found.</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{user.name}</div>
                    <div className="text-sm text-muted-foreground">@{user.username}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <Badge variant={getPermissionsBadgeColor(user.permissions)} className="gap-1">
                    {getRoleIcon(user.role)}
                    {roleLabels[user.role]}
                  </Badge>
                  {hasMultipleRoles(user.permissions) && (
                    <Badge variant="outline" className="gap-1 border-blue-300 text-blue-700">
                      <Crown className="h-3 w-3" />
                      Multi-Role
                    </Badge>
                  )}
                  {user.permissions?.includes('SYSTEM_ADMIN') && (
                    <Badge variant="outline" className="gap-1 border-red-300 text-red-700">
                      <Crown className="h-3 w-3" />
                      Admin
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {user.permissions?.length || 0} role permissions
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
              <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(user.id)}>
                      <Shield className="h-4 w-4 mr-2" />
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(user.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

UserTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired, // Changed from 'roles' to 'role'
    permissions: PropTypes.arrayOf(PropTypes.string), // Added permissions prop
    status: PropTypes.string.isRequired,
    lastActive: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
};