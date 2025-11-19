import { Search, ChevronDown, Eye, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { Button } from '../ui/system_users/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/system_users/dropdown-menu';
import { fastAPIArticles } from '../../services/fastapi';
import { Article } from '../../utils/fastapi-client';

export default function AllArticles({ onCreate, onNavigateToEditor, onNavigateToEditorWithData }: { 
  onCreate?: () => void; 
  onNavigateToEditor?: () => void;
  onNavigateToEditorWithData?: (articleData: { title: string }) => void;
}) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch articles from FastAPI
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fastAPIArticles.getAll();
        setArticles(data);
      } catch (err) {
        setError('Failed to load articles. Please try again.');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filtered = useMemo(
    () => articles.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || 
        (statusFilter === "Drafted" && article.status === "draft") ||
        (statusFilter === "Rejected" && article.status === "rejected") ||
        (statusFilter === "Published" && article.status === "published");
      const matchesCategory = categoryFilter === "All Categories" || 
        article.major_name.toLowerCase().includes(categoryFilter.toLowerCase());
      return matchesSearch && matchesStatus && matchesCategory;
    }),
    [articles, q, statusFilter, categoryFilter]
  );

  const toggleSelect = (title: string) => {
    setSelected((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const allSelected = filtered.length > 0 && selected.length === filtered.length;

  const toggleAll = () => {
    setSelected(allSelected ? [] : filtered.map((article) => article.title));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-500">Content Library</div>
          <div className="text-xl font-semibold">
            Manage all articles and pages
          </div>
        </div>
        {onCreate ? (
          <button
            onClick={onCreate}
            className="px-3 py-2 rounded-md bg-black text-white text-sm hover:opacity-90"
          >
            + Create Article
          </button>
        ) : onNavigateToEditor ? (
          <button
            onClick={onNavigateToEditor}
            className="px-3 py-2 rounded-md bg-black text-white text-sm hover:opacity-90"
          >
            + Create Article
          </button>
        ) : (
          <a
            href="/content?tab=editor"
            className="px-3 py-2 rounded-md bg-black text-white text-sm hover:opacity-90"
          >
            + Create Article
          </a>
        )}
      </div>

      {/* Toolbar */}
      <div ref={dropdownRef} className="bg-white border rounded-xl p-3 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 border rounded-md w-full max-w-md">
          <Search size={16} className="text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles..."
            className="outline-none text-sm w-full"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowCategoryDropdown(false);
            }}
            className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
          >
            {statusFilter} <ChevronDown size={14} />
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
              {["All Status", "Drafted", "Rejected", "Published"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowStatusDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button 
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowStatusDropdown(false);
            }}
            className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
          >
            {categoryFilter} <ChevronDown size={14} />
          </button>
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
              {["All Categories", "Admission Requirements", "Financial Aid", "Tuition Fees"].map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setCategoryFilter(category);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action bar */}
      {selected.length > 0 && (
        <div className="bg-gray-50 border rounded-lg px-4 py-2 mb-3 text-sm flex items-center gap-4">
          <span className="text-gray-700">
            {selected.length} selected
          </span>
          <button className="text-blue-600 hover:underline">Publish</button>
          <button className="text-gray-600 hover:underline">Archive</button>
          <button className="text-red-600 hover:underline">Delete</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading articles...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-300 accent-blue-500"
                  />
                </th>
                <th className="text-left px-2 py-3">Title</th>
                <th className="text-left px-2 py-3">Major</th>
                <th className="text-left px-2 py-3">Status</th>
                <th className="text-left px-2 py-3">Author</th>
                <th className="text-left px-2 py-3">Created At</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((article, i) => {
                const isSelected = selected.includes(article.title);
                return (
                  <tr
                    key={article.article_id}
                    className={`hover:bg-gray-50 ${
                      isSelected ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(article.title)}
                        className="h-4 w-4 rounded border-gray-300 accent-blue-500"
                      />
                    </td>
                    <td className="px-2 py-3">{article.title}</td>
                    <td className="px-2 py-3">{article.major_name}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full capitalize text-xs ${
                          article.status === "published"
                            ? "bg-green-100 text-green-700"
                            : article.status === "review"
                            ? "bg-yellow-100 text-yellow-700"
                            : article.status === "archived"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-2 py-3">{article.author_name}</td>
                    <td className="px-2 py-3">{article.create_at}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              if (onNavigateToEditorWithData) {
                                onNavigateToEditorWithData({ title: article.title });
                              }
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
