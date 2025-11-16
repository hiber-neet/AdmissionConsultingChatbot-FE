import { useState, useEffect } from 'react';
import { type User as AuthUser } from '../../contexts/Auth';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Database, 
  Lightbulb, 
  Menu,
  User,
  ChevronLeft,
  MessageSquare,
  FileText
} from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { DashboardOverview } from './DashboardOverview';
import { AnalyticsStatistics } from './AnalyticsStatistics';
import { QATemplateManagement } from './QATemplateManagement';
import { DocumentManagement } from './DocumentManagement';
import { ContentOptimization } from './ContentOptimization';
import { LeaderKnowledgeBase } from './consultantLeader/leaderKnowledgeBase';

type ConsultantPage = 'overview' | 'analytics' | 'qaTemplates' | 'documents' | 'optimization' | 'leaderReview';

export function ConsultantLayout() {
  const [currentPage, setCurrentPage] = useState<ConsultantPage>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [prefilledQuestion, setPrefilledQuestion] = useState<string | null>(null);
  const [templateAction, setTemplateAction] = useState<'edit' | 'add' | 'view' | null>(null);

  // TESTING: Toggle between consultant and leader roles
  const [isTestingLeader, setIsTestingLeader] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  
  useEffect(() => {
    // Get user data from sessionStorage
    const userData = sessionStorage.getItem("demo_user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Toggle button will appear in the sidebar footer for testing
  const toggleRole = () => {
    setIsTestingLeader(!isTestingLeader);
  };

  // Use the toggle for testing, remove isTestingLeader for production
  const isConsultantLeader = isTestingLeader;

  // Handle navigation to QA Templates with pre-filled question
  const handleNavigateToKnowledgeBase = (question: string) => {
    setPrefilledQuestion(question);
    setTemplateAction('add');
    setCurrentPage('qaTemplates');
  };

  // Handle navigation from Analytics to Templates
  const handleNavigateToTemplates = (question?: string, action?: 'edit' | 'add' | 'view') => {
    setPrefilledQuestion(question || null);
    setTemplateAction(action || null);
    setCurrentPage('qaTemplates');
  };

  // Handle navigation from Dashboard to Templates (always 'add' action)
  const handleDashboardNavigateToTemplates = (question: string, action: 'add') => {
    setPrefilledQuestion(question);
    setTemplateAction(action);
    setCurrentPage('qaTemplates');
  };

  // Reset template state when question is used
  const handleQuestionUsed = () => {
    setPrefilledQuestion(null);
    setTemplateAction(null);
  };

  const navigation = [
    { id: 'overview' as ConsultantPage, label: 'Dashboard Home', icon: LayoutDashboard },
    { id: 'analytics' as ConsultantPage, label: 'Analytics & Statistics', icon: TrendingUp },
    { id: 'qaTemplates' as ConsultantPage, label: 'Q&A Templates', icon: MessageSquare },
    { id: 'documents' as ConsultantPage, label: 'Documents', icon: FileText },
    { id: 'optimization' as ConsultantPage, label: 'Content Optimization', icon: Lightbulb },
    ...(isConsultantLeader ? [
      { id: 'leaderReview' as ConsultantPage, label: 'Knowledge Base Review', icon: Database },
    ] : []),
  ];

  return (
    <div className="h-full flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo and Brand */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
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
        <nav className="flex-grow overflow-y-auto p-2 space-y-1">
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
        <div className="mt-auto p-4 border-t border-gray-200 flex-shrink-0">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#3B82F6] text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">Sarah Chen</div>
                <div className="text-xs text-muted-foreground truncate">
                  {isTestingLeader ? 'Consultant Leader' : 'Consultant'}
                </div>
              </div>
            )}
          </div>
          {/* TESTING: Role toggle button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRole}
            className="mt-2 w-full text-xs"
          >
            Toggle Role (Testing)
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {currentPage === 'overview' && <DashboardOverview onNavigateToTemplates={handleDashboardNavigateToTemplates} />}
        {currentPage === 'analytics' && <AnalyticsStatistics onNavigateToTemplates={handleNavigateToTemplates} />}
        {currentPage === 'qaTemplates' && <QATemplateManagement prefilledQuestion={prefilledQuestion} onQuestionUsed={handleQuestionUsed} templateAction={templateAction} />}
        {currentPage === 'documents' && <DocumentManagement />}
        {currentPage === 'optimization' && <ContentOptimization onNavigateToKnowledgeBase={handleNavigateToKnowledgeBase} />}
        {currentPage === 'leaderReview' && isConsultantLeader && <LeaderKnowledgeBase />}
      </main>
    </div>
  );
}
