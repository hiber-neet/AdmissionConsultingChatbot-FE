import { useState } from 'react';
import { Plus, Search, MoreVertical, Shield, User, Edit, Trash2, Mail } from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Input } from '../ui/system_users/input';
import { Label } from '../ui/system_users/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Badge } from '../ui/system_users/badge';
import { Checkbox } from '../ui/system_users/checkbox';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/system_users/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/system_users/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/system_users/table';

import PropTypes from 'prop-types';

const initialUsers = [
  {
    id: '1',
    name: 'John Anderson',
    email: 'john.anderson@university.edu',
    roles: ['admin', 'content_manager'],
    status: 'active',
    lastActive: '5 minutes ago',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@university.edu',
    roles: ['content_manager'],
    status: 'active',
    lastActive: '2 hours ago',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@university.edu',
    roles: ['consultant'],
    status: 'active',
    lastActive: '1 day ago',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    roles: ['content_manager', 'consultant'],
    status: 'active',
    lastActive: '3 hours ago',
    createdAt: '2024-04-05',
  },
  {
    id: '5',
    name: 'David Thompson',
    email: 'david.thompson@university.edu',
    roles: ['consultant'],
    status: 'inactive',
    lastActive: '2 weeks ago',
    createdAt: '2024-05-12',
  },
];

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

export function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roles: [],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.roles.includes(filterRole);
    return matchesSearch && matchesRole;
  });

  const handleCreateOrUpdate = () => {
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? {
              ...u,
              name: formData.name,
              email: formData.email,
              // Preserve admin role if it exists, can't be added or removed
              roles: u.roles.includes('admin') 
                ? ['admin', ...formData.roles.filter(r => r !== 'admin')]
                : formData.roles.filter(r => r !== 'admin'),
            }
          : u
      ));
    } else {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        roles: formData.roles.filter(r => r !== 'admin'), // Never allow adding admin role to new users
        status: 'active',
        lastActive: 'Just now',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([newUser, ...users]);
    }

    // Reset form
    setFormData({ name: '', email: '', role: 'content_manager' });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      roles: user.roles || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
  };

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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2>User Management</h2>
            <p className="text-muted-foreground">Manage system users and role permissions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingUser(null);
                setFormData({ name: '', email: '', roles: [] });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@university.edu"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Roles</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="role-admin"
                        checked={formData.roles?.includes('admin')}
                        disabled={!formData.roles?.includes('admin')}
                        onCheckedChange={() => {}}
                      />
                      <Label 
                        htmlFor="role-admin" 
                        className={`font-normal w-full ${!formData.roles?.includes('admin') ? 'text-muted-foreground' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          System Admin (Full Access)
                          {!formData.roles?.includes('admin') && (
                            <span className="text-xs text-muted-foreground ml-2">(Reserved Role)</span>
                          )}
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="role-content-manager"
                        checked={formData.roles?.includes('content_manager')}
                        onCheckedChange={(checked) => {
                          const newRoles = checked 
                            ? [...(formData.roles || []), 'content_manager']
                            : (formData.roles || []).filter(r => r !== 'content_manager');
                          setFormData({ ...formData, roles: newRoles });
                        }}
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
                        checked={formData.roles?.includes('consultant')}
                        onCheckedChange={(checked) => {
                          const newRoles = checked 
                            ? [...(formData.roles || []), 'consultant']
                            : (formData.roles || []).filter(r => r !== 'consultant');
                          setFormData({ ...formData, roles: newRoles });
                        }}
                      />
                      <Label htmlFor="role-consultant" className="font-normal w-full">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Consultant (Analytics Only)
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p><strong>Selected Role Permissions:</strong></p>
                  <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                    {formData.roles?.includes('admin') && (
                      <>
                        <li>Full system control</li>
                        <li>User and role management</li>
                        <li>System configuration</li>
                      </>
                    )}
                    {formData.roles?.includes('content_manager') && (
                      <>
                        <li>Knowledge base management</li>
                        <li>Content approval workflow</li>
                        <li>Q&A template editing</li>
                      </>
                    )}
                    {formData.roles?.includes('consultant') && (
                      <>
                        <li>View analytics dashboard</li>
                        <li>Generate reports</li>
                        <li>Monitor performance metrics</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOrUpdate}>
                  {editingUser ? 'Update' : 'Create'} User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-10"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">System Admin</SelectItem>
              <SelectItem value="content_manager">Content Manager</SelectItem>
              <SelectItem value="consultant">Consultant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role Distribution */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{users.filter(u => u.role === 'admin').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Content Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{users.filter(u => u.role === 'content_manager').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Consultants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{users.filter(u => u.role === 'consultant').length}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Table */}
      <ScrollArea className="flex-1">
        <div className="p-6 pb-8">
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
                {filteredUsers.map((user) => (
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
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
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
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                            <Shield className="h-4 w-4 mr-2" />
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(user.id)}
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found.</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}