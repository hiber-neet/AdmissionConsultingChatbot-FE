import { MoreVertical, Edit, Shield, Mail, User, GraduationCap, Crown, Users, Ban, UserCheck } from 'lucide-react';
import { Button } from '../../ui/system_users/button';
import { Badge } from '../../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../../ui/system_users/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/system_users/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/system_users/dropdown-menu';
import { Card } from '../../ui/system_users/card';
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
  onBanUser,
  loading 
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

  const isAdminUser = (user) => {
    return user.role === 'SYSTEM_ADMIN' || (user.permissions && user.permissions.includes('admin'));
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
                <div className="flex items-center gap-2">
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                  {user.isBanned && (
                    <Badge variant="destructive" className="gap-1">
                      <Ban className="h-3 w-3" />
                      Banned
                    </Badge>
                  )}
                  {isAdminUser(user) && (
                    <Badge variant="outline" className="gap-1 border-blue-300 text-blue-700">
                      <Shield className="h-3 w-3" />
                      Protected
                    </Badge>
                  )}
                  {user.banReason && (
                    <span className="text-xs text-red-600">
                      {user.banReason}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
              <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={loading}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)} disabled={loading}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => user.status === 'active' ? onBanUser(user.id, false) : onBanUser(user.id, true)} 
                      disabled={loading || isAdminUser(user)}
                      className={
                        isAdminUser(user) 
                          ? "text-gray-400 cursor-not-allowed" 
                          : user.status === 'active' 
                            ? "text-orange-600" 
                            : "text-green-600"
                      }
                    >
                      {user.status === 'active' ? (
                        <>
                          <Ban className="h-4 w-4 mr-2" />
                          {isAdminUser(user) ? 'Cannot Ban Admin' : 'Deactivate (Ban)'}
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          {isAdminUser(user) ? 'Cannot Unban Admin' : 'Activate (Unban)'}
                        </>
                      )}
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
    role: PropTypes.string.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string.isRequired,
    lastActive: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    isBanned: PropTypes.bool,
    banReason: PropTypes.string,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onBanUser: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};