// src/components/content/ContentManagerLayOut.tsx
import React, { useState, useEffect } from "react";
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
  MessageSquareText,
  MessageCircle,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/system_users/button";
import { Avatar, AvatarFallback } from "@/components/ui/system_users/avatar";
import { useAuth } from "@/contexts/Auth";
import { STAFF_COLORS, getNavigationClasses, getSidebarClasses, getRoleSwitchingClasses } from '../../constants/staffColors';

// Page type
type ContentPage = "dashboard" | "articles" | "review" | "editor" | "profile";

export default function ContentManagerLayOut() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission, isContentManagerLeader, logout, activeRole, switchToRole, getAccessibleRoles } = useAuth();
  
  // Redirect to login if no user is found
  useEffect(() => {
    if (!user) {
      console.log('No user found in ContentManagerLayOut, redirecting to login');
      navigate('/loginprivate');
    }
  }, [user, navigate]);
  
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
    { id: "dashboard" as ContentPage, label: "Bảng Điều Khiển", icon: LayoutDashboard, path: "/content/dashboard", permission: "Content Manager" },
    { id: "articles" as ContentPage, label: "Danh Sách Bài Viết", icon: FileText, path: "/content/articles", permission: "Content Manager" },
    { id: "editor" as ContentPage, label: "Chi Tiết Bài Viết", icon: PenSquare, path: "/content/editor", permission: "Content Manager" },
    ...(isContentManagerLeader() ? [
      { id: "review" as ContentPage, label: "Hàng Đợi Duyệt Bài", icon: ListChecks, path: "/content/review", permission: "Content Manager" }
    ] : []),
    { id: "profile" as ContentPage, label: user?.name || "Hồ Sơ", icon: User, path: "/content/profile", permission: "Student" },
  ];

  // Define navigation for all roles
  const roleNavigations = {
    Admin: [
      { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard, path: '/admin/dashboard' },
      { id: 'templates', label: 'Mẫu Q&A', icon: MessageSquareText, path: '/admin/templates' },
      { id: 'users', label: 'Quản Lý Người Dùng', icon: Users, path: '/admin/users' },
      { id: 'profile', label: user?.name || 'Hồ Sơ', icon: User, path: '/admin/profile' },
    ],
    'Content Manager': navigation,
    'Admission Official': [
      { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard, path: '/admission/dashboard' },
      { id: 'request-queue', label: 'Hàng Đợi Yêu Cầu', icon: Clock, badge: 8, path: '/admission/request-queue' },
      { id: 'consultation', label: 'Tư Vấn Trực Tiếp', icon: MessageCircle, badge: 5, path: '/admission/consultation' },
      { id: 'knowledge-base', label: 'Cơ Sở Tri Thức', icon: BookOpen, path: '/admission/knowledge-base' },
      { id: 'students', label: 'Danh Sách Học Sinh', icon: Users, path: '/admission/students' },
      { id: 'profile', label: user?.name || 'Hồ Sơ', icon: User, path: '/admission/profile' },
    ],
    Consultant: [
      { id: 'overview', label: 'Trang Chủ Dashboard', icon: LayoutDashboard, path: '/consultant/overview' },
      { id: 'analytics', label: 'Phân Tích & Thống Kê', icon: TrendingUp, path: '/consultant/analytics' },
      { id: 'templates', label: 'Câu Hỏi Huấn Luyện', icon: MessageSquareText, path: '/consultant/templates' },
      { id: 'optimization', label: 'Tối Ưu Hóa Nội Dung', icon: Lightbulb, path: '/consultant/optimization' },
      ...(user?.isLeader ? [
        { id: 'leader', label: 'Duyệt Cơ Sở Tri Thức', icon: Database, path: '/consultant/leader' }
      ] : []),
      { id: 'profile', label: user?.name || 'Hồ Sơ', icon: User, path: '/consultant/profile' }
    ]
  };

  // Get current navigation based on active role
  const currentNavigation = roleNavigations[activeRole] || roleNavigations[user?.role] || [];
  
  // Get accessible roles for role switching
  const accessibleRoles = getAccessibleRoles();
  
  // Role labels and icons for switching buttons
  const roleLabels = {
    Admin: { label: 'Quản Trị Viên', icon: Shield, color: 'bg-red-100 text-red-700 border-red-200' },
    'Content Manager': { label: 'Quản Lý Nội Dung', icon: FileEdit, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    'Admission Official': { label: 'Cán Bộ Tuyển Sinh', icon: GraduationCap, color: 'bg-green-100 text-green-700 border-green-200' },
    Consultant: { label: 'Tư Vấn Viên', icon: TrendingUp, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    Parent: { label: 'Phụ Huynh', icon: User, color: 'bg-gray-100 text-gray-700 border-gray-200' }
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
    ...(user?.permissions?.includes('Consultant') ? [{
      title: 'Consultant',
      items: [
        { label: 'Bảng Điều Khiển Tư Vấn', icon: LayoutDashboard, path: '/consultant/overview' },
        { label: 'Phân Tích & Thống Kê', icon: TrendingUp, path: '/consultant/analytics' },
        { label: 'Câu Hỏi Huấn Luyện', icon: MessageSquare, path: '/consultant/templates' },
        { label: 'Tối Ưu Hóa Nội Dung', icon: Lightbulb, path: '/consultant/optimization' },
        ...(user?.isLeader ? [
          { label: 'Duyệt Cơ Sở Tri Thức', icon: Database, path: '/consultant/leader' }
        ] : []),
      ]
    }] : []),
    
    // Admission Officer section  
    ...(user?.permissions?.includes('Admission Official') ? [{
      title: 'Cán Bộ Tuyển Sinh',
      items: [
        { label: 'Tổng Quan Tuyển Sinh', icon: LayoutDashboard, path: '/admission/dashboard' },
        { label: 'Hàng Đợi Yêu Cầu', icon: Calendar, path: '/admission/request-queue' },
        { label: 'Học Sinh', icon: GraduationCap, path: '/admission/students' },
        { label: 'Cơ Sở Tri Thức', icon: BookOpen, path: '/admission/knowledge-base' },
      ]
    }] : []),
    
    // Admin section
    ...(user?.permissions?.includes('Admin') ? [{
      title: 'Quản Trị',
      items: [
        { label: 'Bảng Điều Khiển Quản Trị', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Quản Lý Người Dùng', icon: Users, path: '/admin/users' },
        { label: 'Phân Tích Hệ Thống', icon: TrendingUp, path: '/admin/analytics' },
      ]
    }] : [])
  ];

  return (
     <div className={`min-h-screen flex ${STAFF_COLORS.pageBackground}`}>
      {/* Sidebar */}
      <aside className={getSidebarClasses(sidebarCollapsed)}>
        {/* Brand */}
        <div className={`p-4 ${STAFF_COLORS.brand.border} flex items-center justify-between`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 ${STAFF_COLORS.brand.logoBackground} rounded-lg flex items-center justify-center`}>
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className={`font-semibold ${STAFF_COLORS.brand.titleText}`}>Content Hub</div>
                <div className={`text-xs ${STAFF_COLORS.brand.subtitleText}`}>Editorial Manager</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed((v) => !v)}
            className={`h-8 w-8 ${STAFF_COLORS.button.hover}`}
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
              <div className={`px-3 py-2 text-xs ${STAFF_COLORS.sectionHeader.font} ${STAFF_COLORS.sectionHeader.text} uppercase tracking-wider`}>
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
                    className={getNavigationClasses(isActive)}
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
            <div className={`space-y-2 border-t ${STAFF_COLORS.divider.border} pt-4`}>
              <div className={`px-3 py-2 text-xs ${STAFF_COLORS.sectionHeader.font} ${STAFF_COLORS.sectionHeader.text} uppercase tracking-wider`}>
                Chuyển Vai Trò
              </div>
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
                    className={getRoleSwitchingClasses(isCurrentRole)}
                    disabled={isCurrentRole}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{roleInfo.label}</span>
                  </button>
                );
              }).filter(Boolean)}
            </div>
          )}
        </nav>

        {/* User */}
        <div className={`mt-auto p-4 ${STAFF_COLORS.divider.border} border-t flex-shrink-0`}>
          <div
            className={`flex items-center gap-3 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className={`${STAFF_COLORS.brand.logoBackground} text-white`}>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{user?.name || 'Đang tải...'}</div>
                <div className="text-xs text-gray-500 truncate">
                  {!user ? 'Đang kết nối...' : user?.isLeader ? 'Trưởng Nhóm Quản Lý Nội Dung' : 'Quản Lý Nội Dung'}
                </div>
                <div className={`text-xs ${STAFF_COLORS.brand.subtitleText} truncate`}>
                  Quyền: {user?.permissions?.length || 0}
                </div>
              </div>
            )}
          </div>
          {/* User info and logout */}
          <div className="mt-2 space-y-1">            
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('Bạn có chắc muốn đăng xuất?')) {
                  logout();
                }
              }}
              className="w-full text-xs font-medium border bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
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
