import { useState, useMemo, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  ListChecks, 
  PenSquare, 
  Lightbulb,
  Database,
  TrendingUp, 
  BarChart3,
  MessageCircle, 
  FileEdit,
  LayoutDashboard, 
  MessageSquareText, 
  Users, 
  Shield,
  Activity 
} from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { useAuth } from '../../contexts/Auth';
import { canAccess } from '../../constants/permissions';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current route for active state
  const getCurrentRoute = () => {
    const path = location.pathname.split('/').pop();
    return path || 'dashboard';
  };

  const navigation = [
    { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'templates', label: 'Mẫu Q&A', icon: MessageSquareText, path: '/admin/templates' },
    { id: 'users', label: 'Quản Lý Người Dùng', icon: Users, path: '/admin/users' },
    { id: 'activity', label: 'Nhật Ký Hoạt Động', icon: Activity, path: '/admin/activity' },
    // admission section
    { id: 'admissions', label: 'Tổng quan admission', icon: LayoutDashboard, path: '/admin/admissions' },
    { id: 'content', label: 'Quản Lý Nội Dung', icon: FileEdit, badge: 3, path: '/admin/content' },
    { id: 'consultation', label: 'Tư Vấn Trực Tiếp', icon: MessageCircle, badge: 5, path: '/admin/consultation' },
    { id: 'insights', label: 'Thông Tin Học Sinh', icon: Users, path: '/admin/insights' },
    // consultant section
    { id: 'overview', label: 'Tổng quan consultant', icon: LayoutDashboard, path: '/admin/overview' },
    { id: 'analytics', label: 'Analytics & Statistics', icon: TrendingUp, path: '/admin/analytics' },
    { id: 'knowledge', label: 'Knowledge Base', icon: Database, path: '/admin/knowledge' },
    { id: 'optimization', label: 'Content Optimization', icon: Lightbulb, path: '/admin/optimization' },
    // content section
    { id: "dashboardcontent", label: "Tổng quan content", icon: LayoutDashboard, path: '/admin/dashboardcontent' },
    { id: "articles", label: "All Articles", icon: FileText, path: '/admin/articles' },
    { id: "review", label: "Review Queue", icon: ListChecks, path: '/admin/review' },
    { id: "editor", label: "New Article", icon: PenSquare, path: '/admin/editor' },
  ];

  // Filter navigation based on user role
  const allowedNav = useMemo(
    () => navigation.filter(n => canAccess(user?.role, n.id)),
    [user?.role]
  );

  // Redirect to first allowed route if current route is not accessible
  useEffect(() => {
    if (!user) return;
    const currentRoute = getCurrentRoute();
    const currentAllowed = canAccess(user.role, currentRoute);
    if (!currentAllowed && allowedNav.length > 0) {
      const fallback = allowedNav[0]?.path;
      if (fallback) {
        navigate(fallback, { replace: true });
      }
    }
  }, [user, location.pathname, allowedNav, navigate]);

  return (
    <div className="flex h-full bg-[#F8FAFC]">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white flex flex-col h-full">
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
        
        <nav className="p-4 space-y-2 flex-grow overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = getCurrentRoute() === item.id;
            const allowed = canAccess(user?.role, item.id);

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
              </button>
            );
          })}
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
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}