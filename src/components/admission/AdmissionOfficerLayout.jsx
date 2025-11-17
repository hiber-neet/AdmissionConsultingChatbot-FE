import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileEdit,
  BarChart3,
  MessageCircle,
  Users,
  Bell,
  Search,
  ChevronLeft,
  Menu,
  GraduationCap,
  BookOpen,
  Clock
} from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Input } from '../ui/system_users/input';
import { Badge } from '../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';

import PropTypes from 'prop-types';

export function AdmissionOfficerLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current route for active state
  const getCurrentRoute = () => {
    const path = location.pathname.split('/').pop();
    return path || 'dashboard';
  };

  const navigation = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard, path: '/admission/dashboard' },
    { id: 'request-queue', label: 'Hàng Đợi Yêu Cầu', icon: Clock, badge: 8, path: '/admission/request-queue' },
    { id: 'consultation', label: 'Tư Vấn Trực Tiếp', icon: MessageCircle, badge: 5, path: '/admission/consultation' },
    { id: 'knowledge-base', label: 'Cơ Sở Tri Thức', icon: BookOpen, path: '/admission/knowledge-base' },
    { id: 'students', label: 'Danh Sách Học Sinh', icon: Users, path: '/admission/students' },
  ];

  return (
    <div className="h-full flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r flex flex-col h-screen transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'
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
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
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
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b px-6 py-3 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết, báo cáo, sinh viên..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
