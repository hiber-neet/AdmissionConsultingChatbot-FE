import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileEdit,
  MessageCircle,
  Users,
  ChevronLeft,
  Menu,
  GraduationCap,
  BookOpen,
  Clock,
  LogOut,
  User,
  FileText,
  ListChecks,
  PenSquare,
  TrendingUp,
  Database,
  Lightbulb,
  MessageSquareText,
  Shield
} from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Badge } from '../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { useAuth } from '../../contexts/Auth';

import PropTypes from 'prop-types';

export function AdmissionOfficerLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout, activeRole, switchToRole, getAccessibleRoles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current route for active state
  const getCurrentRoute = () => {
    const path = location.pathname.split('/').pop();
    return path || 'dashboard';
  };

  const navigation = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard, path: '/admission/dashboard' },
    { id: 'request-queue', label: 'Hàng Đợi Yêu Cầu', icon: Clock, path: '/admission/request-queue' },
    { id: 'consultation', label: 'Tư Vấn Trực Tiếp', icon: MessageCircle, path: '/admission/consultation' },
    { id: 'knowledge-base', label: 'Cơ Sở Tri Thức', icon: BookOpen, path: '/admission/knowledge-base' },
    { id: 'students', label: 'Danh Sách Học Sinh', icon: Users, path: '/admission/students' },
    { id: 'profile', label: 'Hồ Sơ', icon: User, path: '/admission/profile' },
  ];

  // Define navigation for all roles
  const roleNavigations = {
    Admin: [
      { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard, path: '/admin/dashboard' },
      { id: 'templates', label: 'Mẫu Q&A', icon: MessageSquareText, path: '/admin/templates' },
      { id: 'users', label: 'Quản Lý Người Dùng', icon: Users, path: '/admin/users' },
      { id: 'profile', label: 'Hồ Sơ', icon: User, path: '/admin/profile' },
    ],
    'Content Manager': [
      { id: "dashboard", label: "Tổng quan content", icon: LayoutDashboard, path: '/content/dashboard' },
      { id: "articles", label: "Tất Cả Bài Viết", icon: FileText, path: '/content/articles' },
      { id: "review", label: "Hàng Đợi Duyệt Bài", icon: ListChecks, path: '/content/review' },
      { id: "editor", label: "Bài Viết Mới", icon: PenSquare, path: '/content/editor' },
      { id: "profile", label: "Hồ Sơ", icon: User, path: '/content/profile' },
    ],
    'Admission Official': navigation,
    Consultant: [
      { id: 'overview', label: 'Trang Chủ Dashboard', icon: LayoutDashboard, path: '/consultant/overview' },
      { id: 'analytics', label: 'Phân Tích & Thống Kê', icon: TrendingUp, path: '/consultant/analytics' },
      { id: 'templates', label: 'Câu Hỏi Huấn Luyện', icon: MessageSquareText, path: '/consultant/templates' },
      { id: 'optimization', label: 'Tối Ưu Hóa Nội Dung', icon: Lightbulb, path: '/consultant/optimization' },
      ...(user?.isLeader ? [
        { id: 'leader', label: 'Đánh Giá Lãnh Đạo', icon: Database, path: '/consultant/leader' }
      ] : []),
      { id: 'profile', label: 'Hồ Sơ', icon: User, path: '/consultant/profile' }
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
    Consultant: { label: 'Consultant', icon: TrendingUp, color: 'bg-purple-100 text-purple-700 border-purple-200' }
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

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
      >
        {/* Logo and Brand */}
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">Cán Bộ Tuyển Sinh</div>
                <div className="text-xs text-muted-foreground">Bảng Điều Khiển</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
          {/* Current Role Pages */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                {roleLabels[activeRole || user?.role]?.label || 'Pages'}
              </h3>
            )}
            {currentNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = getCurrentRoute() === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${isActive
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "default"}
                          className="ml-auto"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Role Switching Buttons */}
          {accessibleRoles.length > 1 && !sidebarCollapsed && (
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
                    {!sidebarCollapsed && <span className="text-sm">{roleInfo.label}</span>}
                    {isCurrentRole && (
                      <span className="ml-auto text-xs opacity-70">Current</span>
                    )}
                  </button>
                );
              }).filter(Boolean)}
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t mt-auto flex-shrink-0">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#3B82F6] text-white">
                AO
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">Cán Bộ Alex</div>
                <div className="text-xs text-muted-foreground truncate">Tuyển Sinh</div>
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('Bạn có chắc muốn đăng xuất?')) {
                  logout();
                }
              }}
              className="w-full mt-3 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-3 w-3 mr-2" />
              Đăng xuất
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-hidden flex">
          <div className="flex-1 min-h-screen overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
