import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../../ui/system_users/scroll-area';
import { UserManagementHeader } from './UserManagementHeader';
import { UserFilters } from './UserFilters';
import { UserStats } from './UserStats';
import { UserFormDialog } from './UserFormDialog';
import { UserTable } from './UserTable';
import { toast } from 'react-toastify';

// Role mapping from role_id to role name
const roleMapping = {
  1: 'SYSTEM_ADMIN',
  2: 'CONSULTANT', 
  3: 'CONTENT_MANAGER',
  4: 'ADMISSION_OFFICER',
  5: 'CUSTOMER',
  null: 'CUSTOMER', // Default role for users without role_id
  undefined: 'CUSTOMER'
};

// Permission name to ID mapping (permissions are the same as roles)
// Note: These IDs should match your backend database permission_id values
const PERMISSION_NAME_TO_ID = {
  'admin': 1,
  'consultant': 2,
  'content_manager': 3,
  'admission_officer': 4,
  'customer': 5,
  // Also handle uppercase versions for compatibility
  'ADMIN': 1,
  'CONSULTANT': 2,
  'CONTENT_MANAGER': 3,
  'ADMISSION_OFFICER': 4,
  'CUSTOMER': 5,
  // Handle SYSTEM_ADMIN alias
  'SYSTEM_ADMIN': 1
};

// Reverse mapping from permission ID to name
const PERMISSION_ID_TO_NAME = {
  1: 'admin',
  2: 'consultant', 
  3: 'content_manager',
  4: 'admission_officer',
  5: 'customer'
};

// Function to derive permissions from user profile fields
const derivePermissionsFromProfiles = (apiUser) => {
  const permissions = [];
  
  // Check for admin permission (role_id === 1)
  if (apiUser.role_id === 1) {
    permissions.push('admin');
  }
  
  // Check for consultant permission (has consultant_profile or role_id === 2)
  if (apiUser.consultant_profile || apiUser.role_id === 2) {
    permissions.push('consultant');
  }
  
  // Check for content_manager permission (has content_manager_profile or role_id === 3)
  if (apiUser.content_manager_profile || apiUser.role_id === 3) {
    permissions.push('content_manager');
  }
  
  // Check for admission_officer permission (has admission_official_profile or role_id === 4)
  if (apiUser.admission_official_profile || apiUser.role_id === 4) {
    permissions.push('admission_officer');
  }
  
  // Remove duplicates and return
  return Array.from(new Set(permissions));
};

// Function to transform API user data to frontend format
const transformUserData = (apiUser) => {
  const roleName = roleMapping[apiUser.role_id] || 'CUSTOMER';
  
  // Transform permissions from API format to frontend format
  let permissions = [];
  
  if (apiUser.permissions && Array.isArray(apiUser.permissions) && apiUser.permissions.length > 0) {
    // If API returns permission objects with permission_name
    permissions = apiUser.permissions.map(perm => {
      if (typeof perm === 'object' && perm.permission_name) {
        // Normalize permission names
        const name = perm.permission_name.toLowerCase();
        if (name === 'admin' || name === 'system_admin') return 'admin';
        if (name === 'consultant') return 'consultant';
        if (name === 'content_manager' || name === 'contentmanager') return 'content_manager';
        if (name === 'admission_officer' || name === 'admission_official') return 'admission_officer';
        return name;
      } else if (typeof perm === 'object' && perm.permission_id) {
        return PERMISSION_ID_TO_NAME[perm.permission_id] || 'customer';
      } else if (typeof perm === 'string') {
        // If it's already a permission name, normalize to lowercase
        return perm.toLowerCase().replace('system_admin', 'admin');
      } else if (typeof perm === 'number') {
        return PERMISSION_ID_TO_NAME[perm] || 'customer';
      }
      return null; // We'll filter out nulls
    }).filter(Boolean);
    
    // Remove duplicates
    permissions = Array.from(new Set(permissions));
  }
  
  // If no valid permissions found, derive from profile fields
  if (permissions.length === 0) {
    permissions = derivePermissionsFromProfiles(apiUser);
  }
  
  // If still no permissions, fall back to role-based permission
  if (permissions.length === 0) {
    permissions = [roleName.toLowerCase().replace('system_admin', 'admin')];
  }
  
  return {
    id: apiUser.user_id?.toString() || Date.now().toString(),
    name: apiUser.full_name || 'Unknown User',
    username: apiUser.email?.split('@')[0] || 'unknown',
    email: apiUser.email || '',
    role: roleName,
    permissions: permissions,
    status: apiUser.status ? 'active' : 'inactive',
    phone_number: apiUser.phone_number || '',
    lastActive: 'Recently', // API doesn't provide this, so we use a default
    createdAt: new Date().toISOString().split('T')[0], // API doesn't provide this
    isBanned: !apiUser.status, // If status is false, user is banned
    banReason: !apiUser.status ? 'Banned by admin' : null,
    consultant_is_leader: apiUser.consultant_is_leader || false,
    content_manager_is_leader: apiUser.content_manager_is_leader || false,
  };
};

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
    isBanned: false,
    banReason: null,
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
    isBanned: false,
    banReason: null,
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
    isBanned: false,
    banReason: null,
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
    isBanned: false,
    banReason: null,
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
    isBanned: true,
    banReason: 'Banned for policy violation',
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
    isBanned: false,
    banReason: null,
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
    isBanned: false,
    banReason: null,
  },
];

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
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
    phone_number: '',
    interest_desired_major: '',
    interest_region: '',
    consultant_is_leader: false,
    content_manager_is_leader: false,
  });

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    
    // Check if we have a valid token first
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('No authentication token found. Please login again.');
      setUsers(initialUsers);
      setLoading(false);
      return;
    }
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      if (payload.exp < currentTime) {
        toast.error('Authentication token expired. Please login again.');
        setUsers(initialUsers);
        setLoading(false);
        return;
      }
    } catch (e) {
      toast.error('Invalid authentication token. Please login again.');
      setUsers(initialUsers);
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type') || 'bearer';
      const baseUrl = 'http://localhost:8000';
      
      // Ensure token type is properly capitalized
      const authHeader = `Bearer ${token}`;

      const response = await fetch(`${baseUrl}/users/staffs`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': authHeader
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.detail || `HTTP ${response.status}: ${response.statusText}`;
          
          // Special handling for permission errors
          if (response.status === 403 && parsedError.detail === "Admin permission required") {
            errorMessage = "Access denied: Admin permissions required. Current user role may not have sufficient privileges.";
          }
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${errorData || response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Transform API data to frontend format
      if (Array.isArray(data)) {
        const transformedUsers = data.map(transformUserData);
        setUsers(transformedUsers);
      } else {
        setUsers(initialUsers);
      }

    } catch (err) {
      toast.error(`Failed to fetch users: ${err.message}`);
      // Use fallback data when API fails
      setUsers(initialUsers);
    } finally {
      setLoading(false);
    }
  };

  // Ban user API call
  const banUser = async (userId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = 'http://localhost:8000';

      const response = await fetch(`${baseUrl}/users/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: parseInt(userId)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.detail || `HTTP ${response.status}`;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${errorData}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Update user status in local state
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, status: 'inactive', banReason: 'Banned by admin' }
          : u
      ));
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Unban user API call
  const unbanUser = async (userId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = 'http://localhost:8000';

      const response = await fetch(`${baseUrl}/users/unban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: parseInt(userId)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.detail || `HTTP ${response.status}`;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${errorData}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Update user status in local state
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, status: 'active', banReason: null }
          : u
      ));
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Create new user API call
  const createUser = async (userData) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = 'http://localhost:8000';

      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.detail || `HTTP ${response.status}`;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${errorData}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      return data;
    } catch (error) {
      throw error;
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
    setFormData({ 
      name: '', 
      email: '', 
      password: '',
      role: '', 
      permissions: [], 
      phone_number: '', 
      interest_desired_major: '', 
      interest_region: '',
      consultant_is_leader: false,
      content_manager_is_leader: false,
    });
    setIsDialogOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Please fill in all required fields (Name, Email, Role)');
      return;
    }
    if (!editingUser && !formData.password) {
      toast.error('Password is required for new users');
      return;
    }
    if (!editingUser && !formData.phone_number) {
      toast.error('Phone number is required for new users');
      return;
    }

    try {
      setLoading(true);

      if (editingUser) {
        // Update existing user - basic information only
        // The UserFormDialog handles permission updates internally
        console.log('Updating basic user information:', {
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone_number,
          interest_desired_major: formData.interest_desired_major,
          interest_region: formData.interest_region
        });

        // For now, just update local state
        // In a real app, you'd call a user update API here
        setUsers(users.map(u => 
          u.id === editingUser.id 
            ? {
                ...u,
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,
                interest_desired_major: formData.interest_desired_major,
                interest_region: formData.interest_region
              }
            : u
        ));
        
        toast.success('User information updated successfully!');
      } else {
        // Create new user via API
        
        // Map role name to role_id
        const roleNameToId = {
          'SYSTEM_ADMIN': 1,
          'CONSULTANT': 2,
          'CONTENT_MANAGER': 3,
          'ADMISSION_OFFICER': 4,
        };
        
        const roleId = roleNameToId[formData.role];
        if (!roleId) {
          throw new Error(`Invalid role: ${formData.role}`);
        }
        
        // Prepare API request body for new user
        const requestBody = {
          full_name: formData.name,
          email: formData.email,
          status: true,
          password: formData.password,
          role_id: roleId,
          permissions: [], // Start with no permissions, can be added later
          phone_number: formData.phone_number || '',
          consultant_is_leader: false,
          content_manager_is_leader: false,
          interest_desired_major: formData.interest_desired_major || '',
          interest_region: formData.interest_region || ''
        };

        console.log('Creating new user:', requestBody);

        const response = await fetch(`${baseUrl}/users/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.text();
          
          let errorMessage;
          try {
            const parsedError = JSON.parse(errorData);
            errorMessage = parsedError.detail || `HTTP ${response.status}`;
          } catch (parseError) {
            errorMessage = `HTTP ${response.status}: ${errorData}`;
          }
          
          throw new Error(errorMessage);
        }

        const newUser = await response.json();
        console.log('New user created:', newUser);

        // Add to local state
        setUsers([...users, {
          id: newUser.user_id,
          name: newUser.full_name,
          email: newUser.email,
          role: formData.role,
          permissions: [], // New user starts with no permissions
          phone_number: newUser.phone_number || '',
          interest_desired_major: newUser.interest_desired_major || '',
          interest_region: newUser.interest_region || ''
        }]);
        
        toast.success('User created successfully! You can now add permissions.');
      }

      // Close dialog and refresh
      setIsDialogOpen(false);
      await fetchUsers(); // Refresh the user list

    } catch (error) {
      console.error('Failed to create/update user:', error);
      toast.error(`Failed to ${editingUser ? 'update' : 'create'} user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      phone_number: user.phone_number || '',
      interest_desired_major: '',
      interest_region: '',
      consultant_is_leader: user.consultant_is_leader || false,
      content_manager_is_leader: user.content_manager_is_leader || false,
    });
    setIsDialogOpen(true);
  };

  const handleBanUser = async (userId, isCurrentlyBanned) => {
    try {
      setLoading(true);
      
      // Find the user to check their current status
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      // Check if user is admin - admins cannot be banned
      if (user.role === 'SYSTEM_ADMIN' || (user.permissions && user.permissions.includes('admin'))) {
        toast.error('Cannot ban admin users. Admin users have special privileges.');
        return;
      }
      
      if (user.status === 'active') {
        // User is active, so we're deactivating (banning) them
        await banUser(userId);
        toast.success('User deactivated and banned successfully');
      } else {
        // User is inactive, so we're activating (unbanning) them
        await unbanUser(userId);
        toast.success('User activated and unbanned successfully');
      }
      
    } catch (error) {
      const action = users.find(u => u.id === userId)?.status === 'active' ? 'deactivate' : 'activate';
      toast.error(`Failed to ${action} user: ${error.message}`);
    } finally {
      setLoading(false);
    }
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

        {/* Role Distribution */}
        <UserStats users={users} />
      </div>

      {/* User Table */}
      <ScrollArea className="flex-1">
        <div className="p-6 pb-8">
          <UserTable
            users={filteredUsers}
            onEdit={handleEdit}
            onBanUser={handleBanUser}
            loading={loading}
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
        onUserUpdated={fetchUsers}
      />
    </div>
  );
}