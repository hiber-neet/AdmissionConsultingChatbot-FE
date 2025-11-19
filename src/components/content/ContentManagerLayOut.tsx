// src/components/content/ContentManagerLayOut.tsx
import { useState, useEffect } from "react";
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
} from "lucide-react";

import { Button } from "@/components/ui/system_users/button";
import { Avatar, AvatarFallback } from "@/components/ui/system_users/avatar";
import { useAuth } from "@/contexts/Auth";

// Page type
type ContentPage = "dashboard" | "articles" | "review" | "editor" | "riasec";

export default function ContentManagerLayOut() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission, setUserLeadership, loginAs } = useAuth();
  
  // Auto-login if no user is found (for content pages)
  useEffect(() => {
    if (!user) {
      console.log('No user found in ContentManagerLayOut, auto-logging in as CONTENT_MANAGER');
      loginAs('CONTENT_MANAGER');
    }
  }, [user, loginAs]);
  
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
    { id: "dashboard" as ContentPage, label: "Dashboard", icon: LayoutDashboard, path: "/content/dashboard", permission: "VIEW_CONTENT_DASHBOARD" },
    { id: "articles" as ContentPage, label: "Article List", icon: FileText, path: "/content/articles", permission: "MANAGE_ARTICLES" },
    { id: "editor" as ContentPage, label: "Article Details", icon: PenSquare, path: "/content/editor", permission: "CREATE_ARTICLE" },
    ...(hasPermission("REVIEW_CONTENT") ? [
      { id: "review" as ContentPage, label: "Review Queue", icon: ListChecks, path: "/content/review", permission: "REVIEW_CONTENT" }
    ] : []),
    ...(hasPermission("MANAGE_RIASEC") ? [
      { id: "riasec" as ContentPage, label: "RIASEC Management", icon: Database, path: "/content/riasec", permission: "MANAGE_RIASEC" }
    ] : []),
  ];

  // Toggle button will appear in the sidebar footer for testing
  const toggleRole = () => {
    console.log('Toggle clicked in ContentManager. Current user:', user);
    
    if (!user) {
      console.log('No user found, logging in as content manager');
      loginAs('CONTENT_MANAGER');
      return;
    }
    
    console.log('Current isLeader:', user?.isLeader);
    const newLeaderStatus = !(user?.isLeader);
    console.log('Setting isLeader to:', newLeaderStatus);
    setUserLeadership(newLeaderStatus);
  };

  return (
     <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Brand */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">Content Hub</div>
                <div className="text-xs text-gray-500">Editorial Manager</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = getCurrentRoute() === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#3B82F6] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="mt-auto p-4 border-t border-gray-200 flex-shrink-0">
          <div
            className={`flex items-center gap-3 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#3B82F6] text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{user?.name || 'Loading...'}</div>
                <div className="text-xs text-gray-500 truncate">
                  {!user ? 'Connecting...' : user?.isLeader ? 'Content Manager Leader' : 'Content Manager'}
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
              {!user ? '🔄 Loading...' : user?.isLeader ? '👑 Leader Mode' : '👤 Regular Mode'}
            </Button>
            
            {/* Debug info */}
            <div className="text-xs text-gray-500 p-1 bg-gray-50 rounded">
              Debug: {!user ? 'No User' : user?.isLeader ? 'Leader' : 'Regular'} | {user?.permissions?.length || 0} perms
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
