import { useState } from 'react';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { UserManagementHeader } from './UserManagementHeader';
import { UserFilters } from './UserFilters';
import { UserStats } from './UserStats';
import { UserFormDialog } from './UserFormDialog';
import { UserTable } from './UserTable';

import PropTypes from 'prop-types';

const initialUsers = [
  {
    id: '1',
    name: 'John Anderson',
    username: 'john.anderson',
    email: 'john.anderson@university.edu',
    roles: ['admin', 'content_manager'],
    status: 'active',
    lastActive: '5 minutes ago',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    username: 'sarah.mitchell',
    email: 'sarah.mitchell@university.edu',
    roles: ['content_manager'],
    status: 'active',
    lastActive: '2 hours ago',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Michael Chen',
    username: 'michael.chen',
    email: 'michael.chen@university.edu',
    roles: ['consultant'],
    status: 'active',
    lastActive: '1 day ago',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    username: 'emily.rodriguez',
    email: 'emily.rodriguez@university.edu',
    roles: ['content_manager', 'consultant'],
    status: 'active',
    lastActive: '3 hours ago',
    createdAt: '2024-04-05',
  },
  {
    id: '5',
    name: 'David Thompson',
    username: 'david.thompson',
    email: 'david.thompson@university.edu',
    roles: ['consultant'],
    status: 'inactive',
    lastActive: '2 weeks ago',
    createdAt: '2024-05-12',
  },
];

export function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    roles: [],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.roles.includes(filterRole);
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', username: '', email: '', password: '', roles: [] });
    setIsDialogOpen(true);
  };

  const handleCreateOrUpdate = () => {
    if (!formData.name || !formData.email || !formData.username) return;
    if (!editingUser && !formData.password) return; // Password required for new users

    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? {
              ...u,
              name: formData.name,
              username: formData.username,
              email: formData.email,
              // Only update password if provided
              ...(formData.password && { password: formData.password }),
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
        username: formData.username,
        email: formData.email,
        password: formData.password, // In real app, this would be hashed
        roles: formData.roles.filter(r => r !== 'admin'), // Never allow adding admin role to new users
        status: 'active',
        lastActive: 'Just now',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([newUser, ...users]);
    }

    // Reset form
    setFormData({ name: '', username: '', email: '', password: '', roles: [] });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      password: '', // Don't prefill password for security
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-6 py-4 space-y-4">
        <UserManagementHeader onAddUser={handleAddUser} />

        {/* Search and Filter */}
        <UserFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterRole={filterRole}
          onFilterRoleChange={setFilterRole}
        />

        {/* Role Distribution */}
        <UserStats users={users} />
      </div>

      {/* User Table */}
      <ScrollArea className="flex-1">
        <div className="p-6 pb-8">
          <UserTable
            users={filteredUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </ScrollArea>

      {/* User Form Dialog */}
      <UserFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editingUser={editingUser}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  );
}