import { MoreVertical, Edit, Shield, Trash2, Mail, User } from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Badge } from '../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/system_users/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/system_users/dropdown-menu';
import { Card } from '../ui/system_users/card';
import PropTypes from 'prop-types';

const roleColors = {
  admin: 'destructive',
  content_manager: 'default',
  consultant: 'secondary',
};

const roleLabels = {
  admin: 'System Admin',
  content_manager: 'Content Manager',
  consultant: 'Consultant',
};

export function UserTable({ 
  users, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) {
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'content_manager':
        return <Edit className="h-4 w-4" />;
      case 'consultant':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
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
                  {user.roles.map(role => (
                    <Badge key={role} variant={roleColors[role]} className="gap-1">
                      {getRoleIcon(role)}
                      {roleLabels[role]}
                    </Badge>
                  ))}
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
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    status: PropTypes.string.isRequired,
    lastActive: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
};