import { useState, useMemo, useEffect } from 'react';
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
import { AdminDashboard } from './AdminDashboard';
import { QATemplateManager } from './QATemplateManager';
import { UserManagement } from './UserManagement';
import { ActivityLog } from './ActivityLog';
import { AdmissionDashboard } from '../admission/AdmissionDashboard';
import { ContentManagement } from '../admission/ContentManagement';
import { ChatbotAnalytics } from '../admission/ChatbotAnalytics';
import { LiveChatView } from '../admission/chat/LiveChatView';
import { StudentInsights } from '../admission/StudentInsights';
import { DashboardOverview } from '../consultant/DashboardOverview';
import { AnalyticsStatistics } from '../consultant/AnalyticsStatistics';
import { KnowledgeBaseManagement } from '../consultant/KnowledgeBaseManagement';
import { ContentOptimization } from '../consultant/ContentOptimization';
import ContentManagerDashboard from '../content/ContentManagerDashboard';
import AllArticles from '../content/AllArticles';
import ReviewQueue from '../content/ReviewQueue';
import ArticleEditor from '../content/ArticleEditor';
import { useAuth } from '../../contexts/Auth';
import { canAccess } from '../../constants/permissions';

export function AdminLayout() {
  const [activeView, setActiveView] = useState('dashboard');
  const { user, logout } = useAuth();

  const navigation = [
    { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard },
    { id: 'templates', label: 'Mẫu Q&A', icon: MessageSquareText },
    { id: 'users', label: 'Quản Lý Người Dùng', icon: Users },
    { id: 'activity_log', label: 'Nhật Ký Hoạt Động', icon: Activity },
    // admission section
    { id: 'admissions', label: 'Tổng quan admission', icon: LayoutDashboard },
    { id: 'content', label: 'Quản Lý Nội Dung', icon: FileEdit, badge: 3 },
    { id: 'chatbot', label: 'Phân Tích Chatbot', icon: BarChart3 },
    { id: 'consultation', label: 'Tư Vấn Trực Tiếp', icon: MessageCircle, badge: 5 },
    { id: 'insights', label: 'Thông Tin Học Sinh', icon: Users },
    // consultant section
    { id: 'overview', label: 'Tổng quan consultant', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics & Statistics', icon: TrendingUp },
    { id: 'knowledge', label: 'Knowledge Base', icon: Database },
    { id: 'optimization', label: 'Content Optimization', icon: Lightbulb },
    // content section
    { id: "dashboardcontent", label: "Tổng quan content", icon: LayoutDashboard },
    { id: "articles", label: "All Articles", icon: FileText },
    { id: "review", label: "Review Queue", icon: ListChecks },
    { id: "editor", label: "New Article", icon: PenSquare },
  ];

  // Filter navigation based on user role
  const allowedNav = useMemo(
    () => navigation.filter(n => canAccess(user?.role, n.id)),
    [user?.role]
  );

  // Set first allowed tab as default
  useEffect(() => {
    if (!user) return;
    const currentAllowed = canAccess(user.role, activeView);
    if (!currentAllowed) {
      const fallback = allowedNav[0]?.id;
      if (fallback && fallback !== activeView) {
        setActiveView(fallback);
      }
    }
  }, [user, activeView, allowedNav]);

  const goToEditor = () => setActiveView('editor');

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
            const isActive = activeView === item.id;
            const allowed = canAccess(user?.role, item.id);

            return (
              <button
                key={item.id}
                onClick={() => allowed && setActiveView(item.id)}
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
        {activeView === 'dashboard' && <AdminDashboard setActiveView={setActiveView} />}
        {activeView === 'templates' && <QATemplateManager />}
        {activeView === 'users' && <UserManagement />}
        {activeView === 'activity_log' && <ActivityLog />}

        {/* Admission Section */}
        {activeView === 'admissions' && <AdmissionDashboard />}
        {activeView === 'content' && <ContentManagement />}
        {activeView === 'chatbot' && <ChatbotAnalytics />}
        {activeView === 'consultation' && <LiveChatView />}
        {activeView === 'insights' && <StudentInsights />}

        {/* Consultant Section */}
        {activeView === 'overview' && <DashboardOverview />}
        {activeView === 'analytics' && <AnalyticsStatistics />}
        {activeView === 'knowledge' && <KnowledgeBaseManagement />}
        {activeView === 'optimization' && <ContentOptimization />}

        {/* Content Section */}
        {activeView === 'dashboardcontent' && (
          <ContentManagerDashboard onCreate={goToEditor} />
        )}
        {activeView === 'articles' && (
          <AllArticles onCreate={goToEditor} />
        )}
        {activeView === 'review' && <ReviewQueue />}
        {activeView === 'editor' && <ArticleEditor />}
      </div>
    </div>
  );
}