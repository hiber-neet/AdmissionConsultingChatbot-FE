import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../../ui/system_users/scroll-area';
import { UserManagementHeader } from './UserManagementHeader';
import { UserFilters } from './UserFilters';
import { UserStats } from './UserStats';
import { UserFormDialog } from './UserFormDialog';
import { UserTable } from './UserTable';
import { toast } from 'react-toastify';
import { loadPermissions } from '../../../constants/permissions';
import { rolesAPI } from '../../../services/fastapi';

// Dynamic role mappings - will be loaded from API
let ROLE_ID_TO_NAME = {};
let ROLE_NAME_TO_FRONTEND = {};

// Permission mapping will be loaded dynamically from API
let PERMISSION_NAME_TO_ID = {};
let PERMISSION_ID_TO_NAME = {};

// Function to transform API user data to frontend format
const transformUserData = (apiUser) => {
  // Use role_name from API if available, otherwise map from role_id
  let roleName;
  if (apiUser.role_name) {
    // Use dynamic role mapping from API
    roleName = ROLE_NAME_TO_FRONTEND[apiUser.role_name] || apiUser.role_name.toUpperCase().replace(/ /g, '_');
  } else if (apiUser.role_id && ROLE_ID_TO_NAME[apiUser.role_id]) {
    // Map from role_id if role_name is not available
    const dbRoleName = ROLE_ID_TO_NAME[apiUser.role_id];
    roleName = ROLE_NAME_TO_FRONTEND[dbRoleName] || dbRoleName.toUpperCase().replace(/ /g, '_');
  } else {
    // Fallback to CUSTOMER if no role information
    roleName = 'CUSTOMER';
  }
  
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
  
  // Don't add fallback permission for customer-type roles - leave empty array
  // Only add fallback for staff roles (SYSTEM_ADMIN, CONSULTANT, CONTENT_MANAGER, ADMISSION_OFFICER)
  const customerRoles = ['CUSTOMER', 'STUDENT', 'PARENT'];
  if (permissions.length === 0 && !customerRoles.includes(roleName)) {
    permissions = [roleName.toLowerCase().replace('system_admin', 'admin')];
  }
  
  return {
    id: apiUser.user_id?.toString() || Date.now().toString(),
    name: apiUser.full_name || 'Unknown User',
    username: apiUser.email?.split('@')[0] || 'unknown',
    email: apiUser.email || '',
    role: roleName,
    permissions: permissions, // Can be empty array for customers
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

  // Load permissions and roles from API on component mount
  useEffect(() => {
    const initializePermissions = async () => {
      try {
        const permissions = await loadPermissions();
        
        // Build dynamic permission mappings
        const nameToId = {};
        const idToName = {};
        
        permissions.forEach(p => {
          const key = p.permission_name.toLowerCase().replace(/\s+/g, '_');
          nameToId[key] = p.permission_id;
          idToName[p.permission_id] = key;
          
          // Also add uppercase versions for compatibility
          nameToId[p.permission_name.toUpperCase().replace(/\s+/g, '_')] = p.permission_id;
        });
        
        // Update global mappings
        PERMISSION_NAME_TO_ID = nameToId;
        PERMISSION_ID_TO_NAME = idToName;
      } catch (error) {
        console.error('Failed to load permissions:', error);
        toast.error('Không thể tải dữ liệu quyền hạn');
      }
    };

    const initializeRoles = async () => {
      try {
        const roles = await rolesAPI.getAll();
        
        // Build dynamic role mappings
        const idToName = {};
        const nameToFrontend = {};
        
        roles.forEach(r => {
          idToName[r.role_id] = r.role_name;
          
          // Map database role names to frontend display names
          // Default mapping: convert to uppercase and replace spaces with underscores
          let frontendName = r.role_name.toUpperCase().replace(/\s+/g, '_');
          
          // Special mappings
          if (r.role_name === 'Admin' || r.role_name === 'System Admin') {
            frontendName = 'SYSTEM_ADMIN';
          } else if (r.role_name === 'Consultant') {
            frontendName = 'CONSULTANT';
          } else if (r.role_name === 'Content Manager') {
            frontendName = 'CONTENT_MANAGER';
          } else if (r.role_name === 'Admission Official') {
            frontendName = 'ADMISSION_OFFICER';
          } else if (r.role_name === 'Student') {
            frontendName = 'STUDENT';
          } else if (r.role_name === 'Parent') {
            frontendName = 'PARENT';
          } else if (r.role_name === 'Customer') {
            frontendName = 'CUSTOMER';
          }
          // Note: Any other role names will use the default uppercase conversion
          
          nameToFrontend[r.role_name] = frontendName;
        });
        
        // Update global mappings
        ROLE_ID_TO_NAME = idToName;
        ROLE_NAME_TO_FRONTEND = nameToFrontend;
      } catch (error) {
        console.error('Failed to load roles:', error);
        toast.error('Không thể tải dữ liệu vai trò');
      }
    };

    // Run initialization in sequence to avoid race conditions
    const initialize = async () => {
      await Promise.all([initializePermissions(), initializeRoles()]);
      // Fetch users after roles and permissions are loaded
      fetchUsers();
    };
    
    initialize();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    
    // Check if we have a valid token first
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
      setUsers([]);
      setLoading(false);
      return;
    }
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      if (payload.exp < currentTime) {
        toast.error('Token xác thực đã hết hạn. Vui lòng đăng nhập lại.');
        setUsers([]);
        setLoading(false);
        return;
      }
    } catch (e) {
      toast.error('Token xác thực không hợp lệ. Vui lòng đăng nhập lại.');
      setUsers([]);
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type') || 'bearer';
      const baseUrl = 'http://localhost:8000';
      
      // Ensure token type is properly capitalized
      const authHeader = `Bearer ${token}`;

      // Fetch both staff and customer users in parallel
      const [staffResponse, customersResponse] = await Promise.all([
        fetch(`${baseUrl}/users/staffs`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': authHeader
          }
        }),
        fetch(`${baseUrl}/users/students`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': authHeader
          }
        })
      ]);

      if (!staffResponse.ok) {
        const errorData = await staffResponse.text();
        
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.detail || `HTTP ${staffResponse.status}: ${staffResponse.statusText}`;
          
          // Special handling for permission errors
          if (staffResponse.status === 403 && parsedError.detail === "Admin permission required") {
            errorMessage = "Access denied: Admin permissions required. Current user role may not have sufficient privileges.";
          }
        } catch (parseError) {
          errorMessage = `HTTP ${staffResponse.status}: ${errorData || staffResponse.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const staffData = await staffResponse.json();
      const customersData = customersResponse.ok ? await customersResponse.json() : [];

      // Transform and combine both datasets
      const allUsers = [];
      
      if (Array.isArray(staffData)) {
        const transformedStaff = staffData.map(transformUserData);
        allUsers.push(...transformedStaff);
      }
      
      if (Array.isArray(customersData)) {
        const transformedCustomers = customersData.map(transformUserData);
        allUsers.push(...transformedCustomers);
      }
      
      setUsers(allUsers);

    } catch (err) {
      toast.error(`Không thể tải người dùng: ${err.message}`);
      setUsers([]);
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

  // Note: fetchUsers is now called from the initialization useEffect
  // after roles and permissions are loaded to avoid race conditions

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
      toast.error('Vui lòng điền tất cả các trường bắt buộc (Tên, Email, Vai trò)');
      return;
    }
    if (!editingUser && !formData.password) {
      toast.error('Mật khẩu là bắt buộc cho người dùng mới');
      return;
    }
    if (!editingUser && !formData.phone_number) {
      toast.error('Số điện thoại là bắt buộc cho người dùng mới');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('access_token');
      const baseUrl = 'http://localhost:8000';

      if (editingUser) {
        // Update existing user - basic information only
        // The UserFormDialog handles permission updates internally
        
        const updatePayload = {
          full_name: formData.name,
          email: formData.email,
          phone_number: formData.phone_number || null,
        };

        // Only include password if it's provided
        if (formData.password && formData.password.trim() !== '') {
          updatePayload.password = formData.password;
        }

        const response = await fetch(`${baseUrl}/users/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatePayload)
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

        const updatedUserData = await response.json();
        
        // Update local state with the response from server
        setUsers(users.map(u => 
          u.id === editingUser.id 
            ? {
                ...u,
                name: updatedUserData.full_name,
                email: updatedUserData.email,
                phone_number: updatedUserData.phone_number,
                status: updatedUserData.status ? 'active' : 'inactive',
              }
            : u
        ));
        
        toast.success('Cập nhật thông tin người dùng thành công!');
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
        
        // Determine permissions based on role
        let permissionIds = [];
        
        // First, get all available permissions from API
        const permissionsResponse = await fetch(`${baseUrl}/users/permissions`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (permissionsResponse.ok) {
          const allPermissions = await permissionsResponse.json();
          
          if (formData.role === 'SYSTEM_ADMIN') {
            // Admin gets ALL permissions
            permissionIds = allPermissions.map(p => p.permission_id);
          } else {
            // For other staff roles, assign matching permission
            const roleToPermissionName = {
              'CONSULTANT': 'Consultant',
              'CONTENT_MANAGER': 'ContentManager',
              'ADMISSION_OFFICER': 'AdmissionOfficial'
            };
            
            const targetPermissionName = roleToPermissionName[formData.role];
            if (targetPermissionName) {
              const matchingPermission = allPermissions.find(p => 
                p.permission_name === targetPermissionName || 
                p.permission_name.replace(/\s+/g, '') === targetPermissionName
              );
              
              if (matchingPermission) {
                permissionIds = [matchingPermission.permission_id];
              }
            }
          }
        }
        
        // Prepare API request body for new user
        const requestBody = {
          full_name: formData.name,
          email: formData.email,
          status: true,
          password: formData.password,
          role_id: roleId,
          permissions: permissionIds, // Automatically assign permissions based on role
          phone_number: formData.phone_number || '',
          consultant_is_leader: false,
          content_manager_is_leader: false,
          interest_desired_major: formData.interest_desired_major || '',
          interest_region: formData.interest_region || ''
        };

        const response = await fetch(`${baseUrl}/auth/register`, {
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
        
        // Determine permissions for local state based on role
        let assignedPermissions = [];
        if (formData.role === 'SYSTEM_ADMIN') {
          assignedPermissions = ['admin'];
        } else {
          const roleToPermission = {
            'CONSULTANT': 'consultant',
            'CONTENT_MANAGER': 'content_manager',
            'ADMISSION_OFFICER': 'admission_officer'
          };
          const permission = roleToPermission[formData.role];
          if (permission) {
            assignedPermissions = [permission];
          }
        }
        
        // Add to local state
        setUsers([...users, {
          id: newUser.user_id?.toString() || Date.now().toString(),
          name: newUser.full_name,
          username: newUser.email?.split('@')[0] || 'user',
          email: newUser.email,
          role: formData.role,
          permissions: assignedPermissions,
          status: 'active',
          phone_number: newUser.phone_number || '',
          lastActive: 'Just now',
          createdAt: new Date().toISOString().split('T')[0],
          isBanned: false,
          banReason: null,
          consultant_is_leader: false,
          content_manager_is_leader: false,
          interest_desired_major: newUser.interest_desired_major || '',
          interest_region: newUser.interest_region || ''
        }]);
        
        toast.success(`Tạo người dùng thành công với quyền ${assignedPermissions.join(', ')}!`);
      }

      // Close dialog and refresh
      setIsDialogOpen(false);
      await fetchUsers(); // Refresh the user list

    } catch (error) {
      console.error('Failed to create/update user:', error);
      toast.error(`Không thể ${editingUser ? 'cập nhật' : 'tạo'} người dùng: ${error.message}`);
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
        toast.error('Không thể cấm người dùng quản trị. Người dùng quản trị có đặc quyền đặc biệt.');
        return;
      }
      
      if (user.status === 'active') {
        // User is active, so we're deactivating (banning) them
        await banUser(userId);
        toast.success('Vô hiệu hóa và cấm người dùng thành công');
      } else {
        // User is inactive, so we're activating (unbanning) them
        await unbanUser(userId);
        toast.success('Kích hoạt và bỏ cấm người dùng thành công');
      }
      
    } catch (error) {
      const action = users.find(u => u.id === userId)?.status === 'active' ? 'vô hiệu hóa' : 'kích hoạt';
      toast.error(`Không thể ${action} người dùng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Separate users into staff and customers
  const staffUsers = filteredUsers.filter(user => 
    user.permissions && user.permissions.length > 0
  );
  
  const customerUsers = filteredUsers.filter(user => 
    !user.permissions || user.permissions.length === 0
  );

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

      {/* User Tables */}
      <ScrollArea className="flex-1">
        <div className="p-6 pb-8 space-y-8">
          {/* Staff Section */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Staff Members</h2>
              <p className="text-sm text-gray-600 mt-1">
                Users with system permissions (Admins, Consultants, Content Managers, Admission Officers)
              </p>
            </div>
            <UserTable
              users={staffUsers}
              onEdit={handleEdit}
              onBanUser={handleBanUser}
              loading={loading}
              isCustomerSection={false}
            />
          </div>

          {/* Customer Section */}
          <div>
            <div className="mb-4 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
              <p className="text-sm text-gray-600 mt-1">
                Students and Parents (can only be activated/deactivated, not edited)
              </p>
            </div>
            <UserTable
              users={customerUsers}
              onEdit={null}
              onBanUser={handleBanUser}
              loading={loading}
              isCustomerSection={true}
            />
          </div>
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