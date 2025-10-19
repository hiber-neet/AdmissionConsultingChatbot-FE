import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, ClipboardList, Plus } from "lucide-react";

export default function ContentManagerLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r">
        <div className="p-4 border-b">
          <div className="text-xs text-gray-500">Content Hub</div>
          <div className="font-semibold">Editorial Manager</div>
        </div>

        <nav className="p-2 space-y-1">
          <NavLink
            to="/content"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-orange-50 text-orange-600" : "hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>

          <NavLink
            to="/content/articles"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-orange-50 text-orange-600" : "hover:bg-gray-100"
              }`
            }
          >
            <FileText size={16} />
            All Articles
          </NavLink>

          <NavLink
            to="/content/review"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-orange-50 text-orange-600" : "hover:bg-gray-100"
              }`
            }
          >
            <ClipboardList size={16} />
            Review Queue
          </NavLink>
        </nav>

        <div className="mt-auto p-4">
          <NavLink
            to="/content/editor"
            className="inline-flex items-center gap-2 w-full justify-center px-3 py-2 rounded-md text-sm bg-black text-white hover:opacity-90"
          >
            <Plus size={16} /> Create Article
          </NavLink>
        </div>

        <div className="p-4 border-t text-xs text-gray-500">
          <div className="font-medium text-gray-700">Sarah Chen</div>
          Content Manager
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
