import { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { UserManagementHeader } from './UserManagementHeader';
import { UserFilters } from './UserFilters';
import { UserStats } from './UserStats';
import { UserFormDialog } from './UserFormDialog';
import { UserTable } from './UserTable';

import PropTypes from 'prop-types';

// Fallback data in case API fails
const initialUsers = [
  {
    id: '1',
    name: 'John Anderson',
    username: 'john.anderson',
    email: 'john.anderson@university.edu',
    role: 'SYSTEM_ADMIN',
    permissions: ['SYSTEM_ADMIN'],
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
    permissions: ['CONTENT_MANAGER', 'CONSULTANT'],
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
    permissions: ['CONSULTANT'],
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
    permissions: ['CONTENT_MANAGER'],
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
    permissions: ['CONSULTANT'],
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
    permissions: ['ADMISSION_OFFICER'],
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
    permissions: ['ADMISSION_OFFICER', 'CONSULTANT'],
    status: 'active',
    lastActive: '1 hour ago',
    createdAt: '2024-07-22',
  },
];

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // Fetch users from API
  const fetchUsers = async () => {
    console.log('🔄 Fetching users from API...');
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type') || 'bearer';
      const frontendUser = JSON.parse(sessionStorage.getItem("demo_user") || "{}");
      
      console.log('👤 Frontend user data:', frontendUser);
      console.log('📋 Request details:', {
        url: 'http://localhost:8000/users/staffs',
        token: token ? `${token.substring(0, 20)}...` : 'No token',
        tokenType,
        frontendRole: frontendUser.role,
        frontendPermissions: frontendUser.permissions
      });

      // Decode token to see what backend will receive
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log('🔑 JWT payload (what backend sees):', payload);
        } catch (e) {
          console.log('⚠️ Could not decode JWT token');
        }
      }

      const response = await fetch('http://localhost:8000/users/staffs', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `${tokenType} ${token}`
        }
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.detail || `HTTP ${response.status}: ${response.statusText}`;
          
          // Special handling for permission errors
          if (response.status === 403 && parsedError.detail === "Admin permission required") {
            console.error('🚫 PERMISSION ISSUE: Current user does not have admin permissions');
            console.error('🔍 This suggests:');
            console.error('   1. User role in backend is not SYSTEM_ADMIN');
            console.error('   2. User permissions in backend do not include admin rights');
            console.error('   3. Backend permission check is not matching frontend user data');
            console.error('👤 Current frontend user data:', JSON.parse(sessionStorage.getItem("demo_user") || "{}"));
            errorMessage = "Access denied: Admin permissions required. Current user role may not have sufficient privileges.";
          }
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${errorData || response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ API Success:', {
        dataType: typeof data,
        dataLength: Array.isArray(data) ? data.length : 'Not array',
        data
      });

      // Handle the response - it might be a string or array depending on the actual API
      if (typeof data === 'string') {
        console.log('📝 Response is string:', data);
        // If it's a string, we might need to parse it or use fallback data
        setUsers(initialUsers); // Use fallback data for now
      } else if (Array.isArray(data)) {
        console.log('📋 Response is array with', data.length, 'users');
        setUsers(data);
      } else {
        console.log('🤷 Unexpected response format, using fallback data');
        setUsers(initialUsers);
      }

    } catch (err) {
      console.error('💥 Fetch error:', err);
      setError(err.message);
      // Use fallback data when API fails
      console.log('🔄 Using fallback data due to API error');
      setUsers(initialUsers);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

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

        {/* Loading state */}
        {loading && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm">Loading users from API...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <span className="text-sm">⚠️ API Error: {error}</span>
              <button 
                onClick={fetchUsers}
                className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
              >
                Retry
              </button>
            </div>
            {error.includes("Admin permissions required") && (
              <div className="bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg text-sm">
                <div className="font-medium text-yellow-800 mb-1">🔧 Troubleshooting:</div>
                <div className="text-yellow-700 space-y-1">
                  <div>• User ID 6 (admin@gmail.com) lacks admin permissions in backend database</div>
                  <div>• Try logging in with a different admin account</div>
                  <div>• Or grant admin permissions to user ID 6 in the backend</div>
                  <div>• Using fallback data for now</div>
                </div>
              </div>
            )}
          </div>
        )}

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