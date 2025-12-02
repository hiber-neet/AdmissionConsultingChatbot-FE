// src/components/content/ContentManagerLayOut.tsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ListChecks,
  PenSquare,
  Menu,
  User,
  ChevronLeft,
  Database,
  LogOut,
  MessageSquare,
  TrendingUp,
  Lightbulb,
  Users,
  Calendar,
  GraduationCap,
  BookOpen,
  Shield,
  FileEdit,
  Activity,
  MessageSquareText,
  MessageCircle,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/system_users/button";
import { Avatar, AvatarFallback } from "@/components/ui/system_users/avatar";
import { useAuth } from "@/contexts/Auth";

// Page type
type ContentPage = "dashboard" | "articles" | "review" | "editor" | "profile";

export default function ContentManagerLayOut() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission, setUserLeadership, loginAs, logout, activeRole, switchToRole, getAccessibleRoles } = useAuth();
  
  // Auto-login if no user is found (for content pages)
  useEffect(() => {
    if (!user) {
      console.log('No user found in ContentManagerLayOut, auto-logging in as CONTENT_MANAGER');
      loginAs('CONTENT_MANAGER');
    }
  }, [user, loginAs]);
  
  // Get current route for active state
  const getCurrentRoute = (): ContentPage => {
    const path = location.pathname.split('/').pop();
    return (path as ContentPage) || 'dashboard';
  };
  
  // Navigation function that updates URL
  const navigateToPage = (page: ContentPage) => {
    navigate(`/content/${page}`);
  };

  const navigation = [
    { id: "dashboard" as ContentPage, label: "Dashboard", icon: LayoutDashboard, path: "/content/dashboard", permission: "content_manager" },
    { id: "articles" as ContentPage, label: "Article List", icon: FileText, path: "/content/articles", permission: "content_manager" },
    { id: "editor" as ContentPage, label: "Article Details", icon: PenSquare, path: "/content/editor", permission: "content_manager" },
    ...(hasPermission("content_manager") ? [
      { id: "review" as ContentPage, label: "Review Queue", icon: ListChecks, path: "/content/review", permission: "content_manager" }
    ] : []),
    { id: "profile" as ContentPage, label: "Profile", icon: User, path: "/content/profile", permission: "student" },
  ];

  // Define navigation for all roles
  const roleNavigations = {
    SYSTEM_ADMIN: [
      { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard, path: '/admin/dashboard' },
      { id: 'templates', label: 'Mẫu Q&A', icon: MessageSquareText, path: '/admin/templates' },
      { id: 'users', label: 'Quản Lý Người Dùng', icon: Users, path: '/admin/users' },
      { id: 'activity', label: 'Nhật Ký Hoạt Động', icon: Activity, path: '/admin/activity' },
      { id: 'profile', label: 'Profile', icon: User, path: '/admin/profile' },
    ],
    CONTENT_MANAGER: navigation,
    ADMISSION_OFFICER: [
      { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard, path: '/admission/dashboard' },
      { id: 'request-queue', label: 'Hàng Đợi Yêu Cầu', icon: Clock, badge: 8, path: '/admission/request-queue' },
      { id: 'consultation', label: 'Tư Vấn Trực Tiếp', icon: MessageCircle, badge: 5, path: '/admission/consultation' },
      { id: 'knowledge-base', label: 'Cơ Sở Tri Thức', icon: BookOpen, path: '/admission/knowledge-base' },
      { id: 'students', label: 'Danh Sách Học Sinh', icon: Users, path: '/admission/students' },
      { id: 'profile', label: 'Profile', icon: User, path: '/admission/profile' },
    ],
    CONSULTANT: [
      { id: 'overview', label: 'Dashboard Home', icon: LayoutDashboard, path: '/consultant/overview' },
      { id: 'analytics', label: 'Analytics & Statistics', icon: TrendingUp, path: '/consultant/analytics' },
      { id: 'templates', label: 'Training Questions', icon: MessageSquareText, path: '/consultant/templates' },
      { id: 'optimization', label: 'Content Optimization', icon: Lightbulb, path: '/consultant/optimization' },
      ...(user?.isLeader ? [
        { id: 'leader', label: 'Leader Review', icon: Database, path: '/consultant/leader' }
      ] : []),
      { id: 'profile', label: 'Profile', icon: User, path: '/consultant/profile' }
    ],
    STUDENT: [
      { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    ]
  };

  // Get current navigation based on active role
  const currentNavigation = roleNavigations[activeRole] || roleNavigations[user?.role] || [];
  
  // Get accessible roles for role switching
  const accessibleRoles = getAccessibleRoles();
  
  // Role labels and icons for switching buttons
  const roleLabels = {
    SYSTEM_ADMIN: { label: 'Admin', icon: Shield, color: 'bg-red-100 text-red-700 border-red-200' },
    CONTENT_MANAGER: { label: 'Content', icon: FileEdit, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    ADMISSION_OFFICER: { label: 'Admission', icon: GraduationCap, color: 'bg-green-100 text-green-700 border-green-200' },
    CONSULTANT: { label: 'Consultant', icon: TrendingUp, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    STUDENT: { label: 'Student', icon: User, color: 'bg-gray-100 text-gray-700 border-gray-200' }
  };

  // Handle role switching
  const handleRoleSwitch = (role) => {
    switchToRole(role);
    // Navigate to the main dashboard of the switched role
    const navItems = roleNavigations[role];
    if (navItems && navItems.length > 0) {
      navigate(navItems[0].path);
    }
  };

  // Additional navigation sections for other permissions
  const additionalSections = [
    // Consultant section
    ...(user?.permissions?.includes('consultant') ? [{
      title: 'Consultant',
      items: [
        { label: 'Consultant Dashboard', icon: LayoutDashboard, path: '/consultant/overview' },
        { label: 'Analytics & Statistics', icon: TrendingUp, path: '/consultant/analytics' },
        { label: 'Training Questions', icon: MessageSquare, path: '/consultant/templates' },
        { label: 'Content Optimization', icon: Lightbulb, path: '/consultant/optimization' },
        ...(user?.isLeader ? [
          { label: 'Leader Review', icon: Database, path: '/consultant/leader' }
        ] : []),
      ]
    }] : []),
    
    // Admission Officer section  
    ...(user?.permissions?.includes('admission_officer') ? [{
      title: 'Admission Officer',
      items: [
        { label: 'Admission Dashboard', icon: LayoutDashboard, path: '/admission/dashboard' },
        { label: 'Request Queue', icon: Calendar, path: '/admission/request-queue' },
        { label: 'Students', icon: GraduationCap, path: '/admission/students' },
        { label: 'Knowledge Base', icon: BookOpen, path: '/admission/knowledge-base' },
      ]
    }] : []),
    
    // Admin section
    ...(user?.permissions?.includes('admin') ? [{
      title: 'Administration',
      items: [
        { label: 'Admin Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'User Management', icon: Users, path: '/admin/users' },
        { label: 'System Analytics', icon: TrendingUp, path: '/admin/analytics' },
      ]
    }] : [])
  ];

  // Toggle button will appear in the sidebar footer for testing
  const toggleRole = () => {
    console.log('Toggle clicked in ContentManager. Current user:', user);
    
    if (!user) {
      console.log('No user found, logging in as content manager');
      loginAs('CONTENT_MANAGER');
      return;
    }
    
    console.log('Current isLeader:', user?.isLeader);
    const newLeaderStatus = !(user?.isLeader);
    console.log('Setting isLeader to:', newLeaderStatus);
    setUserLeadership(newLeaderStatus);
  };

  return (
     <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Brand */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">Content Hub</div>
                <div className="text-xs text-gray-500">Editorial Manager</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
          {/* Current Role Pages */}
          <div>
            {!sidebarCollapsed && (
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {roleLabels[activeRole || user?.role]?.label || 'Pages'}
              </div>
            )}
            <div className="space-y-1">
              {currentNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = getCurrentRoute() === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#3B82F6] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Switching Buttons */}
          {accessibleRoles.length > 1 && !sidebarCollapsed && (
            <div className="space-y-2 border-t pt-4">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Switch Role
              </div>
              {accessibleRoles.map((role) => {
                const roleInfo = roleLabels[role];
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
              })}
            </div>
          )}
        </nav>

        {/* User */}
        <div className="mt-auto p-4 border-t border-gray-200 flex-shrink-0">
          <div
            className={`flex items-center gap-3 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#3B82F6] text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{user?.name || 'Loading...'}</div>
                <div className="text-xs text-gray-500 truncate">
                  {!user ? 'Connecting...' : user?.isLeader ? 'Content Manager Leader' : 'Content Manager'}
                </div>
                <div className="text-xs text-blue-600 truncate">
                  Perms: {user?.permissions?.length || 0}
                </div>
              </div>
            )}
          </div>
          {/* TESTING: Role toggle button */}
          <div className="mt-2 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRole}
              className={`w-full text-xs font-medium border ${ 
                user?.isLeader 
                ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200' 
                : 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200'
              }`}
              disabled={!user}
            >
              {!sidebarCollapsed && (
                !user ? '🔄 Loading...' : user?.isLeader ? '👑 Leader Mode' : '👤 Regular Mode'
              )}
            </Button>
            
            {/* Debug info */}
            {!sidebarCollapsed && (
              <div className="text-xs text-gray-500 p-1 bg-gray-50 rounded">
                Debug: {!user ? 'No User' : user?.isLeader ? 'Leader' : 'Regular'} | {user?.permissions?.length || 0} perms
              </div>
            )}
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to logout?')) {
                  logout();
                }
              }}
              className="w-full text-xs font-medium border bg-red-100 text-red-700 border-red-300 hover:bg-red-200 mt-2"
            >
              <LogOut className="h-3 w-3" />
              {!sidebarCollapsed && (
                <span className="ml-1">Logout</span>
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
