import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  ListChecks, 
  PenSquare, 
  Lightbulb,
  Database,
  TrendingUp, 
  MessageCircle, 
  FileEdit,
  LayoutDashboard, 
  MessageSquareText, 
  Users, 
  Shield,
  User,
  GraduationCap,
  BookOpen,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/Auth';
import { canAccessPage } from '../../constants/permissions';

export function AdminLayout() {
  const { user, logout, activeRole, switchToRole, getAccessibleRoles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current route for active state
  const getCurrentRoute = () => {
    const path = location.pathname.split('/').pop();
    return path || 'dashboard';
  };

  // Define navigation for all roles
  const roleNavigations = {
    Admin: [
      { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard, path: '/admin/dashboard' },
      { id: 'templates', label: 'Mẫu Q&A', icon: MessageSquareText, path: '/admin/templates' },
      { id: 'users', label: 'Quản Lý Người Dùng', icon: Users, path: '/admin/users' },
      { id: 'profile', label: 'Profile', icon: User, path: '/admin/profile' },
    ],
    'Content Manager': [
      { id: "dashboard", label: "Tổng quan content", icon: LayoutDashboard, path: '/content/dashboard' },
      { id: "articles", label: "All Articles", icon: FileText, path: '/content/articles' },
      { id: "review", label: "Review Queue", icon: ListChecks, path: '/content/review' },
      { id: "editor", label: "New Article", icon: PenSquare, path: '/content/editor' },
      { id: "profile", label: "Profile", icon: User, path: '/content/profile' },
    ],
    'Admission Official': [
      { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard, path: '/admission/dashboard' },
      { id: 'request-queue', label: 'Hàng Đợi Yêu Cầu', icon: Clock, badge: 8, path: '/admission/request-queue' },
      { id: 'consultation', label: 'Tư Vấn Trực Tiếp', icon: MessageCircle, badge: 5, path: '/admission/consultation' },
      { id: 'knowledge-base', label: 'Cơ Sở Tri Thức', icon: BookOpen, path: '/admission/knowledge-base' },
      { id: 'students', label: 'Danh Sách Học Sinh', icon: Users, path: '/admission/students' },
      { id: 'profile', label: 'Profile', icon: User, path: '/admission/profile' },
    ],
    Consultant: [
      { id: 'overview', label: 'Dashboard Home', icon: LayoutDashboard, path: '/consultant/overview' },
      { id: 'analytics', label: 'Analytics & Statistics', icon: TrendingUp, path: '/consultant/analytics' },
      { id: 'templates', label: 'Training Questions', icon: MessageSquareText, path: '/consultant/templates' },
      { id: 'optimization', label: 'Content Optimization', icon: Lightbulb, path: '/consultant/optimization' },
      ...(user?.isLeader ? [
        { id: 'leader', label: 'Leader Review', icon: Database, path: '/consultant/leader' }
      ] : []),
      { id: 'profile', label: 'Profile', icon: User, path: '/consultant/profile' }
    ]
  };

  // Get current navigation based on active role
  const currentNavigation = roleNavigations[activeRole] || roleNavigations[user?.role] || [];
  
  // Get accessible roles for role switching
  const accessibleRoles = getAccessibleRoles();
  
  // Role labels and icons for switching buttons
  const roleLabels = {
    Admin: { label: 'Admin', icon: Shield, color: 'bg-red-100 text-red-700 border-red-200' },
    'Content Manager': { label: 'Content', icon: FileEdit, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    'Admission Official': { label: 'Admission', icon: GraduationCap, color: 'bg-green-100 text-green-700 border-green-200' },
    Consultant: { label: 'Consultant', icon: TrendingUp, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    Parent: { label: 'Parent', icon: User, color: 'bg-gray-100 text-gray-700 border-gray-200' }
  };

  // Handle role switching
  const handleRoleSwitch = (role) => {
    switchToRole(role);
    // Navigate to the main dashboard of the switched role
    const navigation = roleNavigations[role];
    if (navigation && navigation.length > 0) {
      navigate(navigation[0].path);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white flex flex-col min-h-screen">
        <div className="p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold">Admin Panel</div>
              <p className="text-xs text-muted-foreground">System Control</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-4 flex-grow overflow-y-auto">
          {/* Current Role Pages */}
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              {roleLabels[activeRole || user?.role]?.label || 'Pages'}
            </h3>
            {currentNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = getCurrentRoute() === item.id;
              const allowed = canAccessPage(user?.permissions, item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => allowed && navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${
                    !allowed
                      ? 'opacity-50 cursor-not-allowed text-gray-400 hover:bg-transparent'
                      : ''
                  }`}
                  disabled={!allowed}
                  title={!allowed ? 'Bạn không có quyền truy cập mục này' : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Role Switching Buttons */}
          {accessibleRoles.length > 1 && (
            <div className="space-y-2 border-t pt-4">
              <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Switch Role
              </h3>
              {accessibleRoles.map((role) => {
                const roleInfo = roleLabels[role];
                if (!roleInfo) {
                  console.warn('Role info not found for role:', role);
                  return null;
                }
                const Icon = roleInfo.icon;
                const isCurrentRole = role === (activeRole || user?.role);
                
                return (
                  <button
                    key={role}
                    onClick={() => !isCurrentRole && handleRoleSwitch(role)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors border ${
                      isCurrentRole
                        ? `${roleInfo.color} font-medium border-opacity-50`
                        : 'text-gray-600 hover:bg-gray-50 border-gray-200'
                    } ${
                      isCurrentRole ? 'cursor-default' : 'cursor-pointer'
                    }`}
                    disabled={isCurrentRole}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{roleInfo.label}</span>
                    {isCurrentRole && (
                      <span className="ml-auto text-xs opacity-70">Current</span>
                    )}
                  </button>
                );
              }).filter(Boolean)}
            </div>
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t flex-shrink-0">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-red-600 hover:bg-red-50"
            onClick={() => {
              if (confirm('Bạn có chắc muốn đăng xuất?')) {
                logout();
              }
            }}
          >
            <Users className="h-5 w-5 flex-shrink-0 text-red-500" />
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}