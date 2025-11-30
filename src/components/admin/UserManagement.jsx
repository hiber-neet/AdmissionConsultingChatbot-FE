import { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { UserManagementHeader } from './UserManagementHeader';
import { UserFilters } from './UserFilters';
import { UserStats } from './UserStats';
import { UserFormDialog } from './UserFormDialog';
import { UserTable } from './UserTable';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';

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

// Function to transform API user data to frontend format
const transformUserData = (apiUser) => {
  const roleName = roleMapping[apiUser.role_id] || 'CUSTOMER';
  
  // Transform permissions from API format to frontend format
  let permissions = [roleName]; // Default to role name as permission
  
  if (apiUser.permissions && Array.isArray(apiUser.permissions)) {
    // If API returns permission objects with permission_id
    permissions = apiUser.permissions.map(perm => {
      if (typeof perm === 'object' && perm.permission_id) {
        return PERMISSION_ID_TO_NAME[perm.permission_id] || 'customer';
      } else if (typeof perm === 'string') {
        // If it's already a permission name, normalize to lowercase
        return perm.toLowerCase().replace('system_admin', 'admin');
      } else if (typeof perm === 'number') {
        return PERMISSION_ID_TO_NAME[perm] || 'customer';
      }
      return roleName.toLowerCase(); // Fallback to role name
    });
    
    // Remove duplicates and ensure at least the role is included
    const normalizedRole = roleName.toLowerCase().replace('system_admin', 'admin');
    permissions = Array.from(new Set([...permissions, normalizedRole]));
  } else {
    // No specific permissions, use role-based permission
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
    banReason: !apiUser.status ? 'Banned by admin' : null
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
  });

  // Fetch users from API
  const fetchUsers = async () => {
    console.log('🔄 Fetching users from API...');
    setLoading(true);
    
    // Check if we have a valid token first
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ No token found in localStorage');
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
        console.error('❌ Token is expired');
        toast.error('Authentication token expired. Please login again.');
        setUsers(initialUsers);
        setLoading(false);
        return;
      }
      console.log('✅ Token is valid and not expired');
    } catch (e) {
      console.error('❌ Invalid token format:', e);
      toast.error('Invalid authentication token. Please login again.');
      setUsers(initialUsers);
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type') || 'bearer';
      const frontendUser = JSON.parse(sessionStorage.getItem("demo_user") || "{}");
      const baseUrl = 'http://localhost:8000';
      
      console.log('👤 Frontend user data:', frontendUser);
      console.log('📋 Request details:', {
        url: `${baseUrl}/users/staffs`,
        token: token ? `${token.substring(0, 20)}...` : 'No token',
        tokenType,
        frontendRole: frontendUser.role,
        frontendPermissions: frontendUser.permissions
      });

      // Ensure token type is properly capitalized
      const authHeader = `Bearer ${token}`;
      console.log('🧪 TESTING: Exact request headers that will be sent:');
      console.log('   Authorization:', authHeader);
      console.log('   Accept:', 'application/json');

      // Decode token to see what backend will receive
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log('🔑 JWT payload (what backend sees):', payload);
          
          // Debug token vs frontend user mismatch
          console.log('🔍 TOKEN vs FRONTEND COMPARISON:');
          console.log('   Frontend user ID:', frontendUser.id);
          console.log('   JWT user_id/sub:', payload.user_id || payload.sub);
          console.log('   Frontend role:', frontendUser.role);
          console.log('   JWT role_id:', payload.role_id);
          console.log('   JWT full payload:', JSON.stringify(payload, null, 2));
          
          if (frontendUser.id !== (payload.user_id || payload.sub)?.toString()) {
            console.warn('⚠️ USER ID MISMATCH: Frontend user ID doesn\'t match JWT token user ID');
          }
          
        } catch (e) {
          console.log('⚠️ Could not decode JWT token:', e.message);
        }
      }

      const response = await fetch(`${baseUrl}/users/staffs`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': authHeader
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

      // Transform API data to frontend format
      if (Array.isArray(data)) {
        console.log('� Response is array with', data.length, 'users');
        const transformedUsers = data.map(transformUserData);
        console.log('� Transformed users:', transformedUsers);
        setUsers(transformedUsers);
      } else {
        console.log('🤷 Unexpected response format, using fallback data');
        setUsers(initialUsers);
      }

    } catch (err) {
      console.error('💥 Fetch error:', err);
      toast.error(`Failed to fetch users: ${err.message}`);
      // Use fallback data when API fails
      console.log('🔄 Using fallback data due to API error');
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
      console.log('🔒 Banning user:', userId);

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

      console.log('📡 Ban API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Ban API Error:', errorData);
        
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
      console.log('✅ User banned successfully:', data);
      
      // Update user status in local state
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, status: 'inactive', banReason: 'Banned by admin' }
          : u
      ));
      
      return data;
    } catch (error) {
      console.error('💥 Ban user error:', error);
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
      console.log('🔓 Unbanning user:', userId);

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

      console.log('📡 Unban API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Unban API Error:', errorData);
        
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
      console.log('✅ User unbanned successfully:', data);
      
      // Update user status in local state
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, status: 'active', banReason: null }
          : u
      ));
      
      return data;
    } catch (error) {
      console.error('💥 Unban user error:', error);
      throw error;
    }
  };

  // Update user permissions API call
  const updateUserPermissions = async (userId, permissions, consultantIsLeader = false, contentManagerIsLeader = false) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = 'http://localhost:8000';
      console.log('🔧 Updating permissions for user:', userId);
      console.log('📋 Permissions to set:', permissions);

      // Convert permission names to IDs
      const permissionIds = permissions
        .map(permName => PERMISSION_NAME_TO_ID[permName])
        .filter(id => id !== undefined); // Remove any unmapped permissions
      
      console.log('🆔 Mapped permission IDs:', permissionIds);

      if (permissionIds.length === 0) {
        console.warn('⚠️ No valid permission IDs found for permissions:', permissions);
      }

      const requestBody = {
        user_id: parseInt(userId),
        permission_ids: permissionIds,
        consultant_is_leader: consultantIsLeader,
        content_manager_is_leader: contentManagerIsLeader
      };

      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${baseUrl}/users/permissions/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Permission Update API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Permission Update API Error:', errorData);
        
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.detail || `HTTP ${response.status}`;
          
          // Handle specific permission errors
          if (parsedError.missing_permission_ids) {
            errorMessage = `Invalid permission IDs: ${parsedError.missing_permission_ids.join(', ')}`;
          }
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${errorData}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Permissions updated successfully:', data);
      
      return data;
    } catch (error) {
      console.error('💥 Update permissions error:', error);
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
      console.log('➕ Creating new user via API...');
      console.log('📋 User data to create:', userData);

      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      console.log('📡 Create User API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Create User API Error:', errorData);
        
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
      console.log('✅ User created successfully:', data);
      
      return data;
    } catch (error) {
      console.error('💥 Create user error:', error);
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
      interest_region: '' 
    });
    setIsDialogOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.name || !formData.email || !formData.role) return;
    if (!editingUser && !formData.password) return; // Password required for new users
    if (!editingUser && !formData.phone_number) {
      toast.error('Phone number is required for new users');
      return;
    }

    try {
      setLoading(true);

      if (editingUser) {
        // Update existing user - call API for permission updates
        console.log('🔄 Updating user permissions via API...');
        
        // Check if permissions have changed
        const currentPermissions = editingUser.permissions || [];
        const newPermissions = formData.permissions || [];
        const permissionsChanged = JSON.stringify(currentPermissions.sort()) !== JSON.stringify(newPermissions.sort());
        
        if (permissionsChanged) {
          console.log('📝 Permissions changed, calling API...');
          console.log('   Current:', currentPermissions);
          console.log('   New:', newPermissions);
          
          // Determine leadership flags based on role and permissions
          // In this simplified system, leadership is determined by having multiple permissions
          // or having admin/content_manager permissions along with consultant role, etc.
          const consultantIsLeader = formData.role === 'CONSULTANT' && 
            (newPermissions.includes('admin') || newPermissions.includes('content_manager') || newPermissions.length > 1);
          const contentManagerIsLeader = formData.role === 'CONTENT_MANAGER' && 
            (newPermissions.includes('admin') || newPermissions.includes('consultant') || newPermissions.length > 1);
          
          await updateUserPermissions(
            editingUser.id, 
            newPermissions, 
            consultantIsLeader, 
            contentManagerIsLeader
          );
          
          toast.success('User permissions updated successfully!');
        } else {
          console.log('📝 No permission changes detected');
          toast.success('User information updated successfully!');
        }
        
        // Update local state regardless
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
        // Create new user via API
        console.log('➕ Creating new user via API...');
        
        // Map role name to role_id
        const roleNameToId = {
          'SYSTEM_ADMIN': 1,
          'CONSULTANT': 2,
          'CONTENT_MANAGER': 3,
          'ADMISSION_OFFICER': 4,
          'CUSTOMER': 5
        };
        
        const roleId = roleNameToId[formData.role];
        if (!roleId) {
          throw new Error(`Invalid role: ${formData.role}`);
        }
        
        // Convert permission names to IDs
        const permissionIds = formData.permissions
          .map(permName => PERMISSION_NAME_TO_ID[permName])
          .filter(id => id !== undefined); // Remove any unmapped permissions
        
        console.log('🔄 Mapped permission IDs:', permissionIds);
        
        // Determine leadership flags
        const consultantIsLeader = formData.role === 'CONSULTANT' && 
          (formData.permissions.includes('admin') || formData.permissions.includes('content_manager') || formData.permissions.length > 1);
        const contentManagerIsLeader = formData.role === 'CONTENT_MANAGER' && 
          (formData.permissions.includes('admin') || formData.permissions.includes('consultant') || formData.permissions.length > 1);
        
        // Prepare API request body
        const requestBody = {
          full_name: formData.name,
          email: formData.email,
          status: true,
          password: formData.password,
          role_id: roleId,
          permissions: permissionIds,
          phone_number: formData.phone_number || '',
          consultant_is_leader: consultantIsLeader,
          content_manager_is_leader: contentManagerIsLeader,
          interest_desired_major: formData.interest_desired_major || '',
          interest_region: formData.interest_region || ''
        };
        
        console.log('📤 API Request body:', JSON.stringify(requestBody, null, 2));
        
        // Call the API
        const createdUser = await createUser(requestBody);
        
        // Transform API response to frontend format
        const newUser = transformUserData(createdUser);
        
        // Add to the users list
        setUsers([newUser, ...users]);
        toast.success('New user created successfully!');
        
        // Refresh the user list to ensure we have the latest data
        await fetchUsers();
      }

      // Reset form and close dialog
      setFormData({ 
        name: '', 
        email: '', 
        password: '', 
        role: '', 
        permissions: [], 
        phone_number: '', 
        interest_desired_major: '', 
        interest_region: '' 
      });
      setEditingUser(null);
      setIsDialogOpen(false);
      
    } catch (error) {
      console.error('💥 Create/Update user error:', error);
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
      password: '', // Don't prefill password for security
      role: user.role,
      permissions: user.permissions || [],
      phone_number: user.phone_number || '',
      interest_desired_major: '',
      interest_region: '',
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
        console.log('✅ User deactivated and banned successfully');
      } else {
        // User is inactive, so we're activating (unbanning) them
        await unbanUser(userId);
        toast.success('User activated and unbanned successfully');
        console.log('✅ User activated and unbanned successfully');
      }
      
    } catch (error) {
      console.error('💥 Ban/Unban error:', error);
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
            onDelete={handleDelete}
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
      />
    </div>
  );
}