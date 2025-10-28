// src/pages/contentManager/ContentManagerPage.tsx
import { useState } from "react";
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

// Content Manager screens
import AllArticles from "@/components/content/AllArticles";
import ReviewQueue from "@/components/content/ReviewQueue";
import ArticleEditor from "@/components/content/ArticleEditor";
import  ContentManagerDashboard  from "@/components/content/ContentManagerDashboard";

// ---- Tiny dashboard section (placeholder). Replace with a real component if you add one.
function ContentDashboard() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Content Overview</h1>
        <p className="text-sm text-gray-500">Manage your editorial workflow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-600">Total Published</div>
          <div className="mt-2 text-2xl font-semibold">2</div>
          <div className="text-xs text-gray-400">Live on portal</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-600">Needs Review</div>
          <div className="mt-2 text-2xl font-semibold">2</div>
          <div className="text-xs text-gray-400">Awaiting approval</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-600">My Drafts</div>
          <div className="mt-2 text-2xl font-semibold">1</div>
          <div className="text-xs text-gray-400">In progress</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-600">Most Viewed</div>
          <div className="mt-2 text-2xl font-semibold">1247</div>
          <div className="text-xs text-gray-400">Top article this week</div>
        </div>
      </div>
    </div>
  );
}

// ---- Page type
type ContentPage = "dashboard" | "articles" | "review" | "editor";

export default function ContentManagerPage() {
  const [currentPage, setCurrentPage] = useState<ContentPage>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigation = [
    { id: "dashboard" as ContentPage, label: "Dashboard", icon: LayoutDashboard },
    { id: "articles" as ContentPage, label: "All Articles", icon: FileText },
    { id: "review" as ContentPage, label: "Review Queue", icon: ListChecks },
    { id: "editor" as ContentPage, label: "New Article", icon: PenSquare },
  ];

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
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
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
                <div className="text-sm truncate">Sarah Chen</div>
                <div className="text-xs text-gray-500 truncate">Content Manager</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {currentPage === 'dashboard' && <ContentManagerDashboard />}
        {currentPage === "articles" && <AllArticles />}
        {currentPage === "review" && <ReviewQueue />}
        {currentPage === "editor" && <ArticleEditor />}
      </main>
    </div>
  );
}
