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
    role: 'SYSTEM_ADMIN',
    permissions: ['MANAGE_USERS', 'MANAGE_ROLES', 'VIEW_ACTIVITY_LOG', 'MANAGE_SYSTEM_SETTINGS', 'ACCESS_ALL_MODULES'],
    status: 'active',
    lastActive: '5 minutes ago',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    username: 'sarah.mitchell',
    email: 'sarah.mitchell@university.edu',
    role: 'CONTENT_MANAGER',
    permissions: ['VIEW_CONTENT_DASHBOARD', 'MANAGE_ARTICLES', 'CREATE_ARTICLE', 'EDIT_ARTICLE', 'DELETE_ARTICLE', 'PUBLISH_ARTICLE', 'REVIEW_CONTENT'],
    status: 'active',
    lastActive: '2 hours ago',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Michael Chen',
    username: 'michael.chen',
    email: 'michael.chen@university.edu',
    role: 'CONSULTANT',
    permissions: ['VIEW_CONSULTANT_OVERVIEW', 'VIEW_ANALYTICS', 'MANAGE_KNOWLEDGE_BASE', 'CREATE_QA_TEMPLATE', 'EDIT_QA_TEMPLATE', 'DELETE_QA_TEMPLATE', 'APPROVE_QA_TEMPLATE'],
    status: 'active',
    lastActive: '1 day ago',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    username: 'emily.rodriguez',
    email: 'emily.rodriguez@university.edu',
    role: 'CONTENT_MANAGER',
    permissions: ['VIEW_CONTENT_DASHBOARD', 'MANAGE_ARTICLES', 'CREATE_ARTICLE', 'EDIT_ARTICLE'],
    status: 'active',
    lastActive: '3 hours ago',
    createdAt: '2024-04-05',
  },
  {
    id: '5',
    name: 'David Thompson',
    username: 'david.thompson',
    email: 'david.thompson@university.edu',
    role: 'CONSULTANT',
    permissions: ['VIEW_CONSULTANT_OVERVIEW', 'VIEW_ANALYTICS', 'MANAGE_KNOWLEDGE_BASE'],
    status: 'inactive',
    lastActive: '2 weeks ago',
    createdAt: '2024-05-12',
  },
  {
    id: '6',
    name: 'Lisa Wang',
    username: 'lisa.wang',
    email: 'lisa.wang@university.edu',
    role: 'ADMISSION_OFFICER',
    permissions: ['VIEW_ADMISSION_DASHBOARD', 'MANAGE_STUDENT_QUEUE', 'CONDUCT_CONSULTATION', 'VIEW_STUDENT_INSIGHTS'],
    status: 'active',
    lastActive: '30 minutes ago',
    createdAt: '2024-06-18',
  },
  {
    id: '7',
    name: 'Robert Johnson',
    username: 'robert.johnson',
    email: 'robert.johnson@university.edu',
    role: 'ADMISSION_OFFICER',
    permissions: ['VIEW_ADMISSION_DASHBOARD', 'MANAGE_STUDENT_QUEUE', 'CONDUCT_CONSULTATION', 'VIEW_STUDENT_INSIGHTS', 'ACCESS_LIVE_CHAT'],
    status: 'active',
    lastActive: '1 hour ago',
    createdAt: '2024-07-22',
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
    email: '',
    password: '',
    role: '',
    permissions: [],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: '', permissions: [] });
    setIsDialogOpen(true);
  };

  const handleCreateOrUpdate = () => {
    if (!formData.name || !formData.email || !formData.role) return;
    if (!editingUser && !formData.password) return; // Password required for new users

    if (editingUser) {
      // Update existing user - role cannot be changed, only permissions
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? {
              ...u,
              name: formData.name,
              email: formData.email,
              // Only update password if provided
              ...(formData.password && { password: formData.password }),
              // Role cannot be changed, only permissions can be updated
              permissions: formData.permissions,
            }
          : u
      ));
    } else {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        username: formData.email.split('@')[0], // Generate username from email prefix
        email: formData.email,
        password: formData.password, // In real app, this would be hashed
        role: formData.role, // Set the permanent role
        permissions: formData.permissions, // Set initial permissions
        status: 'active',
        lastActive: 'Just now',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([newUser, ...users]);
    }

    // Reset form
    setFormData({ name: '', email: '', password: '', role: '', permissions: [] });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't prefill password for security
      role: user.role,
      permissions: user.permissions || [],
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