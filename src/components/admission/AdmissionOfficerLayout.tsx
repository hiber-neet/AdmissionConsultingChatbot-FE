import { useState } from 'react';
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
  GraduationCap
} from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Input } from '../ui/system_users/input';
import { Badge } from '../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { AdmissionDashboard } from './AdmissionDashboard';
import { ContentManagement } from './ContentManagement';
import { ChatbotAnalytics } from './ChatbotAnalytics';
import { LiveConsultation } from './LiveConsultation';
import { StudentInsights } from './StudentInsights';

type AdmissionView = 'dashboard' | 'content' | 'chatbot' | 'consultation' | 'insights';

export function AdmissionOfficerLayout() {
  const [currentView, setCurrentView] = useState<AdmissionView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(true);

  const navigation = [
    { id: 'dashboard' as AdmissionView, label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'content' as AdmissionView, label: 'Quản Lý Nội Dung', icon: FileEdit, badge: 3 },
    { id: 'chatbot' as AdmissionView, label: 'Phân Tích Chatbot', icon: BarChart3 },
    { id: 'consultation' as AdmissionView, label: 'Tư Vấn Trực Tiếp', icon: MessageCircle, badge: 5 },
    { id: 'insights' as AdmissionView, label: 'Thông Tin Học Sinh', icon: Users },
  ];

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar */}
      <aside 
        className={`bg-card border-r flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo and Brand */}
        <div className="p-4 border-b flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
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
        <nav className="flex-1 p-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
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
        <div className="p-4 border-t">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground">
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
        <header className="border-b px-6 py-3 flex items-center justify-between bg-card">
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
            <Button
              variant="default"
              onClick={() => setShowLiveChat(!showLiveChat)}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Bắt Đầu Tư Vấn Trực Tiếp
              {navigation[3].badge && (
                <Badge variant="secondary">{navigation[3].badge}</Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex">
          <div className={`flex-1 overflow-hidden ${showLiveChat ? 'border-r' : ''}`}>
            {currentView === 'dashboard' && <AdmissionDashboard />}
            {currentView === 'content' && <ContentManagement />}
            {currentView === 'chatbot' && <ChatbotAnalytics />}
            {currentView === 'consultation' && <LiveConsultation />}
            {currentView === 'insights' && <StudentInsights />}
          </div>

          {/* Live Chat Panel (Collapsible) */}
          {showLiveChat && (
            <div className="w-80 bg-card flex flex-col">
              <LiveConsultation isPanel={true} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
