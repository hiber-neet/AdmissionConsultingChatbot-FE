import { useState } from 'react';
import { FileText, ListChecks, PenSquare, Lightbulb ,Database ,TrendingUp, BarChart3 ,MessageCircle, FileEdit ,LayoutDashboard, MessageSquareText, Users, Shield } from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { AdminDashboard } from './AdminDashboard';
import { QATemplateManager } from './QATemplateManager';
import { UserManagement } from './UserManagement';
import { AdmissionDashboard  } from '../admission/AdmissionDashboard';
import { ContentManagement } from '../admission/ContentManagement';
import { ChatbotAnalytics } from '../admission/ChatbotAnalytics';
import { LiveConsultation } from '../admission/LiveConsultation';
import { StudentInsights } from '../admission/StudentInsights';
import { DashboardOverview } from '../consultant/DashboardOverview';
import { AnalyticsStatistics } from '../consultant/AnalyticsStatistics';
import { KnowledgeBaseManagement } from '../consultant/KnowledgeBaseManagement';
import { ContentOptimization } from '../consultant/ContentOptimization';
import  ContentManagerDashboard  from '../content/ContentManagerDashboard';
import  AllArticles  from '../content/AllArticles';
import  ReviewQueue  from '../content/ReviewQueue';
import  ArticleEditor  from '../content/ArticleEditor';
type AdminView = 'dashboard' | 'templates' | 'users' | 'admissions' | 'content' | 'chatbot' | 'consultation' | 'insights' | 'overview' | 'analytics' | 'knowledge' | 'optimization' | "dashboardcontent" | "articles" | "review" | "editor";

export function AdminLayout() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const navigation = [
    { id: 'dashboard' as AdminView, label: 'Bảng Điều Khiển', icon: LayoutDashboard },
    { id: 'templates' as AdminView, label: 'Mẫu Q&A', icon: MessageSquareText },
    { id: 'users' as AdminView, label: 'Quản Lý Người Dùng', icon: Users },
    //admission section
    { id: 'admissions' as AdminView, label: 'Tổng quan admission', icon: LayoutDashboard },
    { id: 'content' as AdminView, label: 'Quản Lý Nội Dung', icon: FileEdit, badge: 3 },
    { id: 'chatbot' as AdminView, label: 'Phân Tích Chatbot', icon: BarChart3 },
    { id: 'consultation' as AdminView, label: 'Tư Vấn Trực Tiếp', icon: MessageCircle, badge: 5 },
    { id: 'insights' as AdminView, label: 'Thông Tin Học Sinh', icon: Users },
    //consultant section
    { id: 'overview' as AdminView, label: 'Tổng quan consultant', icon: LayoutDashboard },
    { id: 'analytics' as AdminView, label: 'Analytics & Statistics', icon: TrendingUp },
    { id: 'knowledge' as AdminView, label: 'Knowledge Base', icon: Database },
    { id: 'optimization' as AdminView, label: 'Content Optimization', icon: Lightbulb },
    //content section
    { id: "dashboardcontent" as AdminView, label: "Tổng quan content", icon: LayoutDashboard },
    { id: "articles" as AdminView, label: "All Articles", icon: FileText },
    { id: "review" as AdminView, label: "Review Queue", icon: ListChecks },
    { id: "editor" as AdminView, label: "New Article", icon: PenSquare },
  ];

    const goToEditor = () => setActiveView('editor');

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <div>
              <h1>Admin Panel</h1>
              <p className="text-sm text-muted-foreground">System Control</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveView(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'dashboard' && <AdminDashboard />}
        {activeView === 'templates' && <QATemplateManager />}
        {activeView === 'users' && <UserManagement />}
        {activeView === 'users' && <AdmissionDashboard />}

 
        {activeView === 'admissions' && <AdmissionDashboard />}
        {activeView === 'content' && <ContentManagement />}
        {activeView === 'chatbot' && <ChatbotAnalytics />}
        {activeView === 'consultation' && <LiveConsultation />}
        {activeView === 'insights' && <StudentInsights />}

 
        {activeView === 'overview' && <DashboardOverview />}
        {activeView === 'analytics' && <AnalyticsStatistics />}
        {activeView === 'knowledge' && <KnowledgeBaseManagement />}  
        {activeView === 'optimization' && <ContentOptimization />}  
 
        {activeView === 'dashboardcontent' && <ContentManagerDashboard />}
        {activeView === 'articles' && <AllArticles />}
        {activeView === 'review' && <ReviewQueue />}
        {activeView === 'editor' && <ArticleEditor />}
        
      </div>
    </div>
  );
}