import { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Database, 
  Lightbulb, 
  Menu,
  User,
  ChevronLeft
} from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { DashboardOverview } from './DashboardOverview';
import { AnalyticsStatistics } from './AnalyticsStatistics';
import { KnowledgeBaseManagement } from './KnowledgeBaseManagement';
import { ContentOptimization } from './ContentOptimization';

type ConsultantPage = 'overview' | 'analytics' | 'knowledge' | 'optimization';

export function ConsultantLayout() {
  const [currentPage, setCurrentPage] = useState<ConsultantPage>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigation = [
    { id: 'overview' as ConsultantPage, label: 'Dashboard Home', icon: LayoutDashboard },
    { id: 'analytics' as ConsultantPage, label: 'Analytics & Statistics', icon: TrendingUp },
    { id: 'knowledge' as ConsultantPage, label: 'Knowledge Base', icon: Database },
    { id: 'optimization' as ConsultantPage, label: 'Content Optimization', icon: Lightbulb },
  ];

  return (
    <div className="h-full flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo and Brand */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">AdmissionBot</div>
                <div className="text-xs text-muted-foreground">Manager</div>
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
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#3B82F6] text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">Sarah Chen</div>
                <div className="text-xs text-muted-foreground truncate">Consultant</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {currentPage === 'overview' && <DashboardOverview />}
        {currentPage === 'analytics' && <AnalyticsStatistics />}
        {currentPage === 'knowledge' && <KnowledgeBaseManagement />}
        {currentPage === 'optimization' && <ContentOptimization />}
      </main>
    </div>
  );
}
