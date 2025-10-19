import { Search, ChevronDown, Eye } from "lucide-react";
import { useMemo, useState } from "react";

type Row = {
  title: string;
  category: string;
  status: "draft" | "review" | "published";
  author: string;
  modified: string;
  views: number;
};

const DATA: Row[] = [
  {
    title: "MIT Engineering Programs – Admission Requirements",
    category: "MIT",
    status: "draft",
    author: "Sarah Chen",
    modified: "10/24/2024",
    views: 0,
  },
  {
    title: "Financial Aid Checklist – Complete FAFSA Guide",
    category: "Financial Aid",
    status: "review",
    author: "Michael Torres",
    modified: "10/23/2024",
    views: 9,
  },
  {
    title: "International Student Visa Guide – F-1 Process",
    category: "International",
    status: "review",
    author: "Michael Torres",
    modified: "10/22/2024",
    views: 0,
  },
  {
    title: "University of California Berkeley – Complete Admission Guide 2025",
    category: "UC Berkeley",
    status: "published",
    author: "Sarah Chen",
    modified: "10/18/2024",
    views: 1247,
  },
  {
    title: "Stanford MBA Program Overview 2025",
    category: "Stanford",
    status: "published",
    author: "Sarah Chen",
    modified: "09/25/2024",
    views: 882,
  },
];

export default function AllArticles() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => DATA.filter((r) => r.title.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-500">Content Library</div>
          <div className="text-xl font-semibold">Manage all articles and pages</div>
        </div>
        <a
          href="/content/editor"
          className="px-3 py-2 rounded-md bg-black text-white text-sm hover:opacity-90"
        >
          Create Article
        </a>
      </div>

      {/* Toolbar */}
      <div className="bg-white border rounded-xl p-3 mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 border rounded-md w-full max-w-md">
          <Search size={16} className="text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles..."
            className="outline-none text-sm w-full"
          />
        </div>
        <button className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm">
          All Status <ChevronDown size={14} />
        </button>
        <button className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm">
          All Categories <ChevronDown size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Author</th>
              <th className="text-left px-4 py-3">Last Modified</th>
              <th className="text-left px-4 py-3">Views</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3">{r.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      r.status === "published"
                        ? "bg-green-100 text-green-700"
                        : r.status === "review"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">{r.author}</td>
                <td className="px-4 py-3">{r.modified}</td>
                <td className="px-4 py-3">
                  <div className="inline-flex items-center gap-1">
                    <Eye size={14} className="text-gray-400" />
                    {r.views}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
