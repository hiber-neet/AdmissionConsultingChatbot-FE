import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/Auth';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Database, 
  Lightbulb, 
  Menu,
  User,
  ChevronLeft,
  MessageSquare,
  FileText,
  LogOut,
  Users,
  Calendar,
  GraduationCap,
  BookOpen,
  Eye,
  Plus
} from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';

export function ConsultantLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, hasPermission, setUserLeadership, loginAs, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get current route for active state
  const getCurrentRoute = () => {
    const path = location.pathname.split('/').pop();
    return path || 'overview';
  };

  // Auto-login if no user is found (for consultant pages)
  useEffect(() => {
    if (!user) {
      console.log('No user found in ConsultantLayout, auto-logging in as CONSULTANT');
      loginAs('CONSULTANT');
    }
  }, [user, loginAs]);

  // Toggle button will appear in the sidebar footer for testing
  const toggleRole = () => {
    console.log('Toggle clicked. Current user:', user);
    
    if (!user) {
      console.log('No user found, logging in as consultant');
      loginAs('CONSULTANT');
      return;
    }
    
    console.log('Current isLeader:', user?.isLeader);
    const newLeaderStatus = !(user?.isLeader);
    console.log('Setting isLeader to:', newLeaderStatus);
    setUserLeadership(newLeaderStatus);
  };

  const navigation = [
    { id: 'overview', label: 'Dashboard Home', icon: LayoutDashboard, path: '/consultant/overview' },
    { id: 'analytics', label: 'Analytics & Statistics', icon: TrendingUp, path: '/consultant/analytics' },
    { id: 'templates', label: 'Q&A Templates', icon: MessageSquare, path: '/consultant/templates' },
    { id: 'documents', label: 'Documents', icon: FileText, path: '/consultant/documents' },
    { id: 'optimization', label: 'Content Optimization', icon: Lightbulb, path: '/consultant/optimization' },
    ...(user?.isLeader ? [
      { id: 'leader', label: 'Leader Review', icon: Database, path: '/consultant/leader' }
    ] : []),
    { id: 'profile', label: 'Profile', icon: User, path: '/consultant/profile' }
  ];

  // Additional navigation sections for other permissions
  const additionalSections = [
    // Content Manager section
    ...(user?.permissions?.includes('content_manager') ? [{
      title: 'Content Manager',
      items: [
        { label: 'Content Dashboard', icon: LayoutDashboard, path: '/content/dashboard' },
        { label: 'All Articles', icon: FileText, path: '/content/articles' },
        { label: 'Article Editor', icon: Plus, path: '/content/editor' },
        { label: 'Review Queue', icon: Eye, path: '/content/review' },
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

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col min-h-screen transition-all duration-300 ${
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
        <nav className="flex-grow overflow-y-auto p-2 space-y-3">
          {/* Main Consultant Navigation */}
          <div>
            {!sidebarCollapsed && (
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Consultant
              </div>
            )}
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = getCurrentRoute() === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#3B82F6] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Permission Sections */}
          {additionalSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {!sidebarCollapsed && (
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIndex}
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
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
                <div className="text-sm truncate">{user?.name || 'Loading...'}</div>
                <div className="text-xs text-gray-500 truncate">
                  {!user ? 'Connecting...' : user?.isLeader ? 'Consultant Leader' : 'Consultant'}
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

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
