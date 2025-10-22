// src/components/content/ContentManagerDashboard.tsx
import {
  Plus,
  CalendarDays,
  Eye,
  PencilLine,
  Clock3,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/system_users/button";

type Props = {
  onCreate?: () => void;    
};

type Stat = {
  label: string;
  value: number | string;
  sublabel?: string;
  icon?: React.ReactNode;
};

type Activity = {
  title: string;
  author: string;
  updatedAt: string;
  status: "draft" | "review" | "published";
  badgeColor?: string; // màu chấm tròn ở đầu dòng
};

const stats: Stat[] = [
  { label: "Total Published", value: 2, sublabel: "Live on portal", icon: <Eye className="h-4 w-4 text-orange-500" /> },
  { label: "Needs Review", value: 2, sublabel: "Awaiting approval", icon: <Loader2 className="h-4 w-4 text-amber-500" /> },
  { label: "My Drafts", value: 1, sublabel: "In progress", icon: <PencilLine className="h-4 w-4 text-sky-500" /> },
  { label: "Most Viewed", value: 1247, sublabel: "UC Berkeley – Complete AI", icon: <Eye className="h-4 w-4 text-emerald-600" /> },
];

const activities: Activity[] = [
  {
    title: "MIT Engineering Programs – Admission Requirements",
    author: "Sarah Chen",
    updatedAt: "10/24/2024",
    status: "draft",
    badgeColor: "bg-slate-400",
  },
  {
    title: "Financial Aid Checklist – Complete FAFSA Guide",
    author: "Michael Torres",
    updatedAt: "10/23/2024",
    status: "review",
    badgeColor: "bg-amber-500",
  },
  {
    title: "International Student Visa Guide – F-1 Process",
    author: "Michael Torres",
    updatedAt: "10/22/2024",
    status: "review",
    badgeColor: "bg-indigo-500",
  },
  {
    title: "UC Berkeley – Complete Admission Guide 2025",
    author: "Sarah Chen",
    updatedAt: "10/19/2024",
    status: "published",
    badgeColor: "bg-emerald-500",
  },
  {
    title: "Stanford MBA Program Overview 2025",
    author: "Sarah Chen",
    updatedAt: "09/25/2024",
    status: "published",
    badgeColor: "bg-emerald-500",
  },
];

function StatusPill({ status }: { status: Activity["status"] }) {
  const map: Record<Activity["status"], string> = {
    draft: "bg-gray-100 text-gray-700",
    review: "bg-amber-100 text-amber-700",
    published: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`px-2.5 py-1 text-xs rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}

export default function ContentManagerDashboard({ onCreate }: Props) {
    const handleCreate = () => {
    if (onCreate) onCreate();
    else window.location.assign("/content?tab=editor");
  };
  return (
    <div className="h-full w-full overflow-auto">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Content Overview</h1>
            <p className="text-sm text-gray-500">
              Manage your editorial workflow
            </p>
          </div>
        
          <Button onClick={handleCreate} className="bg-black text-white hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Create New Article
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">{s.label}</span>
                {s.icon}
              </div>
              <div className="text-2xl font-semibold">{s.value}</div>
              {s.sublabel && (
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <Clock3 className="h-3.5 w-3.5" />
                  {s.sublabel}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-3 text-sm font-medium text-gray-800">
            Quick Actions
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button  onClick={handleCreate}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4 text-sm font-medium text-gray-800">
            Recent Activity
          </div>

          <ul className="divide-y divide-gray-100">
            {activities.map((a, idx) => (
              <li key={idx} className="flex items-center justify-between p-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${a.badgeColor}`}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {a.title}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {a.author} • updated • {a.updatedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusPill status={a.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <div className="mt-10 flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays className="h-3.5 w-3.5" />
          Auto-refresh every 5 min
        </div>
      </div>
    </div>
  );
}
