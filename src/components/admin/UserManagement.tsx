import { useState } from 'react';
import { Plus, Search, MoreVertical, Shield, User, Edit, Trash2, Mail } from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Input } from '../ui/system_users/input';
import { Label } from '../ui/system_users/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Badge } from '../ui/system_users/badge';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/system_users/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/system_users/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/system_users/table';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'content_manager' | 'consultant';
  status: 'active' | 'inactive';
  lastActive: string;
  createdAt: string;
}

const initialUsers: AppUser[] = [
  {
    id: '1',
    name: 'John Anderson',
    email: 'john.anderson@university.edu',
    role: 'admin',
    status: 'active',
    lastActive: '5 minutes ago',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@university.edu',
    role: 'content_manager',
    status: 'active',
    lastActive: '2 hours ago',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@university.edu',
    role: 'consultant',
    status: 'active',
    lastActive: '1 day ago',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    role: 'content_manager',
    status: 'active',
    lastActive: '3 hours ago',
    createdAt: '2024-04-05',
  },
  {
    id: '5',
    name: 'David Thompson',
    email: 'david.thompson@university.edu',
    role: 'consultant',
    status: 'inactive',
    lastActive: '2 weeks ago',
    createdAt: '2024-05-12',
  },
];

const roleColors = {
  admin: 'destructive',
  content_manager: 'default',
  consultant: 'secondary',
} as const;

const roleLabels = {
  admin: 'System Admin',
  content_manager: 'Content Manager',
  consultant: 'Consultant',
};

export function UserManagement() {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'content_manager' as AppUser['role'],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
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
              role: formData.role,
            }
          : u
      ));
    } else {
      // Create new user
      const newUser: AppUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
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

  const handleEdit = (user: AppUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' as const }
        : u
    ));
  };

  const getRoleIcon = (role: string) => {
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
                setFormData({ name: '', email: '', role: 'content_manager' });
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

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value: AppUser['role']) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">System Admin (Full Access)</SelectItem>
                      <SelectItem value="content_manager">Content Manager (KB Management)</SelectItem>
                      <SelectItem value="consultant">Consultant (Analytics Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p><strong>Role Permissions:</strong></p>
                  <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                    {formData.role === 'admin' && (
                      <>
                        <li>Full system control</li>
                        <li>User and role management</li>
                        <li>System configuration</li>
                      </>
                    )}
                    {formData.role === 'content_manager' && (
                      <>
                        <li>Knowledge base management</li>
                        <li>Content approval workflow</li>
                        <li>Q&A template editing</li>
                      </>
                    )}
                    {formData.role === 'consultant' && (
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
                      <Badge variant={roleColors[user.role]} className="gap-1">
                        {getRoleIcon(user.role)}
                        {roleLabels[user.role]}
                      </Badge>
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